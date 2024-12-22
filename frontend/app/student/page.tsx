"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBook, FaChartLine, FaUsers, FaComments, FaTrophy } from "react-icons/fa"; 
import styles from "./student.module.css"; 

export default function Student() {
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
            <Link href="/student-courses-enrollments" className={styles.menuItem}>
              <FaUsers className={styles.icon} />
              {isSidebarOpen && <span>Course Enrollments</span>}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/student-courses" className={styles.menuItem}>
              <FaBook className={styles.icon} />
              {isSidebarOpen && <span>Courses</span>}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/student-adaptive-quizzes" className={styles.menuItem}>
              <FaChartLine className={styles.icon} />
              {isSidebarOpen && <span>Adaptive Quizzes</span>}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/student-group-chats" className={styles.menuItem}>
              <FaComments className={styles.icon} />
              {isSidebarOpen && <span>Group Chats</span>}
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link href="/student-performance" className={styles.menuItem}>
              <FaTrophy className={styles.icon} />
              {isSidebarOpen && <span>Performance</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <h1>Welcome to the student dashboard!</h1>
      </div>
    </div>
  );
}
