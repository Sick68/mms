import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { getMedicinesForSale, createSale, getAllCustomers } from '../api/salesApi';

const SalesPage = () => {
    const [medicines, setMedicines] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [formData, setFormData] = useState({ medicine_id: '', quantity: 1 });
    const [lastSale, setLastSale] = useState(null);
    const [loading, setLoading] = useState(false);

    // Reusing the premium branding styles from PurchasePage
    const customSelectStyles = {
        control: (base) => ({
            ...base,
            backgroundColor: "#f0f9f8",
            borderRadius: "1.25rem",
            padding: "6px",
            fontSize: "1rem",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "none",
            "&:hover": { borderColor: "#00897b" }
        }),
        placeholder: (base) => ({ ...base, color: "rgba(0,105,92,0.4)", fontWeight: "600" }),
        singleValue: (base) => ({ ...base, color: "#004d40", fontWeight: "700" })
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const meds = await getMedicinesForSale();
                setMedicines(meds.data.map(m => ({ 
                    value: m.medicine_id, 
                    label: `${m.name} (Stock: ${m.quantity}) - $${m.price}` 
                })));

                const custs = await getAllCustomers();
                setCustomers(custs.data.map(c => ({
                    value: c.customer_id,
                    label: c.customer_name
                })));
            } catch (err) { console.error("Initialization failed", err); }
        };
        loadData();
    }, []);

    const handleProcessSale = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let payload = {
                medicine_id: formData.medicine_id,
                quantity: Number(formData.quantity),
                customer_id: null,
                customer_name: null
            };

            if (selectedCustomer) {
                if (typeof selectedCustomer.value === 'number' || !isNaN(selectedCustomer.value)) {
                    payload.customer_id = selectedCustomer.value;
                } else {
                    payload.customer_name = selectedCustomer.label;
                }
            } else {
                payload.customer_name = "Walk-in";
            }

            const res = await createSale(payload);
            setLastSale(res.data);
            alert("Sale Completed!");
            setSelectedCustomer(null);
            setFormData({ medicine_id: '', quantity: 1 });
        } catch (err) {
            alert(err.response?.data?.message || "Server Error");
        } finally { setLoading(false); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 bg-[#f4fcfb] min-h-screen animate-fade-in">
            
            {/* LEFT: SALE ENTRY FORM */}
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-black text-[#00695c] tracking-tight">Sales Counter</h1>
                    <p className="text-sm font-bold text-[#004d40] opacity-50 uppercase tracking-widest">Point of Sale System</p>
                </header>

                <form onSubmit={handleProcessSale} className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] border border-white shadow-xl space-y-6">
                    
                    {/* Customer Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00695c] uppercase ml-2 opacity-60">Customer Info</label>
                        <CreatableSelect
                            isClearable
                            options={customers}
                            value={selectedCustomer}
                            styles={customSelectStyles}
                            onChange={(selected) => setSelectedCustomer(selected)}
                            formatCreateLabel={(inputValue) => `Add "${inputValue}" as Walk-in`}
                            placeholder="Search registered or type name..."
                        />
                    </div>

                    {/* Medicine Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00695c] uppercase ml-2 opacity-60">Select Medicine</label>
                        <Select 
                            options={medicines}
                            styles={customSelectStyles}
                            placeholder="Choose medicine from stock..."
                            onChange={(opt) => setFormData({ ...formData, medicine_id: opt ? opt.value : "" })}
                        />
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-[#00695c] uppercase ml-2 opacity-60">Quantity to Sell</label>
                        <input 
                            type="number" min="1" required
                            className="w-full p-4 rounded-2xl bg-[#f0f9f8] text-lg font-bold text-[#004d40] outline-none border border-black/5 focus:border-[#00897b]"
                            value={formData.quantity}
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full py-5 bg-[#00897b] text-white text-lg font-black rounded-3xl hover:bg-[#00695c] transition-all shadow-2xl active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                    >
                        {loading ? 'Processing...' : 'Generate Invoice'}
                    </button>
                </form>
            </div>

            {/* RIGHT: INVOICE PREVIEW */}
            <div id="invoice-section" className="flex flex-col">
                <div className="mb-6 invisible lg:visible">
                    <h2 className="text-xs font-black text-[#00695c] uppercase opacity-40 ml-4 mb-3 tracking-widest">Live Preview</h2>
                </div>

                {lastSale ? (
                    <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-white flex flex-col h-full relative">
                        <div className="text-center border-b-2 border-dashed border-[#00897b]/10 pb-8 mb-8">
                            <h3 className="font-black text-2xl text-[#00796b]">SALES RECEIPT</h3>
                            <p className="text-[11px] font-black text-[#00897b] opacity-40 uppercase tracking-tighter">Transaction #{lastSale.sale_id}</p>
                        </div>

                        <div className="flex justify-between mb-10 text-sm">
                            <div>
                                <p className="text-[10px] font-black uppercase text-[#004d40] opacity-30">Client</p>
                                <p className="font-black text-[#004d40] text-lg">{lastSale.customer_name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-[#004d40] opacity-30">Date</p>
                                <p className="font-black text-[#004d40]">{new Date(lastSale.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between text-xs font-black text-[#00897b] opacity-40 uppercase border-b border-black/5 pb-2">
                                <span>Description</span>
                                <span>Subtotal</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div className="flex flex-col">
                                    <span className="text-lg font-black text-[#004d40]">{lastSale.medicine.name}</span>
                                    <span className="text-[11px] font-bold opacity-40 uppercase tracking-widest">
                                        Qty: {lastSale.medicine.quantity} × ${lastSale.medicine.price}
                                    </span>
                                </div>
                                <span className="text-xl font-black text-[#00796b]">
                                    ${Number(lastSale.medicine.subtotal).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-black/5 space-y-3">
                            <div className="flex justify-between text-sm font-bold opacity-60">
                                <span>Tax ({lastSale.tax_percent}%)</span>
                                <span>+${((lastSale.medicine.subtotal * lastSale.tax_percent) / 100).toFixed(2)}</span>
                            </div>

                            {lastSale.discount_amount > 0 && (
                                <div className="flex justify-between text-sm font-black text-[#00897b] bg-[#f0f9f8] p-3 rounded-xl border border-[#00897b]/10">
                                    <span>Discount Applied</span>
                                    <span>-${Number(lastSale.discount_amount).toFixed(2)}</span>
                                </div>
                            )}

                            <div className="pt-8 border-t-4 border-double border-[#00897b]/10">
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-[#004d40] opacity-40">TOTAL PAYABLE</span>
                                    <span className="text-4xl font-black text-[#00796b]">
                                        ${Number(lastSale.finalTotal).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => window.print()}
                            className="mt-10 no-print bg-[#f0f9f8] text-[#00897b] py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-[#00897b] hover:text-white transition-all uppercase"
                        >
                            Print Official Receipt
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 border-4 border-dashed border-[#00897b]/5 rounded-[50px] flex flex-col items-center justify-center text-center p-12 opacity-30">
                        
                        <p className="text-sm font-black uppercase tracking-widest">Process a transaction <br/> to generate receipt</p>
                    </div>
                )}
            </div>

           <style>{`
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

    /* ✅ PRINT SETTINGS */
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

export default SalesPage;