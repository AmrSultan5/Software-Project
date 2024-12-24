"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AiFillHome } from "react-icons/ai";
import styles from "./instructor-students.module.css";

/** ---------- TYPES ---------- **/
type Student = {
  user_id: string;
  name: string;
  email: string;
  role: string;             // e.g. "student"
  coursesEnrolled?: string[];
};

type Course = {
  course_id: string;
  title: string;
  description?: string;
  category: string;
  difficulty_level: "Beginner" | "Intermediate" | "Advanced";
  created_by: string;       // The instructor ID or name
  students?: Student[];     // (Optional) students already enrolled in the course
};

export default function InstructorStudentsCourses() {
  const router = useRouter();

  /** ---------- STATE: Data & Loading/Error ---------- **/
  const [courses, setCourses] = useState<Course[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /** ---------- STATE: Searching ---------- **/
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  /** ---------- STATE: Enrollment Modals ---------- **/
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [targetCourse, setTargetCourse] = useState<Course | null>(null);

  /** For enrolling, we store the selected student IDs  **/
  const [studentsToEnroll, setStudentsToEnroll] = useState<string[]>([]);

  /** For removing, we store the selected student IDs already in the course **/
  const [studentsToRemove, setStudentsToRemove] = useState<string[]>([]);

  /*************************************************
   * 1) FETCH the instructor's courses & all students
   *************************************************/
  useEffect(() => {
    async function fetchData() {
      try {
        // Replace with your real instructor ID or fetch it from context/auth
        const instructorId = "instructor123";

        // 1) Fetch only the courses for this instructor
        //    e.g. GET /api/courses/instructor/:instructorId
        const coursesRes = await fetch(
          `http://localhost:5000/api/courses/instructor/${instructorId}`
        );
        if (!coursesRes.ok) {
          throw new Error("Failed to fetch instructor courses");
        }
        const coursesData: Course[] = await coursesRes.json();

        // 2) Fetch all students (or only relevant ones)
        //    e.g. GET /api/users?role=student
        const studentsRes = await fetch(
          "http://localhost:5000/api/users?role=student"
        );
        if (!studentsRes.ok) {
          throw new Error("Failed to fetch students");
        }
        const studentsData: Student[] = await studentsRes.json();

        setCourses(coursesData);
        setFilteredCourses(coursesData);
        setAllStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /*************************************************
   * 2) Searching for courses or students
   *************************************************/
  const handleCourseSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courseSearchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }
    const lowerQuery = courseSearchQuery.toLowerCase();
    const filtered = courses.filter((course) => {
      const fields = [
        course.title,
        course.description,
        course.category,
        course.difficulty_level,
        course.created_by,
        course.course_id,
      ]
        .filter(Boolean)
        .map((f) => f?.toLowerCase());
      return fields.some((field) => field?.includes(lowerQuery));
    });
    setFilteredCourses(filtered);
  };

  const handleStudentSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentSearchQuery.trim()) {
      setFilteredStudents(allStudents);
      return;
    }
    const lowerQuery = studentSearchQuery.toLowerCase();
    const filtered = allStudents.filter((student) => {
      const fields = [
        student.name,
        student.email,
        student.user_id,
        student.role,
      ]
        .filter(Boolean)
        .map((f) => f.toLowerCase());
      return fields.some((field) => field.includes(lowerQuery));
    });
    setFilteredStudents(filtered);
  };

  /*************************************************
   * 3) ENROLL STUDENTS in a course
   *************************************************/
  const openEnrollModal = (course: Course) => {
    setTargetCourse(course);
    setStudentsToEnroll([]); // Clear selected
    setShowEnrollModal(true);
  };

  const closeEnrollModal = () => {
    setShowEnrollModal(false);
    setTargetCourse(null);
  };

  const handleEnrollSubmit = async () => {
    if (!targetCourse) return;
    if (studentsToEnroll.length === 0) {
      alert("No students selected for enrollment.");
      return;
    }

    try {
      // Example: POST /api/courses/:course_id/enroll
      // Body: { studentIds: [...] }
      const response = await fetch(
        `http://localhost:5000/api/courses/${targetCourse.course_id}/enroll`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentIds: studentsToEnroll }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to enroll students.");
      }
      // Refresh local data
      // Option 1: Re-fetch entire courses list. 
      // Option 2: Patch local state if you prefer.
      const updatedCourses = courses.map((c) => {
        if (c.course_id === targetCourse.course_id) {
          // Create a new array of students or handle however your backend merges
          const newlyEnrolledStudents = allStudents.filter((s) =>
            studentsToEnroll.includes(s.user_id)
          );
          const existing = c.students ?? [];
          return {
            ...c,
            students: [...existing, ...newlyEnrolledStudents],
          };
        }
        return c;
      });
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses);
      alert("Students enrolled successfully!");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to enroll students. Please try again."
      );
    } finally {
      closeEnrollModal();
    }
  };

  /*************************************************
   * 4) REMOVE STUDENTS from a course
   *************************************************/
  const openRemoveModal = (course: Course) => {
    setTargetCourse(course);
    setStudentsToRemove([]);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => {
    setShowRemoveModal(false);
    setTargetCourse(null);
  };

  const handleRemoveSubmit = async () => {
    if (!targetCourse) return;
    if (studentsToRemove.length === 0) {
      alert("No students selected for removal.");
      return;
    }

    try {
      // Example: POST /api/courses/:course_id/remove
      // Body: { studentIds: [...] }
      const response = await fetch(
        `http://localhost:5000/api/courses/${targetCourse.course_id}/remove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentIds: studentsToRemove }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove students.");
      }
      // Refresh local data
      const updatedCourses = courses.map((c) => {
        if (c.course_id === targetCourse.course_id) {
          return {
            ...c,
            students: (c.students ?? []).filter(
              (stu) => !studentsToRemove.includes(stu.user_id)
            ),
          };
        }
        return c;
      });
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses);
      alert("Students removed successfully!");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to remove students. Please try again."
      );
    } finally {
      closeRemoveModal();
    }
  };

  /*************************************************
   * RENDER
   *************************************************/
  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className={styles.container}>
      {/* Home icon */}
      <div className={styles.homeIcon} onClick={() => router.push("/instructor")}>
        <AiFillHome size={30} color="#007bff" />
      </div>

      <h1 className={styles.title}>Manage Courses & Students</h1>

      {/* ------------------- COURSE SEARCH ------------------- */}
      <div className={styles.searchSection}>
        <form onSubmit={handleCourseSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search Courses..."
            className={styles.searchInput}
            value={courseSearchQuery}
            onChange={(e) => setCourseSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </div>

      {/* -------------- COURSES LIST -------------- */}
      <div className={styles.coursesContainer}>
        {filteredCourses.map((course) => (
          <div key={course.course_id} className={styles.courseCard}>
            <h2>{course.title}</h2>
            <p>{course.course_id}</p>
            <p>
              <strong>Category:</strong> {course.category}
            </p>
            <p>
              <strong>Difficulty:</strong> {course.difficulty_level}
            </p>
            <p>
              <strong>Created By:</strong> {course.created_by}
            </p>

            {/* STUDENTS ENROLLED IN THIS COURSE */}
            <div className={styles.enrolledSection}>
              <h3>Enrolled Students:</h3>
              {course.students && course.students.length > 0 ? (
                <ul className={styles.enrolledList}>
                  {course.students.map((stu) => (
                    <li key={stu.user_id}>
                      {stu.name} ({stu.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No students enrolled yet.</p>
              )}
            </div>

            {/* Buttons: ENROLL or REMOVE Students */}
            <div className={styles.buttonGroup}>
              <button
                onClick={() => openEnrollModal(course)}
                className={styles.enrollButton}
              >
                Enroll Students
              </button>
              {course.students && course.students.length > 0 && (
                <button
                  onClick={() => openRemoveModal(course)}
                  className={styles.removeButton}
                >
                  Remove Students
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ------------------- ENROLL MODAL ------------------- */}
      {showEnrollModal && targetCourse && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Enroll Students in {targetCourse.title}</h2>

            {/* Search Students */}
            <form onSubmit={handleStudentSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search students..."
                className={styles.searchInput}
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
              />
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </form>

            {/* Student List with checkboxes */}
            <div className={styles.studentList}>
              {filteredStudents.map((stu) => (
                <div key={stu.user_id} className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id={stu.user_id}
                    value={stu.user_id}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      if (checked) {
                        setStudentsToEnroll((prev) => [...prev, value]);
                      } else {
                        setStudentsToEnroll((prev) =>
                          prev.filter((id) => id !== value)
                        );
                      }
                    }}
                  />
                  <label htmlFor={stu.user_id}>
                    {stu.name} ({stu.email})
                  </label>
                </div>
              ))}
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.saveButton}
                onClick={handleEnrollSubmit}
              >
                Enroll Selected
              </button>
              <button className={styles.cancelButton} onClick={closeEnrollModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- REMOVE MODAL ------------------- */}
      {showRemoveModal && targetCourse && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Remove Students from {targetCourse.title}</h2>

            {/* List only currently enrolled students */}
            {targetCourse.students && targetCourse.students.length > 0 ? (
              <div className={styles.studentList}>
                {targetCourse.students.map((stu) => (
                  <div key={stu.user_id} className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      id={`remove-${stu.user_id}`}
                      value={stu.user_id}
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        if (checked) {
                          setStudentsToRemove((prev) => [...prev, value]);
                        } else {
                          setStudentsToRemove((prev) =>
                            prev.filter((id) => id !== value)
                          );
                        }
                      }}
                    />
                    <label htmlFor={`remove-${stu.user_id}`}>
                      {stu.name} ({stu.email})
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p>No students to remove.</p>
            )}

            <div className={styles.actionButtons}>
              <button
                className={styles.saveButton}
                onClick={handleRemoveSubmit}
              >
                Remove Selected
              </button>
              <button className={styles.cancelButton} onClick={closeRemoveModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
