// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Routes
const userRoute = require("./routes/userRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const foodRoute = require("./routes/foodRoute");
const adminRoutes = require("./routes/adminRoute");
const searchRoute = require("./routes/searchRoute");

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- BODY PARSERS -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- CORS (FIXED & SAFE) -------------------- */
const allowedOriginsEnv =
  process.env.ALLOWED_ORIGINS || "http://localhost:5173";

const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log("Allowed CORS origins:", allowedOrigins);

/* -------------------- STATIC FILES -------------------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* -------------------- DATABASE -------------------- */
mongoose
  .connect(process.env.MONGOURL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) => res.send("🍔 API is running..."));

app.use("/api/user", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/food", foodRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoute);

/* -------------------- 404 HANDLER -------------------- */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* -------------------- START SERVER -------------------- */
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
