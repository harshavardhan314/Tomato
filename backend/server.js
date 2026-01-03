// Load environment variables
const dotenv = require("dotenv");
dotenv.config(); 


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");


const userRoute = require("./routes/userRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const foodRoute = require("./routes/foodRoute"); 
const adminRoutes = require("./routes/adminRoute");
const searchRoute = require("./routes/searchRoute");


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());

const allowedOriginsEnv =process.env.ALLOWED_ORIGINS || "http://localhost:5173";
const allowedOrigins = allowedOriginsEnv
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      console.warn(`Blocked CORS request from origin: ${origin}`);
      return callback(new Error("CORS policy: Origin not allowed"));
    },
    credentials: true,
  })
);

console.log("Allowed CORS origins:", allowedOrigins);

// Static file serving (for images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.get("/", (req, res) => res.send("🍔 API is running..."));
app.use("/api/user", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/food", foodRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoute);


app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// --- Start Server ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
