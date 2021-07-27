const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  order: {
    //The order of the meal for the day
    type: Number,
    required: true,
  },
  recipe_name: {
    type: String,
    required: true,
  },
  recipe_id: {
    type: mongoose.Schema.ObjectId,
  },
  servings: {
    type: Number,
    default: 1,
  },
  groceries: [
    {
      name: {
        type: String,
      },
      amount: {
        type: Number,
      },
      unit: {
        type: String,
      },
    },
  ],
});

module.exports = Meal = mongoose.model("meal", MealSchema);
