import { Fragment, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { deleteRecipe } from "../../actions/recipe";
import axios from "axios";
import dayjs from "dayjs";

import Loading from "../layout/Loading";

const Recipe = ({ auth, match, deleteRecipe }) => {
  const initialState = {
    title: "",
    description: "",
    servings: "",
    instructions: [],
    ingredients: [],
    user: {},
    createdDate: "",
    updatedDate: "",
  };
  const [recipe, setRecipe] = useState(initialState);

  const [loading, setLoading] = useState(true);

  const getRecipe = async (match) => {
    try {
      const res = await axios.get(`/api/recipes/${match.params.id}`);
      setRecipe(res.data);
      setLoading(false);
    } catch (err) {
      setRecipe(initialState);
      setLoading(false);
      return <Redirect to="/recipes" />;
    }
  };

  useEffect(() => {
    getRecipe(match);
  }, [match, loading]);

  const {
    title,
    description,
    servings,
    instructions,
    ingredients,
    user,
    createdDate,
    updatedDate,
  } = recipe;

  const delRecipe = async () => {
    deleteRecipe(match.params.id);
    setRecipe(null);
  };

  const changeServings = (e) => {
    if (e.target.value > 0) {
      const ingredientsList = ingredients.map((ingredient) => ({
        ...ingredient,
        amount: (ingredient.amount * e.target.value) / servings,
      }));
      setRecipe({
        ...recipe,
        servings: e.target.value,
        ingredients: ingredientsList,
      });
    }
  };

  return (
    <Fragment>
      {recipe && !loading ? (
        <Fragment>
          {!auth.loading && auth.isAuthenticated && auth.user._id === user._id && (
            <Fragment>
              <Link
                to={`/edit-recipe/${recipe._id}`}
                className="btn btn-dark my-1"
              >
                Edit recipe
              </Link>
              <div onClick={delRecipe} className="btn btn-danger my-1">
                Delete recipe
              </div>
            </Fragment>
          )}
          <div className="recipe-grid my-1">
            <div className="recipe-top bg-primary p-1">
              <h1 className="large">{title}</h1>
              <p>{description}</p>
              <div className="my-1"></div>
              <input
                type="number"
                value={servings}
                onChange={changeServings}
              ></input>{" "}
              serving{servings > 1 && "s"}
            </div>

            <div className="recipe-image bg-primary p-2">
              <img
                alt={title}
                src="https://www.simplyrecipes.com/thmb/L5NZQ7OsDodmvvITXy0nloyHx_M=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2006__09__Garlic-Bread-LEAD-2b-24b3ef3eb22647f4b9e57340b8dbe50a.jpg"
              />
              {/* <Link to="/add-plan" className="btn btn-dark my-1">
                Add to planner
              </Link> */}
            </div>

            <div className="recipe-ingredients bg-white p-2">
              <h2 className="text-primary">Ingredients</h2>
              <ul className="ingredients">
                {ingredients && ingredients.length > 0
                  ? ingredients.map(({ _id, amount, unit, name, notes }) => (
                      <li key={_id}>
                        {amount} {unit} {name} {notes && <small>{notes}</small>}
                      </li>
                    ))
                  : ""}
              </ul>
            </div>

            <div className="recipe-instructions bg-white p-2">
              <h2 className="text-primary">Instructions</h2>
              <ol className="instructions">
                {instructions && instructions.length > 0
                  ? instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))
                  : ""}
              </ol>
            </div>
            <div className="recipe-about bg-light p-1">
              <p>
                Written by <strong>{user.name}</strong> on{" "}
                {dayjs(createdDate).format("ddd, DD MMM YYYY")}
              </p>
              <p>Updated on {dayjs(updatedDate).format("ddd, DD MMM YYYY")}</p>
            </div>
          </div>
        </Fragment>
      ) : (
        <Loading />
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteRecipe })(Recipe);
