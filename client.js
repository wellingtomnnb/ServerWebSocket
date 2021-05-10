const WebSocket = require('ws');
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const ws = new WebSocket('ws://127.0.0.1:4001');

ws.on('open', function open() {
  rl.addListener('line', line =>{
        
    if(line === 'end'){
        ws.end()
    }
    else ws.send(line) 
    
})
});

ws.on('message', function incoming(data) {
  console.log(data);
});