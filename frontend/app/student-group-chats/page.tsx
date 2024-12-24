"use client";

import { useEffect, useState } from "react";
import styles from "./student-group-chats.module.css";

type Message = {
  sender: string;
  role: "student" | "instructor";
  content: string;
  timestamp: string;
};

type Notification = {
  id: string;
  message: string;
  type: "reply" | "update";
  isRead: boolean;
};

export default function StudentGroupChats() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentId = "12345"; // Replace with dynamic student ID
  const courseId = "course-123"; // Replace with dynamic course ID

  useEffect(() => {
    const fetchMessagesAndNotifications = async () => {
      try {
        // Fetch messages
        const messagesResponse = await fetch(
          `http://localhost:5000/api/group-chats/${courseId}`
        );
        const messagesText = await messagesResponse.text(); // Read as text
        const messagesData = messagesText ? JSON.parse(messagesText) : { messages: [] }; // Parse JSON safely
        setMessages(messagesData.messages || []);

        // Fetch notifications
        const notificationsResponse = await fetch(
          `http://localhost:5000/api/notifications/${studentId}`
        );
        const notificationsText = await notificationsResponse.text(); // Read as text
        const notificationsData = notificationsText
          ? JSON.parse(notificationsText)
          : [];
        setNotifications(notificationsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessagesAndNotifications();
  }, [studentId, courseId]);

  const sendMessage = async () => {
    try {
      const sender = "Student Name"; // Replace with dynamic student name
      await fetch("http://localhost:5000/api/group-chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          sender,
          role: "student",
          content: newMessage,
        }),
      });

      // Update messages locally
      setMessages((prev) => [
        ...prev,
        {
          sender,
          role: "student",
          content: newMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch("http://localhost:5000/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      // Update notifications locally
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  if (loading) return <div>Loading chat...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Student Group Chats</h1>

      {/* Messages Section */}
      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.role === "instructor"
                  ? styles.instructorMessage
                  : styles.studentMessage
              }`}
            >
              <strong>{message.sender}:</strong> {message.content}
            </div>
          ))}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className={styles.input}
          />
          <button onClick={sendMessage} className={styles.sendButton}>
            Send
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className={styles.notifications}>
        <h2>Notifications</h2>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notification} ${
                notification.isRead ? "" : styles.unreadNotification
              }`}
            >
              <p>{notification.message}</p>
              {!notification.isRead && (
                <button
                  onClick={() => markNotificationAsRead(notification.id)}
                  className={styles.markAsReadButton}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No notifications available.</p>
        )}
      </div>
    </div>
  );
}
