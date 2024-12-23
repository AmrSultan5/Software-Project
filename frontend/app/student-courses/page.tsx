"use client";

import { useEffect, useState } from "react";
import styles from "./student-courses.module.css";

type Course = {
  id: string;
  title: string;
  description: string;
  resources: string[]; // Array of multimedia resources URLs
};

export default function AccessCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses.");
        }

        const data: Course[] = await response.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSaveNotes = () => {
    alert("Notes saved successfully!");
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Access and Navigate Courses</h1>

      <div className={styles.coursesList}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <h3>Resources:</h3>
            <ul>
              {course.resources.map((resource, index) => (
                <li key={index}>
                  <a href={resource} target="_blank" rel="noopener noreferrer">
                    View Resource {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.notesSection}>
        <h3>Quick Notes</h3>
        <textarea
          rows={6}
          placeholder="Write your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button onClick={handleSaveNotes}>Save Notes</button>
      </div>
    </div>
  );
}
