const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4001 });

//LIST CONNECT CLIENTS
let clients = [];

//NEW CONNECTION TO THE NEW CLIENT
wss.on('connection', function connection(client) {

    registerClient(client)

    
    client.on('message', function incoming(message) {

        console.log(message)

        

        const str = message.toString()
    
        if(validData(client, message)){

            console.log(client.clientName + "/MESSAGE: " + str)

            saveData(str)

            //Quando receber uma mensagem com todos os parametros, enviamos ela para todos os clients conectados
            //clients.forEach(s => s.send(client.clientName + ': ' + str))  
            clients.forEach(s => s.send(str))           
        }

        


    });

    

    //CLOSE THE CONNECTION
    client.on('close', ()=>{
        console.log(`${client.clientName} Desconectou-se`)
        clients.splice(client.index,1)
    })

    client.on('error', (err) => {
        console.log(`${client.clientName} Desconectou-se`)
        clients.splice(client.index,1)
    });

    //client.send('something');
});

//AUXILIARY FUNCTIONS
function registerClient(client){

    clients.push(client);
    client["clientName"] = 'Client' + (clients.length)
    client["index"] = clients.length -1
    console.log(client.clientName + ' conectou-se')

}

function validData(client, message){
    if(message === 'end'){
        client.close()
    }
    else{
        
        //Tentativa de converter os dados recebidos p/JSON
        try{
            var obj = JSON.parse(message)

            if(typeof obj == "object"){

                if(validParameters(client, message)){
                    return true
                }
            }else{
                client.send("FormactError: Esperava-se um 'JSON' e foi recebido um '" + typeof obj + "'\n" + e)
                return false
            } 
        }
        catch(e){
            console.log(client.clientName + '/WARNING: Entrada Inválida')
            client.send("FormactError: Esperava-se um 'JSON' e foi recebido um '" + typeof obj + "'\n" + e)
            return false
        }
        
    }

}

function validParameters(client, message){
    switch (true){
        case !message.includes("ev") : client.send("ParameterError: Parametro 'ev' não encontrado")
        break
        case !message.includes("data") : client.send("ParameterError: Parametro 'data' não encontrado")
        break
        case !message.includes("hash_id") : client.send("ParameterError: Parametro 'hash_id' não encontrado")
        break
        case !message.includes("channel") : client.send("ParameterError: Parametro 'channel' não encontrado")
        break
        case !message.includes("type") : client.send("ParameterError: Parametro 'type' não encontrado")
        break
        default : return true
            
    }
}

function saveData(message){
    var fs = require("fs")

    //Sobreescreve arquivo mais velho com o ultimo dado recebido
    var oldData = fs.readFileSync("./newEvent.json", "utf8")
    fs.writeFile('./oldEvent.json', oldData, function (err) {
        if (err) return console.log(err);
    })

   //Salva o novo data  
    fs.writeFile('./newEvent.json', message, function (err) {
        if (err) return console.log(err);
        console.log(">>>> Novo Registrado Salvo <<<<");
    });

    /*
    //Transforma STRING em JSON
    //var event = JSON.parse(data)

    //Transforma OBJETO em STRING
    //eventJson = JSON.stringify(event)
    */
}