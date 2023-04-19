import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [summonerList, setSummonerList] = useState('');

  function handleSearch(event) {
    setSearchTerm(event.target.value);
    console.log(event.target.value);
    axios
    .get(`http://172.24.9.146:5000/api/fiware/summoner/${event.target.value}`)
    .then(response => {setSummonerList(repsonse.data);})
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
      <p>{summonerList}</p>
    </div>
  );
};

export default NavBar;
