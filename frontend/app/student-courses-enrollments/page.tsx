"use client";

import { useEffect, useState } from "react";
import styles from "./student-courses-enrollments.module.css";
import { AiFillHome } from "react-icons/ai";
import { useRouter } from "next/navigation";

type Course = {
  course_id: string;
  title: string;
  description?: string;
  category: string;
  difficulty_level: string;
  created_by: string;
};

export default function BrowseCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollmentLoading, setEnrollmentLoading] = useState<string | null>(null);
  const router = useRouter();

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
    const query = searchQuery.toLowerCase();
    setFilteredCourses(
      courses.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query) ||
          course.created_by.toLowerCase().includes(query)
      )
    );
  };

  const handleEnroll = async (course_id: string) => {
    setEnrollmentLoading(course_id);
  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("You must be logged in to enroll in a course.");
        router.push("/login");
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/courses/${course_id}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Handle error response
      if (!response.ok) {
        const errorData = await response.json();
  
        if (response.status === 400 && errorData.message === "User is already enrolled in this course.") {
          alert("You are already enrolled in this course!");
          return;
        }
  
        if (response.status === 500) {
          throw new Error("You are already enrolled in this course!");
        }
  
        throw new Error(errorData.message || "Failed to enroll in the course.");
      }
  
      alert("You have successfully enrolled in the course!");
    } catch (err) {
      console.error("Error enrolling in course:", err);
      alert(err instanceof Error ? err.message : "Failed to enroll in the course. Please try again.");
    } finally {
      setEnrollmentLoading(null);
    }
  };  

  if (loading) return <div className={styles.loading}>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.homeIcon} onClick={() => router.push("/student")}>
        <AiFillHome size={30} color="#007bff" />
      </div>
      <h1 className={styles.title}>Browse Courses</h1>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by topic, instructor, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      <div className={styles.coursesList}>
        {filteredCourses.length === 0 ? (
          <div className={styles.noResults}>No courses found. Try a different search term.</div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.course_id} className={styles.courseCard}>
              <h2>{course.title}</h2>
              <p>{course.description || "No description available."}</p>
              <p>
                <strong>Category:</strong> {course.category}
              </p>
              <p>
                <strong>Difficulty:</strong> {course.difficulty_level}
              </p>
              <p>
                <strong>Created By:</strong> {course.created_by}
              </p>
              <button
                className={styles.enrollButton}
                onClick={() => handleEnroll(course.course_id)}
                disabled={enrollmentLoading === course.course_id}
              >
                {enrollmentLoading === course.course_id ? "Enrolling..." : "Enroll"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}