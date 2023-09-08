import React, { useState } from "react";

const UserSection = ({
  selectedTab,
  onUpload,
  tabColors,
  side,
  fileUploads,
  setFileUploads,
  setMessage,
  selectedTabName,
  confirmedTabs,
}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const chosenFile = e.target.files[0];
    console.log("Selected file:", chosenFile);
    setFile(chosenFile);
  };

  const handleUpload = async () => {
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("part", selectedTab);

      try {
        const response = await fetch("http://localhost:5100/api/upload", {
          // Use relative URL here
          method: "POST",
          body: data,
        });

        const responseData = await response.json();

        if (response.ok) {
          setMessage(responseData.message);
        } else {
          setMessage("Failed to upload file. Reason: " + responseData.message);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setMessage("An error occurred while uploading the file.");
      }

      const newFileUploads = [...fileUploads];
      newFileUploads[selectedTab] = true;
      setFileUploads(newFileUploads);
    } else {
      setMessage("No file selected.");
    }
  };

  // const isUploadEnabled = confirmedTabs.includes(selectedTab);
  const isUploadEnabled = true;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 border rounded-md">
      <h2 className="mb-4 text-lg font-bold">
        {`Upload to ${side}'s ${selectedTabName}`}
      </h2>
      <input className="text-center" type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className={`rounded-md p-2 text-white ${
          isUploadEnabled ? "bg-blue-500" : "bg-gray-300"
        }`}
        disabled={!isUploadEnabled}
      >
        Upload
      </button>
    </div>
  );
};

export default UserSection;
