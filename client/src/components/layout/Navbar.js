import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";

const Navbar = ({ logout, auth: { loading, isAuthenticated } }) => {
  const privateRoutes = (
    <ul>
      <li>
        <Link to="/recipes">Recipes</Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          Logout
        </a>
      </li>
    </ul>
  );

  const guestRoutes = (
    <ul>
      <li>
        <Link to="/recipes">Recipes</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">Planner</Link>
      </h1>
      <Fragment>
        {!loading && isAuthenticated ? privateRoutes : guestRoutes}
      </Fragment>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
