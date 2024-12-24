"use client";

import { useEffect, useState } from "react";
import styles from "./student-adaptive-quizzes.module.css";

type Question = {
  question_text: string;
  options: string[];
  correct_answer: string;
};

type Quiz = {
  quiz_id: string;
  module_id: string;
  questions: Question[];
  completed_by: string[];
  created_at: string;
};

export default function AdaptiveQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/quizzes", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quizzes.");
        }

        const data: Quiz[] = await response.json();
        setQuizzes(data);

        const completed = data
          .filter((quiz) => quiz.completed_by.includes("current_user_id")) // Replace with actual user ID logic
          .map((quiz) => quiz.quiz_id);

        setCompletedQuizzes(completed);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setFeedback("");
  };

  const handleAnswer = async (selectedOption: string) => {
    if (!currentQuiz) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_answer;

    setFeedback(
      isCorrect
        ? "Correct! Well done! 😊"
        : `Incorrect. The correct answer is: ${currentQuestion.correct_answer}`
    );

    setTimeout(async () => {
      if (currentQuestionIndex + 1 < currentQuiz.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setFeedback("");
      } else {
        alert("Quiz completed! Great job!");

        await fetch(`http://localhost:5000/api/quizzes/${currentQuiz.quiz_id}/complete`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: "current_user_id" }), // Replace with actual user ID logic
        });

        setCompletedQuizzes((prev) => [...prev, currentQuiz.quiz_id]);
        setCurrentQuiz(null);
      }
    }, 2000);
  };

  const handleGoHome = () => {
    setCurrentQuiz(null);
    setFeedback("");
    setCurrentQuestionIndex(0);
  };

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div>{error}</div>;

  if (currentQuiz) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];

    return (
      <div className={styles.container}>
        <button onClick={handleGoHome} className={styles.homeButton}>
          Home
        </button>
        <h1 className={styles.title}>Quiz: {currentQuiz.quiz_id}</h1>
        <div className={styles.quizSection}>
          <h2 className={styles.question}>
            Question {currentQuestionIndex + 1}/{currentQuiz.questions.length}
          </h2>
          <p>{currentQuestion.question_text}</p>
          <div className={styles.options}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={styles.optionButton}
              >
                {option}
              </button>
            ))}
          </div>
          {feedback && <p className={styles.feedback}>{feedback}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Engage in Interactive Modules</h1>
      <p className={styles.subtitle}>
        • Participate in adaptive quizzes that adjust question difficulty based
        on performance.<br />
        • Receive instant feedback on quiz responses.
      </p>
      <div className={styles.quizzesList}>
        {quizzes.map((quiz) => (
          <div key={quiz.quiz_id} className={styles.quizCard}>
            <h2>Quiz ID: {quiz.quiz_id}</h2>
            <p>Module ID: {quiz.module_id}</p>
            <p>Total Questions: {quiz.questions.length}</p>
            {completedQuizzes.includes(quiz.quiz_id) ? (
              <div className={styles.completed}>✅ Quiz Completed</div>
            ) : (
              <button
                onClick={() => handleStartQuiz(quiz)}
                className={styles.startButton}
              >
                Start Quiz
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
