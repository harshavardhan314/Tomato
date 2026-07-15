const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("./config/cloudinary");
const foodModel = require("./models/foodModel");

// ---------------- FOOD LIST (CLEANED) ----------------
const food_list = [
  { _id: "1", name: "Greek salad", imageFile: "food_1.png", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { _id: "2", name: "Veg salad", imageFile: "food_2.png", price: 180, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { _id: "3", name: "Clover Salad", imageFile: "food_3.png", price: 160, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { _id: "4", name: "Chicken Salad", imageFile: "food_4.png", price: 240, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },

  { _id: "5", name: "Lasagna Rolls", imageFile: "food_5.png", price: 140, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { _id: "6", name: "Peri Peri Rolls", imageFile: "food_6.png", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { _id: "7", name: "Chicken Rolls", imageFile: "food_7.png", price: 200, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { _id: "8", name: "Veg Rolls", imageFile: "food_8.png", price: 150, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },

  { _id: "9", name: "Ripple Ice Cream", imageFile: "food_9.png", price: 145, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { _id: "10", name: "Fruit Ice Cream", imageFile: "food_10.png", price: 221, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { _id: "11", name: "Jar Ice Cream", imageFile: "food_11.png", price: 100, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { _id: "12", name: "Vanilla Ice Cream", imageFile: "food_12.png", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },

  { _id: "13", name: "Chicken Sandwich", imageFile: "food_13.png", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { _id: "14", name: "Vegan Sandwich", imageFile: "food_14.png", price: 180, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { _id: "15", name: "Grilled Sandwich", imageFile: "food_15.png", price: 160, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { _id: "16", name: "Bread Sandwich", imageFile: "food_16.png", price: 240, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },

  { _id: "17", name: "Cup Cake", imageFile: "food_17.png", price: 140, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { _id: "18", name: "Vegan Cake", imageFile: "food_18.png", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { _id: "19", name: "Butterscotch Cake", imageFile: "food_19.png", price: 200, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { _id: "20", name: "Sliced Cake", imageFile: "food_20.png", price: 150, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },

  { _id: "21", name: "Garlic Mushroom", imageFile: "food_21.png", price: 140, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { _id: "22", name: "Fried Cauliflower", imageFile: "food_22.png", price: 220, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { _id: "23", name: "Mix Veg Pulao", imageFile: "food_23.png", price: 100, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { _id: "24", name: "Rice Zucchini", imageFile: "food_24.png", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },

  { _id: "25", name: "Cheese Pasta", imageFile: "food_25.png", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { _id: "26", name: "Tomato Pasta", imageFile: "food_26.png", price: 180, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { _id: "27", name: "Creamy Pasta", imageFile: "food_27.png", price: 160, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { _id: "28", name: "Chicken Pasta", imageFile: "food_28.png", price: 240, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },

  { _id: "29", name: "Butter Noodles", imageFile: "food_29.png", price: 140, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
  { _id: "30", name: "Veg Noodles", imageFile: "food_30.png", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
  { _id: "31", name: "Somen Noodles", imageFile: "food_31.png", price: 200, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
  { _id: "32", name: "Cooked Noodles", imageFile: "food_32.png", price: 150, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
];

// ---------------- UPLOAD FUNCTION ----------------
async function uploadImage(fileName) {
  const filePath = path.join(__dirname, "./assets", fileName);

  const result = await cloudinary.uploader.upload(filePath, {
    folder: "food-app",
    public_id: fileName.replace(".png", ""),
  });

  return result.secure_url;
}

// ---------------- SEED FUNCTION ----------------
async function seed() {
  try {
    await mongoose.connect(process.env.MONGOURL);

    console.log("DB Connected");

    await foodModel.deleteMany({});
    console.log("Old data cleared");

    for (const item of food_list) {
      const imageUrl = await uploadImage(item.imageFile);

      await foodModel.create({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: imageUrl,
      });

      console.log("Seeded:", item.name);
    }

    console.log("✅ Seeding Completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seed();