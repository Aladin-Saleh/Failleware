import React, { useState } from 'react';
import { NavLink } from "react-router-dom";

const NavBar = () => {
  
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearch(event) {
    setSearchTerm(event.target.value);
    axios
    .get(`http://127.0.0.1:5000/api/fiware/${searchTerm}?type=Summoner`)
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

        <input type="button"  value="Connexion" className="right"/>

        <input type="text" placeholder="Search a summoner..." className="right" value={searchTerm} onChange={handleSearch}/>

      </ul>
    </div>
  );
};

export default NavBar;
