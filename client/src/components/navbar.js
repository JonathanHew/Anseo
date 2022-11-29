import { NavLink } from "react-router-dom";
import {useSelector} from "react-redux"

const NavBar = () => {
  const {isAuth} = useSelector((state) => state.auth)


  // if isAuth (logged in), render dashboard, if not render login and register options
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <div>
          <NavLink to="/">
            <span className="navbar-brand mb-0 h1">Home</span>
          </NavLink>
        </div>

        {isAuth ? (
          <div>
            <NavLink to="/dashboard" className="mx-3">
              <span>Dashboard</span>
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink to="/login">
              <span>Login</span>
            </NavLink>

            <NavLink to="/register" className="mx-3">
              <span>Register</span>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
