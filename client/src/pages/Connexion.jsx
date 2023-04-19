import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const Connexion = () => {

    const [pseudo, setPseudo]           = useState('');
    const [password, setPassword]       = useState('');
    const [riotAccount, setRiotAccount] = useState('');


    const handleSubmit = (e) => 
    {
        e.preventDefault(); // Empeche le rechargement de la page
        axios({
            method: 'post',
            url: 'http://localhost:5000/api/user/sign-up',
            headers : {
                'Content-Type': 'application/json'
            },
            data: {
                login: pseudo,
                riotAccount: riotAccount,
                password: password

            }
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        })


    }

    return (
        <div className='connexion'>

            <form action="">
                <input type="text" placeholder='Pseudo' value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                <input type="password" placeholder='Mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="text" placeholder='Compte Riot' value={riotAccount} onChange={(e) => setRiotAccount(e.target.value)} />
                <button type='submit' onClick={handleSubmit}>Se connecter</button>
            </form>
            




        </div>
    );
};

export default Connexion;