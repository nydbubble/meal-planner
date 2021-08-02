const auth = require("../middleware/auth");
const express = require("express");
const { check, validationResult } = require("express-validator");
const cloudinary = require("cloudinary");
const { unlink } = require("fs/promises");
const upload = require("../helpers/upload");
const router = express.Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");

//@route   GET api/recipes/?name=recipe_name
//@desc    Get all recipes
//@access  Public
router.get("/", async (req, res) => {
  try {
    let recipes;
    if (req.query.name) {
      recipes = await Recipe.find({
        $text: { $search: req.query.name },
      });
    } else recipes = await Recipe.find();

    if (recipes.length === 0) {
      return res.status(404).json({ msg: "No recipes found." });
    }

    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   GET api/recipes/:recipe_id
//@desc    Get recipe by recipe ID
//@access  Public
router.get("/:recipe_id", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.recipe_id });
    if (!recipe) {
      return res.status(404).json({ msg: "No recipe from this ID" });
    }
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  POST api/recipes
//@desc   Create a new recipe
//@access Private
router.post(
  "/",
  auth,
  upload.single("image"),
  check("title", "Title is required").notEmpty(),
  check("ingredientsList", "Ingredients are required").notEmpty(),
  check("instructions", "Instructions are required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      for (let key in req.body) {
        if (key === "image" && req.file) {
          continue;
        }
        req.body[key] = JSON.parse(req.body[key]);
      }

      const { servings, ingredientsList, instructions, image, ...rest } =
        req.body;

      let uploadedImage;
      if (req.file) {
        uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          tags: `${req.body.title}`,
        });
        await unlink(req.file.path);
      }

      const user = await User.findById(req.user.id).select("name");

      const recipeFields = {
        user,
        ingredientsList,
        servings: isNaN(parseInt(servings)) ? 2 : parseInt(servings),
        instructions: Array.isArray(instructions)
          ? instructions
          : instructions.split(/[\n+]/),
        image: uploadedImage ? uploadedImage.url : "",
        ...rest,
      };

      const recipe = new Recipe(recipeFields);

      await recipe.save();

      res.json(recipe);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@router PUT api/recipes/:recipe_id
//@desc   Edit recipe from recipe ID
//@access Private
router.put(
  "/:recipe_id",
  auth,

  upload.single("image"),
  check("title", "Title is required").notEmpty(),
  check("ingredientsList", "Ingredients are required").notEmpty(),
  check("instructions", "Instructions are required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const recipe = await Recipe.findById(req.params.recipe_id);
      if (recipe.user._id.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized." });
      }

      for (let key in req.body) {
        if (key === "image" && req.file) {
          continue;
        }
        req.body[key] = JSON.parse(req.body[key]);
      }

      const {
        servings,
        ingredientsList,
        instructions,
        updatedDate,
        image,
        ...rest
      } = req.body;

      let uploadedImage;
      if (req.file) {
        uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          tags: `${req.body.title}`,
        });
        await unlink(req.file.path);
      }

      const recipeFields = {
        ingredientsList,
        servings: isNaN(parseInt(servings)) ? 2 : parseInt(servings),
        instructions: Array.isArray(instructions)
          ? instructions
          : instructions.split(/[\n+]/),
        image: uploadedImage ? uploadedImage.url : image,
        updatedDate: Date.now(),
        ...rest,
      };

      await recipe.update(recipeFields);

      res.json(recipe);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@router DELETE api/recipes/:recipe_id
//@desc   Delete recipe by ID
//@access Private
router.delete("/:recipe_id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipe_id);

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    if (recipe.user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await recipe.remove();

    res.json({ msg: "Recipe removed" });
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

module.exports = router;
