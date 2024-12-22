"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./admin-security.module.css";
import { AiFillHome } from "react-icons/ai";

type AuditLog = {
  id: string;
  email: string;
  activity: string;
  timestamp: string;
};

type FailedLoginAttempt = {
  id: string;
  email: string;
  ipAddress: string;
  timestamp: string;
};

type MFAStatus = {
  email: string;
  mfaEnabled: boolean;
};

export default function SecurityMonitoring() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [failedLogins, setFailedLogins] = useState<FailedLoginAttempt[]>([]);
  const [mfaStatuses, setMfaStatuses] = useState<MFAStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch audit logs
      const logsResponse = await fetch("http://localhost:5000/api/auth/audit-logs", {
        method: "GET",
      });
      if (!logsResponse.ok) throw new Error("Failed to fetch audit logs");
      const logsData: AuditLog[] = await logsResponse.json();
      setAuditLogs(logsData);

      // Fetch failed logins
      const failedLoginsResponse = await fetch("http://localhost:5000/api/auth/failed-logins", {
        method: "GET",
      });
      if (!failedLoginsResponse.ok) throw new Error("Failed to fetch failed logins");
      const failedLoginsData: FailedLoginAttempt[] = await failedLoginsResponse.json();
      setFailedLogins(failedLoginsData);

      // Fetch MFA statuses
      const mfaStatusResponse = await fetch("http://localhost:5000/api/auth/mfa-statuses", {
        method: "GET",
      });
      if (!mfaStatusResponse.ok) throw new Error("Failed to fetch MFA statuses");
      const mfaStatusesData: MFAStatus[] = await mfaStatusResponse.json();
      setMfaStatuses(mfaStatusesData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-5 text-black">
        <div className={styles.homeIcon} onClick={() => router.push("/admin")}>
        <AiFillHome size={30} color="#007bff" />
      </div>
      <h1 className="text-2xl font-bold mb-5 text-black">Security Monitoring</h1>

      {/* Authentication Summary */}
      <h2 className="text-xl font-semibold mb-3">Authentication Summary</h2>
      <p>Total Audit Logs: {auditLogs.length}</p>
      <p>Total Failed Login Attempts: {failedLogins.length}</p>
      <p>
        MFA-Enabled Accounts:{" "}
        {mfaStatuses.filter((status) => status.mfaEnabled).length} / {mfaStatuses.length}
      </p>

      {/* Audit Logs */}
      <h2 className="text-xl font-semibold mb-3">Audit Logs</h2>
      <table className="w-full border mb-5">
        <thead>
          <tr>
            <th className="border p-2">User Email</th>
            <th className="border p-2">Activity</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log, index) => (
            <tr key={log.id || index}>
              <td className="border p-2">{log.email}</td>
              <td className="border p-2">{log.activity}</td>
              <td className="border p-2">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Failed Login Attempts */}
      <h2 className="text-xl font-semibold mb-3">Failed Login Attempts</h2>
      <table className="w-full border mb-5">
        <thead>
          <tr>
            <th className="border p-2">User Email</th>
            <th className="border p-2">IP Address</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {failedLogins.map((attempt, index) => (
            <tr key={attempt.id || index}>
              <td className="border p-2">{attempt.email}</td>
              <td className="border p-2">{attempt.ipAddress}</td>
              <td className="border p-2">{new Date(attempt.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MFA Status */}
      <h2 className="text-xl font-semibold mb-3">MFA Status</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">User Email</th>
            <th className="border p-2">MFA Enabled</th>
          </tr>
        </thead>
        <tbody>
          {mfaStatuses.map((status, index) => (
            <tr key={index}>
              <td className="border p-2">{status.email}</td>
              <td className="border p-2">{status.mfaEnabled ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}