"use client";

import { useEffect, useState } from "react";
import styles from "./student-modules.module.css";

type Module = {
  id: string;
  title: string;
  description: string;
  interactive: boolean;
};

export default function StudentModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/student-modules", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch modules.");
        }

        const data: Module[] = await response.json();
        setModules(data);
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) return <div>Loading modules...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Engage in Interactive Modules</h1>
      <div className={styles.modulesList}>
        {modules.map((module) => (
          <div key={module.id} className={styles.moduleCard}>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            {module.interactive && <p>🌟 Interactive Content Available!</p>}
            <button onClick={() => alert(`Starting ${module.title}`)}>
              Start Module
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
