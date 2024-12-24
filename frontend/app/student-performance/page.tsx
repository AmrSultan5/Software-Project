"use client";

import { useEffect, useState } from "react";
import styles from "./student-performance.module.css";

type Metric = {
  id: string;
  courseTitle: string;
  description: string;
  completionPercentage: number;
  averageScore: number;
  timeSpent: number;
  resources: { type: string; url: string }[];
};

export default function PerformanceTracking() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/progress/students/<studentId>", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch metrics.");
        }

        const data = await response.json();

        const mappedMetrics = data.map((item: any) => ({
          id: item._id,
          courseTitle: item.course?.title || "Unknown Course",
          description: item.course?.description || "No description available",
          completionPercentage: item.completionPercentage,
          averageScore: item.averageScore,
          timeSpent: item.timeSpent,
          resources: item.course?.resources || [],
        }));

        setMetrics(mappedMetrics);
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <div>Loading performance metrics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Track Performance</h1>
      <div className={styles.metricsList}>
        {metrics.map((metric) => (
          <div key={metric.id} className={styles.metricCard}>
            <h2>{metric.courseTitle}</h2>
            <p>{metric.description}</p>
            <div className={styles.progressBar}>
              <div style={{ width: `${metric.completionPercentage}%` }}></div>
            </div>
            <p>Completion: {metric.completionPercentage}%</p>
            <p>Average Score: {metric.averageScore}%</p>
            <p>Time Spent: {metric.timeSpent} mins</p>
          </div>
        ))}
      </div>
    </div>
  );
}
