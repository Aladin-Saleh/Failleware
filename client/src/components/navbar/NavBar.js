import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="nav-bar">
      <ul>
        <li>
          <NavLink to="/"> Home </NavLink>
        </li>

        <li>
            <NavLink to="/board"> Leaderboard </NavLink>
        </li>

        <li>
            <NavLink to="/stats"> Statistiques </NavLink>
        </li>

        <input type="button"  value="Connexion" className="right"/>

        <input type="text" placeholder="Search..." className="right"/>

      </ul>
    </div>
  );
};

export default NavBar;
