import { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import WeeklyCalendar from "./WeeklyCalendar";
import RecipeList from "./RecipeList";
import { getRecipes } from "../../actions/recipe";
import { getMeals, addMeal } from "../../actions/meal";

const Planner = ({ recipes, getRecipes, getMeals, meals }) => {
  // const [meals, setMeals] = useState({
  //   meals: [],
  // });
  dayjs.extend(isBetween);

  const [groceries, setGroceries] = useState({
    groceries: [],
  });

  const startDay = dayjs().day() === 0 ? 7 : dayjs().day();
  const firstDayofWeek = dayjs().date() - startDay + 1;

  const [startDate, setStartDate] = useState(dayjs().date(firstDayofWeek));

  const [recipeList, setRecipeList] = useState(false);
  const [mealId, setMealId] = useState({
    date: "",
    order: "",
  });

  const { date, order } = mealId;

  // const getMeals = async () => {
  //   try {
  //     const res = await axios.get(
  //       `/api/meals/?start=${startDate.format("YYYY-MM-DD")}&end=${startDate
  //         .add(6, "day")
  //         .format("YYYY-MM-DD")}`
  //     );
  //     const groceriesList = [];
  //     const meals = res.data.map((item) => {
  //       groceriesList.push(...item.groceries);
  //       return {
  //         ...item,
  //         date: dayjs(item.date),
  //       };
  //     });
  //     setGroceries(groceriesList);
  //     setMeals(meals);
  //   } catch (err) {
  //     console.error(err);
  //     setGroceries([]);
  //     setMeals([]);
  //   }
  // };

  // const getGroceries = async () => {
  //   try {
  //     const res = await axios.get(
  //       `/api/meals/groceries/?start=${startDate.format(
  //         "YYYY-MM-DD"
  //       )}&end=${startDate.add(6, "day").format("YYYY-MM-DD")}`
  //     );
  //     setGroceries(res.data);
  //   } catch (err) {
  //     //console.error(err);
  //     setGroceries([]);
  //   }
  // };

  useEffect(() => {
    getMeals();
  }, []);

  useEffect(() => {
    //getMeals();
    //getGroceries();
    let groceriesList = [];
    meals
      .filter((meal) =>
        meal.date.isBetween(startDate, startDate.add(6, "day"), "date", "[]")
      )
      .map((meal) => groceriesList.push(...meal.groceries));
    setGroceries(groceriesList);
    setRecipeList(false);
  }, [meals, startDate]);

  const changePrevWeek = () => {
    setStartDate(startDate.subtract(7, "day"));
  };
  const changeNextWeek = () => setStartDate(startDate.add(7, "day"));

  const openRecipeList = (date, order) => {
    setRecipeList(true);
    setMealId({ date, order });
  };

  const closeRecipeList = () => {
    setRecipeList(false);
    setMealId({
      date: "",
      order: "",
    });
  };

  // const addToMealPlan = async (recipe_name, recipe_id) => {
  //   const config = { headers: { "Content-Type": "application/json" } };
  //   const meal = {
  //     recipe_id,
  //     recipe_name,
  //     date: date.toDate(),
  //     order,
  //   };
  //   const body = JSON.stringify(meal);
  //   try {
  //     const res = await axios.post(`/api/meals/`, body, config);
  //     getMeals();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  return (
    <Fragment>
      <h1 className="large text-primary">Meal Planner</h1>
      <p className="lead">Plan your meals every week!</p>
      <div className="planner-container">
        <div className="planner-calendar bg-white p-1">
          <h3>Meal Plan</h3>
          <p>
            Week of {startDate.format("DD MMMM YYYY")}
            {"   "}
            <i
              onClick={changePrevWeek}
              className="fas fa-chevron-left btn btn-light"
            ></i>
            <i
              onClick={changeNextWeek}
              className="fas fa-chevron-right btn btn-light"
            ></i>
          </p>
          <WeeklyCalendar
            startDate={startDate}
            meals={meals}
            onClick={openRecipeList}
          />
        </div>

        {recipeList && (
          <RecipeList recipeList={closeRecipeList} date={date} order={order} />
        )}

        {!recipeList && (
          <div className="planner-groceries bg-white p-1">
            <h3>Groceries List</h3>
            <ul>
              {groceries.length > 0 &&
                groceries.map((grocery, i) => (
                  <li key={i}>
                    <input type="checkbox" id={grocery._id} />
                    <label htmlFor={grocery._id}>
                      <strong>{grocery.name}</strong> ({grocery.amount}{" "}
                      {grocery.unit})
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </Fragment>
  );
};

Planner.propTypes = {};

const mapStateToProps = (state) => ({
  recipes: state.recipe.recipes,
  meals: state.meal.meals,
});

export default connect(mapStateToProps, { getRecipes, getMeals, addMeal })(
  Planner
);
