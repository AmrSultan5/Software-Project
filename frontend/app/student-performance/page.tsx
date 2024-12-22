"use client";

import { useEffect, useState } from "react";
import styles from "./student-performance.module.css";

type Metric = {
  id: string;
  title: string;
  description: string;
  value: number; // Percentage or score
};

export default function PerformanceTracking() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/performance-metrics", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch performance metrics.");
        }

        const data: Metric[] = await response.json();
        setMetrics(data);
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
            <h2>{metric.title}</h2>
            <p>{metric.description}</p>
            <div className={styles.progressBar}>
              <div style={{ width: `${metric.value}%` }}></div>
            </div>
            <p>{metric.value}%</p>
            <button onClick={() => alert(`Details for ${metric.title}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
