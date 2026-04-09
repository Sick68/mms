import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex h-screen w-full bg-[#f4fbfc] overflow-hidden">
      {/* Sidebar remains static */}
      <Sidebar /> 

      {/* Main area gets its own scrollbar */}
      <main className="flex-1 p-6 overflow-y-auto relative custom-scroll">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;