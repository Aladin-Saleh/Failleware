import React, { useState } from 'react';

const Search = () => {

  return (
    <div className='search-container'>
        <form>
            <label for="region-select">Region:</label>
            
            <select name="regions" id="region-select">
                <option value="EUW">--EUW--</option>
                <option value="EUW">EUW</option>
                <option value="EUNE">EUNE</option>
                <option value="NA">NA</option>
                <option value="OCE">OCE</option>
            </select>

            <input type="text" placeholder="Search a summoner..." />
        </form>
    </div>
  );
};

export default Search;
