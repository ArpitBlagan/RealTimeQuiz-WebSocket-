const express =require('express');
const {WebSocketServer,websocket} =require('ws');
const Cookie =require('cookie-parser');
const {Quiz} =require('./managers/assign');
const {userManager}=require('./managers/user');
const mongoose=require('mongoose');
require('dotenv').config();
const {routerr}=require('./routes/quiz')
const cors=require('cors');
const url=require('url');
const http=require('http');
const app=express();
app.use(Cookie());
app.use(express.json());
mongoose.connect(process.env.URL).
then(()=>{console.log("connected successfully to DB");})
app.use(cors({
    origin:['http://localhost:5173'],
    credentials:true
}));
app.use("/",routerr);
const server=http.createServer(app);
const online= new userManager();
const Quizs =new Quiz();
const wss=new WebSocketServer({server})
wss.on('connection',(ws:any,req:Request)=>{
    console.log("Incoming request..")
    const url_=url.parse(req.url,true);
    const {name}=url_.query;
    online.addUser(name,ws);
    // add this to online users
    ws.on('message',(messsage:any)=>{
        const data=JSON.parse(messsage);
        if(data.name=="AddRoom"){
            //this function need and unique id and string
            Quizs.createRoom(data.id,ws,name);
        }  
        else if(data.name=="getResult"){
            Quizs.getResult(data.id);
        }
        else if(data.name=="addParticipant"){
            Quizs.addParticipants(data.id,ws,name);
        }
        else if(data.name=="startQuiz"){
            Quizs.startQuiz(data.id);
        }
        else if(data.name=="userAns"){
            Quizs.participantAns(data.id,ws,data.ans,data.time)
        }
        else {
            console.log("else");
        }
    });
    ws.on('close',()=>{
        //remove this user form online user's list
        console.log("removed user");
        online.removeUser(ws);
    });
})
server.listen(3000,()=>{console.log('listening..')})