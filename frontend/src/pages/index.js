import React, { useState } from "react";
import Window from "@/components/project/Window";
import AdminSection from "@/components/project/AdminSection";
import UserSection from "@/components/project/UserSection";
import SendMessage from "@/components/project/SendMessage";
import DisplayMessage from "@/components/project/DisplayMessage";

const Page = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [message, setMessage] = useState("");
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
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const [confirmedTabs, setConfirmedTabs] = useState([]);

  const handleTabSelect = (tabIndex, tabName) => {
    const newAdminTabColors = [...adminTabColors];
    newAdminTabColors.fill("green");
    newAdminTabColors[tabIndex] = "yellow";
    setAdminTabColors(newAdminTabColors);
    setSelectedTab(tabIndex);
    setSelectedTabName(tabName);
  };

  const handleConfirm = () => {
    if (isAdmin && selectedTab !== null) {
      const newAdminTabColors = [...adminTabColors];
      newAdminTabColors[selectedTab] = "red";
      setAdminTabColors(newAdminTabColors);
      setUserTabColors(newAdminTabColors); // update user tab colors
      setConfirmedTabs([...confirmedTabs, selectedTab]); // add the selected tab to confirmedTabs
    }
  };

  const handleUpload = (tabIndex, fileName, side) => {
    const newFileUploads =
      side === "Sender" ? [...senderFileUploads] : [...receiverFileUploads];
    newFileUploads[tabIndex] = true; // update the tab index with file upload
    side === "Sender"
      ? setSenderFileUploads(newFileUploads)
      : setReceiverFileUploads(newFileUploads);
    setUploadedFileTab(tabIndex);
    setUploadedFileName(fileName);
    setMessage(
      `File ${fileName} has been uploaded to ${side}'s ${selectedTabName}.`
    );
  };

  const handleSend = (message) => {
    if (
      senderFileUploads.includes(true) &&
      receiverFileUploads.includes(true)
    ) {
      setMessage("Tests Passed");
    } else {
      setMessage("Tests Failed");
    }
    const newAdminTabColors = [...adminTabColors];
    const newUserTabColors = [...userTabColors];

    if (isAdmin) {
      newAdminTabColors[selectedTab] = "green";
      setAdminTabColors(newAdminTabColors);
    } else {
      newUserTabColors[selectedTab] = "green";
      setUserTabColors(newUserTabColors);
    }

    setSenderFileUploads(Array(6).fill(false));
    setReceiverFileUploads(Array(6).fill(false));
  };

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className="p-2 bg-blue-500 text-white  rounded-md "
        >
          Switch to {isAdmin ? "User" : "Admin"}
        </button>
        {isAdmin && (
          <>
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
          </>
        )}
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

        {isAdmin ? (
          <></>
        ) : (
          <>
            <UserSection
              selectedTab={selectedTab}
              onUpload={handleUpload}
              tabColors={isAdmin ? adminTabColors : userTabColors}
              side={"Sender"}
              fileUploads={senderFileUploads}
              setFileUploads={setSenderFileUploads}
              setMessage={setMessage}
              selectedTabName={selectedTabName}
              confirmedTabs={confirmedTabs}
            />

            <UserSection
              selectedTab={selectedTab}
              onUpload={handleUpload}
              tabColors={isAdmin ? adminTabColors : userTabColors}
              side={"Receiver"}
              fileUploads={receiverFileUploads}
              setFileUploads={setReceiverFileUploads}
              setMessage={setMessage}
              selectedTabName={selectedTabName}
              confirmedTabs={confirmedTabs}
            />

            <SendMessage onSend={handleSend} />
            <DisplayMessage message={message} />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
