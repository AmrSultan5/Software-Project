"use client";

import { useEffect, useState } from "react";
import styles from "./student-group-chats.module.css";

type CommunicationFeature = {
  id: string;
  title: string;
  description: string;
};

export default function CommunicationFeatures() {
  const [features, setFeatures] = useState<CommunicationFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/communication-features", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch communication features.");
        }

        const data: CommunicationFeature[] = await response.json();
        setFeatures(data);
      } catch (err) {
        console.error("Error fetching communication features:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading) return <div>Loading communication features...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Using Communication Features</h1>
      <div className={styles.featuresList}>
        {features.map((feature) => (
          <div key={feature.id} className={styles.featureCard}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
            <button onClick={() => alert(`Accessing ${feature.title}`)}>
              Open Feature
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
