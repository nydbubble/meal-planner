const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const Meal = require("../models/Meal");
const Recipe = require("../models/Recipe");

// @route   GET api/meals/?start=YYYY-MM-DD&end=YYYY-MM-DD
// @desc    Get all meals of the user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const startDate = req.query.start && Date(req.query.start);
    const endDate = req.query.end && Date(req.query.end);
    if (endDate < startDate) {
      res
        .status(400)
        .json({ msg: "Start date needs to be earlier than end date." });
    }
    let meals;
    if (startDate && endDate) {
      meals = await Meal.find({
        user: req.user.id,
        date: { $gte: req.query.start, $lte: req.query.end },
      }).sort({ order: 1 });
    } else if (startDate) {
      console.log(startDate);
      meals = await Meal.find({
        user: req.user.id,
        date: { $gte: req.query.start },
      }).sort({ order: 1 });
    } else if (endDate) {
      meals = await Meal.find({
        user: req.user.id,
        date: { $lte: req.query.end },
      }).sort({ order: 1 });
    } else meals = await Meal.find({ user: req.user.id }).sort({ order: 1 });

    if (meals.length === 0) {
      return res
        .status(404)
        .json({ msg: "User does not have any meals planned." });
    }

    res.json(meals);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route   GET api/meals/:meal_id
// @desc    Get meal by ID
// @access  Private
router.get("/:meal_id", auth, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.meal_id);

    if (!meal) {
      return res.status(404).json({ msg: "Meal not found" });
    }

    res.json(meal);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route   POST api/meals
// @desc    Add meal
// @access  Private
router.post(
  "/",
  auth,
  check("date", "Date is required").notEmpty(),
  check("order", "Meal order is required"),
  check("recipe_name", "Recipe name is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { recipe_id, recipe_name, ...rest } = req.body;

      let recipe;
      if (recipe_id) {
        recipe = await Recipe.findById(recipe_id);
      } else if (recipe_name) {
        recipe = await Recipe.find({ $text: { $search: recipe_name } }).limit(
          1
        );
        recipe = recipe[0];
      }

      // let ingredients;
      // if (recipe && recipe.ingredients) {
      //   if (recipe.servings !== servings) {
      //     ingredients = recipe.ingredients.map((ingredient) => {
      //       ingredient.amount =
      //         (ingredient.amount * servings) / recipe.servings;
      //       return ingredient;
      //     });
      //     // console.log(ingredients);
      //   } else {
      //     ingredients = recipe.ingredients;
      //   }
      // }

      const mealFields = {
        user: req.user.id,
        recipe_id: recipe ? recipe._id : null,
        recipe_name: recipe ? recipe.title : recipe_name,
        // groceries:
        //   recipe && groceries
        //     ? groceries.concat(ingredients)
        //     : recipe
        //     ? ingredients
        //     : groceries,
        ...rest,
      };

      const meal = new Meal(mealFields);
      await meal.save();

      res.json(meal);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/meals/:recipe_id
// @desc    Edit meal plan
// @access  Private
router.put(
  "/:meal_id",
  auth,
  check("date", "Date is required").notEmpty(),
  check("order", "Meal type is required"),
  check("recipe_name", "Recipe name is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let meal = await Meal.findById(req.params.meal_id);

      if (!meal) {
        return res.status(404).json({ msg: "Meal not found." });
      }

      if (meal.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized." });
      }

      const { recipe_id, recipe_name, ...rest } = req.body;

      let recipe;
      if (recipe_id) {
        recipe = await Recipe.findById(recipe_id);
      } else if (recipe_name) {
        recipe = await Recipe.find({ $text: { $search: recipe_name } }).limit(
          1
        );
        recipe = recipe[0];
      }

      // let ingredients;
      // if (recipe && recipe.ingredients) {
      //   if (recipe.servings !== servings) {
      //     console.log(recipe.servings.type);
      //     console.log(servings.type);
      //     ingredients = recipe.ingredients.map((ingredient) => {
      //       ingredient.amount =
      //         (ingredient.amount * servings) / recipe.servings;
      //       return ingredient;
      //     });
      //     // console.log(ingredients);
      //   } else {
      //     ingredients = recipe.ingredients;
      //   }
      // }

      const mealFields = {
        //        user: req.user.id,
        recipe_id: recipe ? recipe._id : null,
        recipe_name: recipe ? recipe.title : recipe_name,
        //        groceries: groceries,
        // recipe && groceries
        //   ? groceries.concat(ingredients)
        //   : recipe
        //   ? ingredients
        //   : groceries,
        // servings,
        ...rest,
      };

      //      const meal = await Meal.findByIdAndUpdate(req.params.meal_id, mealFields);

      await meal.update(mealFields);

      res.json(meal);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/meals/:meal_id
// @desc    Delete meal plan
// @access  Private
router.delete("/:meal_id", auth, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.meal_id);

    if (meal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User is not authorized." });
    }
    await meal.remove();

    res.json({ msg: "Meal plan successfully deleted." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  GET api/meals/groceries?start=YYYY-MM-DD&end=YYYY-MM-DD
//@desc   Get groceries of the user
//@access Private
router.get("/groceries", auth, async (req, res) => {
  const startDate = req.query.start && Date(req.query.start);
  const endDate = req.query.end && Date(req.query.end);
  if (endDate < startDate) {
    res
      .status(400)
      .json({ msg: "Start date needs to be earlier than end date." });
  }

  try {
    let groceriesList;
    if (startDate && endDate) {
      groceriesList = await Meal.find({
        user: req.user.id,
        date: { $gte: req.query.start, $lte: req.query.end },
      }).select("groceries");
    } else if (startDate) {
      console.log(startDate);
      groceriesList = await Meal.find({
        user: req.user.id,
        date: { $gte: req.query.start },
      }).select("groceries");
    } else if (endDate) {
      groceriesList = await Meal.find({
        user: req.user.id,
        date: { $lte: req.query.end },
      }).select("groceries");
    } else
      groceriesList = await Meal.find({ user: req.user.id }).select(
        "groceries"
      );

    // const groceriesList = await Meal.find({ user: req.user.id }).select(
    //   "groceries"
    // );
    if (groceriesList.length === 0) {
      return res.status(404).json({ msg: "No groceries for this user." });
    }
    console.log(groceriesList);

    let finalGroceriesList = [];

    groceriesList.map((item) => {
      console.log(item.groceries);
      finalGroceriesList.push(...item.groceries);
    });

    res.json(finalGroceriesList);
  } catch (err) {
    console.log("halo");
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
