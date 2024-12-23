"use client";

import { useEffect, useState } from "react";
import styles from "./student-courses-enrollments.module.css";

type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
};

export default function BrowseCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
        setFilteredCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowercasedQuery) ||
        course.instructor.toLowerCase().includes(lowercasedQuery) ||
        course.category.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/enroll/${courseId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to enroll in the course.");
      }

      alert("Successfully enrolled in the course!");
    } catch (err) {
      console.error("Error enrolling in course:", err);
      alert("Failed to enroll. Please try again.");
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Browse and Enroll in Courses</h1>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search courses by title, instructor, or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      <div className={styles.coursesList}>
        {filteredCourses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>
              <strong>Instructor:</strong> {course.instructor}
            </p>
            <p>
              <strong>Category:</strong> {course.category}
            </p>
            <button onClick={() => handleEnroll(course.id)}>Enroll</button>
          </div>
        ))}
      </div>
    </div>
  );
}
