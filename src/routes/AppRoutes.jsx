import React from "react";
import {
  Dashboard,
  Product,
  Bills,
  Employee,
  ARC,
  Counter,
  NotFound,
} from "../pages";
import { Routes, Route } from "react-router-dom";
import { AdminSuperAdminBartenderPage, AdminSuperAdminPage } from "./";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/employee"
        element={
          <AdminSuperAdminPage>
            <Employee />
          </AdminSuperAdminPage>
        }
      />
      <Route
        path="bills"
        element={
          <AdminSuperAdminPage>
            <Bills />
          </AdminSuperAdminPage>
        }
      />
      <Route
        path="/arc"
        element={
          <AdminSuperAdminPage>
            <ARC />
          </AdminSuperAdminPage>
        }
      />

      <Route
        path="/counter"
        element={
          <AdminSuperAdminBartenderPage>
            <Counter />
          </AdminSuperAdminBartenderPage>
        }
      />
      <Route path="/notfound" element={<NotFound />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
