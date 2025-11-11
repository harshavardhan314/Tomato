// Load environment variables
const dotenv = require("dotenv");
dotenv.config(); // Must come before other imports using env vars

// Import dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Import routes
const userRoute = require("./routes/userRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const foodRoute = require("./routes/foodRoute");
const adminRoutes = require("./routes/adminRoute");

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Parse JSON
app.use(express.json());

// ✅ CORS setup (supports multiple origins)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tomato-frontend-qs21.onrender.com",
      "http://localhost:5174"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // allow cookies/auth headers
  })
);

// ✅ Allow preflight (OPTIONS) for all routes
app.options(/.*/, cors());

// ✅ Static file serving (for uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Database Connection ---
mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Routes ---
app.get("/", (req, res) => res.send("🍔 API is running... hii iam harsha"));
app.use("/api/user", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/food", foodRoute);
app.use("/api/admin", adminRoutes);

// --- 404 Fallback ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// --- Start Server ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
