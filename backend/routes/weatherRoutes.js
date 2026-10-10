import express from "express";
import {
  getWeather,
  getForecast,
  searchLocations,
  getHeatMapData
} from "../controllers/weatherController.js";

const router = express.Router();

router.get("/weather", getWeather);
router.get("/forecast", getForecast);
router.get("/weather/search", searchLocations);
router.get("/heatmap", getHeatMapData);

export default router;
