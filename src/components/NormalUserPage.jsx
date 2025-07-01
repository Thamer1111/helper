import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function NormalUserPage() {
  const { id } = useParams();
  const [helperInfo, setHelperInfo] = useState(null);

  const requestHelp = () => {
    navigator.geolocation.getCurrentPosition(async position => {
      const updated = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        helpRequested: true,
      };
      await fetch(`https://683f24371cd60dca33de6ad4.mockapi.io/normaluser/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    });
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("https://683f24371cd60dca33de6ad4.mockapi.io/userHelper");
      const helpers = await res.json();
      const acceptedHelper = helpers.find(h => h.acceptedUserId === id);
      if (acceptedHelper) setHelperInfo(acceptedHelper);
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">صفحة المستخدم العادي</h2>
      <button onClick={requestHelp} className="btn border rounded-md bg-blue-500 p-2">طلب مساعدة</button>
      {helperInfo && (
        <div className="mt-4 p-4 bg-green-100 rounded-md">
          <h3 className="font-bold text-lg">تم قبول مساعدتك من:</h3>
          <p>الاسم: {helperInfo.name}</p>
          <p>رقم التواصل: {helperInfo.phone}</p>
        </div>
      )}
    </div>
  );
}
