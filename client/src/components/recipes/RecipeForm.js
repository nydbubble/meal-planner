import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouteMatch, Redirect } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";

import Loading from "../layout/Loading";
import { addRecipe, editRecipe } from "../../actions/recipe";

const RecipeForm = ({ auth, addRecipe, editRecipe, match }) => {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    servings: "",
    ingredientsList: [],
    instructions: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const addingRecipe = useRouteMatch("/add-recipe");

  const getRecipe = async (match) => {
    try {
      const res = await axios.get(`/api/recipes/${match.params.id}`);
      setFormData(res.data);
      setLoading(false);
    } catch (err) {
      setFormData(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!addingRecipe) getRecipe(match);
  }, [match, loading]);

  // useEffect(() => {
  //   if (!addingRecipe) {
  //     const fetchRecipe = async (match) => {
  //       const recipe = await getRecipe(match.params.id);
  //       console.log(recipe);
  //       setFormData({
  //         ...recipe,
  //         instructions: recipe.instructions.join("\n"),
  //       });
  //       //        setFormData(await getRecipe(match.params.id));
  //     };

  //     fetchRecipe(match);
  //   }
  // }, []);

  const { title, image, description, servings, ingredientsList, instructions } =
    formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeImage = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const onChangeIngredient = (e, sectionID, i) => {
    ingredientsList[sectionID]["ingredients"][i][e.target.name] =
      e.target.value;
    setFormData({ ...formData, ingredientsList });
    // const ingredientslist = ingredients;
    // ingredientslist[i][e.target.name] = e.target.value;
    // setFormData({ ...formData, ingredients: ingredientslist });
  };

  const addIngredient = (sectionID) => {
    ingredientsList[sectionID]["ingredients"].push({
      name: "",
      amount: "",
      unit: "",
      notes: "",
    });
    setFormData({ ...formData, ingredientsList });
    // const ingredientslist = ingredients;
    // ingredientslist.push({
    //   name: "",
    //   amount: "",
    //   unit: "",
    //   notes: "",
    // });
    // setFormData({ ...formData, ingredients: ingredientslist });
  };

  const deleteIngredient = (sectionID, i) => {
    ingredientsList[sectionID]["ingredients"].splice(i, 1);
    setFormData({ ...formData, ingredientsList });
    // const ingredientslist = ingredients;
    // ingredientslist.splice(i, 1);
    // setFormData({ ...formData, ingredients: ingredientslist });
  };

  const onChangeSection = (e, sectionID) => {
    ingredientsList[sectionID][e.target.name] = e.target.value;
    setFormData({ ...formData, ingredientsList });
  };

  const addSection = () => {
    ingredientsList.push({
      section: "",
      ingredients: [],
    });
    setFormData({ ...formData, ingredientsList });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    //console.log(formData);
    // const body = new FormData();
    // for (let key in formData) {
    //   if (key === "image" && typeof image !== "string") {
    //     body.append(key, formData[key]);
    //   } else body.append(key, JSON.stringify(formData[key]));
    // }
    try {
      addingRecipe
        ? addRecipe(formData)
        : editRecipe(match.params.id, formData);
      setFormSubmitted(true);
    } catch (err) {
      setFormSubmitted(false);
      throw err;
    }
  };

  return (
    <Fragment>
      {auth.loading ? (
        <Loading />
      ) : !addingRecipe &&
        formData.user &&
        formData.user._id.toString() !== auth.user._id ? (
        <p>Not authorized</p>
      ) : (
        <Fragment>
          {/* {formSubmitted && <Redirect to="/recipes" />} */}
          <h1 className="large text-primary">
            {addingRecipe ? "Add Recipe" : "Edit Recipe"}
          </h1>
          <p className="lead">
            {addingRecipe
              ? "Share your recipe to others!"
              : "Add some changes to your recipe."}
          </p>

          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                placeholder="* Recipe title"
              />
            </div>
            <div className="form-group">
              <h4>Image</h4>
              <input
                type="file"
                name="image"
                //value={image}
                onChange={onChangeImage}
                placeholder="Image"
              />
              {image && (
                <div className="recipe-image">
                  <img
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt=""
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <textarea
                placeholder="Description"
                name="description"
                value={description}
                onChange={onChange}
              ></textarea>
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Servings"
                name="servings"
                value={servings}
                onChange={onChange}
              />
            </div>

            <div className="line"></div>
            <h3 className="">Ingredients</h3>

            {ingredientsList.length > 0 &&
              ingredientsList.map(({ section, ingredients }, sectionID) => (
                <div className="bg-white p-1" key={`section_${sectionID}`}>
                  <button className="btn btn-danger" type="button">
                    Delete section
                  </button>

                  <div className="form-group">
                    <input
                      name="section"
                      value={section}
                      onChange={(e) => onChangeSection(e, sectionID)}
                      type="text"
                      placeholder="Section"
                    />
                  </div>

                  <div className="form-grid">
                    {ingredients.length > 0 &&
                      ingredients.map((ingredient, i) => (
                        <Fragment key={`ingredient_${i}`}>
                          <div className="form-grid-group ingredient-delete-item">
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteIngredient(sectionID, i)}
                              type="button"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          <div className="form-grid-group ingredient">
                            <input
                              type="text"
                              placeholder="Ingredient"
                              name="name"
                              value={ingredient.name}
                              onChange={(e) =>
                                onChangeIngredient(e, sectionID, i)
                              }
                            />
                          </div>
                          <div className="form-grid-group">
                            <input
                              type="number"
                              placeholder="Amount"
                              name="amount"
                              value={ingredient.amount}
                              onChange={(e) =>
                                onChangeIngredient(e, sectionID, i)
                              }
                            />
                          </div>
                          <div className="form-grid-group">
                            <input
                              type="text"
                              placeholder="Unit"
                              name="unit"
                              value={ingredient.unit}
                              onChange={(e) =>
                                onChangeIngredient(e, sectionID, i)
                              }
                            />
                          </div>
                          <div className="form-grid-group">
                            <input
                              type="text"
                              placeholder="Notes"
                              name="notes"
                              value={ingredient.notes}
                              onChange={(e) =>
                                onChangeIngredient(e, sectionID, i)
                              }
                            />
                          </div>
                        </Fragment>
                      ))}
                  </div>
                  <div className="form-group">
                    <button
                      type="button"
                      onClick={() => addIngredient(sectionID)}
                      className="btn btn-light my-1"
                    >
                      Add ingredient
                    </button>
                  </div>
                </div>
              ))}
            <button
              type="button"
              onClick={addSection}
              className="btn btn-light my-1"
            >
              Add section
            </button>

            <h3 className="my-1">Instructions</h3>
            <textarea
              name="instructions"
              rows="10"
              placeholder="Instructions"
              value={
                Array.isArray(instructions)
                  ? instructions.join("\n")
                  : instructions
              }
              onChange={onChange}
            ></textarea>
            <input
              type="submit"
              value="Submit"
              className="btn btn-primary my-1"
            />
          </form>
        </Fragment>
      )}
    </Fragment>
  );
};

RecipeForm.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addRecipe, editRecipe })(RecipeForm);
