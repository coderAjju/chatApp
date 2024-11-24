import express from "express"
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv'
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from './routes/message.routes.js'
import cors from 'cors'
import {app,server} from './lib/socket.js'

import path from 'path' // this line is added to deploy the app;

dotenv.config();


const PORT = process.env.PORT || 3000;

const __dirname = path.resolve(); // this line is added to deploy the app;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'../frontend','dist','index.html'));
    })
}

server.listen(PORT, () => {
    connectDB();
    console.log('Example app listening on port',PORT);
})