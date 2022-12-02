// layout component is for components such as navbar which you want on every page

import NavBar from "./navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className="container">{children}</div>
    </div>
  );
};

export default Layout;
