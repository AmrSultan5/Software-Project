"use client";

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { AiFillHome } from "react-icons/ai";
import { useRouter } from "next/navigation";
import styles from "./instructor-courses.module.css";

/** ---------- TYPES ---------- **/
type DecodedToken = {
  user_id: string;
  role: string;
  exp: number;
};

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



export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  /** ----------- STATE: Add Course Modal ----------- **/


  /********************************************
   * FETCH COURSES
   ********************************************/
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to view your courses.");
      router.push("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        alert("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }


      const fetchCourses = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/courses/instructor/${decodedToken.user_id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

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
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Authentication failed. Please log in again.");
      router.push("/login");
    }
  }, [router]);

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
        .filter(Boolean)
        .some((field) => field?.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredCourses(filtered);
  };

  /********************************************
   * DELETE COURSE
   ********************************************/


  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.homeIcon} onClick={() => router.push("/instructor")}>
        <AiFillHome size={30} color="#007bff" />
      </div>

      <h1 className={styles.title}>All Courses</h1>

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
            <p>{course.description || "No description available."}</p>
            <p>
              <strong>Category:</strong> {course.category}
            </p>
            <p>
              <strong>Difficulty:</strong> {course.difficulty_level}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}