// react framework imports
import React from "react";
import { Navigate } from "react-router-dom";

// recoil imports {recoil and atoms}
import { useRecoilValue } from "recoil";
import { currentUserRoleState } from "../atoms/AppAtoms";

const AdminSuperAdminPage = ({ children }) => {
  // component states
  const currentUserRole = useRecoilValue(currentUserRoleState);

  /**
   * Push the current user to Not Found if the user has non of the below roles
   */
  if (!(currentUserRole === "super-admin" || currentUserRole === "admin"))
    return <Navigate to="/notfound" />;

  /**
   * Return the page if the current user passes the check
   */
  return children;
};

export default AdminSuperAdminPage;
