import React, { useEffect, useState } from "react";

import Card from "components/Card";
import { getRockets } from "apis";

import "./index.css";

const Rockets = () => {
  const [rockets, setRockets] = useState([]);

  useEffect(() => {
    Promise.all([getRockets()]).then(([resp]) => {
      setRockets(resp);
    });
  }, []);

  return (
    <div className="rocketsContainer">
      {rockets.map((rocket) => {
        return (
          <Card key={rocket?.name}>
            <h2>{rocket?.name} </h2>
            <p>
              <span
                style={{
                  color: rocket?.active ? "lightgreen" : "red",
                  marginRight: 8,
                }}
              >
                ●
              </span>
              {rocket?.active ? "Active" : "Inactive"}
              <a
                href={rocket?.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: 8 }}
              >
                ⧉
              </a>
            </p>
            <img
              width="100%"
              height={450}
              src={rocket?.flickr_images?.[0]}
              className="rocketImg"
            />
            <p>Height: {rocket?.height?.meters}m</p>
            <p>Weight: {rocket?.mass?.kg}kg</p>
            <p>{rocket?.description}</p>
          </Card>
        );
      })}
    </div>
  );
};

export default Rockets;
