import React from "react";
import { Link } from "react-router-dom";

import spacexLogo from "images/spacex.png";
import Hamburger from "images/burger-menu.js";
import "./index.css";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = React.useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <nav className="navbar">
      <div className="navContainer">
        <div className="logo">
          <img src={spacexLogo} width={75} />
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          <Hamburger />
        </div>
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/history">History</Link>
            </li>
            <li>
              <Link to="/rockets">Rockets</Link>
            </li>
            <li>
              <Link to="/starlink">Starlink</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
