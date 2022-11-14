import React from "react";
import { Dashboard, Bills, ARC, Counter, NotFound, WorkForce } from "../pages";
import { Routes, Route } from "react-router-dom";
import { AdminSuperAdminBartenderPage, AdminSuperAdminPage } from "./";
import { ROUTE_PATHS } from "../constants";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.DASHBOARD} element={<Dashboard />} />
      <Route
        path={ROUTE_PATHS.BILLS}
        element={
          <AdminSuperAdminPage>
            <Bills />
          </AdminSuperAdminPage>
        }
      />
      <Route
        path={ROUTE_PATHS.ARC}
        element={
          <AdminSuperAdminPage>
            <ARC />
          </AdminSuperAdminPage>
        }
      />
        <Route
          path={ROUTE_PATHS.COUNTER}
          element={
            <AdminSuperAdminBartenderPage>
              <Counter />
            </AdminSuperAdminBartenderPage>
          }
        />
      <Route
        path={ROUTE_PATHS.WORKFORCE}
        element={
          <AdminSuperAdminPage>
            <WorkForce />
          </AdminSuperAdminPage>
        }
      />

      {/* <Route path="/notfound" element/={<NotFound />} /> */}

      <Route path={ROUTE_PATHS.NOTFOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
