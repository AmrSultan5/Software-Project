"use client";

import { useEffect, useState } from "react";
import styles from "./student-group-chats.module.css";

type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
};

type Metric = {
  id: string;
  courseId: string;
  completionPercentage: number;
  averageScore: number;
  timeSpent: number;
};

type Notification = {
  id: string;
  message: string;
  type: "reply" | "update";
};

export default function PerformanceTracking() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoursesAndMetrics = async () => {
      try {
        // Fetch courses
        const coursesResponse = await fetch("http://localhost:5000/api/courses", {
          method: "GET",
        });

        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch courses.");
        }

        const coursesData: Course[] = await coursesResponse.json();
        setCourses(coursesData);

        // Fetch metrics
        const metricsResponse = await fetch("http://localhost:5000/api/progress/students/<studentId>", {
          method: "GET",
        });

        if (!metricsResponse.ok) {
          throw new Error("Failed to fetch metrics.");
        }

        const metricsData = await metricsResponse.json();
        const mappedMetrics = metricsData.map((item: any) => ({
          id: item._id,
          courseId: item.courseId,
          completionPercentage: item.completionPercentage,
          averageScore: item.averageScore,
          timeSpent: item.timeSpent,
        }));

        setMetrics(mappedMetrics);

        // Fetch notifications
        const notificationsResponse = await fetch("http://localhost:5000/api/notifications/<studentId>", {
          method: "GET",
        });

        if (!notificationsResponse.ok) {
          throw new Error("Failed to fetch notifications.");
        }

        const notificationsData: Notification[] = await notificationsResponse.json();
        setNotifications(notificationsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndMetrics();
  }, []);

  const joinGroupChat = (courseId: string) => {
    window.open(`http://localhost:5000/chat/${courseId}`, "_blank");
  };

  if (loading) return <div>Loading performance metrics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Track Performance</h1>

      {/* Notifications */}
      <div className={styles.notifications}>
        <h2>Notifications</h2>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className={styles.notification}>
              <p>{notification.message}</p>
            </div>
          ))
        ) : (
          <p>No notifications available.</p>
        )}
      </div>

      {/* Metrics */}
      <div className={styles.metricsList}>
        {metrics.map((metric) => {
          const course = courses.find((c) => c.id === metric.courseId);

          if (!course) {
            return null;
          }

          return (
            <div key={metric.id} className={styles.metricCard}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className={styles.progressBar}>
                <div style={{ width: `${metric.completionPercentage}%` }}></div>
              </div>
              <p>Completion: {metric.completionPercentage}%</p>
              <p>Average Score: {metric.averageScore}%</p>
              <p>Time Spent: {metric.timeSpent} mins</p>
              <button
                className={styles.chatButton}
                onClick={() => joinGroupChat(metric.courseId)}
              >
                Join Group Chat
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
