import React from "react";
import { Link } from "react-router-dom";

const WeeklyCalendarItem = ({ meal, onClick }) => {
  return (
    <button type="button" onClick={onClick} className="btn btn-white">
      {meal ? (
        //<Link to={`/recipes/${meal.recipe_id}`}>{meal.recipe_name}</Link>
        <p onClick={onClick}>{meal.recipe_name}</p>
      ) : (
        <i onClick={onClick} className="fas fa-plus"></i>
      )}
    </button>
  );
};

export default WeeklyCalendarItem;
