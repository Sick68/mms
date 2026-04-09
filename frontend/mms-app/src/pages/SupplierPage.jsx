import React, { useState, useEffect } from "react";
import { fetchSuppliers, addSupplier, updateSupplier } from "../api/supplierApi.js";
import { getSupplierPurchases } from "../api/supplierApi.js";

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [form, setForm] = useState({ name: "", contact: "", address: "" });
    const [editingId, setEditingId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [selectedSupName, setSelectedSupName] = useState("");
    const [loading, setLoading] = useState(false);

    // Load data when page opens
    useEffect(() => { loadSuppliers(); }, []);

    const loadSuppliers = async () => {
        try {
            const res = await fetchSuppliers();
            setSuppliers(res.data);
        } catch (err) { console.error("Load failed", err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await updateSupplier(editingId, form);
                alert("Supplier details updated!");
            } else {
                await addSupplier(form);
                alert("New supplier registered!");
            }
            // Reset form and refresh list
            setForm({ name: "", contact: "", address: "" });
            setEditingId(null);
            loadSuppliers();
        } catch (err) {
            alert("Error saving supplier data");
        } finally { setLoading(false); }
    };

    const handleViewHistory = async (sup) => {
    try {
        setLoading(true); // Optional: add a loading state for history
        const res = await getSupplierPurchases(sup.supplier_id);
        
        // Ensure we are setting an array even if data is null/undefined
        setTransactions(res.data || []); 
        setSelectedSupName(sup.name);
        
        // Auto-scroll to history so the user sees it immediately
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (err) { 
        alert("History fetch failed"); 
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 bg-[#f4fcfb] min-h-screen animate-fade-in">
            
            {/* LEFT: REGISTRATION FORM */}
            <div className="lg:col-span-4 space-y-6">
                <header className="ml-2">
                    <h1 className="text-2xl font-black text-[#00695c]">Supplier Desk</h1>
                    <p className="text-[10px] text-[#004d40] opacity-50 uppercase tracking-[0.2em] font-bold">Vendor Management System</p>
                </header>

                <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-8 rounded-[35px] border border-white shadow-xl shadow-[#00897b]/5 space-y-5">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase opacity-30 ml-2">Company Name</label>
                            <input 
                                className="p-4 rounded-2xl bg-[#f0f9f8] text-sm outline-none border border-transparent focus:border-[#00897b] transition-all"
                                placeholder="Enter Business Name" value={form.name} required
                                onChange={(e) => setForm({...form, name: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase opacity-30 ml-2">Contact Info</label>
                            <input 
                                className="p-4 rounded-2xl bg-[#f0f9f8] text-sm outline-none border border-transparent focus:border-[#00897b] transition-all"
                                placeholder="Phone or Email" value={form.contact} required
                                onChange={(e) => setForm({...form, contact: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase opacity-30 ml-2">Office Address</label>
                            <textarea 
                                className="p-4 rounded-2xl bg-[#f0f9f8] text-sm outline-none border border-transparent focus:border-[#00897b] transition-all h-24 resize-none"
                                placeholder="Street, City, Country" value={form.address} required
                                onChange={(e) => setForm({...form, address: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full py-4 bg-[#00897b] text-white font-black rounded-2xl hover:bg-[#00695c] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {editingId ? 'UPDATE VENDOR' : 'REGISTER VENDOR'}
                    </button>
                    
                    {editingId && (
                        <button 
                            type="button" onClick={() => {setEditingId(null); setForm({name:"", contact:"", address:""})}}
                            className="w-full text-[10px] font-black text-red-400 uppercase tracking-widest"
                        >
                            Cancel Edit
                        </button>
                    )}
                </form>
            </div>

            {/* RIGHT: SUPPLIER LIST & HISTORY */}
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-white/60 backdrop-blur-md overflow-y-auto rounded-[35px] border border-white shadow-sm overflow-hidden p-2">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-[10px] font-black uppercase opacity-30">
                                <th className="px-6 py-4">Vendor Details</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((s) => (
                                <tr key={s.supplier_id} className="bg-white/80 hover:bg-white transition-all group">
                                    <td className="px-6 py-4 rounded-l-2xl">
                                        <p className="font-bold text-[#004d40] text-sm">{s.name}</p>
                                        <p className="text-[11px] opacity-50">{s.contact} • {s.address}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right rounded-r-2xl space-x-2">
                                        <button 
                                            onClick={() => {setForm(s); setEditingId(s.supplier_id)}}
                                            className="text-[10px] font-black text-[#00897b] uppercase px-3 py-1 hover:bg-[#00897b]/10 rounded-lg transition-all"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleViewHistory(s)}
                                            className="bg-[#00897b] text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-md hover:bg-[#00695c] transition-all"
                                        >
                                            History
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* TRANSACTION HISTORY VIEW */}
                {selectedSupName && (
                    <div className="bg-white p-8 rounded-[35px] border border-[#00897b]/10 shadow-2xl animate-slide-up">
                        <div className="flex rounded-2xl justify-between items-center mb-6">
                            <div>
                                <h3 className="font-black text-[#00695c] text-lg">{selectedSupName}</h3>
                                <p className="text-[10px] opacity-40 uppercase font-bold">Supplier Transaction Ledger</p>
                            </div>
                            <button onClick={() => setSelectedSupName("")} className="w-8 h-8 flex items-center justify-center bg-[#f0f9f8] rounded-full text-[#00897b] font-bold">×</button>
                        </div>

                        {transactions.length > 0 ? (
                            <div className="grid h-40 overflow-y-auto grid-cols-1 md:grid-cols-2 gap-4">
                                {transactions.map((t, idx) => (
                                    <div key={idx} className="p-5 bg-[#f0f9f8] rounded-[25px] border border-white">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[9px] font-black bg-[#00897b] text-white px-2 py-0.5 rounded-full uppercase">Order #{t.purchase_id}</span>
                                            <span className="text-[10px] opacity-40">{new Date(t.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="font-bold text-[#004d40]">{t.medicine_name}</p>
                                        <div className="flex justify-between mt-3">
                                            <div className="text-center">
                                                <p className="text-[9px] opacity-40 font-black uppercase">Qty</p>
                                                <p className="text-xs font-bold">{t.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] opacity-40 font-black uppercase">Unit Price</p>
                                                <p className="text-xs font-bold text-[#00897b]">${t.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center opacity-30 text-xs italic">No purchase records found for this vendor.</div>
                        )}
                    </div>
                )}
            </div>
            <style>{`
    /* ✅ PAGE FADE-IN */
    @keyframes fade-in {
        0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .animate-fade-in {
        animation: fade-in 0.5s ease-out forwards;
    }

    /* ✅ SLIDE-UP (FOR HISTORY PANEL) */
    @keyframes slide-up {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-slide-up {
        animation: slide-up 0.4s ease-out forwards;
    }
`}</style>
        </div>
    );
};

export default SupplierPage;