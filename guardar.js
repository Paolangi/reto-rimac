'use strict';
const queryString = require('querystring');
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');


const dynamoDB = new AWS.DynamoDB.DocumentClient();
const PERSONA_TABLE = process.env.PERSONA_TABLE;

app.use(bodyParser.json());

app.post('/savepersonas', (req, res) => {
  console.log('req : ', req);
  console.log('req personaId: ', req.body.personaId);
  const {personaId, nombre,anio_nacimiento,color_ojos,genero,
    color_cabello,talla,peso,color_piel,planeta_natal,peliculas,
    especies,naves_estelares,vehiculos
  } = req.body;

  const url = 'https://' + req.requestContext.domainName + req.requestContext.path + '/' + personaId + '/';

  console.log('personaId: ', personaId);

  const fullToday = (new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' } ) )).toJSON();
  console.log('fullToday: ', fullToday);

  const fecha_creacion = fullToday;
  const fecha_edicion = fullToday;

  const params = {
    TableName: PERSONA_TABLE,
    Item: {
      personaId, nombre,anio_nacimiento,color_ojos,genero,
      color_cabello,talla,peso,color_piel,planeta_natal,peliculas,
      especies,naves_estelares,vehiculos,url, fecha_creacion,fecha_edicion
    }
  }

  dynamoDB.put(params, (error) => {
    if(error){
      console.log(error);
      res.status(400).json({
        error: 'No se ha podido crear la persona'
      })
    } else {
      res.json({personaId, nombre, succes: true, msg:"Persona registrada correctamente"});
      
    }
  });

});

module.exports.handler = serverless(app);
