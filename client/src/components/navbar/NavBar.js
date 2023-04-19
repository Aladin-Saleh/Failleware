import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import axios from "axios";

import Summoner from '../summoner/Summoner';
import SearchBar from '../searchbar/SearchBar';

const NavBar = () => {
  const [summonerList, setSummonerList] = useState([]);
  
  const onSearchSubmit = async term => {
    const res = await axios({
      method: 'get',
      url: `http://localhost:5000/api/fiware/summoner/${term}`
    })
    .then((res) => {
        console.log(res);
        setSummonerList(res.data.data);
    })
    .catch((err) => {
        console.log(err);
    })
    
  };

  const clearResults = () => setSummonerList([]);

  const renderedSummoners = summonerList.map((summoner, i) => {
    return <Summoner summoner={summoner} key={i} />
  })

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
            <input type="button" value="Connexion" />
        </li>

        <li className="right">
          <SearchBar onSearchSubmit={onSearchSubmit} clearResults={clearResults}/>
          <div className='renderedSummoners'>
            {renderedSummoners}
          </div>
        </li>

      </ul>
    </div>
  );
};

export default NavBar;
