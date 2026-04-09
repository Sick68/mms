import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast'; // 1. Import Toast
import { 
    fetchMedicines, 
    addMedicine, 
    updateMedicine, 
    deleteMedicine, 
    fetchLowStock, 
    fetchNearExpiry 
} from '../api/medicineApi';

const MedicinePage = () => {
    const [medicines, setMedicines] = useState([]);
    const [lowStockIds, setLowStockIds] = useState([]);
    const [expiringIds, setExpiringIds] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', category: '', batch_number: '', price: '', quantity: '', expiry_date: '' 
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { 
        loadData(); 
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [res, lowRes, expiryRes] = await Promise.all([
                fetchMedicines(),
                fetchLowStock(),
                fetchNearExpiry()
            ]);
            setMedicines(res.data);
            setLowStockIds(lowRes.data.map(m => m.medicine_id));
            setExpiringIds(expiryRes.data.map(m => m.medicine_id));
        } catch (err) {
            toast.error("Failed to load inventory data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(editingId ? "Updating..." : "Adding...");
        try {
            if (editingId) {
                await updateMedicine(editingId, formData);
                toast.success("Medicine updated successfully!", { id: loadingToast });
            } else {
                await addMedicine(formData);
                toast.success("New batch added to inventory!", { id: loadingToast });
            }
            
            setShowModal(false);
            resetForm();
            loadData();
        } catch (err) {
            toast.error("Operation failed. Please try again.", { id: loadingToast });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this medicine?")) {
            try {
                await deleteMedicine(id);
                toast.success("Item removed from system");
                loadData();
            } catch (err) {
                toast.error("Could not delete item");
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', category: '', batch_number: '', price: '', quantity: '', expiry_date: '' });
        setEditingId(null);
    };

    const handleEdit = (med) => {
        setEditingId(med.medicine_id);
        const dateOnly = med.expiry_date ? med.expiry_date.split('T')[0] : '';
        setFormData({ ...med, expiry_date: dateOnly });
        setShowModal(true);
    };

    const filtered = medicines.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase()) || 
        m.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in p-2">
            {/* 2. ADD TOASTER COMPONENT (Top-Right with Custom Theme) */}
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#ffffff',
                        color: '#004d40',
                        fontSize: '12px',
                        fontWeight: '800',
                        borderRadius: '16px',
                        border: '1px solid #f0f9f8',
                        padding: '12px 20px',
                        boxShadow: '0 10px 15px -3px rgba(0, 121, 107, 0.1)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#00897b',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* TOP HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-[#00695c]">Medicine Inventory</h1>
                    <p className=" m-2 text-xs font-bold text-black opacity-60">
                        {lowStockIds.length > 0 ? `⚠️ ${lowStockIds.length} items below threshold` : 'All stock levels healthy'}
                    </p>
                </div>
                <button 
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-[#00897b] text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#00695c] transition-all shadow-lg active:scale-95"
                >
                    + Add New Batch
                </button>
            </div>

            {/* SEARCH BAR */}
            <div className="bg-white/70 backdrop-blur-md p-4 rounded-[20px] border border-white flex gap-4 items-center shadow-sm">
                <span className="opacity-30 ml-2">🔍</span>
                <input 
                    type="text" placeholder="Search by medicine name or category..." 
                    className="bg-transparent outline-none text-sm w-full font-medium"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* INVENTORY TABLE */}
            <div className="bg-white/80 backdrop-blur-lg rounded-[30px] border border-white shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#f0f9f8]/50 text-[#00695c] text-[10px] font-black uppercase tracking-widest border-b border-black/5">
                        <tr>
                            <th className="p-5 px-8">Medicine Info</th>
                            <th className="p-5 px-8">Category</th>
                            <th className="p-5 px-8">Stock Level</th>
                            <th className="p-5 px-8">Unit Price</th>
                            <th className="p-5 px-8">Expiry Date</th>
                            <th className="p-5 px-8 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr><td colSpan="6" className="p-20 text-center opacity-30 italic">Loading inventory...</td></tr>
                        ) : filtered.map((med) => {
                            const isLow = lowStockIds.includes(med.medicine_id);
                            const isNearExpiry = expiringIds.includes(med.medicine_id);

                            let rowBgClass = "";
                            if (isLow && isNearExpiry) rowBgClass = "bg-red-50/60 border-l-4 border-red-500";
                            else if (isLow) rowBgClass = "bg-red-50/30";
                            else if (isNearExpiry) rowBgClass = "bg-orange-50/50 border-l-4 border-orange-400";

                            return (
                                <tr 
                                    key={med.medicine_id} 
                                    className={`border-b border-black/5 hover:bg-white/60 transition-all ${rowBgClass}`}
                                >
                                    <td className="p-5 px-8">
                                        <div className="font-bold text-[#333]">{med.name}</div>
                                        <div className="text-[10px] opacity-40 font-mono uppercase">BATCH: {med.batch_number}</div>
                                    </td>
                                    <td className="p-5 px-8">
                                        <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold opacity-60 uppercase">
                                            {med.category}
                                        </span>
                                    </td>
                                    <td className="p-5 px-8">
                                        <div className={`flex items-center gap-2 font-black ${isLow ? 'text-red-500' : 'text-[#00897b]'}`}>
                                            {med.quantity}
                                            {isLow && (
                                                <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded uppercase animate-pulse">
                                                    Low
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5 px-8 font-bold text-[#00796b]">
                                        ${Number(med.price).toFixed(2)}
                                    </td>
                                    <td className="p-5 px-8">
                                        <div className={`text-xs flex flex-col ${isNearExpiry ? 'text-orange-600 font-black' : 'opacity-60 font-medium'}`}>
                                            <span>
                                                {new Date(med.expiry_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                            {isNearExpiry && (
                                                <span className="text-[8px] uppercase tracking-tighter bg-orange-100 text-orange-800 px-2 py-0.5 rounded w-fit mt-1.5">
                                                    ⚠️ Expiring Soon
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5 px-8 text-center space-x-4">
                                        <button onClick={() => handleEdit(med)} className="text-[#00897b] hover:text-[#00695c] font-black text-[10px] uppercase tracking-wider">Edit</button>
                                        <button onClick={() => handleDelete(med.medicine_id)} className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-wider">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* MODAL OVERLAY */}
            {showModal && (
                <div className="fixed inset-0 bg-[#004d40]/30 backdrop-blur-[4px] flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white p-7 rounded-[32px] shadow-2xl w-full max-w-md border border-white relative animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-[#00695c]">
                                {editingId ? 'Edit Medicine' : 'Add New Batch'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-2xl opacity-20 hover:opacity-100">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase opacity-30 ml-2 tracking-widest">Product Name</label>
                                <input 
                                    placeholder="Medicine name..." required 
                                    className="w-full p-3.5 rounded-xl bg-[#f0f9f8] text-sm outline-none border border-transparent focus:border-[#00897b] transition-all"
                                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase opacity-30 ml-2 tracking-widest">Category</label>
                                    <input 
                                        placeholder="e.g. Tablet" className="w-full p-3.5 rounded-xl bg-[#f0f9f8] text-sm outline-none border border-transparent"
                                        value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase opacity-30 ml-2 tracking-widest">Batch No.</label>
                                    <input 
                                        placeholder="BN-00" className="w-full p-3.5 rounded-xl bg-[#f0f9f8] text-sm outline-none border border-transparent"
                                        value={formData.batch_number} onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase opacity-30 ml-2 tracking-widest">Price ($)</label>
                                    <input 
                                        type="number" step="0.01" className="w-full p-3.5 rounded-xl bg-[#f0f9f8] text-sm outline-none border border-transparent"
                                        value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase opacity-30 ml-2 tracking-widest">Quantity</label>
                                    <input 
                                        type="number" className="w-full p-3.5 rounded-xl bg-[#f0f9f8] text-sm outline-none border border-transparent"
                                        value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase opacity-30 ml-2 tracking-widest">Expiry Date</label>
                                <input 
                                    type="date" required className="w-full p-3.5 rounded-xl bg-[#f0f9f8] text-sm outline-none border border-transparent"
                                    value={formData.expiry_date} onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 text-[10px] font-black uppercase opacity-40 hover:opacity-100">Cancel</button>
                                <button type="submit" className="flex-[2] py-3.5 bg-[#00897b] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-teal-900/20 hover:bg-[#00695c]">
                                    {editingId ? 'Update Medicine' : 'Save Medicine'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicinePage;