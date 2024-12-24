"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./instructor-courses.module.css";
import { useRouter } from "next/navigation";

type Course = {
  course_id: string;
  title: string;
  description?: string;
  category: string;
  difficulty_level: string;
  created_by: string; // Instructor name
  hierarchy?: {
    section: string;
    lessons: {
      title: string;
      content: string;
    }[];
  }[];
};

export default function InstructorCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/instructor/courses", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch instructor's courses.");
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

  const handleEditCourse = (courseId: string) => {
    router.push(`/instructor/courses/${courseId}/edit`);
  };

  const handleDeleteCourse = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"?`)) return;

    try {
      const response = await fetch(`/api/instructor/courses/${course.course_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the course.");
      }

      // Update local state after successful deletion
      setCourses(courses.filter((c) => c.course_id !== course.course_id));
      alert("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete the course. Please try again.");
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <table className={styles.courseTable}>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.course_id}>
              <td>{course.title}</td>
              <td>{course.created_by}</td>
              <td>
                <Link href={`/instructor/courses/${course.course_id}/edit`}>
                  <FaEdit className={styles.actionIcon} />
                </Link>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteCourse(course)}
                >
                  <FaTrash className={styles.actionIcon} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}