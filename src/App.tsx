import "./App.css";
import { BasicLayout } from "./layouts/BasicLayout";
import { router } from "./router";
import { Route, Routes, useRoutes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { Publications } from "./pages/Publications";
import { Resources } from "./pages/Resources";
import {ScrollToTop} from "./ScollToTop/index.jsx"

function App() {
  return useRoutes(router);
}

export default App;
