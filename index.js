const express = require('express');
const dotenv = require('dotenv');
const dbConnection = require('../server/dbConnection/dbConnection')
const getRouters = require('./MVC/ROUTERS/routers');
const cros = require('cors');
const path = require('path')



const corsConfig = {
    value : ['http://localhost:3000/']
}


const app = express();
dotenv.config({path:'./config.env'})
const Port = process.env.PORT
// app.use(express.static('upload'))
app.use('/uploads',express.static(path.join(__dirname, 'upload')));
app.use(express.json());
app.use(cros(corsConfig));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth',getRouters);
app.use('/auth',getRouters);
app.use('/auth',getRouters);
app.use('/user',getRouters);
app.use('/post',getRouters);
app.use('/post',getRouters);
app.use('/user',getRouters);
app.use('/user',getRouters);
app.use('/user',getRouters);
app.use('/user',getRouters);
app.use('/user',getRouters);


dbConnection();

app.listen(Port, ()=>{
    console.log("server is connected  :" + Port);
})