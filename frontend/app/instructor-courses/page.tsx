"use client";

import { useEffect, useState, useContext } from "react";
import { AiFillHome } from "react-icons/ai";
import { useRouter } from "next/navigation";
import styles from "./instructor-courses.module.css";
import { AuthContext } from "../contexts/AuthContext"; // Adjust the path as needed

/** ---------- TYPES ---------- **/
type Resource = {
  type: string;
  url: string;
};

type Section = {
  section: string;
  lessons: {
    title: string;
    content: string;
  }[];
};

/** Matches CourseDto on the backend **/
type Course = {
  course_id: string;
  title: string;
  description?: string;
  category: string;
  difficulty_level: "Beginner" | "Intermediate" | "Advanced";
  created_by: string;
  taught_by: string;
  resources?: Resource[];
  hierarchy?: Section[];
};

/** Matches ModuleDto on the backend **/
type ModuleData = {
  module_id: string;
  course_id: string;
  title: string;
  content?: string;
  resources: string[];
};

/** Matches QuizDto on the backend **/
type Quiz = {
  quiz_id: string;
  module_id: string;
  questions: {
    question_text: string;
    options: string[];
    correct_answer: string;
  }[];
  created_at?: Date;
};

export default function Courses() {
  /** ----------- CONTEXT: Auth ----------- **/
  const { userId, token } = useContext(AuthContext);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  /** ----------- STATE: Add Course Modal ----------- **/
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState<Omit<Course, "hierarchy" | "resources">>({
    course_id: "",
    title: "",
    description: "",
    category: "",
    difficulty_level: "Beginner",
    created_by: userId ? userId : "",
    taught_by: userId ? userId : "",
    // taught_by will be set automatically
  });

  /** ----------- STATE: Delete Course ----------- **/
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  /** ----------- STATE: Manage Modules Modal ----------- **/
  const [showModuleManager, setShowModuleManager] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modulesForCourse, setModulesForCourse] = useState<ModuleData[]>([]);

  /** ----------- STATE: Add Module Modal ----------- **/
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModule, setNewModule] = useState<ModuleData>({
    module_id: "",
    course_id: "",
    title: "",
    content: "",
    resources: []
  });

  /** ----------- STATE: Manage Quizzes Modal ----------- **/
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [quizzesForModule, setQuizzesForModule] = useState<Quiz[]>([]);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState<Quiz>({
    quiz_id: "",
    module_id: "",
    questions: [
      {
        question_text: "",
        options: [""],
        correct_answer: "",
      },
    ],
  });

  const router = useRouter();

  /********************************************
   * FETCH COURSES
   ********************************************/
  useEffect(() => {
    if (!userId) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/instructor/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token if backend requires authentication
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch instructor courses.");
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
  }, [userId, token]);

  /********************************************
   * SEARCH COURSES
   ********************************************/
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
      return;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = courses.filter((course) =>
      [
        course.title,
        course.description,
        course.category,
        course.difficulty_level,
        course.taught_by,
        course.course_id,
      ]
        .filter(Boolean) // remove undefined/null
        .some((field) => field?.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredCourses(filtered);
  };

  /********************************************
   * DELETE COURSE
   ********************************************/
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
      const response = await fetch(
        `http://localhost:5000/api/courses/${courseToDelete.course_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token if needed
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete the course.");
      }
      const updated = courses.filter(
        (c) => c.course_id !== courseToDelete.course_id
      );
      setCourses(updated);
      setFilteredCourses(updated);
      setShowDeletePopup(false);
      alert("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      alert(err || "Failed to delete the course. Please try again.");
    }
  };

  /********************************************
   * ADD COURSE
   ********************************************/
  const openAddCourseModal = () => {
    setNewCourse({
      course_id: "",
      title: "",
      description: "",
      category: "",
      difficulty_level: "Beginner",
      created_by:userId ? userId : "",
      taught_by: userId ? userId : ""
      // taught_by will be set automatically
    });
    setShowAddCourseModal(true);
  };

  const handleAddCourse = async () => {
    try {
      // Ensure that userId is available
      if (!userId) {
        setError("User not authenticated.");
        return;
      }

      // Create a new course object with `taught_by` set to `userId`
      const courseToAdd = {
        ...newCourse,
        taught_by: userId.toString(), // Ensure it's a string
      };

      const response = await fetch(`http://localhost:5000/api/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseToAdd),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add the course.");
      }

      const createdCourse: Course = await response.json();
      setCourses([...courses, createdCourse]);
      setFilteredCourses([...courses, createdCourse]);
      setShowAddCourseModal(false);
      alert("Course added successfully!");
    } catch (err) {
      console.error("Error adding course:", err);
      alert(err || "Failed to add the course. Please try again.");
    }
  };

  /********************************************
   * MANAGE MODULES FOR A COURSE
   ********************************************/
  const handleManageModules = async (course: Course) => {
    setSelectedCourse(course);
    setShowModuleManager(true);

    try {
      // Only fetch modules for the SELECTED course
      const response = await fetch(
        `http://localhost:5000/api/modules/course/${course.course_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token if needed
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch modules.");
      }
      const data: ModuleData[] = await response.json();
      setModulesForCourse(data);
    } catch (err) {
      console.error("Error fetching modules:", err);
      alert("Failed to fetch modules. Please try again.");
    }
  };

  const closeModuleManager = () => {
    // Clear local module data for this course
    setModulesForCourse([]);
    setSelectedCourse(null);
    setShowModuleManager(false);
  };

  /********************************************
   * ADD MODULE
   ********************************************/
  const openAddModuleModal = () => {
    if (!selectedCourse) return;
    setNewModule({
      module_id: "",
      course_id: selectedCourse.course_id,
      title: "",
      content: "",
      resources: []
    });
    setShowAddModuleModal(true);
  };

  const handleAddModule = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/modules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token if needed
        },
        body: JSON.stringify(newModule),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add module.");
      }
      const createdModule: ModuleData = await response.json();
      // Insert the new module only into the local array for this course
      setModulesForCourse([...modulesForCourse, createdModule]);
      setShowAddModuleModal(false);
      alert("Module added successfully!");
    } catch (err) {
      console.error("Error adding module:", err);
      alert(err || "Failed to add module. Please try again.");
    }
  };

  const closeAddModuleModal = () => {
    setShowAddModuleModal(false);
  };

  /********************************************
   * MANAGE QUIZZES FOR A MODULE
   ********************************************/
  const [showQuizzesModal, setShowQuizzesModal] = useState(false);

  const handleManageQuizzes = async (module: ModuleData) => {
    setSelectedModule(module);
    setShowQuizzesModal(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/quizzes?module_id=${module.module_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token if needed
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch quizzes.");
      }
      const quizData: Quiz[] = await response.json();
      setQuizzesForModule(quizData);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      alert("Failed to fetch quizzes. Please try again.");
    }
  };

  const closeQuizzesModal = () => {
    // Clear quizzes from local state
    setQuizzesForModule([]);
    setSelectedModule(null);
    setShowQuizzesModal(false);
  };

  /********************************************
   * ADD QUIZ
   ********************************************/
  const openAddQuizModal = () => {
    if (!selectedModule) return;
    setNewQuiz({
      quiz_id: "",
      module_id: selectedModule.module_id,
      questions: [
        {
          question_text: "",
          options: [""],
          correct_answer: "",
        },
      ],
    });
    setShowAddQuizModal(true);
  };

  const handleAddQuiz = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token if needed
        },
        body: JSON.stringify(newQuiz),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add quiz.");
      }
      const createdQuiz: Quiz = await response.json();

      // Insert the new quiz only into the local array for this module
      setQuizzesForModule([...quizzesForModule, createdQuiz]);
      setShowAddQuizModal(false);
      alert("Quiz added successfully!");
    } catch (err) {
      console.error("Error adding quiz:", err);
      alert(err || "Failed to add quiz. Please try again.");
    }
  };

  const closeAddQuizModal = () => {
    setShowAddQuizModal(false);
  };

  /********************************************
   * RENDER
   ********************************************/
  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      {/* Home icon */}
      <div className={styles.homeIcon} onClick={() => router.push("/instructor")}>
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

      {/* Add Course Button */}
      <button className={styles.addSectionButton} onClick={openAddCourseModal}>
        Add New Course
      </button>

      {/* Courses List */}
      <div className={styles.coursesList}>
        {filteredCourses.map((course) => (
          <div key={course.course_id} className={styles.courseCard}>
            <h2>{course.title}</h2>
            <p>{course.description || "No description available."}</p>
            <p>
              <strong>Category:</strong> {course.category}
            </p>
            <p>
              <strong>Difficulty:</strong> {course.difficulty_level}
            </p>

            {/* Manage Modules */}
            <button
              className={styles.editButton}
              onClick={() => handleManageModules(course)}
            >
              Manage Modules
            </button>

            {/* Delete Course */}
            <button
              className={styles.deleteButton}
              onClick={() => confirmDelete(course)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/****************************************************************
       * DELETE CONFIRMATION
       ****************************************************************/}
      {showDeletePopup && courseToDelete && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Are you sure you want to delete this course?</h2>
            <p>
              <strong>Course Title:</strong> {courseToDelete.title}
            </p>
            <p>
              <strong>Course ID:</strong> {courseToDelete.course_id}
            </p>
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

      {/****************************************************************
       * ADD COURSE MODAL
       ****************************************************************/}
      {showAddCourseModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add New Course</h2>
            <input
              type="text"
              placeholder="Course ID"
              value={newCourse.course_id}
              onChange={(e) => setNewCourse({ ...newCourse, course_id: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              value={newCourse.category}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
              required
            />
            <select
              value={newCourse.difficulty_level}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  difficulty_level: e.target.value as
                    | "Beginner"
                    | "Intermediate"
                    | "Advanced",
                })
              }
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {/* No need for 'taught_by' input */}
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleAddCourse}
              >
                Save Course
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowAddCourseModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/****************************************************************
       * MANAGE MODULES MODAL
       ****************************************************************/}
      {showModuleManager && selectedCourse && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Manage Modules for {selectedCourse.title}</h2>
            {/* Modules for this course */}
            <ul>
              {modulesForCourse.map((mod) => (
                <li key={mod.module_id} style={{ marginBottom: "10px" }}>
                  <strong>{mod.title}</strong> ({mod.module_id})
                  <button
                    className={styles.addLessonButton}
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleManageQuizzes(mod)}
                  >
                    Manage Quizzes
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.actionButtons}>
              <button
                className={styles.addSectionButton}
                onClick={openAddModuleModal}
              >
                Add Module
              </button>
              <button className={styles.cancelButton} onClick={closeModuleManager}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/****************************************************************
       * ADD MODULE MODAL
       ****************************************************************/}
      {showAddModuleModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add Module</h2>
            <input
              type="text"
              placeholder="Module ID"
              value={newModule.module_id}
              onChange={(e) => setNewModule({ ...newModule, module_id: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={newModule.title}
              onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              value={newModule.content}
              onChange={(e) => setNewModule({ ...newModule, content: e.target.value })}
            />
            <input
              type="text"
              placeholder="Resources (comma separated)"
              onChange={(e) =>
                setNewModule({
                  ...newModule,
                  resources: e.target.value.split(",").map((r) => r.trim()),
                })
              }
            />
            <div className={styles.actionButtons}>
              <button className={styles.saveButton} onClick={handleAddModule}>
                Save Module
              </button>
              <button className={styles.cancelButton} onClick={closeAddModuleModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/****************************************************************
       * MANAGE QUIZZES MODAL
       ****************************************************************/}
      {showQuizzesModal && selectedModule && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Manage Quizzes for {selectedModule.title}</h2>
            <ul>
              {quizzesForModule.map((q) => (
                <li key={q.quiz_id} style={{ marginBottom: "10px" }}>
                  <strong>Quiz ID: {q.quiz_id}</strong> (
                  {q.questions.length} questions)
                </li>
              ))}
            </ul>

            <div className={styles.actionButtons}>
              <button
                className={styles.addSectionButton}
                onClick={openAddQuizModal}
              >
                Add Quiz
              </button>
              <button className={styles.cancelButton} onClick={closeQuizzesModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/****************************************************************
       * ADD QUIZ MODAL
       ****************************************************************/}
      {showAddQuizModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add Quiz</h2>
            <input
              type="text"
              placeholder="Quiz ID"
              value={newQuiz.quiz_id}
              onChange={(e) => setNewQuiz({ ...newQuiz, quiz_id: e.target.value })}
              required
            />
            {/* The module_id is already pre-filled */}
            <div style={{ marginTop: "10px" }}>
              {newQuiz.questions.map((question, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    placeholder="Question Text"
                    value={question.question_text}
                    onChange={(e) => {
                      const updatedQuestions = [...newQuiz.questions];
                      updatedQuestions[idx].question_text = e.target.value;
                      setNewQuiz({ ...newQuiz, questions: updatedQuestions });
                    }}
                    required
                  />
                  <br />
                  <input
                    type="text"
                    placeholder="Options (comma separated)"
                    value={question.options.join(", ")}
                    onChange={(e) => {
                      const updatedQuestions = [...newQuiz.questions];
                      updatedQuestions[idx].options = e.target.value
                        .split(",")
                        .map((opt) => opt.trim());
                      setNewQuiz({ ...newQuiz, questions: updatedQuestions });
                    }}
                    required
                  />
                  <br />
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={question.correct_answer}
                    onChange={(e) => {
                      const updatedQuestions = [...newQuiz.questions];
                      updatedQuestions[idx].correct_answer = e.target.value;
                      setNewQuiz({ ...newQuiz, questions: updatedQuestions });
                    }}
                    required
                  />
                </div>
              ))}
            </div>
            <button
              className={styles.addLessonButton}
              type="button"
              onClick={() => {
                setNewQuiz({
                  ...newQuiz,
                  questions: [
                    ...newQuiz.questions,
                    {
                      question_text: "",
                      options: [""],
                      correct_answer: "",
                    },
                  ],
                });
              }}
            >
              Add Another Question
            </button>
            <div className={styles.actionButtons}>
              <button className={styles.saveButton} onClick={handleAddQuiz}>
                Save Quiz
              </button>
              <button className={styles.cancelButton} onClick={closeAddQuizModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
