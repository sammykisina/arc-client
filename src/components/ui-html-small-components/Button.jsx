import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      icon,
      title,
      buttonStyles,
      buttonTitleWrapperStyles,
      purpose = () => {},
      barge,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="relative w-fit">
        <button
          ref={ref}
          onClick={purpose}
          className={`${buttonStyles} cursor-pointer`}
          {...rest}
        >
          {icon}
          <span className={`${buttonTitleWrapperStyles}`}>{title}</span>
        </button>

        <div
          className={`${
            barge > 0 ? "flex justify-center items-center" : "hidden"
          }`}
        >
          <div className="absolute -top-1 right-0 bg-c_yellow w-6 h-6 flex justify-center items-center rounded-full p-2 text-white ">
            {barge}
          </div>
        </div>
      </div>
    );
  }
);

export default Button;
