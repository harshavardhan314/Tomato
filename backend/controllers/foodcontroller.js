const foodModel = require("../models/foodModel");
const redisClient = require("../config/redis");

const CACHE_KEY = "food:list";

// ---------------- ADD FOOD (CLOUDINARY READY) ----------------
const addFood = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    // validation
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields including image URL are required",
      });
    }

    const newFood = new foodModel({
      name,
      description,
      price,
      category,
      image, // Cloudinary URL
    });

    await newFood.save();

    // Clear cache so next request gets fresh data
    await redisClient.del(CACHE_KEY);

    res.status(201).json({
      success: true,
      message: "Food item added successfully",
      data: newFood,
    });
  } catch (error) {
    console.error("Error adding food:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ---------------- LIST FOOD (REDIS CACHE) ----------------
const listFood = async (req, res) => {
  try {
    const CACHE_KEY = "food:list";

    // Check Redis first
    const cachedFoods = await redisClient.get(CACHE_KEY);

    if (cachedFoods) {
      console.log("⚡ Food list served from Redis");

      return res.status(200).json({
        success: true,
        source: "redis",
        data: JSON.parse(cachedFoods),
      });
    }

    console.log("📦 Food list served from MongoDB");

    // Fetch from MongoDB
    const foods = await foodModel.find({}).lean();

    // Store in Redis for 1 hour
    await redisClient.setEx(
      CACHE_KEY,
      3600,
      JSON.stringify(foods)
    );

    return res.status(200).json({
      success: true,
      source: "mongodb",
      data: foods,
    });
  } catch (error) {
    console.error("Error listing foods:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// ---------------- REMOVE FOOD ----------------
const removeFood = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await foodModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Clear cache after deletion
    await redisClient.del(CACHE_KEY);

    res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting food:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addFood,
  listFood,
  removeFood,
};