import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Card from "components/Card";
import Countdown from "components/Countdown";
import { getLatestLaunch, getNextLaunch, getStarlink } from "apis";
import useCardAnimation from "hooks/useCardAnimation";

import "./index.css";

const Dashboard = () => {
  const [latestLaunch, setLatestLaunch] = useState();
  const [nextLaunch, setNextLaunch] = useState();
  const [starlink, setStarlink] = useState();

  const scope = useCardAnimation();

  useEffect(() => {
    Promise.all([getLatestLaunch(), getNextLaunch(), getStarlink()]).then(
      ([latest, next, sats]) => {
        setLatestLaunch(latest);
        setNextLaunch(next);
        setStarlink(sats);
      }
    );
  }, []);

  return (
    <div className="dashboardContainer" ref={scope}>
      <Card>
        <h2>Last Launch</h2>
        <p>{latestLaunch?.name}</p>
        <p>{new Date(latestLaunch?.date_utc)?.toLocaleDateString("en-US")}</p>
        <img src={latestLaunch?.links?.patch?.small} className="patchImage" />
        <p>
          <span
            style={{
              color: latestLaunch?.success ? "lightgreen" : "red",
              marginRight: 8,
            }}
          >
            ●
          </span>
          {latestLaunch?.success ? "Success!" : "Failure!"}
        </p>
      </Card>

      <Card>
        <h2>Next Launch</h2>
        <p>{nextLaunch?.name}</p>
        <Countdown deadline={nextLaunch?.date_utc} />
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${nextLaunch?.links?.youtube_id}`}
          title="YouTube video player"
          allow="accelerometer; 
                  autoplay; 
                  clipboard-write; 
                  encrypted-media; 
                  gyroscope; 
                  picture-in-picture; 
                  web-share"
          allowFullScreen
        ></iframe>
      </Card>

      <Card>
        <h2>Starlink</h2>
        <p>
          <span style={{ color: "lightgreen", marginRight: 8 }}>●</span>
          {starlink?.length} Active Satellites
        </p>
        <progress
          value={starlink?.length}
          max={12000}
          style={{ width: "100%" }}
        />
        <p>
          {((starlink?.length / 12000) * 100).toFixed(0)}% of Satellites
          Deployed
        </p>

        <Link to="/starlink">
          <button className="viewStarlinkButton">View Network</button>
        </Link>
      </Card>
    </div>
  );
};

export default Dashboard;
