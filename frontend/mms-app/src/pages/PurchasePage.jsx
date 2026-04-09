import React, { useState, useEffect } from "react";
import Select from "react-select"; // Import react-select
import { addPurchase, getInvoice } from "../api/purchaseApi.js";
import API from "../api/axios.js";

const PurchasePage = () => {
    const [form, setForm] = useState({ supplier_id: "", medicine_id: "", quantity: "", price: "" });
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(false);

    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [recentPurchases, setRecentPurchases] = useState([]);

    // Style configuration for the Searchable Dropdowns
    const customSelectStyles = {
        control: (base) => ({
            ...base,
            backgroundColor: "#f0f9f8",
            borderRadius: "1.25rem",
            padding: "6px",
            fontSize: "1rem", // Larger text size
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "none",
            "&:hover": { borderColor: "#00897b" }
        }),
        placeholder: (base) => ({ ...base, color: "rgba(0,105,92,0.4)", fontWeight: "600" }),
        singleValue: (base) => ({ ...base, color: "#004d40", fontWeight: "700" })
    };

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [supRes, medRes] = await Promise.all([
                    API.get("/supplier"),
                    API.get("/medicines")
                ]);
                // Format for react-select: { value, label }
                setSuppliers(supRes.data.map(s => ({ value: s.supplier_id, label: s.name })));
                setMedicines(medRes.data.map(m => ({ value: m.medicine_id, label: m.name })));
            } catch (err) { console.error("Data fetch failed", err); }
        };
        fetchDropdownData();
    }, []);

    const handleRecord = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await addPurchase(form);
            const newId = res.data.purchase_id || res.data.insertId;
            if (newId) {
                const invRes = await getInvoice(newId);
                setInvoice(invRes.data);
            }
            alert("Stock Updated Successfully!");
            setForm({ supplier_id: "", medicine_id: "", quantity: "", price: "" });
        } catch (err) {
            alert("Error updating stock");
        } finally { setLoading(false); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 bg-[#f4fcfb] min-h-screen animate-fade-in">
            
            {/* LEFT: PURCHASE ENTRY FORM */}
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-black text-[#00695c] tracking-tight">Purchase Entry</h1>
                    <p className="text-sm font-bold text-[#004d40] opacity-50 uppercase tracking-widest">Inventory Management</p>
                </header>

                <form onSubmit={handleRecord} className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] border border-white shadow-xl space-y-6">
                    {/* Searchable Supplier */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00695c] uppercase ml-2 opacity-60">Select Supplier</label>
                        <Select 
                            options={suppliers}
                            styles={customSelectStyles}
                            placeholder="Type to search supplier..."
                            onChange={(opt) => setForm({ ...form, supplier_id: opt ? opt.value : "" })}
                        />
                    </div>

                    {/* Searchable Medicine */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00695c] uppercase ml-2 opacity-60">Select Medicine</label>
                        <Select 
                            options={medicines}
                            styles={customSelectStyles}
                            placeholder="Type to search medicine..."
                            onChange={(opt) => setForm({ ...form, medicine_id: opt ? opt.value : "" })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#00695c] uppercase ml-2 opacity-60">Quantity</label>
                            <input 
                                type="number" required placeholder="00"
                                className="w-full p-4 rounded-2xl bg-[#f0f9f8] text-lg font-bold text-[#004d40] outline-none border border-black/5 focus:border-[#00897b]"
                                value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#00695c] uppercase ml-2 opacity-60">Cost Price ($)</label>
                            <input 
                                type="number" step="0.01" required placeholder="0.00"
                                className="w-full p-4 rounded-2xl bg-[#f0f9f8] text-lg font-bold text-[#004d40] outline-none border border-black/5 focus:border-[#00897b]"
                                value={form.price} onChange={(e) => setForm({...form, price: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full py-5 bg-[#00897b] text-white text-lg font-black rounded-3xl hover:bg-[#00695c] transition-all shadow-2xl active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                    >
                        {loading ? 'Processing...' : 'Record Purchase'}
                    </button>
                </form>
            </div>

            {/* RIGHT: INVOICE PREVIEW */}
            <div id="invoice-section" className="flex flex-col">
                <div className="mb-6">
                    <h2 className="text-xs font-black text-[#00695c] uppercase opacity-40 ml-4 mb-3 tracking-widest">History Lookup</h2>
                    <Select 
                        options={suppliers}
                        styles={customSelectStyles}
                        placeholder="Search Supplier to see history..."
                        onChange={async (opt) => {
                            if (opt) {
                                const res = await API.get(`/suppliers/${opt.value}/purchases`);
                                setRecentPurchases(res.data);
                            }
                        }}
                    />
                    
                    {recentPurchases.length > 0 && (
                        <div className="mt-4 bg-white/60 rounded-3xl p-3 max-h-48 overflow-y-auto border border-white shadow-inner custom-scroll">
                            {recentPurchases.map(p => (
                                <div 
                                    key={p.purchase_id}
                                    onClick={async () => {
                                        const res = await getInvoice(p.purchase_id);
                                        setInvoice(res.data);
                                        setRecentPurchases([]);
                                    }}
                                    className="flex justify-between p-4 hover:bg-[#00897b] hover:text-white rounded-2xl cursor-pointer transition-all mb-2 bg-white"
                                >
                                    <span className="font-bold text-sm">📦 {p.medicine_name}</span>
                                    <span className="text-xs font-black opacity-50">{new Date(p.date).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {invoice ? (
                    <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-white flex flex-col h-full relative">
                        <div className="text-center border-b-2 border-dashed border-[#00897b]/10 pb-8 mb-8">
                            <h3 className="font-black text-2xl text-[#00796b]">SUPPLY RECEIPT</h3>
                            <p className="text-[11px] font-black text-[#00897b] opacity-40 uppercase tracking-tighter">Purchase Confirmation</p>
                        </div>

                        <div className="flex justify-between mb-10 text-sm">
                            <div>
                                <p className="text-[10px] font-black uppercase text-[#004d40] opacity-30">Supplier</p>
                                <p className="font-black text-[#004d40] text-lg">{invoice.supplier.name}</p>
                                <p className="text-xs font-bold opacity-50 italic">{invoice.supplier.contact}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-[#004d40] opacity-30">Date</p>
                                <p className="font-black text-[#004d40]">{new Date(invoice.date).toLocaleDateString()}</p>
                                <p className="text-xs font-bold opacity-50">#INV-{invoice.invoice_id}</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between text-xs font-black text-[#00897b] opacity-40 uppercase border-b border-black/5 pb-2">
                                <span>Description</span>
                                <span>Amount</span>
                            </div>
                            {invoice.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-[#004d40]">{item.medicine_name}</span>
                                        <span className="text-[11px] font-bold opacity-40 uppercase tracking-widest">Qty: {item.quantity} × ${item.unit_price}</span>
                                    </div>
                                    <span className="text-xl font-black text-[#00796b]">${Number(item.total).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t-4 border-double border-[#00897b]/10">
                            <div className="flex justify-between items-center">
                                <span className="font-black text-[#004d40] opacity-40">TOTAL SETTLEMENT</span>
                                <span className="text-4xl font-black text-[#00796b]">${Number(invoice.grand_total).toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => window.print()}
                            className="mt-10 no-print bg-[#f0f9f8] text-[#00897b] py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-[#00897b] hover:text-white transition-all uppercase"
                        >
                            Print Official Record
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 border-4 border-dashed border-[#00897b]/5 rounded-[50px] flex flex-col items-center justify-center text-center p-12 opacity-30">
                        <span className="text-5xl mb-6">📜</span>
                        <p className="text-sm font-black uppercase tracking-widest">Select history or record <br/> a new purchase to preview</p>
                    </div>
                )}
            </div>

           <style>{`
    /* ✅ SCROLLBAR */
    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #00897b22; border-radius: 10px; }

    /* ✅ FADE-IN ANIMATION */
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

    /* ✅ PRINT */
    @media print {
        body * { visibility: hidden; }
        #invoice-section, #invoice-section * { visibility: visible; }
        #invoice-section { position: absolute; left: 0; top: 0; width: 100%; }
        .no-print { display: none !important; }
    }
`}</style>
        </div>
    );
};

export default PurchasePage;