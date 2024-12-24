"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link component from Next.js
import { FaUser, FaBook, FaLock, FaDatabase } from "react-icons/fa";
import styles from "./admin.module.css";

export default function Admin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div
        className={isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link href="/admin-users" className={styles.menuItem}>
              <FaUser className={styles.icon} />
              {isSidebarOpen && <span>Users</span>}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/admin-courses" className={styles.menuItem}>
              <FaBook className={styles.icon} />
              {isSidebarOpen && <span>Courses</span>}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/admin-security" className={styles.menuItem}>
              <FaLock className={styles.icon} />
              {isSidebarOpen && <span>Security</span>}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/admin-backup" className={styles.menuItem}>
              <FaDatabase className={styles.icon} />
              {isSidebarOpen && <span>Backup</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <h1>Welcome to the admin page!</h1>
      </div>
    </div>
  );
}