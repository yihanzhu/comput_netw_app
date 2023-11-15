import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AssignmentsContext from "./context/assignmentsContext";
import io from "socket.io-client";

const InstructorDashboard = () => {
  const dummyMailbox = [
    {
      id: 1,
      studentId: "1001",
      text: "I have a question about FTP.",
    },
    {
      id: 2,
      studentId: "1002",
      text: "Can you provide more resources?",
    },
  ];

  const [mailbox, setMailbox] = useState(dummyMailbox);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishTime, setPublishTime] = useState("immediate");
  const [futureDateTime, setFutureDateTime] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [template, setTemplate] = useState("TCP-IP");
  const [studentIDs, setStudentIDs] = useState([]);
  const [createdAssignments, setCreatedAssignments] = useState([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showIDModal, setShowIDModal] = useState(false);
  const [searchID, setSearchID] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const { assignments } = useContext(AssignmentsContext);

  const router = useRouter();

  const sendReply = () => {
    // Logic for sending reply goes here
    setShowReplyModal(false); // Close the modal after sending the reply
  };

  const createAssignment = () => {
    if (
      !createdAssignments.find((assignment) => assignment.template === template)
    ) {
      // This redirects the user to the template page when a template is selected
      router.push("/template/TCP-IP");
    }
  };

  const saveAssignment = (name) => {
    // Logic to save the assignment
    const newAssignment = {
      name,
      link: `/template/TCP-IP`,
    };
    setCreatedAssignments((prev) => [...prev, newAssignment]);
  };

  const publishAssignment = (assignment) => {
    console.log(`Publishing ${assignment.name}`);
    setShowPublishModal(true);

    // Emit the event to the Instructor backend
    socket.emit("publishAssignment", assignment);
  };

  // Set up the connection inside the component.
  const socket = io("http://localhost:5000"); // The address of your backend service

  // Inside your useEffect, you can listen to events
  useEffect(() => {
    socket.on("updateAssignments", (newAssignments) => {
      setCreatedAssignments(newAssignments);
    });

    socket.on("updateMailbox", (newMailbox) => {
      setMailbox(newMailbox);
    });

    socket.on("assignmentPublished", (publishedAssignment) => {
      console.log("assignmentPublished");
      // Update the local state with the published assignment
      setCreatedAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment._id === publishedAssignment._id
            ? publishedAssignment
            : assignment
        )
      );
    });

    // Emit events when needed
    socket.emit("fetchAllAssignments");
    socket.emit("fetchMailbox");

    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, [socket]);

  // Inside InstructorDashboard Component

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Instructor Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {/* Student IDs */}
          <div className="border p-4 rounded-md mb-4">
            <h2 className="text-xl mb-4">Upload Student IDs</h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="p-2 bg-yellow-500 text-white rounded-md"
            >
              Upload Student IDs
            </button>
            <button
              className="p-2 bg-blue-500 text-white rounded-md ml-4"
              onClick={() => setShowIDModal(true)}
            >
              View IDs
            </button>

            {showUploadModal && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-md w-1/3">
                  <h3 className="text-lg font-bold mb-4">Upload Student IDs</h3>
                  <div className="mb-4">
                    <label className="block mb-2">
                      Enter Student IDs (comma separated):
                    </label>
                    <textarea
                      className="w-full p-2 rounded-md border"
                      rows="5"
                      placeholder="E.g., 1, 2, 3"
                      onChange={(e) =>
                        setStudentIDs(
                          e.target.value.split(",").map((id) => id.trim())
                        )
                      }
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="p-2 bg-blue-500 text-white rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showIDModal && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-md w-1/3">
                  <h3 className="text-lg font-bold mb-4">View Student IDs</h3>
                  <input
                    className="w-full p-2 mb-4 rounded-md border"
                    placeholder="Search for an ID..."
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                  />
                  <div
                    className="border p-4 rounded-md overflow-y-auto"
                    style={{ height: "300px" }}
                  >
                    {studentIDs
                      .filter((id) => id.includes(searchID))
                      .map((id, index) => (
                        <div key={index} className="mb-2">
                          {id}
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setShowIDModal(false)}
                      className="p-2 bg-red-500 text-white rounded-md"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Assignments */}
          <div className="border p-4 rounded-md">
            <h2 className="text-xl mb-4">Assignments</h2>

            <button
              onClick={() => setShowAssignmentModal(true)}
              className="p-2 bg-green-500 text-white rounded-md"
            >
              Create New Assignment
            </button>
            {showAssignmentModal && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-md w-1/3">
                  <h3 className="text-lg font-bold mb-4">Choose Template</h3>
                  <div className="mb-4">
                    <select
                      className="w-full p-2 rounded-md border"
                      onChange={(e) => setTemplate(e.target.value)}
                      value={template}
                    >
                      <option value="TCP-IP">TCP-IP</option>
                      {/* Add more templates as options here */}
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={createAssignment}
                      className="p-2 bg-blue-500 text-white rounded-md mr-2"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowAssignmentModal(false)}
                      className="p-2 bg-red-500 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-lg font-bold mb-4">Created Assignments:</h3>
              <ul>
                {assignments.map((assignment, index) => (
                  <li
                    key={index}
                    className="mb-2 flex justify-between items-center"
                  >
                    <span className="flex-1 truncate">{assignment.name}</span>
                    <Link href={assignment.link} className="flex-shrink-0 ml-4">
                      <span className="text-blue-500 cursor-pointer ml-2">
                        Access
                      </span>
                    </Link>
                    <button
                      onClick={() => publishAssignment(assignment)}
                      className="text-blue-500 cursor-pointer ml-4 flex-shrink-0"
                    >
                      Publish
                    </button>
                    {showPublishModal && (
                      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-4 rounded-md w-1/3">
                          <h3 className="text-lg font-bold mb-4">
                            Publish Assignment
                          </h3>

                          <div className="mb-4">
                            <label className="block mb-2">Publish Time:</label>
                            <select
                              className="w-full p-2 rounded-md border"
                              onChange={(e) => setPublishTime(e.target.value)}
                              value={publishTime}
                            >
                              <option value="immediate">Immediate</option>
                              <option value="future">Future</option>
                            </select>
                          </div>

                          {publishTime === "future" && (
                            <div className="mb-4">
                              <label className="block mb-2">
                                Select Date & Time:
                              </label>
                              <input
                                type="datetime-local"
                                className="w-full p-2 rounded-md border"
                                value={futureDateTime}
                                onChange={(e) =>
                                  setFutureDateTime(e.target.value)
                                }
                              />
                            </div>
                          )}

                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                if (
                                  publishTime === "future" &&
                                  !futureDateTime
                                ) {
                                  alert("Please select a future date and time");
                                  return;
                                }

                                // Emit to backend with either 'immediate' or the selected futureDateTime
                                // socket.emit('publishAssignment', { assignment: selectedAssignment, publishTime: publishTime === 'immediate' ? 'immediate' : futureDateTime });
                                setShowPublishModal(false);
                              }}
                              className="p-2 bg-blue-500 text-white rounded-md mr-2"
                            >
                              Publish
                            </button>
                            <button
                              onClick={() => setShowPublishModal(false)}
                              className="p-2 bg-red-500 text-white rounded-md"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mailbox */}
        <div className="border p-4 rounded-md">
          <h2 className="text-xl mb-4">Mailbox</h2>
          <ul
            className="border p-4 rounded-md overflow-y-auto"
            style={{ height: "500px" }}
          >
            {mailbox.map((message) => (
              <li key={message.id} className="mb-2 border-b pb-2">
                <div className="flex justify-between">
                  <p>
                    <strong>Student {message.studentId}:</strong> {message.text}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedMessage(message);
                      setShowReplyModal(true); // this line was missing
                    }}
                    className="text-blue-500"
                  >
                    Reply
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {selectedMessage && (
            <div className="mt-4 border p-4 rounded-md">
              <p>
                <strong>Replying to Student {selectedMessage.studentId}</strong>
              </p>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full p-2 rounded-md border mt-4"
                rows="4"
              />
              <button
                onClick={sendReply}
                className="p-2 bg-blue-500 text-white rounded-md mt-4"
              >
                Send Reply
              </button>
            </div>
          )}
        </div>
        {/* Reply Modal */}
        {selectedMessage && showReplyModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-md w-1/3">
              <h3 className="text-lg font-bold mb-4">
                Replying to Student {selectedMessage.studentId}
              </h3>

              {/* Displaying the student's original message for reference */}
              <div className="border p-4 mb-4">
                <strong>Original Message:</strong> {selectedMessage.text}
              </div>

              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full p-2 rounded-md border mt-4"
                rows="4"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={sendReply}
                  className="p-2 bg-blue-500 text-white rounded-md mr-2"
                >
                  Send Reply
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedMessage(null);
                  }}
                  className="p-2 bg-red-500 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
