import React, { useEffect, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import { getHistory } from "apis";
import RocketIcon from "images/rocket";

const History = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState();

  useEffect(() => {
    getHistory().then((resp) => {
      setHistory(resp.reverse());
      setLoading(false);
    });
  }, []);

  console.log(history);

  if (loading) return <></>;

  return (
    <VerticalTimeline>
      {history.map((event) => {
        return (
          <VerticalTimelineElement
            key={event?.id}
            className="vertical-timeline-element--work"
            contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
            date={new Date(event?.event_date_utc)?.getFullYear()}
            icon={<RocketIcon />}
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          >
            <h3 className="vertical-timeline-element-title">{event?.title}</h3>
            <h4 className="vertical-timeline-element-subtitle">
              {new Date(event?.event_date_utc)?.toLocaleDateString("en-US")}
            </h4>
            <p>{event?.details}</p>
            {event?.links?.article && (
              <a
                href={event?.links?.article}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, float: "right" }}
              >
                SOURCE
              </a>
            )}
          </VerticalTimelineElement>
        );
      })}
    </VerticalTimeline>
  );
};

export default History;
