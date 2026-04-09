import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/adminPage";

import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import MainLayout from "./Components/MainLayout.jsx";
import MedicinePage from "./pages/MedicinePage.jsx";
import SalesPage from "./pages/SalesPage.jsx";
import PurchasePage from "./pages/PurchasePage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import CustomerPage from "./pages/CustomerPage.jsx";
import SupplierPage from "./pages/SupplierPage.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route 
    path="/admin" 
    element={
      <ProtectedRoute allowedRole="admin">
        <AdminPage />
      </ProtectedRoute>
    } 
  />
  {/* Staff Routes with Sidebar */}
  <Route element={<MainLayout />}>
    <Route path="/medicines" element={<MedicinePage/>} />
    <Route path="/sales" element={<SalesPage/>} />
    <Route path="/purchase" element={<PurchasePage />} />
    <Route path="/reports" element={<ReportsPage/>} />
    <Route path="/Customer" element={<CustomerPage/>}></Route>
    <Route path="/Supplier" element={<SupplierPage/>}></Route>
  </Route>
    </Routes>
  );
}
export default App;