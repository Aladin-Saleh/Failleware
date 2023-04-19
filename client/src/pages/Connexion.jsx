import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const Connexion = () => {

    const [pseudo, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [riotAccount, setRiotAccount] = useState('');
    const [response, setResponse] = useState('');
    const [signIn, setSignIn] = useState(false);
    const [option, setOption] = useState('sign-in');


    const handleSubmit = (e) => {
        e.preventDefault(); // Empeche le rechargement de la page
        axios({
            method: 'post',
            url: `http://localhost:5000/api/user/${option}`,
            headers: {
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
                setResponse(res.data.message);
                // Redirection vers la page d'accueil
                // window.location.href = '/';
            })
            .catch((err) => {
                console.log(err);
                setResponse(err.response.data.message);
            })


    }

    return (
        <div className='connexion'>

            <form action="">
                {signIn ? (
                    <>
                        <input type="text" placeholder='Pseudo' value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                        <input type="password" placeholder='Mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input type="text" placeholder='Compte Riot' value={riotAccount} onChange={(e) => setRiotAccount(e.target.value)} />
                        <span className='response'>{response}</span>
                        <button type='submit' onClick={handleSubmit}>S'inscrire</button>

                        <p onClick={() => { setSignIn(false); setOption("sign-in")}}>Se connecter</p>
                    </>
                ) : (
                    <>
                        <input type="text" placeholder='Pseudo' value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                        <input type="password" placeholder='Mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <span className='response'>{response}</span>
                        <button type='submit' onClick={handleSubmit}>Se connecter</button>

                        <p onClick={() => { setSignIn(true); setOption("sign-up") }}>S'inscrire</p>
                    </>
                )}
            </form>





        </div>
    );
};

export default Connexion;