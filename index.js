const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors'); 
app.use(cors());

const axios = require('axios');

const {randomBytes} = require('crypto');

const posts = {};

app.get('/posts', (req,res)=>{
  // when a get request is received send all data / post back to client
  res.send(posts);
});

app.post('/posts',  async(req, res) =>{
    // generate a unique id for each new post request
    const id = randomBytes(4).toString('hex');
    // put the data from request body into title
    const { title } = req.body;
    // put the data into the data array with id as key
    posts[id] = {
        id, title 
    };

    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: { 
            id,
            title
        } 
    });

    // return status 201 to client and the data itself
    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Event received', req.body.type);
    res.send({});
});

app.listen(4000, () =>{
    console.log('Listening on port 4000')
});