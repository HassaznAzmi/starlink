export const getStarlink = () => {
  return fetch("https://api.spacexdata.com/v4/starlink").then((res) =>
    res.json()
  );
};

export const getLatestLaunch = () => {
  return fetch("https://api.spacexdata.com/v5/launches/latest").then((res) =>
    res.json()
  );
};

export const getNextLaunch = () => {
  return fetch("https://api.spacexdata.com/v5/launches/next").then((res) =>
    res.json()
  );
};

export const getUpcomingLaunches = () => {
  return fetch("https://api.spacexdata.com/v5/launches/upcoming").then((res) =>
    res.json()
  );
};

export const getHistory = () => {
  return fetch("https://api.spacexdata.com/v4/history").then((res) =>
    res.json()
  );
};
export const getCrew = () => {
  return fetch("https://api.spacexdata.com/v4/crew").then((res) => res.json());
};

export const getRockets = () => {
  return fetch("https://api.spacexdata.com/v4/rockets").then((res) =>
    res.json()
  );
};
