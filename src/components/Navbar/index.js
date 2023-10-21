import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import spacexLogo from "images/spacex.png";
import Hamburger from "images/burger-menu.js";
import "./index.css";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = React.useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const closeNavbar = () => setShowNavbar(false);

  useEffect(() => {
    if (document) {
      document.body.style.overflow = showNavbar ? "hidden" : "auto";
    }
  }, [useEffect]);

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
              <Link to="/starlink" onClick={closeNavbar}>
                Starlink
              </Link>
            </li>
            <li>
              <Link to="/launches" onClick={closeNavbar}>
                Launches
              </Link>
            </li>
            <li>
              <Link to="/history" onClick={closeNavbar}>
                History
              </Link>
            </li>
            <li>
              <Link to="/rockets" onClick={closeNavbar}>
                Rockets
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
