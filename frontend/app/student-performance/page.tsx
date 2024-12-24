"use client";

import { useEffect, useState } from "react";
import styles from "./student-performance.module.css";

type Course = {
  id: string;
  title: string;
  description: string;
  completionPercentage: number;
  averageScore: number;
  timeSpent: number;
  resources: { type: string; url: string }[];
};

export default function PerformanceTracking() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses.");
        }

        const data = await response.json();

        const mappedCourses = data.map((course: any) => ({
          id: course._id,
          title: course.title || "Unknown Course",
          description: course.description || "No description available",
          completionPercentage: course.completionPercentage || 0,
          averageScore: course.averageScore || 0,
          timeSpent: course.timeSpent || 0,
          resources: course.resources || [],
        }));

        setCourses(mappedCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Courses</h1>
      <div className={styles.coursesList}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <div className={styles.progressBar}>
              <div style={{ width: `${course.completionPercentage}%` }}></div>
            </div>
            <p>Completion: {course.completionPercentage}%</p>
            <p>Average Score: {course.averageScore}%</p>
            <p>Time Spent: {course.timeSpent} mins</p>
            <button className={styles.detailsButton}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
