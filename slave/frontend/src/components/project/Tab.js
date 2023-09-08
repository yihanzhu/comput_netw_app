import React from "react";

const Tab = ({
  color,
  onClick,
  children,
  isSelected,
  isUploaded,
  isSend,
}) => {
  let colorClass = "";
  switch (color) {
    case "green":
      colorClass = "bg-green-500";
      break;
    case "red":
      colorClass = "bg-red-500";
      break;
    case "yellow":
      colorClass = "bg-yellow-500";
      break;
    default:
      colorClass = "bg-green-500";
      break;
  }
  if (isSelected) {
    colorClass = "bg-red-500";
  }
  if (isUploaded) {
    colorClass = "bg-yellow-500";
  }
  if (isSend) {
    colorClass = "bg-green-500";
  }
  return (
    <div
      className={`p-4  rounded-md cursor-default text-center ${colorClass}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Tab;
