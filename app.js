var express = require('express');
var app = express();
var IOTA = require('iota.lib.js')
var iota = new IOTA({provider:'https://nodes.testnet.iota.org:443'})
const seed = 'ULMDKKWTVWAPMIKBGXJOKCCKTGGKDYLQTBSBWRXLBLTKFETC9PXBPZOIVKRVUVDNHJSTEHKVRRZWEGWVV'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var options = {
    checksum:true,
    security:2
}
var http = require('http').Server(app);
var io = require('socket.io')(http)

//HTTP
app.get('/', function (req, res){
    res.sendFile(__dirname + "/index.html");
})

app.use(express.static('img'));

http.listen(80, function (){
    console.log("Server started at port 80")
})


//Socket io
io.on('connection',function(socket){
    console.log('Connection...')

    iota.api.getNewAddress(seed,options,(error, newAddress)=>{
        if(error){
            console.log(error);
        }else{
            console.log('New address is generated: '+ newAddress)
    
            const transfers=[{
                address:newAddress,
                value:0
            }]
    
            iota.api.sendTransfer(seed, 3, 9, transfers, (error,sucess)=>{
                if(error){
                    console.log(error);
                }else{
                    console.log(sucess)
                    socket.emit('newAddress', newAddress)
                    CheckBalance(newAddress, socket)
                }
            })
        }
    })
})

function CheckBalance(addressToCheck, socket)
{
    iota.api.getBalances([addressToCheck], 100, function(error, success){

        if(error || !success)
        {
            console.log(error)
        }

        if(!success.balances){
            console.log('Error: Low Balance!!')
        }
        else
        {
            //socket.emit('unlocked', addressToCheck)
            if(success.balances[0] > 0)
            {
                socket.emit('unlocked', addressToCheck)
                console.log('Unlocked Address :'+ addressToCheck)
            }

            CheckBalance(addressToCheck, socket)
        }
    })
}

