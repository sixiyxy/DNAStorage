import { Home } from "../pages/Home";
import { Contact } from "../pages/Contact";
import { Resources } from "../pages/Resources";
import { WholeServices } from "../pages/WholeServices";
import { Tutorial } from "../pages/Tutorial";
import { Publications } from "../pages/Publications";
import { Methods } from "../pages/Methods";
import { RouteObject } from "react-router-dom";
import { BasicLayout } from "../layouts/BasicLayout";
import { ServiceChose } from "../pages/ServiceChose";
import { EncodeServices } from "../pages/EncodeServices";
import { SimulationServices } from "../pages/SimulationServices";
export const router: RouteObject[] = [
  // {
  //   path: "/",
  //   element: <Home />,
  // },
  {
    path: "/",
    element: <BasicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/publications", element: <Publications /> },
      { path: "/resources", element: <Resources /> },
      { path: "/services", element: <ServiceChose /> },
      { path: "/services/encode", element: <EncodeServices /> },
      { path: "/services/simulation", element: <SimulationServices /> },
      { path: "/services/wholeprocess", element: <WholeServices /> },
      { path: "/tutorial", element: <Tutorial /> },
      { path: "/methods", element: <Methods /> },
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
