// Controller for Riot API (server/controllers/riot.controller.js)
const axios = require('axios');
const { response } = require('express');


module.exports.getAllFromType = async (req, res) => 
{
    const type  = req.params.type;
    var message         = '';
    var code            = 500;

    if (!type)
    {
        res.status(400).json(
            {
                message: 'Le nom du type est obligatoire'
            }
        );
    }

    try
    {
        const fiwareSummoners = await axios({
            method: 'GET',
            url: `${process.env.FIWARE_URL}/v2/entities?type=${type}`
        })
        .then(response => {
            res.status(200).json({
                message:    'Récupération des entités du type depuis FIWARE',
                data: response.data
            });
        })
        .catch(error => {
            console.log("error", error);
            message = "Une erreur est survenue lors de la récupération des entités du type dans FIWARE"
            code    = 400;            
        })
    }
    catch (error)
    {
        res.status(code).json(
            {
                message:    message || 'Une erreur est survenue lors de la récupération des entités du type depuis FIWARE',
                error:      error
            }
        )
    }

}


module.exports.getEntityById = async (req, res) => 
{
    const id  = req.params.id;
    const type = req.params.type || '';
    var message         = '';
    var code            = 500;

    if (!id)
    {
        res.status(400).json(
            {
                message: 'Le nom du type est obligatoire'
            }
        );
    }

    try
    {
        request_url = `${process.env.FIWARE_URL}/v2/entities/${id}`;

        if(type !== '')
        {
            request_url += `?type=${type}`;
        }

        const fiwareSummoners = await axios({
            method: 'GET',
            url: request_url
        })
        .then(response => {
            res.status(200).json({
                message:    'Récupération de l\'entité depuis FIWARE',
                data: response.data
            });
        })
        .catch(error => {
            console.log("error", error);
            message = "Une erreur est survenue lors de la récupération de l\'entité dans FIWARE"
            code    = 400;            
        })
    }
    catch (error)
    {
        res.status(code).json(
            {
                message:    message || 'Une erreur est survenue lors de la récupération de l\'entité depuis FIWARE',
                error:      error
            }
        )
    }

}


module.exports.getAttributesByEntityId = async (req, res) => 
{
    const id  = req.params.id;
    var message         = '';
    var code            = 500;

    if (!id)
    {
        res.status(400).json(
            {
                message: 'Le nom du type est obligatoire'
            }
        );
    }

    try
    {
        const fiwareSummoners = await axios({
            method: 'GET',
            url: `${process.env.FIWARE_URL}/v2/entities/${id}/attrs`
        })
        .then(response => {
            res.status(200).json({
                message:    'Récupération de l\'entité depuis FIWARE',
                data: response.data
            });
        })
        .catch(error => {
            console.log("error", error);
            message = "Une erreur est survenue lors de la récupération de l\'entité dans FIWARE"
            code    = 400;            
        })
    }
    catch (error)
    {
        res.status(code).json(
            {
                message:    message || 'Une erreur est survenue lors de la récupération de l\'entité depuis FIWARE',
                error:      error
            }
        )
    }

}