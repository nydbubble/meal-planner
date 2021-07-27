import { Link } from "react-router-dom";

export const RecipeCard = ({ recipe: { _id, title, image } }) => {
  return (
    <div className="recipe-card">
      <Link to={`/recipes/${_id}`}>
        <img alt="" src={image} />
      </Link>
      <div className="p-1">
        <Link to={`/recipes/${_id}`}>{title}</Link>
      </div>
    </div>
  );
};
