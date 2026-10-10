import { Alert } from "../models/Alert.js";

// Sample demonstration alerts to seed if DB is empty
const INITIAL_DEMO_ALERTS = [
  {
    title: "Extreme Heatwave Warning",
    location: "Delhi, Delhi",
    severity: "Extreme",
    temperature: "44°C",
    expectedPeak: "45°C",
    peakTime: "1:30 PM - 4:30 PM",
    description: "Severe heatwave conditions persisting across the National Capital Region. High risk of heat-related illness. Public advised to avoid direct sun exposure.",
    status: "Active",
    source: "Project Demonstration",
    isDemonstration: true
  },
  {
    title: "Severe Coastal Heat Advisory",
    location: "Mumbai, Maharashtra",
    severity: "High",
    temperature: "39°C",
    expectedPeak: "40°C",
    peakTime: "12:00 PM - 3:30 PM",
    description: "High humidity combined with elevated ambient temperatures producing an uncomfortable apparent heat index exceeding 43°C. Outdoor workers advised to hydrate frequently.",
    status: "Active",
    source: "Project Demonstration",
    isDemonstration: true
  },
  {
    title: "Afternoon Heat Advisory",
    location: "Pune, Maharashtra",
    severity: "Moderate",
    temperature: "36°C",
    expectedPeak: "37°C",
    peakTime: "2:00 PM - 4:00 PM",
    description: "Moderate heat levels detected. General public is encouraged to drink adequate water and take shade breaks during peak daylight hours.",
    status: "Active",
    source: "Project Demonstration",
    isDemonstration: true
  },
  {
    title: "High Thermal Index Warning",
    location: "Ahmedabad, Gujarat",
    severity: "Extreme",
    temperature: "43°C",
    expectedPeak: "44°C",
    peakTime: "1:00 PM - 4:00 PM",
    description: "Severe dry heatwave conditions forecast across Ahmedabad and Gandhinagar. Extreme heat safety protocols recommended for vulnerable demographics.",
    status: "Active",
    source: "Project Demonstration",
    isDemonstration: true
  },
  {
    title: "Elevated Heat Alert",
    location: "Nagpur, Maharashtra",
    severity: "High",
    temperature: "41°C",
    expectedPeak: "42°C",
    peakTime: "12:30 PM - 3:30 PM",
    description: "Elevated thermal stress forecast in Vidarbha region. Citizens should restrict non-essential travel and strenuous outdoor physical activities.",
    status: "Active",
    source: "Project Demonstration",
    isDemonstration: true
  },
  {
    title: "Mild Seasonal Heat Advisory",
    location: "Bengaluru, Karnataka",
    severity: "Low",
    temperature: "30°C",
    expectedPeak: "31°C",
    peakTime: "1:00 PM - 3:00 PM",
    description: "Mild temperature conditions within normal physiological limits. Baseline hydration suggested.",
    status: "Monitoring",
    source: "Project Demonstration",
    isDemonstration: true
  }
];

/**
 * Seed initial demonstration alerts if database collection is empty
 */
export async function seedAlertsIfEmpty() {
  try {
    const count = await Alert.countDocuments();
    if (count === 0) {
      await Alert.insertMany(INITIAL_DEMO_ALERTS);
      console.log("[Alerts] Seeded initial demonstration alerts in MongoDB.");
    }
  } catch (err) {
    console.warn("[Alerts Seeding Warning]:", err.message);
  }
}

/**
 * GET /api/alerts
 * List all alerts with optional severity filtering and summary statistics
 */
export async function getAlerts(req, res, next) {
  try {
    const { severity, status, search } = req.query;
    const query = {};

    if (severity && severity !== "All") {
      query.severity = severity;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 });

    // Calculate overall summary counts across all alerts
    const allAlerts = await Alert.find();
    const summary = {
      total: allAlerts.length,
      extreme: allAlerts.filter(a => a.severity === "Extreme").length,
      high: allAlerts.filter(a => a.severity === "High").length,
      moderate: allAlerts.filter(a => a.severity === "Moderate").length,
      low: allAlerts.filter(a => a.severity === "Low").length
    };

    res.json({
      success: true,
      count: alerts.length,
      summary,
      alerts
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/alerts/:id
 * Get single alert by ID
 */
export async function getAlertById(req, res, next) {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found"
      });
    }

    res.json({
      success: true,
      alert
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/alerts
 * Protected: Create a new alert
 */
export async function createAlert(req, res, next) {
  try {
    const {
      title,
      location,
      severity,
      temperature,
      expectedPeak,
      peakTime,
      description,
      status,
      source
    } = req.body;

    if (!title || !location || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, location, and description are required fields."
      });
    }

    const newAlert = new Alert({
      title: title.trim(),
      location: location.trim(),
      severity: severity || "Moderate",
      temperature: temperature || "38°C",
      expectedPeak: expectedPeak || "40°C",
      peakTime: peakTime || "1:00 PM - 4:00 PM",
      description: description.trim(),
      status: status || "Active",
      source: source || "Project Demonstration Alert (User Generated)",
      isDemonstration: true,
      createdBy: req.user ? req.user._id : null
    });

    const saved = await newAlert.save();

    res.status(201).json({
      success: true,
      message: "Alert created successfully in MongoDB",
      alert: saved
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/alerts/:id
 * Protected: Update an existing alert
 */
export async function updateAlert(req, res, next) {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found"
      });
    }

    const {
      title,
      location,
      severity,
      temperature,
      expectedPeak,
      peakTime,
      description,
      status
    } = req.body;

    if (title) alert.title = title.trim();
    if (location) alert.location = location.trim();
    if (severity) alert.severity = severity;
    if (temperature) alert.temperature = temperature;
    if (expectedPeak) alert.expectedPeak = expectedPeak;
    if (peakTime) alert.peakTime = peakTime;
    if (description) alert.description = description.trim();
    if (status) alert.status = status;

    const updated = await alert.save();

    res.json({
      success: true,
      message: "Alert updated successfully",
      alert: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/alerts/:id
 * Protected: Delete an alert
 */
export async function deleteAlert(req, res, next) {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found"
      });
    }

    await Alert.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Alert deleted successfully from MongoDB",
      id: req.params.id
    });
  } catch (err) {
    next(err);
  }
}
