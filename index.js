const { PORT = 3000 } = process.env;
const express = require('express');
const morgan = require('morgan');
const server = express(); 

server.use(morgan('dev'));
server.use(express.json())
server.use(express.urlencoded());


server.use((req, res, next)=> {
    console.log("<____Body Logger START_____>");
    console.log(req.body);
    console.log("<____Body Logger END_____>");
    
    next();
})

const apiRouter = require('./api');
server.use('/api', apiRouter);


const { client } = require('./db');
client.connect();



server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});