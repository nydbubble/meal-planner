import { Link } from "react-router-dom";

export const RecipeCard = ({ recipe: { _id, title } }) => {
  return (
    <div className="recipe-card">
      <Link to={`/recipes/${_id}`}>
        <img
          alt=""
          src="https://www.simplyrecipes.com/thmb/L5NZQ7OsDodmvvITXy0nloyHx_M=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2006__09__Garlic-Bread-LEAD-2b-24b3ef3eb22647f4b9e57340b8dbe50a.jpg"
        />
      </Link>
      <div className="p-1">
        <Link to={`/recipes/${_id}`}>{title}</Link>
      </div>
    </div>
  );
};
