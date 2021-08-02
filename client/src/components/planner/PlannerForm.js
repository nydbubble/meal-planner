import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import dayjs from "dayjs";

import { addMeal, editMeal } from "../../actions/meal";

const PlannerForm = ({ meal, addMeal, editMeal }) => {
  const orderName = ["breakfast", "lunch", "dinner"];
  const [formData, setFormData] = useState({
    recipe_name: "",
    date: dayjs(),
    order: "",
    servings: "",
    groceries: [],
  });

  useEffect(() => {
    setFormData({
      ...meal,
      date: meal.date,
    });
  }, [meal]);

  const { recipe_id, recipe_name, date, order, servings, groceries } = formData;

  const onChange = (e) => {
    console.log(e.target.name);
    if (e.target.name === "servings") {
      if (e.target.value < 1) return false;
      setFormData({
        ...formData,
        groceries: groceries.map((grocery) => ({
          ...grocery,
          amount: (grocery.amount * e.target.value) / servings,
        })),
        [e.target.name]: e.target.value,
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onChangeGrocery = (e, i) => {
    const groceriesList = groceries;
    groceriesList[i][e.target.name] = e.target.value;
    setFormData({ ...formData, groceries: groceriesList });
  };

  const addGrocery = () => {
    const groceriesList = groceries;
    groceriesList.push({
      name: "",
      amount: "",
      unit: "",
    });
    setFormData({ ...formData, groceries: groceriesList });
  };

  const deleteGrocery = (i) => {
    const groceriesList = groceries;
    groceriesList.splice(i, 1);
    setFormData({ ...formData, groceries: groceriesList });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (formData._id) {
      editMeal(formData);
    } else addMeal(formData);
  };

  return (
    <Fragment>
      <h4>
        <Link to={`/recipes/${recipe_id}`}>
          {recipe_name.charAt(0).toUpperCase() + recipe_name.slice(1)}
        </Link>{" "}
        for {orderName[order]} at {date.format("ddd, DD MMM YYYY")}
      </h4>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <h4>Servings</h4>
          <input
            type="number"
            name="servings"
            value={servings}
            onChange={onChange}
            placeholder="Servings"
          />
        </div>

        <div className="line"></div>
        <h3 className="">Groceries</h3>

        <button
          onClick={addGrocery}
          type="button"
          className="btn btn-light my-1"
        >
          Add groceries
        </button>
        {groceries.length > 0 &&
          groceries.map((grocery, i) => (
            <Fragment key={i}>
              <div className="form-meal-grid bg-white my-1">
                <div className="form-grid-group ingredient-delete-item">
                  <button
                    type="button"
                    onClick={() => deleteGrocery(i)}
                    className="btn btn-danger"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="form-grid-group ingredient">
                  <input
                    type="text"
                    name="name"
                    value={grocery.name}
                    onChange={(e) => onChangeGrocery(e, i)}
                    placeholder="Ingredient"
                  />
                </div>
                <div className="form-grid-group">
                  <input
                    type="number"
                    name="amount"
                    value={grocery.amount}
                    onChange={(e) => onChangeGrocery(e, i)}
                    placeholder="Amount"
                  />
                </div>
                <div className="form-grid-group">
                  <input
                    type="text"
                    name="unit"
                    value={grocery.unit}
                    onChange={(e) => onChangeGrocery(e, i)}
                    placeholder="Unit"
                  />
                </div>
              </div>
            </Fragment>
          ))}
        <div className="form-group">
          <input
            type="submit"
            value="Submit"
            className="btn btn-primary my-1"
          />
        </div>
      </form>
    </Fragment>
  );
};

export default connect(null, { addMeal, editMeal })(PlannerForm);
