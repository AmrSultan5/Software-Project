"use client";

import React from "react";
import Link from "next/link";
import styles from "./instructor-dashboard.module.css";

const InstructorDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Instructor Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Section: Course Management */}
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Course Management</h2>
          <p className={styles.sectionDescription}>
            Manage your courses here.
          </p>
          <Link href="/instructor-courses">
          <button className={styles.primaryButton}>Manage Course</button>
          </Link>
        </section>

        {/* Section: Notifications */}
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Notifications</h2>
          <ul className={styles.sectionList}>
            <li>New student enrolled in your course.</li>
            <li>Assignment submitted by a student.</li>
          </ul>
        </section>

        {/* Section: Analytics */}
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Analytics</h2>
          <p className={styles.sectionDescription}>
            View performance and engagement metrics.
          </p>
          <Link href="/instructor-analytics">
          <button className={styles.primaryButton}>View Analytics</button>
          </Link>
        </section>

        {/* Section: User Management */}
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Student Management</h2>
          <p className={styles.sectionDescription}>
            Manage student enrollments and user details.
          </p>
          <Link href="/instructor-users">
            <button className={styles.primaryButton}>
              Go to Student Management
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default InstructorDashboard;
