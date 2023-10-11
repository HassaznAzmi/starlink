import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MapContainer from "containers/MapContainer";
import Navbar from "components/Navbar";

const App = () => {
  return (
    <>
      <BrowserRouter basename="/">
        <Navbar />
        <Routes>
          <Route path="/starlink" element={<MapContainer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
