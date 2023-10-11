import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MapContainer from "containers/MapContainer";
import Dashboard from "containers/Dashboard";
import Rockets from "containers/Rockets";
import History from "containers/History";
import Navbar from "components/Navbar";

const App = () => {
  return (
    <>
      <BrowserRouter basename="/">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/rockets" element={<Rockets />} />
          <Route path="/starlink" element={<MapContainer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
