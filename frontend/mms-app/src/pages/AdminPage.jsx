import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { logout } from '../Redux/features/auth/authSlice';
import { 
  fetchUsers, 
  deleteUser, 
  addUser, 
  updateUserRole, 
  fetchSettings, 
  updateSetting 
} from '../api/adminApi';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' });
  const [localSettings, setLocalSettings] = useState({});
  const [toast, setToast] = useState({ show: false, message: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userRes = await fetchUsers();
      const settingsRes = await fetchSettings();
      setUsers(userRes.data);
      setSettings(settingsRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout()); // Clears Redux state and LocalStorage
    navigate('/login'); // Redirects to login page
  };
  
  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // --- HANDLERS ---
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUser(newUser);
      setNewUser({ username: '', password: '', role: 'staff' });
      loadData();
      showToast("User added successfully!");
    } catch (err) { alert("Error adding user"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        loadData();
        showToast("User removed successfully");
      } catch (err) { alert("Error deleting user"); }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      loadData();
      showToast("Role updated!");
    } catch (err) { alert("Failed to update role"); }
  };

  const saveSettings = async () => {
    try {
      const keys = Object.keys(localSettings);
      if (keys.length === 0) return;
      await Promise.all(keys.map(key => updateSetting(key, localSettings[key])));
      showToast("Settings saved successfully!");
      setLocalSettings({});
      loadData();
    } catch (err) { showToast("Error saving settings"); }
  };

  // Search Logic
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-[#f4fbfc] font-['Segoe_UI',sans-serif] text-[#003d33]">
      
      {/* Sleek Toast */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 bg-[#00796b] text-white px-5 py-2.5 rounded-lg shadow-lg text-sm font-medium animate-pulse">
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
       
        <div className="flex justify-between items-center mb-8">
  <h1 className="text-2xl font-bold text-[#00695c] tracking-tight">Admin Control</h1>
  <button 
    onClick={handleLogout}
    className="px-4 py-1.5 text-[11px] font-bold tracking-widest text-red-500/80 border border-red-500/20 rounded-lg bg-white/30 backdrop-blur-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 active:scale-95 flex items-center gap-2"
  >
    <span className="text-[10px]">⏻</span> LOGOUT
  </button>
</div>

        {/* COMPACT ADD USER */}
        <section className="bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-white shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-70">Register Staff</h2>
          <form onSubmit={handleAddUser} className="flex flex-wrap gap-3">
            <input 
              type="text" placeholder="Username" required
              className="flex-1 p-2.5 rounded-xl border border-black/5 bg-white/50 text-sm outline-none focus:ring-1 focus:ring-[#00897b]/30"
              value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            />
            <input 
              type="password" placeholder="Password" required
              className="flex-1 p-2.5 rounded-xl border border-black/5 bg-white/50 text-sm outline-none focus:ring-1 focus:ring-[#00897b]/30"
              value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            />
            <select 
              className="p-2.5 rounded-xl border border-black/5 bg-white/50 text-sm outline-none cursor-pointer"
              value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="staff">Staff Access</option>
              <option value="admin">Admin Access</option>
            </select>
            <button type="submit" className="px-6 py-2.5 bg-[#00897b] text-white font-bold text-sm rounded-xl hover:bg-[#00695c] transition-all active:scale-95">
              Create Account
            </button>
          </form>
        </section>

        {/* SIDE-BY-SIDE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* USER MANAGEMENT */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm flex flex-col max-h-[500px]">
            <div className="p-4 px-5 border-b border-black/5 flex justify-between items-center bg-white/30">
              <h2 className="text-sm font-bold uppercase tracking-wider opacity-70">Manage Users</h2>
              
              {/* Search Inside Header */}
              <div className="relative">
                <input 
                  type="text" placeholder="Search users..." 
                  className="p-1.5 px-3 pl-8 rounded-lg bg-white/50 border border-black/5 text-xs outline-none focus:ring-1 focus:ring-[#00897b]/20"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] opacity-40">🔍</span>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f0f9f8] text-[#00695c] text-[11px] font-bold uppercase sticky top-0 z-10">
                  <tr>
                    <th className="p-3 px-6">Username</th>
                    <th className="p-3 px-6">Access Level</th>
                    <th className="p-3 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="border-b border-black/5 hover:bg-white/40 transition-colors">
                      <td className="p-3 px-6 font-medium">{user.username}</td>
                      <td className="p-3 px-6">
                        <select 
                          value={user.role} 
                          onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border-none cursor-pointer ${
                            user.role === 'admin' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          <option value="admin">ADMIN</option>
                          <option value="staff">STAFF</option>
                        </select>
                      </td>
                      <td className="p-3 px-6 text-center">
                        <button 
                          onClick={() => handleDelete(user.user_id)}
                          className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-10 text-center text-xs opacity-50 italic">No users found matching "{searchTerm}"</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SYSTEM CONFIG */}
       <div className="bg-white/80 backdrop-blur-md p-6 rounded-[30px] shadow-sm border border-white">
  <h2 className="text-sm font-black text-[#00695c] uppercase tracking-widest mb-6">Global Policies</h2>
  
  <div className="grid gap-5">
    {settings.map((s) => (
      <div key={s.setting_key} className="flex flex-col gap-1">
        <label className="text-[10px] font-black text-[#004d40] opacity-40 uppercase ml-1">
          {s.setting_key.replace(/_/g, ' ')}
        </label>
        <div className="relative">
          <input 
            type="number" 
            defaultValue={s.setting_value}
            onChange={(e) => setLocalSettings(p => ({ ...p, [s.setting_key]: e.target.value }))}
            className="w-full p-3.5 rounded-2xl bg-[#f0f9f8] border border-transparent focus:border-[#00897b]/20 focus:bg-white transition-all text-sm font-bold outline-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-20">
            {s.setting_key.includes('percentage') ? '%' : '$'}
          </span>
        </div>
      </div>
    ))}
    
    <button 
      onClick={saveSettings}
      className="mt-2 w-full py-4 bg-[#00897b] text-white font-black text-xs rounded-2xl hover:bg-[#00695c] shadow-lg shadow-[#00897b]/20 active:scale-95 transition-all"
    >
      SAVE SYSTEM CONFIG
    </button>
  </div>
</div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 121, 107, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 121, 107, 0.2); }
      `}</style>
    </div>
  );
};

export default AdminPage;