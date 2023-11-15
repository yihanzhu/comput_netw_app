import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import AssignmentsContext from "../context/assignmentsContext";

import Window from "@/components/project/Window";
import UserSection from "@/components/project/UserSection";
import SendMessage from "@/components/project/SendMessage";
import DisplayMessage from "@/components/project/DisplayMessage";

const AssignmentPage = () => {
  const router = useRouter();
  const { assignmentName } = router.query;
  const { assignments } = useContext(AssignmentsContext);

  // Logic to get the current assignment can stay here, since it doesn't involve calling a hook
  const currentAssignment = assignments.find(
    (assignment) => assignment.name === assignmentName
  );
  // Early returns should come after all hooks have been called
  if (!currentAssignment) {
    return <div>Loading...</div>;
  }

  const { selectedTab: savedSelectedTab } = currentAssignment;
  const [selectedTab, setSelectedTab] = useState(savedSelectedTab);
  const [selectedTabName, setSelectedTabName] = useState("");
  const [adminTabColors, setAdminTabColors] = useState(Array(6).fill("green"));
  const [message, setMessage] = useState("");
  const [confirmedTabs, setConfirmedTabs] = useState([]);
  const [senderFileUploads, setSenderFileUploads] = useState(
    Array(6).fill(false)
  );
  const [receiverFileUploads, setReceiverFileUploads] = useState(
    Array(6).fill(false)
  );

  const handleTabSelect = (tabIndex, tabName) => {
    const newAdminTabColors = [...adminTabColors];
    newAdminTabColors.fill("green");
    newAdminTabColors[tabIndex] = "yellow";
    setAdminTabColors(newAdminTabColors);
    setSelectedTab(tabIndex);
    setSelectedTabName(tabName);
  };

  const handleUpload = (tabIndex, fileName, side) => {
    const newFileUploads =
      side === "Sender" ? [...senderFileUploads] : [...receiverFileUploads];
    newFileUploads[tabIndex] = true;
    side === "Sender"
      ? setSenderFileUploads(newFileUploads)
      : setReceiverFileUploads(newFileUploads);
    setMessage(
      `File ${fileName} has been uploaded to ${side}'s ${selectedTabName}.`
    );
  };

  const handleSend = () => {
    if (
      senderFileUploads.includes(true) &&
      receiverFileUploads.includes(true)
    ) {
      setMessage("Tests Passed");
    } else {
      setMessage("Tests Failed");
    }
    setSenderFileUploads(Array(6).fill(false));
    setReceiverFileUploads(Array(6).fill(false));
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
        <Window
          name="Sender"
          isAdmin={false}
          selectedTabFromAdmin={selectedTab}
          onTabSelect={handleTabSelect}
          tabColors={Array(6)
            .fill("green")
            .map((color, index) => (index === selectedTab ? "yellow" : color))}
          fileUploads={senderFileUploads}
        />
        <Window
          name="Receiver"
          isAdmin={false}
          selectedTabFromAdmin={selectedTab}
          onTabSelect={handleTabSelect}
          tabColors={Array(6)
            .fill("green")
            .map((color, index) => (index === selectedTab ? "yellow" : color))}
          fileUploads={receiverFileUploads}
        />

        <UserSection
          selectedTab={selectedTab}
          onUpload={handleUpload}
          tabColors={adminTabColors}
          side={"Sender"}
          fileUploads={senderFileUploads}
          setMessage={setMessage}
          selectedTabName={selectedTabName}
          confirmedTabs={confirmedTabs}
        />

        <UserSection
          selectedTab={selectedTab}
          onUpload={handleUpload}
          tabColors={adminTabColors}
          side={"Receiver"}
          fileUploads={receiverFileUploads}
          setMessage={setMessage}
          selectedTabName={selectedTabName}
          confirmedTabs={confirmedTabs}
        />

        <SendMessage onSend={handleSend} />
        <DisplayMessage message={message} />
      </div>
    </div>
  );
};

export default AssignmentPage;
