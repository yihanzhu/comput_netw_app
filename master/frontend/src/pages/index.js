import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Window from "@/components/project/Window";
import AdminSection from "@/components/project/AdminSection";
import axios from 'axios';

const Page = () => {
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
      if(socket) {
        socket.emit("tabConfirmed", selectedTab);
      }
    }
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
      </div>

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

export default Page;
