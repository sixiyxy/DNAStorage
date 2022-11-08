import "./App.css";
import React,{useEffect,useState} from "react";
import { notification,Button} from "antd";
import { BasicLayout } from "./layouts/BasicLayout";
import { router } from "./router";
import { Route, Routes, useRoutes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { Publications } from "./pages/Publications";
import { Resources } from "./pages/Resources";
import {ScrollToTop} from "./ScollToTop/index.jsx"

function App() {
  const close = () => {
    console.log(
      'Notification was closed. Either the close button was clicked or duration time elapsed.',
    );
  };
  const btn = (
    <Button type="primary" size="middle" onClick={() => notification.close(key)}>
      Got it!
    </Button>
  );
  const key = `open${Date.now()}`;
  useEffect(()=>{
    notification.open({
      message: '',
      description:
        'We use cookies for our Web Application Firewall (WAF) protection that help to protect our web server from a variety of application layer attacks and to enhance your experience. By continuing to visit this site you agree to our use of cookies!',
      btn,
      key,
      duration:null,
      placement:'bottom',
      style: {
        width: '1000px',
        fontSize:'20px'
      },
      onClose: close,
    });
},[])
  return (
    useRoutes(router)
    );
}

export default App;
