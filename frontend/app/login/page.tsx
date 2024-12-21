"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {jwtDecode} from "jwt-decode";
import styles from "./login.module.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

      if (response.status === 401) {
        // Handle invalid email or password error
        const data = await response.json();
        setError(data.message || "Invalid email or password!");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      // Decode the token to extract the user's role
      const decodedToken: { role: string } = jwtDecode(data.token);

      // Redirect based on the user's role
      if (decodedToken.role === "admin") {
        router.push("/admin");
      } else if (decodedToken.role === "instructor") {
        router.push("/instructor");
      } else if (decodedToken.role === "student") {
        router.push("/student");
      }
    } catch (err) {
      console.error("Error occurred:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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
    </div>
  );
}