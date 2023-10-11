import React, { useEffect, useRef, useState } from "react";
import * as fetch from "node-fetch";
import { generateMap } from "./generateMap";
import "./index.css";

const MapContainer = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltip, setTooltip] = useState(<></>);
  const [sats, setSats] = useState();

  const handleTooltip = (satellite) => {
    if (satellite?.longitude) {
      setTooltip(
        <>
          <div className="header">{satellite?.spaceTrack?.OBJECT_NAME}</div>
          <ul className="tooltipBody">
            <li>Longitude: {satellite?.longitude?.toFixed(4)}</li>
            <li>Latitude: {satellite?.latitude?.toFixed(4)}</li>
            {satellite?.velocity_kms && (
              <li>Velocity (km/s): {satellite?.velocity_kms?.toFixed(4)}</li>
            )}
            <li>Height (km): {satellite?.height_km.toFixed(4)}</li>
            <br />
            <span>Launch Date: {satellite?.spaceTrack?.LAUNCH_DATE}</span>
          </ul>
        </>
      );
    }
  };

  useEffect(() => {
    const result = fetch("https://api.spacexdata.com/v4/starlink")
      .then((res) => res.json())
      .then((satellites) => {
        setSats(satellites);
        // const sim = generateMap({
        //   containerRef,
        //   canvasRef,
        //   satellites,
        //   tooltipRef,
        //   handleTooltip,
        // });
        // return sim;
      })
      .catch((err) => console.log(err));

    // result.then((resp) => {
    //   console.log(resp);
    // });
  }, []);

  useEffect(() => {
    let sim = {};
    if (sats) {
      sim = generateMap({
        containerRef,
        canvasRef,
        satellites: sats,
        tooltipRef,
        handleTooltip,
      });
      console.log(sim);
    }
    return sim?.stop;
  }, [sats]);

  return (
    <div className="container">
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
