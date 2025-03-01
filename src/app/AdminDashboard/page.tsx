"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contact?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"single" | "multiple" | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // ✅ **Redirect if no token**
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/AdminLogin");
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  // ✅ **Fetch Users from API**
  useEffect(() => {
    if (!isCheckingAuth) {
      fetchUsers();
    }
  }, [isCheckingAuth]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/getUsers");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // ✅ **Confirm Delete Popup Logic**
  const confirmDelete = (mode: "single" | "multiple", userId?: string) => {
    setDeleteMode(mode);
    setShowConfirmation(true);
    if (mode === "single" && userId) {
      setUserToDelete(userId);
    }
  };

  // ✅ **Perform Deletion**
  const handleDeleteConfirmed = async () => {
    if (deleteMode === "single" && userToDelete) {
      try {
        const response = await fetch(`/api/admin/deleteUser`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userToDelete }),
        });

        if (response.ok) {
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete));
          setSelectedUsers((prev) => prev.filter((id) => id !== userToDelete));
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else if (deleteMode === "multiple" && selectedUsers.length > 0) {
      try {
        for (const userId of selectedUsers) {
          await fetch(`/api/admin/deleteUser`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
        }

        setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user._id)));
        setSelectedUsers([]);
      } catch (error) {
        console.error("Error deleting users:", error);
      }
    }
    setShowConfirmation(false);
    setDeleteMode(null);
    setUserToDelete(null);
  };

  // ✅ **Logout Functionality**
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");
    window.history.replaceState(null, "", "/AdminLogin");
    router.push("/AdminLogin");
  };

  // ✅ **Filter Users for Search**
  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ✅ **Select All Users**
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user._id));
    }
  };

  // ✅ **Select Individual Users**
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  if (isCheckingAuth) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Users Table */}
      <div className="container mx-auto py-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Here's the list of all the registered users:
        </h2>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-4 py-4">
                  <input type="checkbox" onChange={toggleSelectAll} checked={selectedUsers.length === filteredUsers.length} />
                </th>
                <th className="px-6 py-4 text-left font-medium">First Name</th>
                <th className="px-6 py-4 text-left font-medium">Last Name</th>
                <th className="px-6 py-4 text-left font-medium">Email</th>
                <th className="px-6 py-4 text-left font-medium">Contact</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-blue-50">
                    <td className="px-4 py-4">
                      <input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={() => toggleUserSelection(user._id)} />
                    </td>
                    <td className="px-6 py-4">{user.firstName}</td>
                    <td className="px-6 py-4">{user.lastName}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.contact || "Not provided"}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => confirmDelete("single", user._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedUsers.length > 0 && (
          <button onClick={() => confirmDelete("multiple")} className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700">
            Delete Selected Users ({selectedUsers.length})
          </button>
        )}
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold text-red-600">Are you sure?</h2>
            <p className="text-gray-700">{deleteMode === "single" ? "Do you really want to delete this user?" : "Do you really want to delete these selected users?"}</p>
            <button onClick={handleDeleteConfirmed} className="px-6 py-2 bg-red-600 text-white rounded-lg">Yes, Delete</button>
            <button onClick={() => setShowConfirmation(false)} className="px-6 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}