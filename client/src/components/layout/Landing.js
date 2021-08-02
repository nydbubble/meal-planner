import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/planner" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Meal Planner</h1>
          <p className="lead">
            Share recipes and plan your meals for the week. Groceries list will
            be added based on recipe ingredients.
          </p>
          <div className="buttons">
            <Link className="btn btn-primary" to="/register">
              Sign Up
            </Link>
            <Link className="btn" to="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
