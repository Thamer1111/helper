import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function HelperUserPage() {
  const { id } = useParams();
  const [helper, setHelper] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`https://683f24371cd60dca33de6ad4.mockapi.io/userHelper/${id}`);
      const data = await res.json();
      setHelper(data);
      if (data.acceptedUserId) {
        const userRes = await fetch(`https://683f24371cd60dca33de6ad4.mockapi.io/normaluser/${data.acceptedUserId}`);
        const userData = await userRes.json();
        setSelectedUser(userData);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!helper || helper.acceptedUserId) return;
      const res = await fetch("https://683f24371cd60dca33de6ad4.mockapi.io/normaluser");
      const users = await res.json();
      const filtered = users.filter(u =>
        u.helpRequested &&
        getDistanceKm(helper.lat, helper.lng, u.lat, u.lng) <= 35
      );
      setRequests(filtered);
    };
    const interval = setInterval(fetchRequests, 3000);
    return () => clearInterval(interval);
  }, [helper]);

  const acceptHelp = async user => {
    await fetch(`https://683f24371cd60dca33de6ad4.mockapi.io/userHelper/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acceptedUserId: user.id }),
    });
    setSelectedUser(user);
    alert("تم قبول الطلب");
  };

  const finishHelp = async () => {
    if (!selectedUser) return;
    await fetch(`https://683f24371cd60dca33de6ad4.mockapi.io/normaluser/${selectedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ helpRequested: false })
    });
    await fetch(`https://683f24371cd60dca33de6ad4.mockapi.io/userHelper/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acceptedUserId: "" })
    });
    setSelectedUser(null);
    alert("تم إنهاء الطلب");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">طلبات المساعدة القريبة</h2>
      {!selectedUser && requests.map(user => (
        <div key={user.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
          <p>اسم المستخدم: {user.name}</p>
          <p>يبعد: {getDistanceKm(helper.lat, helper.lng, user.lat, user.lng).toFixed(2)} كم</p>
          <button onClick={() => acceptHelp(user)} className="btn mt-2">قبول</button>
        </div>
      ))}

      {selectedUser && (
        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">تم قبول الطلب لهذا المستخدم:</h3>
          <p><strong>الاسم:</strong> {selectedUser.name}</p>
          <p><strong>رقم التواصل:</strong> {selectedUser.phone}</p>
          <p><strong>الموقع:</strong> {selectedUser.lat}, {selectedUser.lng}</p>
          <button onClick={finishHelp} className="btn mt-4 bg-red-500 hover:bg-red-600">إنهاء الطلب</button>
        </div>
      )}
    </div>
  );
}
