import React from 'react';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/features/auth/authSlice";

// Assets Import
import medicineIcon from '../assets/icons/medicine.svg';
import salesIcon from '../assets/icons/sales.png'; 
import purchaseIcon from '../assets/icons/purchase.svg';
import reportsIcon from '../assets/icons/reports.svg';
import supplierIcon from '../assets/icons/supplier.svg';
import customerIcon from '../assets/icons/customer.svg';
import logoutIcon from '../assets/icons/logout.svg'; // Imported your logout icon

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: 'Medicines', path: '/medicines', icon: medicineIcon },
    { name: 'Sales', path: '/sales', icon: salesIcon },
    { name: 'Purchase', path: '/purchase', icon: purchaseIcon },
    { name: 'Reports', path: '/reports', icon: reportsIcon },
    { name: 'Supplier', path: "/Supplier", icon: supplierIcon },
    { name: 'Customer', path: "/Customer", icon: customerIcon },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <aside className="w-64 bg-[#fdfdfd] border-r border-slate-100 p-5 flex flex-col h-screen sticky top-0">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-[#00796b] rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-teal-900/10">
          M
        </div>
        <div className="text-[#004d40] font-black text-xl tracking-tight">
          MED<span className="text-[#00796b]">STORE</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="space-y-1.5 flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Main Menu</p>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={({ isActive }) => 
                `group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive 
                  ? 'bg-[#00796b] text-white shadow-lg shadow-[#00796b]/20 translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#00796b]'
                }`
              }
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <img 
                  src={item.icon} 
                  alt={item.name} 
                  className={`w-full h-full object-contain transition-all duration-200 ${
                    isActive ? 'brightness-0 invert' : 'opacity-70 group-hover:opacity-100'
                  }`}
                />
              </div>
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="mt-auto pt-4 border-t border-slate-50">
        <button 
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          {/* IMPLEMENTED LOGOUT ICON BELOW */}
          <div className="w-5 h-5 flex items-center justify-center">
            <img 
              src={logoutIcon} 
              alt="Logout" 
              className="w-full h-full object-contain opacity-50 group-hover:opacity-100 group-hover:invert-[20%] group-hover:sepia-[100%] group-hover:saturate-[500%] group-hover:hue-rotate-[320deg] transition-all duration-200" 
              /* The long filter above turns the SVG red on hover to match the text */
            />
          </div>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;