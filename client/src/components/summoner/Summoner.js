import React from 'react';
import { NavLink } from "react-router-dom";

const Summoner = ({summoner}) => {
  console.log("Summoner = "+ summoner);
  const profile_url = `/profile/${summoner.name.value}`
    return (
        <div className='summoner-container'>
          <NavLink to={profile_url}> {summoner.name.value} </NavLink>
        </div>
      );
};

export default Summoner;