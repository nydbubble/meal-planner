import { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PlannerForm from "./PlannerForm";
import dayjs from "dayjs";

import { deleteMeal } from "../../actions/meal";
import { getRecipes } from "../../actions/recipe";
import Loading from "../layout/Loading";

const RecipeList = ({
  meals: { meals, loading },
  recipeList,
  recipes,
  date,
  order,
  deleteMeal,
  getRecipes,
}) => {
  const [editID, setEditID] = useState(null);

  const [meal, setMeal] = useState(null);

  useEffect(() => {
    if (recipes.length === 0) getRecipes();
  }, []);

  useEffect(() => {
    console.log(meals);
    if (!loading) {
      const foundMeal = meals.find(
        (meal) => meal.date.isSame(date, "date") && meal.order === order
      );
      if (foundMeal) {
        foundMeal.date = dayjs(foundMeal.date);
        setMeal(foundMeal);
        setEditID(foundMeal._id);
      } else {
        setMeal(null);
        setEditID(null);
      }
    } else {
      setMeal(null);
      setEditID(null);
    }
  }, [loading, date, order, meals]);

  const createMeal = (recipe) => {
    setMeal({
      _id: editID,
      recipe_id: recipe._id,
      recipe_name: recipe.title,
      date,
      order,
      groceries: recipe.ingredientsList
        .map(({ ingredients }) =>
          ingredients.map((ingredient) => ({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
          }))
        )
        .flat(),
      servings: recipe.servings,
    });
  };

  console.log(meal);

  return (
    <div className="recipe-list bg-white p-1" style={{ display: "block" }}>
      <h3>
        <i
          onClick={() => recipeList(false)}
          className="btn btn-danger fas fa-times"
        ></i>
        {"   "}
        {!editID ? "Choose Recipe" : "Edit Meal"}
      </h3>
      {loading ? (
        <Loading />
      ) : meal ? (
        <Fragment>
          <button
            type="button"
            onClick={() => setMeal(null)}
            className="btn btn-light my-1"
          >
            Change Recipe
          </button>
          {editID && (
            <button
              type="button"
              onClick={async () => deleteMeal(editID)}
              className="btn btn-danger my-1"
            >
              Delete plan
            </button>
          )}

          <PlannerForm meal={meal} />
        </Fragment>
      ) : (
        recipes.length > 0 &&
        recipes.map((recipe) => (
          <div
            key={recipe._id}
            onClick={() => {
              createMeal(recipe);
            }}
            className="recipe-list-container"
          >
            <div className="recipe-list-image">
              <img alt={recipe.title} src={recipe.image} />
            </div>
            <div className="recipe-list-content">
              <h4 className="recipe-list-title">{recipe.title}</h4>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  recipes: state.recipe.recipes,
  meals: state.meal,
});

export default connect(mapStateToProps, { getRecipes, deleteMeal })(RecipeList);
