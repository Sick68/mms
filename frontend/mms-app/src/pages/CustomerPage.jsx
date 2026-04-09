import React, { useState, useEffect } from "react";
import { addCustomer, getCustomerHistory, getAllCustomers } from "../api/customerApi";

const CustomerPage = () => {
    const [formData, setFormData] = useState({ customer_name: "", contact: "" });
    const [customers, setCustomers] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Load registry for the search suggestions
    const loadRegistry = async () => {
        try {
            const res = await getAllCustomers();
            setCustomers(res.data);
        } catch (err) { console.error("Registry load failed", err); }
    };

    useEffect(() => { loadRegistry(); }, []);

    // Logic: Only show filtered list if user has typed something
    const filteredCustomers = searchTerm.length > 0 
        ? customers.filter(c => c.contact.includes(searchTerm) || c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, created_at: new Date().toISOString().slice(0, 19).replace('T', ' ') };
            await addCustomer(payload);
            alert("Customer Registered!");
            setFormData({ customer_name: "", contact: "" });
            loadRegistry(); 
        } catch (err) { alert("Error adding customer"); }
    };

    const handleSelect = (customer) => {
        setSearchTerm(customer.contact); 
        setSelectedCustomer(customer);
        fetchHistory(customer.customer_id);
        setShowDropdown(false);
    };

    const fetchHistory = async (id) => {
        setLoading(true);
        try {
            const res = await getCustomerHistory(id);
            setHistory(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    return (
        <div className="p-8 bg-[#f4fcfb] min-h-screen space-y-8 animate-fade-in">
            {/* HEADER */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[35px] border border-white shadow-sm flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[#00695c]">Customer Management</h1>
                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Registry & Purchase Tracking</p>
                </div>
                {selectedCustomer && (
                    <div className="bg-[#00897b] text-white px-6 py-2 rounded-2xl shadow-lg">
                        <p className="text-[10px] font-bold uppercase opacity-70">Viewing History For</p>
                        <p className="text-sm font-black">{selectedCustomer.customer_name}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: REGISTRATION */}
                <div className="lg:col-span-4 bg-white/60 backdrop-blur-xl p-8 rounded-[40px] border border-white shadow-xl h-fit">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-[#00897b] p-2 rounded-xl text-white text-xl">👤</div>
                        <h2 className="text-lg font-black text-[#004d40]">New Registration</h2>
                    </div>

                    <form onSubmit={handleAdd} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase opacity-40 ml-2 mb-2">Full Name</label>
                            <input 
                                type="text" placeholder="e.g. Sikander" required
                                value={formData.customer_name}
                                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                                className="w-full p-4 bg-[#f0f9f8] rounded-2xl border-none outline-none focus:ring-2 ring-[#00897b] font-bold text-[#004d40]"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase opacity-40 ml-2 mb-2">Contact Number</label>
                            <input 
                                type="text" placeholder="03XXXXXXXXX" required
                                value={formData.contact}
                                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                className="w-full p-4 bg-[#f0f9f8] rounded-2xl border-none outline-none focus:ring-2 ring-[#00897b] font-bold text-[#004d40]"
                            />
                        </div>
                        <button className="w-full bg-[#00897b] text-white p-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-[#00695c] transition-all mt-4">
                            Save Customer
                        </button>
                    </form>
                </div>

                {/* RIGHT: HISTORY SEARCH */}
                <div className="lg:col-span-8 bg-white/40 backdrop-blur-md p-8 rounded-[40px] border border-white shadow-sm flex flex-col h-[600px]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-lg font-black text-[#004d40]">Purchase History</h2>
                            <p className="text-[10px] font-bold opacity-30 uppercase">Search by phone number</p>
                        </div>
                        
                        {/* SEARCH INPUT WITH CUSTOM DROPDOWN */}
                        <div className="relative w-full md:w-64">
                            <input 
                                type="text" 
                                placeholder="Search by phone..." 
                                value={searchTerm} 
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                    if(e.target.value === "") {
                                        setHistory([]);
                                        setSelectedCustomer(null);
                                    }
                                }}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                className="w-full p-4 bg-white rounded-2xl border border-[#00897b]/20 outline-none text-xs font-bold shadow-sm focus:border-[#00897b]"
                            />
                            
                            {/* Dropdown list - only shows when typing */}
                            {showDropdown && filteredCustomers.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-white z-50 overflow-hidden max-h-60 overflow-y-auto custom-scroll">
                                    {filteredCustomers.map(c => (
                                        <div 
                                            key={c.customer_id}
                                            onClick={() => handleSelect(c)}
                                            className="p-4 hover:bg-[#f0f9f8] cursor-pointer border-b border-gray-50 last:border-none group transition-colors"
                                        >
                                            <p className="text-xs font-black text-[#00897b] group-hover:text-[#004d40]">{c.contact}</p>
                                            <p className="text-[10px] font-bold opacity-40 uppercase">{c.customer_name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-y-auto pr-2 custom-scroll flex-grow">
                        {loading ? (
                             <div className="flex justify-center mt-20 font-black text-[#00897b] animate-pulse">LOADING RECORDS...</div>
                        ) : history.length > 0 ? (
                            <table className="w-full text-left border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase opacity-30">
                                        <th className="px-4">Sale ID</th>
                                        <th className="px-4">Medicine</th>
                                        <th className="px-4 text-center">Qty</th>
                                        <th className="px-4">Total</th>
                                        <th className="px-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((row) => (
                                        <tr key={row.sale_id} className="bg-white/60 hover:bg-white transition-all shadow-sm rounded-2xl group">
                                            <td className="p-4 text-[11px] font-black opacity-30 rounded-l-2xl">#{row.sale_id}</td>
                                            <td className="p-4 text-xs font-black text-[#004d40]">{row.medicine_name}</td>
                                            <td className="p-4 text-xs font-black text-center text-[#00897b]">{row.quantity}</td>
                                            <td className="p-4 text-xs font-black text-[#00897b]">${row.finalTotal}</td>
                                            <td className="p-4 text-[10px] font-bold opacity-60 rounded-r-2xl">{new Date(row.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-20">
                                <span className="text-5xl mb-4">📜</span>
                                <p className="font-black uppercase tracking-tighter">
                                    {searchTerm.length > 0 ? "No records found" : "Enter phone to see history"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
<style>{`
    /* ✅ SCROLLBAR */
    .custom-scroll::-webkit-scrollbar { width: 5px; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #00897b22; border-radius: 10px; }

    /* ✅ PAGE FADE */
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

    /* ✅ DROPDOWN ANIMATION */
    @keyframes dropdown-in {
        0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.98);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .animate-dropdown {
        animation: dropdown-in 0.25s ease-out;
    }

    /* ✅ ROW STAGGER EFFECT */
    @keyframes row-in {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-row {
        animation: row-in 0.3s ease forwards;
    }
`}</style>
        </div>
    );
};

export default CustomerPage;