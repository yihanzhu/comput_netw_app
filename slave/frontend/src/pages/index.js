import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import io from "socket.io-client";

const StudentDashboard = () => {
  const router = useRouter();

  // Assuming these assignments are fetched from some database or API in the real scenario.
  const dummyAssignments = [
    {
      id: 1,
      name: "FTP",
      link: `/assignments/1`,
    },
    {
      id: 2,
      name: "HTTP",
      link: `/assignments/2`,
    },
  ];

  const [assignments] = useState(dummyAssignments);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    // Logic for sending a message to the instructor.
    setMessage(""); // Clear the message input after sending
  };

  // Set up the connection inside the component.
  const socket = io("http://localhost:5100"); // The address of your student backend service

  // Inside your useEffect, you can listen to events.
  useEffect(() => {
    socket.on("newPublishedAssignment", (publishedAssignment) => {
      console.log("newPublishedAssignment");
      setAssignments((prevAssignments) => [
        ...prevAssignments,
        publishedAssignment,
      ]);
    });

    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, [socket]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded-md">
          <h2 className="text-xl mb-4">Your Assignments</h2>
          <ul>
            {assignments.map((assignment) => (
              <li key={assignment.id} className="mb-2 flex justify-between">
                {assignment.name}
                <Link href={assignment.link}>
                  <span className="text-blue-500 cursor-pointer">Access</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border p-4 rounded-md">
          <h2 className="text-xl mb-4">Send a message to the Instructor</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-2 rounded-md border"
            rows="4"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded-md mt-4"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
