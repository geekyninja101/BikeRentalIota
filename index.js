var paymentAddress;
$(function (){
    var socket = io();
    socket.on('newAddress',function(address){
        paymentAddress = address
        $('#mainImage').attr('src','payment.png')
        $('#mainText').html('Please pay 1 IOTA to the following address:</br></br>' + address)                  
    })
    socket.on('unlocked', function(unlockedAddress){
        if(unlockedAddress===paymentAddress)
        {
            $('#mainImage').attr('src','unlocked.png')
            $('#mainText').html('Payment is received and the bike is unlocked.')
        }
    })
})