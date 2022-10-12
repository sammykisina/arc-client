import React from "react";

const StatusPill = ({ value }) => {
  // component states
  const status = value ? value.toLowerCase() : "unknown";

  return (
    <span
      className={`px-3 py-1 uppercase leading-loose text-xs rounded-full shadow-sm ${
        status.startsWith("active") || status.startsWith("in-order")
          ? "bg-c_green text-white"
          : ""
      } ${
        status.startsWith("inactive") || status.startsWith("out-of-order")
          ? "bg-c_yellow/30 text-c_dark"
          : ""
      } ${status.startsWith("underreview") ? "bg-orange-400 text-white" : ""} ${
        status.startsWith("suspended") ? "bg-red-400 text-white" : ""
      }  `}
    >
      {status}
    </span>
  );
};

export default StatusPill;
