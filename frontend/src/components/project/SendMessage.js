import React, { useState } from "react";

const SendMessage = ({ onSend, fileUploads }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    onSend("Tests Passed", fileUploads);
    setMessage("");
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gray-200 border rounded-md">
      {/* <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mr-4"
      /> */}
      <button
        onClick={handleSend}
        className="p-2 bg-blue-500 text-white  rounded-md "
      >
        Test
      </button>
    </div>
  );
};

export default SendMessage;
