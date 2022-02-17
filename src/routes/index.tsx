import { BrowserRouter, Route, Switch } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import RouteItem from "../models/route.interface";
import {
  APP_TITLE,
  ADMIN_DASHBOARD_TITLE,
  TRANSPORTER_DASHBOARD_TITLE,
  DISTRIBUTOR_DASHBOARD_TITLE,
  PHARMA_DASHBOARD_TITLE,
  PROFILE_DASHBOARD_TITLE,
  STORE_DASHBOARD_TITLE,
} from "../utils/constants";
import { AdminContextProvider } from "../context/AdminContext";
import { DialogContextProvider } from "../context/DialogContext";
import LoaderComponent from "../generic/Loader";

// Lazy loading

const Default = lazy(() => import("../generic/Default"));
const Spinner = lazy(() => import("../generic/MSpinner"));

//Build app routing data array using RouteItem interface
export const routes: Array<RouteItem> = [
  {
    key: "router-login",
    title: APP_TITLE,
    path: "/",
    enabled: true,
    component: lazy(() => import("../containers/Login")),
  },
  {
    key: "router-admin",
    title: ADMIN_DASHBOARD_TITLE,
    path: "/admin",
    enabled: true,
    component: lazy(() => import("../containers/Admin")),
  },
  {
    key: "router-logout",
    path: "/logout",
    title: APP_TITLE,
    enabled: true,
    component: lazy(() => import("../containers/Login")),
  },
  {
    key: "router-transporter",
    title: TRANSPORTER_DASHBOARD_TITLE,
    path: "/transporter",
    enabled: true,
    component: lazy(() => import("../containers/Transporter")),
  },
  {
    key: "router-distributor",
    title: DISTRIBUTOR_DASHBOARD_TITLE,
    path: "/distributor",
    enabled: true,
    component: lazy(() => import("../containers/Distributor")),
  },
  {
    key: "router-retailer",
    title: STORE_DASHBOARD_TITLE,
    path: "/retailer",
    enabled: true,
    component: lazy(() => import("../containers/Retailer")),
  },
  {
    key: "router-profile",
    title: PROFILE_DASHBOARD_TITLE,
    path: "/profile",
    enabled: true,
    component: lazy(() => import("../containers/profile")),
  },
];

const AppRoute = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Suspense fallback={<LoaderComponent />}>
          <Spinner />
          <DialogContextProvider>
            <AdminContextProvider>
              {routes.map((route: RouteItem) =>
                route.subRoutes ? (
                  route.subRoutes.map((item: RouteItem) => (
                    <div key={`${item.key}-${item.title}`}>
                      <Route
                        path={`${item.path}`}
                        component={item.component || Default}
                        exact
                      />
                    </div>
                  ))
                ) : (
                  <div key={`${route.key}-${route.title}`}>
                    <Route
                      path={`${route.path}`}
                      component={route.component || Default}
                      exact
                    />
                  </div>
                )
              )}
            </AdminContextProvider>
          </DialogContextProvider>
        </Suspense>
      </Switch>
    </BrowserRouter>
  );
};

export default AppRoute;
