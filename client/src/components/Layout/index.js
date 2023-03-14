// layout component is for components such as navbar which you want on every page

import NavBar from "../NavBar";

const Layout = ({ children }) => {
  return (
    <div className="background-light-grey pb-2 page-height">
      <NavBar />
      <div className="container">{children}</div>
    </div>
  );
};

export default Layout;
