import { Fragment } from "react";
import dayjs from "dayjs";
import WeeklyCalendarItem from "./WeeklyCalendarItem";

const WeeklyCalendarList = ({ startDate, meals, onClick }) => {
  const week = [];
  for (let i = 0; i < 7; i++) {
    week.push(startDate.add(i, "day"));
  }

  return (
    <div className="plan-list my-1">
      <div></div>
      {week.map((day) => (
        <Fragment key={day}>
          <div
            className={`bg-${
              dayjs().isSame(day, "day") ? "primary" : "dark"
            } p-1 plan-list-day`}
          >
            {dayjs(day).format("ddd")}
          </div>

          <div className="bg-dark p-1">Breakfast</div>
          <WeeklyCalendarItem
            onClick={() => onClick(dayjs(day), 0)}
            meal={
              meals.length > 0 &&
              meals.find(
                (meal) =>
                  dayjs(meal.date).isSame(day, "day") && meal.order === 0
              )
            }
          />

          <div className="bg-dark p-1">Lunch</div>
          <WeeklyCalendarItem
            onClick={() => onClick(dayjs(day), 1)}
            meal={
              meals.length > 0 &&
              meals.find(
                (meal) =>
                  dayjs(meal.date).isSame(day, "day") && meal.order === 1
              )
            }
          />

          <div className="bg-dark p-1">Dinner</div>
          <WeeklyCalendarItem
            onClick={() => onClick(dayjs(day), 2)}
            meal={
              meals.length > 0 &&
              meals.find(
                (meal) =>
                  dayjs(meal.date).isSame(day, "day") && meal.order === 2
              )
            }
          />
        </Fragment>
      ))}
    </div>
  );
};

export default WeeklyCalendarList;
