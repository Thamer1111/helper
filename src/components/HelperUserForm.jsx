import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function HelperUserForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", code: "" });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(async position => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const res = await fetch("https://683f24371cd60dca33de6ad4.mockapi.io/userHelper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...location })
      });
      const data = await res.json();
      navigate(`/helper/page/${data.id}`);
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">تسجيل مساعد</h2>
        <input name="name" placeholder="الاسم" onChange={handleChange} required className="input" />
        <input name="email" placeholder="الإيميل" onChange={handleChange} required className="input" />
        <input name="phone" placeholder="رقم التواصل" onChange={handleChange} required className="input" />
        <input name="code" placeholder="الرمز" onChange={handleChange} required className="input" />
        <button type="submit" className="btn">تسجيل</button>
      </form>
    </div>
  );
}
