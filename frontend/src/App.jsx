import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import EmployeeDashboard from "./pages/EmployeeDashboard";

import ManagerDashboard from "./pages/ManagerDashboard";

import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/employee" element={<EmployeeDashboard />} />

        <Route path="/manager" element={<ManagerDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
