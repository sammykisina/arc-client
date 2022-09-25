import React from "react";
import { Link } from "react-router-dom";
import { NotFoundSvg } from "../assets";
import { Title } from "../components";

const NotFound = () => {
  return (
    <section>
      <div className="flex justify-center">
        <img src={NotFoundSvg} alt="" className="sm:w-[350px] sm:h-[350px]" />
      </div>

      <div className="px-5 py-4 flex justify-center flex-col items-center">
        {/* info */}
        <Title
          title="Sorry!"
          titleStyles="text-3xl text-c_green font-semibold"
        />

        <p className="mt-2 text-c_dark sm:w-[70%] lg:w-[60%]">
          The Page you are trying to accessing is not available for you. Please
          contact the admin for further information.
        </p>

        <div className=" mt-5">
          <Link
            to="/"
            className="bg-c_yellow py-2 rounded-md hover:bg-c_yellow/50 flex  items-center justify-center gap-x-4 w-[200px] text-white"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
