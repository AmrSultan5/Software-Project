"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  user_id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  profile_picture_url?: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/users", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch users.");
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!searchQuery.trim()) {
        await fetchUsers(); // Reset to all users if search query is empty
        return;
      }
      const response = await fetch(`http://localhost:5000/api/users/${searchQuery}`, {
        method: "GET",
      });
      if (response.status === 404) {
        setUsers([]); // Clear users list if no match
        throw new Error("User not found.");
      }
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data: User = await response.json();
      setUsers([data]); // Show the matching user
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user_id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user_id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete user.");
      setUsers(users.filter((user) => user.user_id !== user_id)); // Update UI
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleAddUser = () => {
    setEditUser({
      user_id: "",
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveUser = async (user: User) => {
    if (!user.name || !user.email || !user.role || !user.password || (!isEditing && !user.user_id)) {
      alert("Please fill out all fields.");
      return;
    }

    const parsedUser = {
      ...user,
      user_id: isEditing ? user.user_id : Number(user.user_id),
    };

    if (!isEditing && isNaN(Number(parsedUser.user_id))) {
      alert("User ID must be a valid number.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `http://localhost:5000/api/users/${parsedUser.user_id}`
        : "http://localhost:5000/api/users";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedUser),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to save user: ${errorMessage}`);
      }

      setShowModal(false);
      fetchUsers();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-5 text-black">
      <button onClick={() => router.push("/admin")} className="bg-blue-500 text-white p-2 rounded mb-5">
        Home
      </button>

      <h1 className="text-2xl font-bold mb-5">Users Management</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-5 flex gap-2">
        <input
          type="text"
          placeholder="Search users..."
          className="border p-2 flex-1 text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>

      {/* Users Table */}
      <table className="w-full border text-black">
        <thead>
          <tr>
            <th className="border p-2">User-ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td className="border p-2">{user.user_id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                <button onClick={() => handleEditUser(user)} className="text-blue-500 mr-2">
                  Edit
                </button>
                <button onClick={() => handleDeleteUser(user.user_id)} className="text-red-500">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Button at the End */}
      <div className="mt-5">
        <button onClick={handleAddUser} className="bg-green-500 text-white p-2 rounded">
          Add User
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded w-1/3">
            <h2 className="text-xl font-bold mb-5">{isEditing ? "Edit User" : "Add User"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editUser) handleSaveUser(editUser);
              }}
            >
              {!isEditing && (
                <input
                  type="number"
                  placeholder="User ID"
                  className="border p-2 w-full mb-2 text-black"
                  value={editUser?.user_id || ""}
                  onChange={(e) =>
                    setEditUser((prev) =>
                      prev ? { ...prev, user_id: e.target.value } : prev
                    )
                  }
                />
              )}
              <input
                type="text"
                placeholder="Name"
                className="border p-2 w-full mb-2 text-black"
                value={editUser?.name || ""}
                onChange={(e) =>
                  setEditUser((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full mb-2 text-black"
                value={editUser?.email || ""}
                onChange={(e) =>
                  setEditUser((prev) =>
                    prev ? { ...prev, email: e.target.value } : prev
                  )
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="border p-2 w-full mb-2 text-black"
                value={editUser?.password || ""}
                onChange={(e) =>
                  setEditUser((prev) =>
                    prev ? { ...prev, password: e.target.value } : prev
                  )
                }
              />
              <select
                className="border p-2 w-full mb-2 text-black"
                value={editUser?.role || ""}
                onChange={(e) =>
                  setEditUser((prev) =>
                    prev ? { ...prev, role: e.target.value } : prev
                  )
                }
              >
                <option value="">Select Role</option>
                <option value="student">student</option>
                <option value="instructor">instructor</option>
                <option value="admin">admin</option>
              </select>
              <button type="submit" className="bg-blue-500 text-white p-2 w-full" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mt-2 bg-gray-500 text-white p-2 w-full"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}