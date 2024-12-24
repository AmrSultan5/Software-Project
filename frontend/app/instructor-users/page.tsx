"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../contexts/AuthContext"; // Adjust the path as needed

type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  password:string,
  profile_picture_url?: string;
  coursesEnrolled?: string[];
};

type Course = {
  course_id: string;
  title: string;
  description?: string;
  category: string;
  difficulty_level: string;
  taught_by: number; // Changed from created_by to taught_by
  hierarchy?: Section[];
};

type Lesson = {
  title: string;
  content: string;
};

type Section = {
  section: string;
  lessons: Lesson[];
};

export default function Users() {
  const { userId,  } = useContext(AuthContext);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/courses", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses.");
      }

      const data: Course[] = await response.json();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledStudents();
    fetchCourses();
  }, []);

  const fetchEnrolledStudents = async () => {
    setLoading(true);
    setError(null);
    try {

      const response = await fetch(
        `http://localhost:5000/api/users/enrolled-in-instructor-courses/${userId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch enrolled students.");
      }

      const data: User[] = await response.json();
      setUsers(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error fetching enrolled students:", errorMessage);
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
        await fetchEnrolledStudents(); // Reset to all users if search query is empty
        return;
      }
      const response = await fetch(
        `http://localhost:5000/api/users/enrolled-in-instructor-courses/search?query=${encodeURIComponent(
          searchQuery
        )}`,
        {
          method: "GET",
        }
      );
      if (response.status === 404) {
        setUsers([]); // Clear users list if no match
        throw new Error("User not found.");
      }
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data: User[] = await response.json();
      setUsers(data); // Show the matching users
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user_id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user_id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user.");
      setUsers(users.filter((user) => user.user_id !== user_id)); // Update UI
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleAddUser = () => {
    setEditUser({
      user_id: 0, // Initialize with 0 or appropriate default
      name: "",
      email: "",
      password: "",
      role: "student",
      coursesEnrolled: [],
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
    if (
      !user.name ||
      !user.email ||
      !user.role ||
      (!isEditing && !user.user_id) ||
      (!isEditing && isNaN(user.user_id))
    ) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `http://localhost:5000/api/users/${user.user_id}`
        : "http://localhost:5000/api/users";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to save user: ${errorMessage}`);
      }

      setShowModal(false);
      // Refetch enrolled students after adding/editing
      await fetchEnrolledStudents();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error saving user:", errorMessage);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-5 text-black">
      <button
        onClick={() => router.push("/instructor")}
        className="bg-blue-500 text-white p-2 rounded mb-5"
      >
        Home
      </button>

      <h1 className="text-2xl font-bold mb-5">Students Enrolled in Your Courses</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-5 flex gap-2">
        <input
          type="text"
          placeholder="Search students..."
          className="border p-2 flex-1 text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </form>

      {/* Add User Button */}
      <button onClick={handleAddUser} className="bg-green-500 text-white p-2 rounded mb-5">
        Add Student
      </button>

      {/* Users Table */}
      <table className="w-full border text-black">
        <thead>
          <tr>
            <th className="border p-2">User-ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Courses Enrolled</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td className="border p-2">{user.user_id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                {user.coursesEnrolled && user.coursesEnrolled.length > 0
                  ? user.coursesEnrolled.join(", ")
                  : "None"}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.user_id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit User */}
      {showModal && editUser && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded w-1/3">
            <h2 className="text-xl font-bold mb-5">
              {isEditing ? "Edit Student" : "Add Student"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveUser(editUser);
              }}
            >
              {!isEditing && (
                <input
                  type="number"
                  placeholder="User ID"
                  className="border p-2 w-full mb-2 text-black"
                  value={editUser.user_id || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, user_id: Number(e.target.value) })
                  }
                  required
                />
              )}
              <input
                type="text"
                placeholder="Name"
                className="border p-2 w-full mb-2 text-black"
                value={editUser.name || ""}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full mb-2 text-black"
                value={editUser.email || ""}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border p-2 w-full mb-2 text-black"
                value={editUser.password || ""}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                required
              />
              <select
                className="border p-2 w-full mb-2 text-black"
                value={editUser.role || "student"}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                required
              >
                <option value="student">Student</option>
                {/* Add other roles if necessary */}
              </select>
              <label className="font-semibold mb-1 block text-black">
                Enroll in Courses:
              </label>
              <select
                multiple
                className="border p-2 w-full mb-2 text-black"
                value={editUser.coursesEnrolled || []}
                onChange={(e) => {
                  const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
                  setEditUser({ ...editUser, coursesEnrolled: selectedValues });
                }}
              >
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 w-full"
                disabled={saving}
              >
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
