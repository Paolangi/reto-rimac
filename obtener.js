'use strict';
const queryString = require('querystring');
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const axios = require('axios');
const util = require('./util');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const PERSONA_TABLE = process.env.PERSONA_TABLE;

app.use(bodyParser.json());



app.get('/personas',(req, res) => {
  const params = {
    TableName: PERSONA_TABLE
  };

  dynamoDB.scan(params, (error, result) => {
    if(error){
      console.log(error);
      res.status(400).json({
        error: 'No se ha podido acceder a los registros'
      })
    } else {
      const {Items} = result;
      res.json({
        success: true,
        message: 'Personas cargadas correctamente',
        users: Items
      });
    }
  });
});


const getRowsSwapi = async (url) => {
    try {
        return await axios.get(url)
    } catch (error) {
      console.error(error)
      return {} ;
    }
  };

app.get('/personas/:personaId', async (req, res) => {
  const params = {
    TableName: PERSONA_TABLE,
    Key: {
      personaId: req.params.personaId
    }
  };

  console.log(req.params.personaId);

  dynamoDB.get(params, async (error, result) => {
    if(error){
      console.log(error);
     return res.status(400).json({
        error: 'No se ha podido acceder al registro'
      })  
    } 

    if(result.Item){

      const {personaId, nombre} = result.Item;
      
      for(var ikey in result.Item) {
        console.log("key: "+ikey+", value: "+ result.Item[ikey]);
        if(util.isArray(result.Item[ikey]) ){
            const entityBlock = [];
            const entityArray = result.Item[ikey];

            for(var incr in result.Item[ikey] ){

                try{
                    const url = result.Item[ikey][incr];              
                    const elementInvk = await getRowsSwapi(url) ;
                    if(elementInvk.data){
                    entityBlock.push(elementInvk.data);
                    }
                   
                } catch (error) {
                    entityBlock.push(element);
                }    

            }

            result.Item[ikey] = entityBlock;
        }

      }

        return res.json(result.Item);

    }else{
      res.status(404).json({
        error: 'Persona no encontrada'
      })
    }
  });
});

module.exports.handler = serverless(app);