const mongoose = require("mongoose");

const RecipeSchema = mongoose.Schema({
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
    },
  },
  title: {
    type: String,
    required: true,
    text: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  servings: {
    type: Number,
    default: 2,
  },
  ingredientsList: [
    {
      section: {
        type: String,
      },
      ingredients: [
        {
          name: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          unit: {
            type: String,
          },
          notes: {
            type: String,
          },
        },
      ],
    },
  ],
  instructions: {
    type: [String],
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Recipe = mongoose.model("recipe", RecipeSchema);
