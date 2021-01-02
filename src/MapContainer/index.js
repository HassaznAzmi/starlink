import React, { useEffect, useRef, useState } from "react";
import * as fetch from "node-fetch";
import { generateMap } from "./generateMap";
import spacexLogo from "./utils/spacex.png";
import starlinkLogo from "./utils/starlink.png";
import "./index.css";

const MapContainer = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltip, setTooltip] = useState(<></>);

  const handleTooltip = (satellite) => {
    setTooltip(
      <>
        <div className="header">{satellite?.spaceTrack?.OBJECT_NAME}</div>
        <ul className="tooltipBody">
          <li>Longitude: {satellite?.longitude.toFixed(4)}</li>
          <li>Latitude: {satellite?.latitude.toFixed(4)}</li>
          <li>Velocity (km/s): {satellite?.velocity_kms.toFixed(4)}</li>
          <li>Height (km): {satellite?.height_km.toFixed(4)}</li>
          <br />
          <span>Launch Date: {satellite?.spaceTrack?.LAUNCH_DATE}</span>
        </ul>
      </>
    );
  };

  useEffect(() => {
    fetch("https://api.spacexdata.com/v4/starlink")
      .then((res) => res.json())
      .then((satellites) =>
        generateMap({
          containerRef,
          canvasRef,
          satellites,
          tooltipRef,
          handleTooltip,
        })
      )
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <div className="navbar">
        <div alt="placeholder" width={75}>
          &nbsp
        </div>
        <img src={starlinkLogo} width={150} alt="Logo" />
        <img src={spacexLogo} width={75} alt="Logo" />
      </div>
      <div ref={containerRef} className="canvasContainer">
        <canvas ref={canvasRef} className="canvas" />
      </div>
      <div ref={tooltipRef} className="tooltip">
        {tooltip}
      </div>
      <div className="disclaimer">
        Not Associated with SpaceX. All data retrieved from{" "}
        <a href="https://github.com/r-spacex/SpaceX-API">here</a>, updated every
        hour
      </div>
    </div>
  );
};

export default MapContainer;
