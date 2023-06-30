const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { emit } = require('process');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

let users = [];
app.use(express.static(path.join(__dirname, "views")))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

io.on('connection', socket => {

    socket.on('add user', (data) => {
        users.push(data);
        io.emit('send users', users);
    })

    socket.on('disconnect', () => {
        let index = users.indexOf(x => x.id == socket.id);
        users.splice(index, 1);
        io.emit('send users', users);
    })

    socket.on('add pregunta', (data) => {
        io.emit('recibir pregunta', data);
    })

    socket.on('responder', (data) => {
        io.emit('recibir respuesta', data);
    })

    socket.on('enviar-like', (data) => {
        io.emit('recibir-like', data);
    })

})



httpServer.listen(process.env.PORT || 3000);