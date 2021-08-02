import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Alert from "../layout/Alert";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Recipes from "../recipes/Recipes";
import RecipeForm from "../recipes/RecipeForm";
import Recipe from "../recipes/Recipe";
import Planner from "../planner/Planner";

const Routes = () => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />

        <Route exact path="/recipes" component={Recipes} />
        <PrivateRoute exact path="/add-recipe" component={RecipeForm} />
        <Route exact path="/recipes/:id" component={Recipe} />
        <PrivateRoute exact path="/edit-recipe/:id" component={RecipeForm} />

        <PrivateRoute exact path="/planner" component={Planner} />
      </Switch>
    </section>
  );
};

export default Routes;
