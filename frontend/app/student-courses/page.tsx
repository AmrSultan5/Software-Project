"use client";

import { useEffect, useState } from "react";
import styles from "./student-courses.module.css";
import { AiOutlineFilePdf, AiOutlineVideoCamera } from "react-icons/ai";

type Course = {
  course_id: string;
  title: string;
  resources: Resource[] | undefined; // Allow undefined for safety
  enrolled_at: string;
  status: string;
};

type Resource = {
  type: string;
  url: string;
};

export default function EnrolledCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("You must be logged in to view your courses.");
          window.location.href = "/login";
          return;
        }

        const response = await fetch("http://localhost:5000/api/courses/enrollments/test", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch enrolled courses.");
        }

        const data: Course[] = await response.json();
        setCourses(
          data.map((course) => ({
            ...course,
            resources: course.resources || [], // Ensure resources is an array
          }))
        );
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleNoteChange = (courseId: string, content: string) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [courseId]: content, // Update the note for the specific course
    }));
  };

  const handleAddNote = async (courseId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to add notes.");
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: courseId,
          user_id: "123456", // Replace with user_id from token or app state
          content: notes[courseId] || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add note.");
      }

      alert("Note added successfully!");
    } catch (err) {
      console.error("Error adding note:", err);
      alert(err instanceof Error ? err.message : "Failed to add note.");
    }
  };

  if (loading) return <div className={styles.loading}>Loading your courses...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Enrolled Courses</h1>
      <div className={styles.courseList}>
        {courses.length === 0 ? (
          <p>You are not enrolled in any courses.</p>
        ) : (
          courses.map((course) => (
            <div key={course.course_id} className={styles.courseCard}>
              <h2 className={styles.courseTitle}>{course.title}</h2>
              <p>
                <strong>Course ID:</strong> {course.course_id}
              </p>
              <p>
                <strong>Enrolled At:</strong> {new Date(course.enrolled_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {course.status}
              </p>
              <h3>Resources:</h3>
              {(!course.resources || course.resources.length === 0) ? (
                <p>No resources available for this course.</p>
              ) : (
                <ul className={styles.resourceList}>
                  {course.resources.map((resource, index) => (
                    <li key={index} className={styles.resourceItem}>
                      {resource.type === "video" ? (
                        <AiOutlineVideoCamera className={styles.icon} />
                      ) : (
                        <AiOutlineFilePdf className={styles.icon} />
                      )}
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resourceLink}
                      >
                        {resource.type === "video" ? "Video Resource" : "PDF Resource"}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <h3>Quick Notes:</h3>
              <textarea
                value={notes[course.course_id] || ""}
                onChange={(e) => handleNoteChange(course.course_id, e.target.value)}
                className={styles.noteInput}
                placeholder="Write your notes here..."
              />
              <button
                className={styles.addNoteButton}
                onClick={() => handleAddNote(course.course_id)}
              >
                Save Note
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}