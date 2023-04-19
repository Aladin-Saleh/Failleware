import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';


const Leaderboard = () => {


    const [rank, setRank] = useState("RankedChallengerSummoner");
    const [data, setData] = useState([]);
    const [queue, setQueue] = useState("RANKED_SOLO_5x5");


    const handleRefresh = (e) => {

        const rank = [];
        // get all rank from the select
        const select = document.getElementById('rank');
        for (let i = 0; i < select.length; i++) {
            rank.push(select[i].value);
        }

        rank.forEach((r) => {
            axios({
                method: 'GET',
                url: `http://172.27.96.148:5000/api/riot/leagues/I/RANKED_SOLO_5x5/${r}/1?region=euw1`
            })
            .then((res) => {
                console.log(res.data);
            })
        });
        // Reload the page
        window.location.reload();

    }

    const handleProfil = (e) => {
        const id = e.target.id;
        console.log(id);
    };


    const handleRank = (e) => {

        // http://localhost:5000/api/fiware/types/:type/attrs/:attr/param/:value

        const rank = e.target.value;

        const getLeaderboard = async () => {
            const data = await axios({
                method: 'GET',
                url:   `http://localhost:5000/api/fiware/types/RankedSummoner/attrs/tier/param/${rank}&limit=100`
            })
            .then((res) => {
                const container = [];
                console.log(res.data.data);
                res.data.data.forEach((element) => {
                    container.push(
                        <tr key={element.summonerId.value} id={element.summonerId.value} onClick={handleProfil}>
                            <td id={element.summonerId.value}>{element.summonerName.value}</td>
                            <td id={element.summonerId.value}>{element.leaguePoints.value}</td>
                            <td id={element.summonerId.value}>{element.wins.value}</td>
                            <td id={element.summonerId.value}>{element.losses.value}</td>
                        </tr>
                    )
                });
                // sort by league points
                container.sort((a, b) => {
                    return b.props.children[1].props.children - a.props.children[1].props.children;
                });
                setData(container);
            })
        };

        getLeaderboard();
    };


    const handleQueue = (e) => {};

    useEffect(() => {

        const getLeaderboard = async () => {
            const data = await axios({
                method: 'GET',
                url: `http://172.27.96.148:5000/api/fiware/${rank}&limit=100`
            })
            .then((res) => {
                const container = [];
                console.log(res.data.data);
                res.data.data.forEach((element) => {
                    container.push(
                        <tr key={element.summonerId.value} id={element.summonerId.value} onClick={handleProfil}>
                            <td id={element.summonerId.value}>{element.summonerName.value}</td>
                            <td id={element.summonerId.value}>{element.leaguePoints.value}</td>
                            <td id={element.summonerId.value}>{element.wins.value}</td>
                            <td id={element.summonerId.value}>{element.losses.value}</td>
                        </tr>
                    )
                });
                // sort by league points
                container.sort((a, b) => {
                    return b.props.children[1].props.children - a.props.children[1].props.children;
                });
                setData(container);
            })
        };

        getLeaderboard();

    }, []);




    return (
        <div className='board'>
            <h1>Leaderboard</h1>
            <div className="option">
            <button type='submit' onClick={handleRefresh}>Actualiser les données</button>

            <label htmlFor="rank">Rank</label>
            <select name="rank" id="rank" onChange={handleRank}>
                <option value="RankedChallengerSummoner">Challenger</option>
                <option value="RankedGrandmasterSummoner">Grandmaster</option>
                <option value="DIAMOND">Diamond</option>
                <option value="PLATINUM">Platinum</option>
                <option value="GOLD">Gold</option>
                <option value="SILVER">Silver</option>
                <option value="BRONZE">Bronze</option>
                <option value="IRON">Les plouks</option>
            </select>

            {/* <label htmlFor="queue">Queue</label>
            <select name="queue" id="queue">
                <option value="RANKED_SOLO_5x5">Solo/Duo</option>
                <option value="RANKED_FLEX_SR">Flex</option>
            </select> */}

            </div>
            <table>
                <thead>
                    <tr>
                        <th>Summoner Name</th>
                        <th>League Points</th>
                        <th>Wins</th>
                        <th>Losses</th>
                    </tr>
                </thead>
                <tbody>
                    {data}
                </tbody>

            </table>

        </div>
    );
};

export default Leaderboard;