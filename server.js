// Setup empty JS object to act as endpoint for all routes


// Require Express to run server and routes
//npm i express
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
// npm install body-parser
const bodyParser= require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
// npm install cors
const cors = require('cors');
const { json } = require('body-parser');
const { parse } = require('path');

app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

//Project Data

const projectData = [];
// Setup Server
// intialize port Number
const port= 8000;

// configure listening for Server 
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
// load all Cities
let citylist =[];
let countryist =[];
 citylist = require('./citylist.json');
 // Fill Country
 citylist.forEach(element => {
     if (countryist.indexOf(element.country)==-1) {
        countryist.push(element.country);
     }
 });
// Initialize all route with a callback function
app.get('/searchCity',function(req, res){
    
    let searchNameCity =req.query.nameCity==undefined?'':req.query.nameCity.toLowerCase();
    let searchNameCountry =req.query.nameCountry==undefined?'':req.query.nameCountry.toLowerCase();

   
    // check if searchNameCity not empty and   searchNameCountry is empty
    if (searchNameCity !=''&& searchNameCountry ==''){
        res.json(citylist.filter(f=>f.name.toLowerCase().trim().indexOf(searchNameCity)>-1 ).slice(0,10));
    } 
    // check if searchNameCity is empty and   searchNameCountry not empty
    else if (searchNameCity ==''&& searchNameCountry !=''){
        res.json(citylist.filter(f=>f.country.toLowerCase().trim().indexOf(searchNameCountry)>-1 ).slice(0,10));
    } 
      // check if searchNameCity not empty and   searchNameCountry not empty
     else if (searchNameCity!='' && searchNameCountry !=''){
         res.json(citylist.filter(f=>f.country.toLowerCase().trim().indexOf(searchNameCountry)>-1)
                          .filter(f=> f.name.toLowerCase().trim().indexOf(searchNameCity)>-1 ).slice(0,10));
    } 
    else{
        res.json(citylist.slice(0,10));
    }
});


app.get('/searchCountry',function(req, res){
    let searchNameCountry =req.query.nameCountry==undefined?'':req.query.nameCountry.toLowerCase();;
    // check if querey is empty
    if (searchNameCountry =='') {
        res.json(countryist.slice(0,10));
    }
    else{
        res.json(countryist.filter(f=>f.toLowerCase().trim().indexOf(searchNameCountry)>-1).slice(0,10));
    }
});


// Callback function to complete GET '/all'
app.get('/all',function(req, res){
    res.json(projectData);
});
// Post Route
app.post('/generate',function(req, res){
    const newObj=req.body;
    projectData.unshift(newObj);
    res.send(true);
});
