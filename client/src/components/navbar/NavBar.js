import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const [summonerList, setSummonerList] = useState('');

  function handleSearch(event) {
    event.preventDefault(); // Empeche le rechargement de la page
    axios({
        method: 'get',
        url: `http://localhost:5000/api/fiware/summoner/${event.target.value}`
    })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    })
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
            <input type="text" placeholder="Search a summoner..." onChange={handleSearch}/>
        </li>
      </ul>
      <p>{summonerList}</p>
    </div>
  );
};

export default NavBar;
