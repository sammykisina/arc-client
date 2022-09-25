import React from "react";
// import { useForm } from "react-hook-form";

const Input = ({
  name,
  required,
  errorMessage,
  inputWrapperStyles,
  type,
  register,
  ...rest
}) => {
  return (
    <div className={`${inputWrapperStyles}`}>
      <input
        {...register(name, { required: register ? true : "" })}
        className={`input`}
        type={type}
        {...rest}
      />
    </div>
  );
};

export default Input;
