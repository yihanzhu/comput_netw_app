import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

const StudentDashboard = () => {
    const router = useRouter();

    // Assuming these assignments are fetched from some database or API in the real scenario.
    const dummyAssignments = [
        { id: 1, template: 'TCP-IP', studentId: '1001', link: `/TCP-IP?studentId=1001` },
        { id: 2, template: 'TCP-IP', studentId: '1002', link: `/TCP-IP?studentId=1002` }
    ];

    const [assignments] = useState(dummyAssignments);
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        // Logic for sending a message to the instructor.
        setMessage(''); // Clear the message input after sending
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

            <div className="grid grid-cols-2 gap-4">
                <div className="border p-4 rounded-md">
                    <h2 className="text-xl mb-4">Your Assignments</h2>
                    <ul>
                        {assignments.map(assignment => (
                            <li key={assignment.id} className="mb-2">
                                Template: {assignment.template},
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
                    <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-md mt-4">Send Message</button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
