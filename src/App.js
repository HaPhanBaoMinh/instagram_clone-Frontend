import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { publicRouter, authRouter } from './router';
import { Fragment, useContext, useEffect, useState } from 'react';
import DefaultLayout from './components/layout/DefaultLayout';
import "./App.css"
import AuthContext from './context/AuthProvider';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css/bundle";
import instanceAxios from './api/axiosConfig';
import SocketContext, { SocketProvider } from './context/SocketProvider';
import { CLIENT_ROUTER } from './api/router';

function App() {
  const { Auth, setAuth } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  useEffect(() => {
    const autoLogin = async () => {
      const payload = localStorage.getItem("payload");
      const password = localStorage.getItem("password");
      if (window.location.href.includes("/login") || window.location.href.includes("/signup")) {
        return;
      }
      try {
        const data = {
          payload,
          password
        }
        const result = await instanceAxios.post("/user/login", data);
        if (!result.data.status) {
          window.location.href = `${CLIENT_ROUTER}/login`;
        }
        setAuth({ ...result.data.result, ...result.data.token });
      } catch (error) {
        console.error(error.message);
      }
    }


    autoLogin();
  }, [])



  return (
    <Router>
      <div className="App h-screen w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          {
            publicRouter.map((route, index) => {
              const Page = route.component;
              let Layout;

              if (route.layout == null) {
                Layout = DefaultLayout;
              } else if (route.layout) {
                Layout = route.layout
              }
              return <Route
                path={route.path}
                key={index}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
            })
          }
          {
            authRouter.map((route, index) => {
              const Page = route.component;
              let Layout;

              if (route.layout == null) {
                Layout = DefaultLayout;
              } else if (route.layout) {
                Layout = route.layout
              }
              return <Route
                path={route.path}
                key={index}
                element={
                  Auth != null || localStorage.getItem('token') ?
                    <SocketProvider>
                      <Layout>
                        <Page />
                      </Layout>
                    </SocketProvider>
                    :
                    <Navigate to="/login" />
                } />
            })
          }
          <Route path="/:notDefine" element={<Navigate to="/home" />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
