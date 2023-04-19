import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearch(event) {
    setSearchTerm(event.target.value);
    console.log(event.target.value);
    axios
    .get(`http://127.0.0.1:5000/api/fiware/summoner/${event.target.value}`)
    .then(response => console.log(response.data))
    .catch(error => console.log(error));
  }


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

        <li className="right"> 
            <input type="button"  value="Connexion" />
        </li>

        <li className="right">
            <input type="text" placeholder="Search a summoner..." value={searchTerm} onChange={handleSearch}/>
        </li>

      </ul>
    </div>
  );
};

export default NavBar;
