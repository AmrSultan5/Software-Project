"use client";

import { useState } from "react";
import Link from "next/link";
import { FaUser, FaBook, FaChartBar, FaUsers, FaGraduationCap, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import styles from "./instructor.module.css";

export default function Instructor() {
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
            <Link href="/instructor-courses" className={styles.menuItem}>
              <FaBook className={styles.icon} />
              {isSidebarOpen && <span>My Courses</span>}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/instructor-students" className={styles.menuItem}>
              <FaUsers className={styles.icon} />
              {isSidebarOpen && <span>My Students</span>}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/instructor-analytics" className={styles.menuItem}>
              <FaChartBar className={styles.icon} />
              {isSidebarOpen && <span>Course Analytics</span>}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/instructor-create-course" className={styles.menuItem}>
              <FaPlus className={styles.icon} />
              {isSidebarOpen && <span>Create Course</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <h1>Welcome to the Instructor Dashboard</h1>
      </div>
    </div>
  );
}