import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import Session from "./pages/Session";
import SelectStudent from "./pages/SelectStudent";
import StudentReport from "./pages/StudentReport";
import SelectModule from "./pages/SelectModule";
import ModuleReport from "./pages/ModuleReport";
import SelectSession from "./pages/SelectSession";
import SessionReport from "./pages/SessionReport";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { fetchUserInfo } from "./api/auth";
import SelectReport from "./pages/SelectReport";

// if user is not logged in and they enter the dashboard route, they will redirected to login
const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth);

  return <>{isAuth ? <Outlet /> : <Navigate to="/login" />} </>;
};

// if user is logged in and they enter the login or register route, they will be redirected to their dashboard
const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth);

  return <>{!isAuth ? <Outlet /> : <Navigate to="/dashboard" />} </>;
};

const App = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const [id, setId] = useState();

  useEffect(() => {
    // if user authenticated, get their information
    if (isAuth) {
      (async () => {
        const content = await fetchUserInfo();
        const userId = content.data.info.id;
        setId(userId);
      })();
    }
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in/:session_id" element={<SignIn />}></Route>

        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/session/:id" element={<Session />}></Route>
          <Route
            path="/select-student"
            element={<SelectStudent id={id} />}
          ></Route>
          <Route
            path="/student-report/:student_number/:module_id"
            element={<StudentReport />}
          ></Route>
          <Route path="/select-module" element={<SelectModule />}></Route>
          <Route
            path="/module-report/:module_id"
            element={<ModuleReport />}
          ></Route>
          <Route path="/select-session" element={<SelectSession />}></Route>
          <Route
            path="/session-report/:session_id"
            element={<SessionReport />}
          ></Route>
          <Route path="/select-report" element={<SelectReport />}></Route>
        </Route>

        <Route element={<RestrictedRoutes />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
