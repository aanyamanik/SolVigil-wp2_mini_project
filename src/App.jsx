import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import HeatMap from "./pages/HeatMap";
import Alerts from "./pages/Alerts";
import Login from "./pages/Login";
import Register from "./pages/Register";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/map" element={<HeatMap />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}


export default App;