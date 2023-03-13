import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { onLogout } from "../../api/auth";
import { useDispatch } from "react-redux";
import { unauthenticateUser } from "../../redux/slices/authSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.auth);

  const logout = async () => {
    try {
      await onLogout();

      dispatch(unauthenticateUser());
      localStorage.removeItem("isAuth");
    } catch (err) {
      console.error(err.response);
    }
  };

  // if isAuth (logged in), render dashboard, if not render login and register options
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <div>
          <NavLink to="/">
            <span className="navbar-brand mb-0 h1">Attendify!</span>
          </NavLink>
        </div>
        {isAuth ? (
          <div>
            <NavLink to="/dashboard">
              <button className="btn btn-outline-primary me-2">
                Dashboard
              </button>
            </NavLink>
            <NavLink to="/">
              <button className="btn btn-outline-info me-5">Reports</button>
            </NavLink>
            <NavLink>
              <button
                className="btn btn-outline-secondary btn-sm ms-3"
                onClick={() => logout()}
              >
                Logout
              </button>
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink to="/login">
              <button type="button" class="btn btn-outline-primary me-2 btn-sm">
                Login
              </button>
            </NavLink>

            <NavLink to="/register" className="mx-1">
              <button type="button" class="btn btn-primary btn-sm">
                Sign-up
              </button>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
