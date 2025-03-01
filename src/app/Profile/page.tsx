"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState<any>({});
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        alert("You must be logged in to access this page.");
        router.push("/Login");
        return;
      }
      try {
        const response = await fetch(`/api/profile?email=${email}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Failed to load profile data.");
        } else {
          setUserData(data);
          setUpdatedData({ ...data, password: "" }); // Reset password field
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("An unexpected error occurred while fetching profile data.");
      }
    };
    fetchUserData();
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setUpdatedData({ ...updatedData, [field]: value });
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUpdatedData({ ...updatedData, profilePicture: reader.result as string });
      setProfilePicturePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,10}$/;
    return passwordRegex.test(password);
  };

  const handleSave = async () => {
    const requestData = { ...updatedData };

    // Validate password if provided
    if (updatedData.password && updatedData.password.trim() !== "") {
      if (!validatePassword(updatedData.password)) {
        alert("Password must be 6–10 chars, including letters, digits, and a special character.");
        return;
      }
    } else {
      delete requestData.password; // Ensure password field is removed if empty
    }

    try {
      const response = await fetch(`/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update profile.");
        return;
      }

      alert("Profile updated successfully!");

      // Redirect to login if password was changed
      if (updatedData.password && updatedData.password.trim() !== "") {
        alert("Password updated. Please log in again.");
        localStorage.clear();
        router.push("/Login");
        return;
      }

      // Otherwise, update the UI without logout
      setIsEditing(false);
      setUserData({ ...userData, ...requestData });
    } catch (err) {
      console.error("Error saving profile data:", err);
      alert("An error occurred while saving profile data.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/Login");
  };

  const handleCreateStore = () => {
    router.push("/CreatingStore");
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }
  if (!userData) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-[#0F6466]">
        Welcome, {userData.firstName} {userData.lastName}
      </h1>
      <div className="mt-4 bg-white p-6 rounded shadow-lg max-w-md mx-auto">
        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-center text-black mb-1">First Name:</label>
              <input
                type="text"
                value={updatedData.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-center text-black mb-1">Last Name:</label>
              <input
                type="text"
                value={updatedData.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-center text-black mb-1">Password:</label>
              <input
                type="password"
                value={updatedData.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-500 text-center mt-1">
                (Only fill this out if you want to change your password.)
              </p>
            </div>
            <div>
              <label className="block text-center text-black mb-1">Profile Picture:</label>
              <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="w-full p-2" />
              {profilePicturePreview && (
                <img src={profilePicturePreview} alt="Preview" className="mt-4 w-24 h-24 rounded-full object-cover mx-auto" />
              )}
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {userData.profilePicture && (
              <img src={userData.profilePicture} alt="Profile" className="rounded-full w-32 h-32 mx-auto mb-4 object-cover" />
            )}
            <p className="text-lg text-gray-700"><strong>Email:</strong> {userData.email}</p>
            <p className="text-lg text-gray-700"><strong>Contact Number:</strong> {userData.contactNumber || "Not provided"}</p>
            <div className="mt-4 flex flex-col items-center space-y-2">
              <button onClick={() => setIsEditing(true)} className="bg-green-500 text-white py-2 px-4 rounded">Edit Profile</button>
              <button onClick={handleCreateStore} className="bg-blue-500 text-white py-2 px-4 rounded">Create Store</button>
              <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded">Logout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
