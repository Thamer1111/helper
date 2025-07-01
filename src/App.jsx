import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import NormalUserForm from "./components/NormalUserForm";
import HelperUserForm from "./components/HelperUserForm";
import NormalUserPage from "./components/NormalUserPage";
import HelperUserPage from "./components/HelperUserPage";

export default function App() {
  return (
    <Router>
      <div className="p-6 bg-gray-100 min-h-screen">
        <nav className="mb-6 flex justify-center gap-4">
          <Link to="/normal" className="text-blue-600 hover:underline">مستخدم عادي</Link>
          <Link to="/helper" className="text-blue-600 hover:underline">مستخدم مساعد</Link>
        </nav>
        <Routes>
          <Route path="/normal" element={<NormalUserForm />} />
          <Route path="/helper" element={<HelperUserForm />} />
          <Route path="/normal/page/:id" element={<NormalUserPage />} />
          <Route path="/helper/page/:id" element={<HelperUserPage />} />
        </Routes>
      </div>
    </Router>
  );
}