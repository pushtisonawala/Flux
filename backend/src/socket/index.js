
import { Server } from "socket.io";
import httpServer from "../index.js";
const io=new Server(httpServer,{
    cors:{
        origin:"http://localhost:3000"
    },
})
io.on("connection",(socket)=>{
    console.log("user connected",socket.id)
    socket.on("join-workspace",({workspaceId})=>{
        const room=`workspace-${workspaceId}`
        socket.join(room)
        console.log(`User ${socket.id} joined ${room}`);

    });
    socket.on("send-message",({workspaceId,message})=>{
const room=`workspace-${workspaceId}`
socket.to(room).emit("message",{
    from:socket.id,
    message,
});
    })
      socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });



})
