"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatingStore() {
  const [storeName, setStoreName] = useState("");
  const [itemType, setItemType] = useState("");
  const [categories, setCategories] = useState("");
  const [location, setLocation] = useState("");
  const [customUserId, setCustomUserId] = useState(""); // Custom user ID
  const router = useRouter();

  const handleCreateStore = async () => {
    try {
      const response = await fetch("/api/profile/createStore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customUserId,
          storeName,
          itemType,
          categories: Number(categories),
          location,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Store Created Successfully!");
        router.push("/Profile");
      } else {
        alert(data.message || "Failed to create store");
      }
    } catch (error) {
      console.error("Error creating store:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Create Store</h2>

        <input
          type="text"
          placeholder="Custom User ID"
          value={customUserId}
          onChange={(e) => setCustomUserId(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          placeholder="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          placeholder="Item Type"
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="number"
          placeholder="Number of Categories"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={handleCreateStore}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create
        </button>
      </div>
    </div>
  );
}
