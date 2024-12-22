"use client";

import { useEffect, useState } from "react";
import styles from "./admin-courses.module.css";
import { AiFillHome } from "react-icons/ai";
import { useRouter } from "next/navigation";

type Lesson = {
  title: string;
  content: string;
};

type Section = {
  section: string;
  lessons: Lesson[];
};

type Course = {
  course_id: string;
  title: string;
  description?: string;
  category: string;
  difficulty_level: string;
  created_by: string;
  hierarchy?: Section[];
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]); // Filtered courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [editMode, setEditMode] = useState(false);
  const [currentHierarchy, setCurrentHierarchy] = useState<Section[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false); // Show delete confirmation popup
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null); // Course to delete

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
        setFilteredCourses(data); // Initialize filteredCourses
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
    if (searchQuery.trim() === "") {
      // If search query is empty, show all courses
      setFilteredCourses(courses);
    } else {
      // Filter courses based on search query
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(lowercasedQuery) ||
          course.description?.toLowerCase().includes(lowercasedQuery) ||
          course.category.toLowerCase().includes(lowercasedQuery) ||
          course.difficulty_level.toLowerCase().includes(lowercasedQuery) ||
          course.created_by.toLowerCase().includes(lowercasedQuery) ||
          course.course_id.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredCourses(filtered);
    }
  };

  const confirmDelete = (course: Course) => {
    setCourseToDelete(course);
    setShowDeletePopup(true);
  };

  const handleCancelDelete = () => {
    setCourseToDelete(null);
    setShowDeletePopup(false);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseToDelete.course_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the course.");
      }

      // Update the state after successful deletion
      const updatedCourses = courses.filter((course) => course.course_id !== courseToDelete.course_id);
      setCourses(updatedCourses);
      setFilteredCourses(updatedCourses);
      setShowDeletePopup(false);
      alert("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete the course. Please try again.");
    }
  };

  const handleEditHierarchy = (courseId: string, hierarchy: Section[] | undefined) => {
    setSelectedCourseId(courseId);
    setCurrentHierarchy(hierarchy || []);
    setEditMode(true);
  };

  const handleAddSection = () => {
    setCurrentHierarchy([...currentHierarchy, { section: "", lessons: [] }]);
  };

  const handleRemoveSection = (index: number) => {
    const updatedHierarchy = [...currentHierarchy];
    updatedHierarchy.splice(index, 1);
    setCurrentHierarchy(updatedHierarchy);
  };

  const handleAddLesson = (sectionIndex: number) => {
    const updatedHierarchy = [...currentHierarchy];
    updatedHierarchy[sectionIndex].lessons.push({ title: "", content: "" });
    setCurrentHierarchy(updatedHierarchy);
  };

  const handleRemoveLesson = (sectionIndex: number, lessonIndex: number) => {
    const updatedHierarchy = [...currentHierarchy];
    updatedHierarchy[sectionIndex].lessons.splice(lessonIndex, 1);
    setCurrentHierarchy(updatedHierarchy);
  };

  const handleSaveHierarchy = async () => {
    if (!selectedCourseId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${selectedCourseId}/hierarchy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentHierarchy),
      });

      if (!response.ok) {
        throw new Error("Failed to save hierarchy.");
      }

      alert("Hierarchy saved successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Error saving hierarchy:", err);
      alert("Failed to save hierarchy. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentHierarchy([]);
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
        <div className={styles.homeIcon} onClick={() => router.push("/admin")}>
        <AiFillHome size={30} color="#007bff" />
      </div>
      <h1 className={styles.title}>All Courses</h1>

      {/* Search Bar */}
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by anything..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      <div className={styles.coursesList}>
        {filteredCourses.map((course) => (
          <div key={course.course_id} className={styles.courseCard}>
            <h2>{course.title}</h2>
            <p>{course.course_id}</p>
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
              className={styles.editButton}
              onClick={() => handleEditHierarchy(course.course_id, course.hierarchy)}
            >
              Edit Hierarchy
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => confirmDelete(course)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Are you sure you want to delete this course?</h2>
            <p><strong>Course Title:</strong> {courseToDelete?.title}</p>
            <p><strong>Course ID:</strong> {courseToDelete?.course_id}</p>
            <div className={styles.actionButtons}>
              <button className={styles.saveButton} onClick={handleDeleteCourse}>
                Yes, Delete
              </button>
              <button className={styles.cancelButton} onClick={handleCancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hierarchy Popup */}
      {editMode && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Hierarchy</h2>
            {currentHierarchy.map((section, sectionIndex) => (
              <div key={sectionIndex} className={styles.section}>
                <input
                  type="text"
                  value={section.section}
                  placeholder="Enter section title"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "Enter section title")}
                  onChange={(e) => {
                    const updatedHierarchy = [...currentHierarchy];
                    updatedHierarchy[sectionIndex].section = e.target.value;
                    setCurrentHierarchy(updatedHierarchy);
                  }}
                />
                <ul className={styles.lessonList}>
                  {section.lessons.map((lesson, lessonIndex) => (
                    <li key={lessonIndex} className={styles.lessonItem}>
                      <input
                        type="text"
                        value={lesson.title}
                        placeholder="Enter lesson title"
                        onFocus={(e) => (e.target.placeholder = "")}
                        onBlur={(e) => (e.target.placeholder = "Enter lesson title")}
                        onChange={(e) => {
                          const updatedHierarchy = [...currentHierarchy];
                          updatedHierarchy[sectionIndex].lessons[lessonIndex].title = e.target.value;
                          setCurrentHierarchy(updatedHierarchy);
                        }}
                      />
                      <textarea
                        value={lesson.content}
                        placeholder="Enter lesson content"
                        onFocus={(e) => (e.target.placeholder = "")}
                        onBlur={(e) => (e.target.placeholder = "Enter lesson content")}
                        onChange={(e) => {
                          const updatedHierarchy = [...currentHierarchy];
                          updatedHierarchy[sectionIndex].lessons[lessonIndex].content = e.target.value;
                          setCurrentHierarchy(updatedHierarchy);
                        }}
                      />
                      <button
                        className={styles.removeLessonButton}
                        onClick={() => handleRemoveLesson(sectionIndex, lessonIndex)}
                      >
                        Remove Lesson
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  className={styles.addLessonButton}
                  onClick={() => handleAddLesson(sectionIndex)}
                >
                  Add Lesson
                </button>
                <button
                  className={styles.removeSectionButton}
                  onClick={() => handleRemoveSection(sectionIndex)}
                >
                  Remove Section
                </button>
              </div>
            ))}
            <div className={styles.actionButtons}>
              <button className={styles.addSectionButton} onClick={handleAddSection}>
                Add Section
              </button>
              <button className={styles.saveButton} onClick={handleSaveHierarchy}>
                Save Hierarchy
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}