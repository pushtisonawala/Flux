import express from "express"
import http from "http"
import {Server} from "socket.io"
import {connectDB} from "./db/mongo.js"
import {createWorkspace} from "./controllers/workspaceControllers.js"
import {signup, login} from "./controllers/userController.js";
import {getReq,createReq} from "./controllers/requestController.js"
const app=express()
const httpServer=http.createServer(app)
app.use(express.json());

async function connection(){
    try{
    await connectDB()
    console.log("connected to mongodb")
    }catch(err){
        console.log(err)
    }
}


connection();
app.post("/api/workspaces", createWorkspace);
app.post("/api/signup", signup);
app.post("/api/login", login);
app.post("/api/requests/:workspace_id", createReq);
app.get("/api/requests/:workspace_id", getReq);




    httpServer.listen(4000,()=>{
      console.log("Server running on http://localhost:4000");

})

