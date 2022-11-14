import React from "react";

const StatusPill = ({ value }) => {
  // component states
  const status = value ? value.toLowerCase() : "unknown";

  return (
    <span
      className={`px-3 py-1 capitalize leading-loose text-xs rounded-full shadow-sm bg-gray-200/10 ${
        status.startsWith("active") || status.startsWith("in-order")
          ? "text-green-500"
          : ""
      } ${
        status.startsWith("inactive") ||
        status.startsWith("cancelled") ||
        status.startsWith("suspended")
          ? "text-red-500"
          : ""
      } ${
        status.startsWith("underreview") ? "bg-orange-400 text-white" : ""
      }  ${status.startsWith("pending") ? " text-yellow-500" : ""}   ${
        status.startsWith("delivered") ? " text-green-500" : ""
      }  `}
    >
      {status}
    </span>
  );
};

export default StatusPill;
