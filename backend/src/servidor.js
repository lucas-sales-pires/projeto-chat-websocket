const { WebSocketServer } = require('ws');
const {config} = require('dotenv');

config();

const wss = new WebSocketServer({ port: process.env.PORTA || 8080 });

wss.on('connection', (ws)=>{
    ws.on("error", console.error)

    ws.on("message",(dados) => {

        wss.clients.forEach((cliente)=>{
            cliente.send(dados.toString())
        })

        console.log("cliente conectado")
    })
});

