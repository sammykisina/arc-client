import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useSetRecoilState } from "recoil";
import { currentUserRoleState, currentUserTokenState } from "../atoms/AppAtoms";
import { AuthAPI } from "../api/authApi";
import { ArcLogo, Icon, Title } from "../components";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { LocalStorage } from "../utils/localStorage";
import { Notification } from "../utils/notifications";

const Login = () => {
  // page states
  const [showPassword, setShowPassword] = useState(false);
  const setCurrentUserToken = useSetRecoilState(currentUserTokenState);
  const setCurrentUserRole = useSetRecoilState(currentUserRoleState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ work_id, password }) => {
    if (password.trim() === "") {
      Notification.errorNotification("Password Cannot Be Empty!");
      return;
    }

    AuthAPI.login({
      work_id: work_id,
      password: password,
    }).then((response) => {
      if (response.error === 1) {
        Notification.errorNotification(response.message);

        return;
      }

      if (response.token && response.role) {
        // store in local storage
        LocalStorage.storeValue("authenticatedUserToken", response.token);
        LocalStorage.storeValue("authenticatedUserRole", response.role);
        LocalStorage.storeValue(
          "authenticatedUserWorkID",
          response.user_work_id
        );

        // set the values in global states
        // setCurrentUserToken(response.token);
        // setCurrentUserRole(response.role);

        // TODO: FInd a better way to handle this:
        /**
         * Concern:
         * 1.The Token in axios config is not set if no refresh
         */
        window.location.reload(false);
      }
    });
  };

  return (
    <section
      className="
    flex flex-col h-screen justify-center items-center bg-white  relative w-full max-w-[1100px] mx-auto sm:px-[24px]"
    >
      {/* pos name */}
      <div className="mb-5">
        <Title
          title="Diana"
          titleStyles="text-7xl sm:text-9xl text-c_dark uppercase "
        />

        <div className="text-c_yellow text-xs text-end">Getting Work Done.</div>
      </div>
      {/* the Into section */}
      <div className="flex flex-col gap-y-5">
        <ArcLogo isSidebarOpen="false" />

        <Title title="Login" titleStyles="text-lg text-c_dark uppercase" />
      </div>
      {/* the login details */}
      <div className="mt-3">
        <form
          className="text-c_dark flex flex-col gap-y-10 text-"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* the work id input */}
          <div className="input-group w-[250px] sm:w-[220px] md:w-[240px]">
            <input
              type="number"
              placeholder=""
              {...register("work_id", { required: true })}
              className="input"
            />

            <label className="placeholder">Enter Your Work ID</label>

            {errors.work_id && (
              <span className="error">Enter your work id</span>
            )}
          </div>

          {/* the password input*/}
          <div className="flex flex-col gap-y-2">
            <div className="input-group  w-[250px] sm:w-[220px] md:w-[240px] flex items-center gap-x-3">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                className="input"
                placeholder=""
              />

              <label className="placeholder">Enter Your Password</label>

              <Icon
                icon={
                  showPassword ? (
                    <AiFillEyeInvisible className="w-5 h-5 cursor-pointer" />
                  ) : (
                    <AiFillEye className="w-5 h-5 cursor-pointer" />
                  )
                }
                purpose={() =>
                  setShowPassword(
                    (prevShowPasswordState) => !prevShowPasswordState
                  )
                }
              />
            </div>

            {errors.password && (
              <span className="error">Enter your password</span>
            )}
          </div>

          {/* the login button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-x-2 px-5 py-1 bg-c_yellow rounded-md
               text-c_dark w-fit hover:bg-c_yellow/50 duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>

      {/* the Toaster */}
      <Toaster />
    </section>
  );
};

export default Login;
