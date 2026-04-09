import React, { useState, useEffect } from "react";
import { getDailyReport, getMonthlyReport, getStockReport, getExpiryReport } from "../api/ReportApi.js";
// NEW: Import Recharts components
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ReportPage = () => {
    const [reports, setReports] = useState({ daily: [], monthly: [], stock: [], expiry: [] });
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const loadAll = async () => {
            try {
                const [d, m, s, e] = await Promise.all([
                    getDailyReport(date),
                    getMonthlyReport(new Date().getMonth() + 1, new Date().getFullYear()),
                    getStockReport(),
                    getExpiryReport()
                ]);
                setReports({ daily: d.data, monthly: m.data, stock: s.data, expiry: e.data });
            } catch (err) { console.error("Data fetch failed"); }
        };
        loadAll();
    }, [date]);

    // Format Data for Daily Graph (e.g., grouping by ID for display)
    const dailyData = reports.daily.map(item => ({
        name: item.medicine_name.substring(0, 5),
        amount: item.finalTotal
    }));

    return (
        <div className="p-6 bg-[#f4fcfb] min-h-screen space-y-6 animate-fade-in">
            {/* TOP HEADER */}
            <div className="flex justify-between items-center bg-white/80 p-6 rounded-[30px] border border-white shadow-sm">
                <div>
                    <h1 className="text-xl font-black text-[#00695c]">Management Reports</h1>
                    <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Medical Store Analytics</p>
                </div>
                <input 
                    type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="p-3 bg-[#f0f9f8] rounded-xl text-xs font-bold text-[#00695c] outline-none"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* DAILY SALES - LINE CHART */}
                <ReportCard title="Daily Revenue Trend" icon="📈">
                    <div className="h-full w-full pt-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00897b11" />
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#00695c' }}
                                />
                                <Line type="monotone" dataKey="amount" stroke="#00897b" strokeWidth={4} dot={{ r: 4, fill: '#00897b' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                        <p className="text-[10px] text-center font-bold opacity-30 mt-4 uppercase">Individual Sale Performance (Today)</p>
                    </div>
                </ReportCard>

                {/* MONTHLY SALES - BAR CHART */}
                <ReportCard title="Monthly Volume" icon="📊">
                    <div className="h-full w-full pt-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={reports.monthly}>
                                <XAxis dataKey="medicine_name" hide />
                                <Tooltip 
                                     contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="finalTotal" fill="#00897b" radius={[10, 10, 10, 10]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                        <p className="text-[10px] text-center font-bold opacity-30 mt-4 uppercase">Sales distribution for current month</p>
                    </div>
                </ReportCard>

               {/* INVENTORY STOCK - CLEAN MODERN PROGRESS STYLE */}
<ReportCard title="Inventory Stock" icon="📦">
    <div className="space-y-4">
        {reports.stock.map((item) => {
            const isLow = item.quantity < 10;
            // Calculate a simple percentage for the progress bar (assuming 100 is "full")
            const stockLevel = Math.min((item.quantity / 100) * 100, 100);
            
            return (
                <div key={item.medicine_id} className="p-4 bg-white/60 rounded-[24px] border border-white/50 shadow-sm transition-all hover:scale-[1.02]">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <p className="text-xs font-black text-[#004d40] tracking-tight">{item.name}</p>
                            <p className="text-[9px] font-bold opacity-40 uppercase">ID: {item.medicine_id}</p>
                        </div>
                        <div className={`text-[10px] font-black px-3 py-1 rounded-lg ${isLow ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-[#00897b]/10 text-[#00897b]'}`}>
                            {item.quantity} units
                        </div>
                    </div>
                    {/* Minimalist Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ${isLow ? 'bg-red-400' : 'bg-[#00897b]'}`}
                            style={{ width: `${stockLevel}%` }}
                        />
                    </div>
                </div>
            );
        })}
    </div>
</ReportCard>

{/* EXPIRY ALERTS - HIGH-VISIBILITY URGENCY CARDS */}
<ReportCard title="Expiry Alerts" icon="⚠️">
    <div className="space-y-3">
        {reports.expiry.map((item) => (
            <div key={item.medicine_id} className="relative overflow-hidden p-4 bg-white/40 rounded-[24px] border border-white group hover:bg-red-50/30 transition-all">
                {/* Decorative Side Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 opacity-40" />
                
                <div className="flex justify-between items-start">
                    <div className="pl-2">
                        <p className="text-xs font-black text-red-900/80 tracking-tight">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-bold text-red-500/60 border border-red-500/20 px-2 py-0.5 rounded-md uppercase">
                                Action Required
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Expires</p>
                        <p className="text-xs font-bold text-[#004d40]">
                            {new Date(item.expiry_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>
        ))}
    </div>
</ReportCard>

            </div>

            <style>{`
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #00897b22; border-radius: 10px; }
            `}</style>
        </div>
    );
};

const ReportCard = ({ title, icon, children }) => (
    <div className="bg-white/40 backdrop-blur-md p-6 rounded-[35px] border border-white shadow-sm h-[380px] flex flex-col transition-all hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
            <span className="bg-white p-2 rounded-xl shadow-sm">{icon}</span>
            <h2 className="text-[11px] font-black uppercase opacity-40 tracking-widest">{title}</h2>
        </div>
        <div className="overflow-y-auto flex-grow custom-scroll pr-2">
            {children && (Array.isArray(children) ? children.length > 0 : true) ? children : (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <p className="text-[10px] font-black uppercase">No Data Recorded</p>
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

export default ReportPage;