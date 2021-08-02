import React from "react";

const WeeklyCalendarItem = ({ meal, onClick }) => {
  return (
    <button type="button" onClick={onClick} className="btn btn-white">
      {meal ? (
        <p onClick={onClick}>{meal.recipe_name}</p>
      ) : (
        <i onClick={onClick} className="fas fa-plus"></i>
      )}
    </button>
  );
};

export default WeeklyCalendarItem;
