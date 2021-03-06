import { Fragment } from "react";
import dayjs from "dayjs";
import WeeklyCalendarItem from "./WeeklyCalendarItem";

const WeeklyCalendar = ({ startDate, meals, onClick }) => {
  const week = [];
  for (let i = 0; i < 7; i++) {
    week.push(startDate.add(i, "day"));
  }

  return (
    <div className="plan-grid my-1">
      <div></div>
      {week.map((day) => (
        <Fragment key={day}>
          <div
            className={`bg-${
              dayjs().isSame(day, "day") ? "primary" : "dark"
            } p-1`}
          >
            {dayjs(day).format("ddd")}
          </div>
        </Fragment>
      ))}

      <div className="bg-dark p-1">Breakfast</div>
      {week.map((day) => (
        <Fragment key={day}>
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
        </Fragment>
      ))}

      <div className="bg-dark p-1">Lunch</div>
      {week.map((day) => (
        <Fragment key={day}>
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
        </Fragment>
      ))}

      <div className="bg-dark p-1">Dinner</div>
      {week.map((day) => (
        <Fragment key={day}>
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

export default WeeklyCalendar;
