import React from "react";

const Date = ({ value, column }) => {
  return (
    <section
      className={`px-3  w-fit uppercase leading-loose rounded-full bg-gray-50 shadow-sm text-c_dark`}
    >
      {value}
    </section>
  );
};

export default Date;
