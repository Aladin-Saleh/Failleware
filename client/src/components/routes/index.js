import React                        from "react";
import { BrowserRouter as Router }  from "react-router-dom";
import { Routes }                   from "react-router-dom";
import { Route }                    from "react-router-dom";


import Home from "../../pages/Home";
import NavBar from "../navbar/NavBar";
import NotFound from "../../pages/NotFound";

function index()
{
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
            
    )
}

export default index