import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getRecipes } from "../../actions/recipe";
import { RecipeCard } from "./RecipeCard";
import Loading from "../layout/Loading";

const Recipes = ({ auth, getRecipes, recipe: { recipes, loading } }) => {
  useEffect(() => {
    if (recipes.length === 0) getRecipes();
  }, [getRecipes]);

  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Recipes</h1>
          {auth.user && (
            <Link to="/add-recipe" className="btn btn-light my-1">
              Add recipe
            </Link>
          )}
          {recipes.length > 0 ? (
            <div className="recipes">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p>No recipes found.</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

Recipes.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.auth,
  recipe: state.recipe,
});

export default connect(mapStateToProps, { getRecipes })(Recipes);
