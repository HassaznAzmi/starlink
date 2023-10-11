import React from "react";
import T from "prop-types";

import "./index.css";

const Card = ({ children }) => {
  return <div className="cardContainer">{children}</div>;
};

Card.propTypes = {
  children: T.node.isRequired,
};

export default Card;
