"use client";

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

type DecodedToken = {
  role: string;
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMfaPopup, setShowMfaPopup] = useState(false);
  const [mfaToken, setMfaToken] = useState(""); // Token to verify OTP
  const router = useRouter();

  useEffect(() => {
    // Redirect to the appropriate page if already logged in
    const token = localStorage.getItem("token");
    if (token) {
      try {
      } catch (err) {
        console.error("Invalid token detected:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      if (data.mfaEnabled) {
        setMfaToken(data.token); // Save the MFA token
        setShowMfaPopup(true); // Show MFA popup
        return;
      }

      // Save token for regular login
      localStorage.setItem("token", data.token);

      const decodedToken: DecodedToken = jwtDecode(data.token);
      redirectToRole(decodedToken.role);
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid OTP. Please try again.");
        return;
      }

      // Save the verified token
      localStorage.setItem("token", mfaToken);

      const decodedToken: DecodedToken = jwtDecode(mfaToken);
      redirectToRole(decodedToken.role);
    } catch (err) {
      console.error("MFA verification error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToRole = (role: string) => {
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "instructor") {
      router.push("/instructor");
    } else if (role === "student") {
      router.push("/student");
    } else {
      setError("Invalid role. Please contact support.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Log In</h1>
        <p className={styles.subtitle}>
          Welcome back! Please log in to your account.
        </p>
        <form className={styles.form} onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.showPasswordButton}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Logging In..." : "Log In"}
          </button>
        </form>
        <p className={styles.signUpOption}>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>

      {/* MFA Popup */}
      {showMfaPopup && (
        <div className={styles.mfaPopup}>
          <h2 className={styles.mfaTitle}>Enter MFA Code</h2>
          <form className={styles.mfaForm} onSubmit={handleMfaSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              className={styles.input}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            {error && <p className={styles.error}>{error}</p>}
            <button
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}