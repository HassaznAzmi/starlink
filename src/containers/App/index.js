import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
          <Route path="/launches" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/rockets" element={<Rockets />} />
          <Route path="/starlink" element={<MapContainer />} />
          <Route path="*" element={<Navigate to="/starlink" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
