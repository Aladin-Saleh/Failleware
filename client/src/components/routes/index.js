import React                        from "react";
import { BrowserRouter as Router }  from "react-router-dom";
import { Routes }                   from "react-router-dom";
import { Route }                    from "react-router-dom";


import Home         from "../../pages/Home";
import NavBar       from "../navbar/NavBar";
import NotFound     from "../../pages/NotFound";
import Connexion    from "../../pages/Connexion";
import Leaderboard  from "../../pages/Leaderboard";
import Profil       from "../../pages/Profil";

function index()
{
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/board" element={<Leaderboard />} />
                <Route path="/profil/:id" element={<Profil />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            
        </Router>
            
    )
}

export default index