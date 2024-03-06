const express=require('express');
const path=require('path');
const app=express();
const PORT=process.env.PORT || 3000
const server=app.listen(PORT,()=>console.log(`A Server is running on port ${PORT}`));

const io=require('socket.io')(server)

app.use(express.static(path.join(__dirname,'public')));

// for total count
const socketsConnected=new Set()

// connecting socket 
io.on('connection',onConnected)

// when client is connected
function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id);

    // it is emit for total clients 
    io.emit('clients-total', socketsConnected.size)

    // when socket disconnected
    socket.on('disconnect',()=>{
        console.log('socket disconnected',socket.id);
        socketsConnected.delete(socket.id)

        io.emit('clients-total', socketsConnected.size)
    })

    // when user send a message we get name message and time...
    socket.on('message',(data)=>{
        console.log(data)
        // when user is logged in, it is visible to other user but not that user...
        socket.broadcast.emit('chat-message',data)
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)
    })
}

