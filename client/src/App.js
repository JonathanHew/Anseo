import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Register from "./pages/register";
import Login from "./pages/login";
import SignIn from "./pages/signIn.page";
import Join from "./pages/join";
import Sessions from "./pages/sessions";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { fetchUserInfo } from "./api/auth";

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
    if(isAuth)
    {
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
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-in/:id" element={<SignIn />}></Route>

        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/join/:id" element={<Join />}></Route>
          <Route path="/sessions" element={<Sessions id={id}/>}></Route>
        </Route>

        <Route element={<RestrictedRoutes />}>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
