import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';


const Profil = () => {

    // Get the id from the url
    const summonerName = window.location.href.split('/')[4].replace('%20', ' ');
    console.log(summonerName);


    const [top3, setTop3] = useState([]);
    const [matchHistory, setMatchHistory] = useState([]);
    const [summonerLevel, setSummonerLevel] = useState(0);
    const [score, setScore] = useState([]);
    const [killAverage, setKillAverage] = useState(0);
    const [deathAverage, setDeathAverage] = useState(0);
    const [assistAverage, setAssistAverage] = useState(0);

    useEffect(() => {


        // Get the summoner data by id
        const getSummoner = async () => {
            const data = await axios({
                method: 'GET',
                // http://172.27.96.148:5000/api/riot/summoner/:summonerName
                url: `http://localhost:5000/api/riot/summoner/${summonerName}`
            })
                .then((res) => {
                    // /masteries/:encryptedSummonerId
                    // console.log(res.data.data.entities[0].puuid.value);
                    console.log(res.data.data.entities[0].summonerLevel.value);
                    setSummonerLevel(res.data.data.entities[0].summonerLevel.value);
                    const encryptedSummonerId = res.data.data.entities[0].summonerId.value;
                    const summonerId = res.data.data.entities[0].puuid.value;
                    console.log(encryptedSummonerId);
                    console.log(summonerId);
                    getMastery(encryptedSummonerId);
                    getMatchHistory(summonerId);

                })
        };

        getSummoner();

    }, []);


    const getMastery = async (encryptedSummonerId) => {
        axios({
            method: 'GET',
            url: `http://localhost:5000/api/riot/masteries/${encryptedSummonerId}`
        }).then((res) => {
            const top3 = res.data.masteries.slice(0, 3);
            // console.log(top3);
            const container = [];
            top3.forEach((element) => {
                axios({
                    method: 'GET',
                    url: `http://localhost:5000/api/fiware/entities/${element.championId}`
                }).then((res) => {
                    // console.log(res.data.data.name.value);
                    container.push(
                        <tr key={element.championId} id={element.championId}>
                            <td>{res.data.data.name.value}</td>
                            <td>{element.championPoints}</td>
                            <td>{element.championLevel}</td>
                        </tr>
                    );
                })

            });
            console.log(container);
            setTop3(container);
        })
    };

    const getMatchHistory = async (puuid) => {
        // http://172.27.96.148:5000/api/riot/matchlist/:puuid
        axios({
            method: 'GET',
            url: `http://localhost:5000/api/riot/matchlist/${puuid}`
        }).then((res) => {

            console.log(res.data.matchs);
            const matchHistory = res.data.matchs;
            const container = [];

            matchHistory.forEach((element) => {
                // getMatch(element);
                console.log(element);
                axios({
                    method: 'GET',
                    url: `http://localhost:5000/api/fiware/entities/${element}`
                }).then((res) => {
                    const data = res.data.data;
                    console.log(data);

                    for (let key in data) {
                        // Vérifier si la propriété est propre à l'objet (et non héritée)
                        if (data.hasOwnProperty(key)) {
                            if (data[key] != null && typeof data[key] === 'object' && data[key].value[0] != null)
                            {
                                console.log("Data not null ",data[key]);
                                if (data[key].value[0].puuid.value === puuid ) 
                                {

                                    // killAverage += data[key].value[0].kills.value;
                                    // deathAverage += data[key].value[0].deaths.value;
                                    // assistAverage += data[key].value[0].assists.value;
                                    console.log(document.getElementById(element));
                                    document.getElementById(element).innerHTML = `
                                        <td> Score : ${data[key].value[0].kills.value} / ${ data[key].value[0].deaths.value} / ${data[key].value[0].assists.value}</td>
                                    `

                                    setKillAverage(killAverage + data[key].value[0].kills.value);
                                    setDeathAverage(deathAverage + data[key].value[0].deaths.value);
                                    setAssistAverage(assistAverage + data[key].value[0].assists.value);
                                }
                            }
  
                        }
                    }


                })




                container.push(
                    <tr key={element}>
                        <td id={element}>{element}</td>
                    </tr>
                );
            })

            console.log(container);
            setMatchHistory(container);
        })
    };

    const getMatch = async (matchId) => {
        // http://172.27.96.148:5000/api/riot/match/:matchId
        axios({
            method: 'GET',
            url: `http://localhost:5000/api/riot/match/${matchId}`
        }).then((res) => {
            console.log(res);
        })
    };

    const getChampion = async (championId) => {
        // http://172.27.96.148:5000/api/fiware/Champion?q=id=81
        axios({
            method: 'GET',
            url: `http://localhost:5000/api/fiware/entities/${championId}`
        }).then((res) => {
            console.log(res.data.data.name.value);
        })


    };

    return (
        <div className='profil'>
            <h1>Profil</h1>
            <h2>{summonerName.replaceAll("%20", ' ')} : LvL {summonerLevel}</h2>
            {<h3>{killAverage} / {deathAverage} / {assistAverage}</h3>}
            <div className='top3'>
                <table>
                    <thead>
                        <tr>
                            <th>Champion</th>
                            <th>Points</th>
                            <th>Level</th>
                        </tr>
                    </thead>

                    <tbody>
                        {top3}
                    </tbody>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>Match</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matchHistory}
                    </tbody>
                </table>
            </div>


        </div>
    );
};

export default Profil;