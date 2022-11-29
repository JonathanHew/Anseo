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
import Navbar from "./components/navbar";
import {userSelector, useSelector} from "react-redux"

// if user is not logged in and they enter the dashboard route, they will redirected to login
const PrivateRoutes = () => {
  const {isAuth} = useSelector((state) => state.auth)

  return <>{isAuth ? <Outlet /> : <Navigate to="/login" />} </>;
};

// if user is logged in and they enter the login or register route, they will be redirected to their dashboard
const RestrictedRoutes = () => {
  const {isAuth} = useSelector((state) => state.auth)


  return <>{!isAuth ? <Outlet /> : <Navigate to="/dashboard" />} </>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>

        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
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
