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
    ingredientsList: [],
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
      setRecipe(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecipe(match);
  }, [match, loading]);

  if (!recipe) {
    return <p>Recipe not found</p>;
  }

  const {
    title,
    description,
    servings,
    image,
    instructions,
    ingredientsList,
    user,
    createdDate,
    updatedDate,
  } = recipe;

  const delRecipe = async () => {
    deleteRecipe(match.params.id);
    //setRecipe(null);
    return <Redirect to="/recipes" />;
  };

  const changeServings = (e) => {
    if (e.target.value > 0) {
      const ingredientslist = ingredientsList.map((section) => {
        section.ingredients = section.ingredients.map((ingredient) => ({
          ...ingredient,
          amount: (ingredient.amount * e.target.value) / servings,
        }));
        return section;
      });
      setRecipe({
        ...recipe,
        servings: e.target.value,
        ingredientsList: ingredientslist,
      });
    }
  };

  return (
    <Fragment>
      {!loading ? (
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
              <img alt={title} src={image} />
              {/* <Link to="/add-plan" className="btn btn-dark my-1">
                Add to planner
              </Link> */}
            </div>

            <div className="recipe-ingredients bg-white p-2">
              <h2 className="text-primary">Ingredients</h2>
              {ingredientsList.length > 0 &&
                ingredientsList.map(({ section, ingredients }) => (
                  <Fragment>
                    <h3>{section}</h3>

                    <ul className="ingredients">
                      {ingredients.length > 0 &&
                        ingredients.map(
                          ({ _id, amount, unit, name, notes }) => (
                            <li key={_id}>
                              {amount} {unit} {name}{" "}
                              {notes && <small>{notes}</small>}
                            </li>
                          )
                        )}
                    </ul>
                  </Fragment>
                ))}
              {/* {ingredients && ingredients.length > 0
                  ? ingredients.map(({ _id, amount, unit, name, notes }) => (
                      <li key={_id}>
                        {amount} {unit} {name} {notes && <small>{notes}</small>}
                      </li>
                    ))
                  : ""} */}
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
