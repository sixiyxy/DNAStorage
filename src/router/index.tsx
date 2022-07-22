import { Home } from "../pages/Home";
import { Contact } from "../pages/Contact";
import { Resources } from "../pages/Resources";
import { Services } from "../pages/Services";
import { Tutorial } from "../pages/Tutorial";
import { Publications } from "../pages/Publications";
import { RouteObject } from "react-router-dom";
import { BasicLayout } from "../pages/layouts/BasicLayouts";
export const router: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/",
    element: <BasicLayout />,
    children: [
      { path: "/publications", element: <Publications /> },
      { path: "/resources", element: <Resources /> },
      { path: "/services", element: <Services /> },
      { path: "/tutorial", element: <Tutorial /> },
      { path: "/contact", element: <Contact /> },
    ],
  },
];
// export const routes = [
//   {
//     path: "/",
//     exact: true,
//     element: "../pages/Home/index.tsx",
//   },
//   {
//     path: "/home",
//     element: Home,
//   },
//   {
//     path: "/contact",
//     element: Contact,
//   },
//   {
//     path: "/publications",
//     element: Publications,
//   },
//   {
//     path: "/Resources",
//     element: Resources,
//   },
//   {
//     path: "/Services",
//     element: Services,
//   },
//   {
//     path: "/Tutorial",
//     element: Tutorial,
//   },
// ];
