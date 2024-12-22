"use client";

import { useState, useEffect } from "react";
import { AiFillDelete, AiOutlineDownload, AiFillHome } from "react-icons/ai";

type BackupRecord = {
  backup_id?: string; // backup_id might not always exist
  _id: string;
  fileName: string;
  createdAt?: string; // createdAt might be optional
};

export default function BackupManagement() {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBackupHistory();
  }, []);

  const fetchBackupHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/admin/backup/history", {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to fetch backup history.");

      const data: BackupRecord[] = await response.json();

      // Ensure dates are properly formatted before setting state
      const formattedData = data.map((backup) => ({
        ...backup,
        backup_id: backup.backup_id || backup._id, // Use `_id` as fallback if backup_id is missing
        createdAt: backup.createdAt
          ? new Date(backup.createdAt).toLocaleString()
          : "No Date Available",
      }));

      setBackups(formattedData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/admin/backup/manual", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to create backup.");

      const data = await response.json();
      const newBackup = {
        ...data.backup,
        createdAt: new Date().toLocaleString(), // Add current date for new backup
      };
      setBackups((prev) => [newBackup, ...prev]);
      alert("Backup created successfully!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteBackup = async (backup_id: string) => {
    if (!confirm("Are you sure you want to delete this backup?")) return;

    setDeleteLoading(backup_id);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/backup/${backup_id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete backup.");

      setBackups((prev) => prev.filter((backup) => backup.backup_id !== backup_id));
      alert("Backup deleted successfully!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading && backups.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-5 text-black">
      <div className="mb-5">
        <button
          className="bg-blue-500 text-white p-2 rounded flex items-center gap-2"
          onClick={() => (window.location.href = "/admin")}
        >
          <AiFillHome size={20} />
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-5">Data Backup Management</h1>

      <button
        onClick={createBackup}
        className="bg-green-500 text-white p-2 rounded mb-5"
        disabled={loading}
      >
        {loading ? "Creating Backup..." : "Create Backup"}
      </button>

      <h2 className="text-xl font-semibold mb-3">Backup History</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">File Name</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {backups.map((backup, index) => (
            <tr key={backup.backup_id || `backup-${index}`}>
              <td className="border p-2">{backup.fileName}</td>
              <td className="border p-2">{backup.createdAt}</td>
              <td className="border p-2 flex gap-2">
                <button
                  className="bg-red-500 text-white p-2 rounded flex items-center gap-1"
                  onClick={() => deleteBackup(backup.backup_id!)} // Ensure `backup_id` is used
                  disabled={deleteLoading === backup.backup_id}
                >
                  {deleteLoading === backup.backup_id ? "Deleting..." : <><AiFillDelete /> Delete</>}
                </button>
                <a
                  href={`http://localhost:5000/backups/${backup.fileName}`}
                  download
                  className="bg-blue-500 text-white p-2 rounded flex items-center gap-1"
                >
                  <AiOutlineDownload />
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}