import { Fragment, useEffect, useState, useLayoutEffect } from "react";
import { connect } from "react-redux";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import WeeklyCalendar from "./WeeklyCalendar";
import RecipeList from "./RecipeList";
import { getRecipes } from "../../actions/recipe";
import { getMeals, addMeal } from "../../actions/meal";
import WeeklyCalendarList from "./WeeklyCalendarList";

const Planner = ({ getMeals, meals }) => {
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

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    getMeals();
  }, []);

  useEffect(() => {
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

  return (
    <Fragment>
      <h1 className="large text-primary">Meal Planner</h1>
      <p className="lead">Plan your meals every week!</p>
      <div className="planner-container">
        <div className="planner-calendar bg-white p-1">
          <h3>Meal Plan</h3>
          <p>
            <i
              onClick={changePrevWeek}
              className="fas fa-chevron-left btn btn-light"
            ></i>
            Week of {startDate.format("DD MMMM YYYY")}{" "}
            <i
              onClick={changeNextWeek}
              className="fas fa-chevron-right btn btn-light"
            ></i>
          </p>

          {dimensions.width > 765 ? (
            <WeeklyCalendar
              startDate={startDate}
              meals={meals}
              onClick={openRecipeList}
            />
          ) : (
            <WeeklyCalendarList
              startDate={startDate}
              meals={meals}
              onClick={openRecipeList}
            />
          )}
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

const mapStateToProps = (state) => ({
  recipes: state.recipe.recipes,
  meals: state.meal.meals,
});

export default connect(mapStateToProps, { getRecipes, getMeals, addMeal })(
  Planner
);
