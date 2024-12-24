"use client";

import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import styles from "./instructor-analytics.module.css";
import { AiFillHome } from "react-icons/ai";
import { useRouter } from "next/navigation";

/** Matches your backend ResponseDto schema */
type ResponseDto = {
  responses_id: string;
  user_Id: string;
  quiz_Id: string;
  answers: object[];
  score: number;
  submitted_at?: string;
};

/** Stats for each quiz */
type QuizStats = {
  quizId: string;
  attempts: number;
  averageScore: number;
  minScore: number;
  maxScore: number;
  distribution: number[]; // e.g., for bins of 10 points each
};

export default function AnalyticsPage() {
  // We'll store the entire dataset in a state if needed, 
  // but currently we only need it to compute quizStatsList.
  const [, setResponses] = useState<ResponseDto[]>([]);

  const [quizStatsList, setQuizStatsList] = useState<QuizStats[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Refs to store all canvas elements and all Chart instances
  const canvasRefs = useRef<HTMLCanvasElement[]>([]);
  const chartInstancesRef = useRef<Chart[]>([]);

  // On component mount, fetch quiz responses
  useEffect(() => {
    fetchQuizResponses();
  }, []);

  /********************************************
   * FETCH RESPONSES
   ********************************************/
  const fetchQuizResponses = async () => {
    try {
      // Replace with your actual endpoint
      const res = await fetch("http://localhost:5000/api/responses");
      if (!res.ok) throw new Error("Failed to fetch quiz responses");
      const data: ResponseDto[] = await res.json();
      setResponses(data);
      computeQuizStats(data);
    } catch (err) {
      console.error(err);
      setError("Could not load analytics");
    } finally {
      setLoading(false);
    }
  };

  /********************************************
   * GROUP & COMPUTE STATS
   ********************************************/
  const computeQuizStats = (data: ResponseDto[]) => {
    // Group by quiz_Id
    const grouped: Record<string, ResponseDto[]> = {};
    data.forEach((resp) => {
      const quizId = resp.quiz_Id;
      if (!grouped[quizId]) grouped[quizId] = [];
      grouped[quizId].push(resp);
    });

    // For each quiz, compute basic stats + distribution
    const statsArray: QuizStats[] = Object.keys(grouped).map((quizId) => {
      const quizResponses = grouped[quizId];
      let totalScore = 0;
      let min = Number.MAX_VALUE;
      let max = Number.MIN_VALUE;

      // For a 0–100 scale, let's define 10 bins: 0-9, 10-19, ..., 90-100
      const distributionBins = Array(10).fill(0);

      quizResponses.forEach((resp) => {
        const s = resp.score;
        totalScore += s;

        if (s < min) min = s;
        if (s > max) max = s;

        // Index in the distribution array
        // e.g. score 23 => binIndex=2, score 87 => binIndex=8
        const binIndex = Math.min(Math.floor(s / 10), 9);
        distributionBins[binIndex] += 1;
      });

      const attempts = quizResponses.length;
      const averageScore = attempts > 0 ? totalScore / attempts : 0;

      return {
        quizId,
        attempts,
        averageScore,
        minScore: min === Number.MAX_VALUE ? 0 : min,
        maxScore: max === Number.MIN_VALUE ? 0 : max,
        distribution: distributionBins,
      };
    });

    setQuizStatsList(statsArray);
  };

  const router = useRouter();

  /********************************************
   * INIT CHARTS
   ********************************************/
  useEffect(() => {
    // Destroy any existing Chart instances to avoid the "Canvas is already in use" error
    chartInstancesRef.current.forEach((chart) => chart.destroy());
    chartInstancesRef.current = [];

    // For each quiz, create a Chart in its <canvas>.
    quizStatsList.forEach((stats, idx) => {
      const canvas = canvasRefs.current[idx];
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Create a new chart instance
      const chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "0-9",
            "10-19",
            "20-29",
            "30-39",
            "40-49",
            "50-59",
            "60-69",
            "70-79",
            "80-89",
            "90-100",
          ],
          datasets: [
            {
              label: "Number of Students",
              data: stats.distribution,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Count of Students",
              },
            },
            x: {
              title: {
                display: true,
                text: "Score Range",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: `Distribution for Quiz ${stats.quizId}`,
              font: {
                size: 16,
              },
            },
            legend: {
              display: false,
            },
          },
        },
      });

      // Push this chart instance into our ref array
      chartInstancesRef.current.push(chartInstance);
    });
  }, [quizStatsList]);

  /********************************************
   * RENDER
   ********************************************/
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }
  if (quizStatsList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-500 text-lg">No quiz responses available.</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Home icon */}
      <div className={styles.homeIcon} onClick={() => router.push("/instructor")}>
        <AiFillHome size={30} color="#007bff" />
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Student Quiz Analytics
      </h1>

      {quizStatsList.map((stats, idx) => (
        <div
          key={stats.quizId}
          className="mb-8 bg-white p-6 rounded-lg shadow-lg flex flex-col space-y-4"
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Quiz: {stats.quizId}
            </h2>
            <p className="text-gray-600">
              Attempts: <span className="font-medium">{stats.attempts}</span>
            </p>
            <p className="text-gray-600">
              Average Score:{" "}
              <span className="font-medium">
                {stats.averageScore.toFixed(2)}
              </span>
            </p>
            <p className="text-gray-600">
              Min Score:{" "}
              <span className="font-medium">{stats.minScore}</span>
            </p>
            <p className="text-gray-600">
              Max Score:{" "}
              <span className="font-medium">{stats.maxScore}</span>
            </p>
          </div>

          <div className="relative w-full h-64">
            {/* Chart Canvas */}
            <canvas
              ref={(el) => {
                if (el) canvasRefs.current[idx] = el;
              }}
              className="w-full h-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
