import React, { useState } from "react";

const UserSection = ({
  selectedTab,
  onUpload,
  side,
  setMessage,
  selectedTabName,
}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const chosenFile = e.target.files[0];
    setFile(chosenFile);
  };

  const handleUploadClick = async () => {
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("part", selectedTab);

      try {
        const response = await fetch("http://localhost:5100/api/upload", {
          method: "POST",
          body: data,
        });

        const responseData = await response.json();

        if (response.ok) {
          setMessage(responseData.message);
          onUpload(selectedTab, file.name, side);
        } else {
          setMessage("Failed to upload file. Reason: " + responseData.message);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setMessage("An error occurred while uploading the file.");
      }
    } else {
      setMessage("No file selected.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 border rounded-md">
      <h2 className="mb-4 text-lg font-bold">
        {`Upload to ${side}'s ${selectedTabName}`}
      </h2>
      <input className="text-center" type="file" onChange={handleFileChange} />
      <button
        onClick={handleUploadClick}
        className="rounded-md p-2 text-white bg-blue-500"
      >
        Upload
      </button>
    </div>
  );
};

export default UserSection;
