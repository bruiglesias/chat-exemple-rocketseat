const express = require('express');
const path = require('path');
const http = require('http');
const io = require('socket.io');
const ejs = require('ejs');

const app = express();
const server = http.createServer(app);

socket_io = io(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use('/' , (request, response)=> {
    response.render('index.html');
});

let messages = [];

// Ação executada toda vez que um socket cliente conectar ao servidor
socket_io.on('connection', socket => {
    // Importante saber:
    // socket.on - ouve uma mensagem
    // socket.emit - emite uma mensagem exclusivamente para o socket conectado
    // socket.broadcast.emit - envia uma mensagem para todos sockets conectados na aplicação

    // Quando um cliente conecta ao socket o servidor envia somente para ele
    // todas as mensagens anteriores
    console.log(`Socket conectado: ${socket.id}`);
    socket.emit('previousMessages' , messages);

    // recebe uma mensagem enviada do socket cliente conectado
    // salva a mensagem no array de mensagens
    socket.on('sendMessage', data => {
        messages.push(data);
        // emite a mensagem recebida para todos os sockets conectados
        socket.broadcast.emit('receivedMessage', data)

    });
});

server.listen(3000);