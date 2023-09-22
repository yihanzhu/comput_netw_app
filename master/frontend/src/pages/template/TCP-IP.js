import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import Window from "@/components/project/Window";
import AdminSection from "@/components/project/AdminSection";
import axios from "axios";
import { useRouter } from "next/router";
import AssignmentsContext from '../context/assignmentsContext';

const TCP_IP = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [adminTabColors, setAdminTabColors] = useState(Array(6).fill("green"));
  const [userTabColors, setUserTabColors] = useState(Array(6).fill("green"));
  const [selectedTabName, setSelectedTabName] = useState("");
  const [senderFileUploads, setSenderFileUploads] = useState(
    Array(6).fill(false)
  );
  const [receiverFileUploads, setReceiverFileUploads] = useState(
    Array(6).fill(false)
  );
  const [uploadedFileTab, setUploadedFileTab] = useState(null);
  const [confirmedTabs, setConfirmedTabs] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  

  const router = useRouter();

  const handleTabSelect = (tabIndex, tabName) => {
    const newAdminTabColors = [...adminTabColors];
    newAdminTabColors.fill("green");
    newAdminTabColors[tabIndex] = "yellow";
    setAdminTabColors(newAdminTabColors);
    setSelectedTab(tabIndex);
    setSelectedTabName(tabName);
  };

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:5000");

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to Master Backend");
    });

    // Clean up the connection when component is unmounted
    return () => {
      socketInstance.close();
    };
  }, []);

  const handleConfirm = () => {
    if (isAdmin && selectedTab !== null) {
      const newAdminTabColors = [...adminTabColors];
      newAdminTabColors[selectedTab] = "red";
      setAdminTabColors(newAdminTabColors);
      setUserTabColors(newAdminTabColors);
      setConfirmedTabs([...confirmedTabs, selectedTab]);
      console.log("Sending to master backend:", selectedTab);
      if (socket) {
        socket.emit("tabConfirmed", selectedTab);
      }
    }
  };

  const [assignmentName, setAssignmentName] = useState("");

  const { assignments, setAssignments } = useContext(AssignmentsContext);

  const saveAssignment = () => {
    const sanitizedAssignmentName = assignmentName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const newAssignment = {
        name: assignmentName,
        link: `/assignments/${sanitizedAssignmentName}`,
        selectedTab: selectedTab, // Save the selectedTab here
    };

    setAssignments(prev => [...prev, newAssignment]);
    router.push('/'); // Redirects to the Instructor Dashboard after saving
};




  



  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <AdminSection
          selectedTab={selectedTab}
          selectedTabName={selectedTabName}
        />

        <button
          onClick={handleConfirm}
          className="p-2 bg-blue-500 text-white ml-4 rounded-md "
        >
          Confirm
        </button>
        <button onClick={() => setShowSaveModal(true)}>Save As</button>
      </div>

      {showSaveModal && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded-md w-1/3">
      <h3 className="text-lg font-bold mb-4">Save As</h3>
      <input 
        value={assignmentName}
        onChange={(e) => setAssignmentName(e.target.value)}
        placeholder="Enter assignment name (e.g., Assignment 1)"
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            saveAssignment();
            setShowSaveModal(false);
            router.push('/');  // Redirects to the Instructor Dashboard after saving
          }}
          className="p-2 bg-blue-500 text-white rounded-md mr-2"
        >
          Confirm
        </button>
        <button
          onClick={() => setShowSaveModal(false)}
          className="p-2 bg-red-500 text-white rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
        <Window
          name="Sender"
          isAdmin={isAdmin}
          selectedTabFromAdmin={selectedTab}
          selectedTabFromUser={uploadedFileTab}
          onTabSelect={handleTabSelect}
          tabColors={isAdmin ? adminTabColors : userTabColors}
          fileUploads={senderFileUploads}
        />
        <Window
          name="Receiver"
          isAdmin={isAdmin}
          selectedTabFromAdmin={selectedTab}
          selectedTabFromUser={uploadedFileTab}
          onTabSelect={handleTabSelect}
          tabColors={isAdmin ? adminTabColors : userTabColors}
          fileUploads={receiverFileUploads}
        />
      </div>
    </div>
  );
};

export default TCP_IP;
