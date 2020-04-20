var arr = [0,0,0,0,0,0];
let vote = 0;
var is_down = false;
var is_up = false;     
var is_down1 = false;
var is_up1 = false;    
var is_down2 = false;
var is_up2 = false;    
btn = document.getElementById('send1');
text = document.getElementById('post-comment1');


//socket.onmessage = renderMessages;

/*
function sendMessage() {
socket.send(JSON.stringify({'chatInput': chatInput})) }

function renderMessages(message) {
console.log(message.data); }


*/

/*
ws.onopen = function()  {
    console.log('WebSocket Client Connected');
    ws.send('Hi this is web client.');
};

ws.onmessage = function(e) {
   console.log("Received: '" + e.data + "'");
    
};
*/
//const WebSocket = require('ws');
// var ws = new WebSocket('ws://localhost:8080');


// function updateDisplay(){
//     document.getElementById("upvotes").innerHTML = vote.toString();
// }

// ws.onopen = function () {
//     console.log('websocket is connected ...')
//     ws.send('connected')
// }

// ws.onmessage = function (ev) {
//     console.log(ev);
// }

// var WebSocketServer = require('ws').Server,
//   wss = new WebSocketServer({port: 40510})

//   wss.on('connection', function (ws) {
//     ws.on('message', function (message) {
//       console.log('received: %s', message)
//     })

//     setInterval(
//         () => ws.send(`${new Date()}`),
//         1000
//       )
//     })

// const ws = new WebSocket('ws://localhost:3030');
// ws.onopen = () => { 
//   console.log('Now connected'); 
// };

// WebSocket.on('upvote', function(data){
//     output = document.getElementById('upvotes' + data.tag);
//     output.innerHTML = data.ballot;
// });


var socket = io.connect('ws://localhost:8080');

socket.on('upvote', function(data){
    output = document.getElementById('upvotes' + data.tag);
    output.innerHTML = data.ballot;
    let dvtag = data.tag + 1;
    output = document.getElementById('downvotes' + dvtag);
    output.innerHTML = data.downvote;
});

socket.on('downvote', function(data){
    output = document.getElementById('downvotes' + data.tag);
    output.innerHTML = data.ballot;
    let uvtag = data.tag - 1;
    output = document.getElementById('upvotes' + uvtag);
    output.innerHTML = data.upvote;
});


socket.on('comment', function(data){
    output = document.getElementById('output' + data.id);
    output.innerHTML += '<p><small>' + data.text + '  -  ' + '<strong>Anon</strong></small></p>'
});

btn.addEventListener('click', function(){
    socket.emit('comment',{
        text : text.value,
        id : 1
    });
});

function comment(id){

    text = document.getElementById('post-comment' + id);

    console.log('comment invoked');

   socket.emit('comment', {
    text : text.value,
    post : id
   }); 
}






function upvote(id){

    output = document.getElementById('upvotes' + id);
    
    //decrement here
    if(is_up){
        var v = arr[id];
        let down_vote = arr[id+1];
        let new_vote = v - 1; 
        arr[id] = new_vote;
        //document.getElementById("upvotes").innerHTML = new_vote.toString();
        is_up = false;

        socket.emit('upvote',{
            ballot : new_vote, 
            downvote : down_vote,
            tag : id
        }); 



    }
    
    else if(is_down){
        
        var v = arr[id+1]
        let down_vote = v - 1; 
        arr[id+1] = down_vote;
        is_down = false;
       // document.getElementById("downvotes").innerHTML = new_vote.toString();
        
        v = arr[id]
        let new_vote = v + 1; 
        arr[id] = new_vote;
        is_up = true;
      //  document.getElementById("upvotes").innerHTML = new_vote.toString();

      socket.emit('upvote',{
        ballot : new_vote, 
        downvote : down_vote,
        tag : id
    }); 

    }
    
    else{
    var v = arr[id]
    let down_vote = arr[id+1];
    let new_vote = v + 1; 
    arr[id] = new_vote;
    is_up = true;

   // document.getElementById("upvotes").innerHTML = new_vote.toString();
    //    updateDisplay(); should be constantly called 

    socket.emit('upvote',{
        ballot : new_vote, 
        downvote : down_vote,
        tag : id
    }); 

    }
}

function upvote1(id){

    output = document.getElementById('upvotes' + id);
    
    //decrement here
    if(is_up1){
        var v = arr[id];
        let down_vote = arr[id+1];
        let new_vote = v - 1; 
        arr[id] = new_vote;
        //document.getElementById("upvotes").innerHTML = new_vote.toString();
        is_up1 = false;

        socket.emit('upvote',{
            ballot : new_vote, 
            downvote : down_vote,
            tag : id
        }); 



    }
    
    else if(is_down1){
        
        var v = arr[id+1]
        let down_vote = v - 1; 
        arr[id+1] = down_vote;
        is_down1 = false;
       // document.getElementById("downvotes").innerHTML = new_vote.toString();
        
        v = arr[id]
        let new_vote = v + 1; 
        arr[id] = new_vote;
        is_up1 = true;
      //  document.getElementById("upvotes").innerHTML = new_vote.toString();

      socket.emit('upvote',{
        ballot : new_vote, 
        downvote : down_vote,
        tag : id
    }); 

    }
    
    else{
    var v = arr[id]
    let down_vote = arr[id+1];
    let new_vote = v + 1; 
    arr[id] = new_vote;
    is_up1 = true;

   // document.getElementById("upvotes").innerHTML = new_vote.toString();
    //    updateDisplay(); should be constantly called 

    socket.emit('upvote',{
        ballot : new_vote, 
        downvote : down_vote,
        tag : id
    }); 

    }
}

function upvote2(id){

    output = document.getElementById('upvotes' + id);
    
    //decrement here
    if(is_up2){
        var v = arr[id];
        let down_vote = arr[id+1];
        let new_vote = v - 1; 
        arr[id] = new_vote;
        //document.getElementById("upvotes").innerHTML = new_vote.toString();
        is_up2 = false;

        socket.emit('upvote',{
            ballot : new_vote, 
            downvote : down_vote,
            tag : id
        }); 



    }
    
    else if(is_down2){
        
        var v = arr[id+1]
        let down_vote = v - 1; 
        arr[id+1] = down_vote;
        is_down2 = false;
       // document.getElementById("downvotes").innerHTML = new_vote.toString();
        
        v = arr[id]
        let new_vote = v + 1; 
        arr[id] = new_vote;
        is_up2 = true;
      //  document.getElementById("upvotes").innerHTML = new_vote.toString();

      socket.emit('upvote',{
        ballot : new_vote, 
        downvote : down_vote,
        tag : id
    }); 

    }
    
    else{
    var v = arr[id]
    let down_vote = arr[id+1];
    let new_vote = v + 1; 
    arr[id] = new_vote;
    is_up2 = true;

   // document.getElementById("upvotes").innerHTML = new_vote.toString();
    //    updateDisplay(); should be constantly called 

    socket.emit('upvote',{
        ballot : new_vote, 
        downvote : down_vote,
        tag : id
    }); 

    }
}



function downvote(id){


output = document.getElementById('downvotes' + id);
    
// //decrement here
if(is_down){
    var v = arr[id];
    let up_vote = arr[id-1];
    let new_vote = v - 1; 
    arr[id] = new_vote;
    //document.getElementById("upvotes").innerHTML = new_vote.toString();
    is_down = false;

    socket.emit('downvote',{
        ballot : new_vote, 
        upvote : up_vote,
        tag : id
    }); 
}

else if(is_up){
    
    var v = arr[id-1];
    let up_vote = v - 1; 
    arr[id-1] = up_vote;
    is_up = false;
   // document.getElementById("downvotes").innerHTML = new_vote.toString();
    
    v = arr[id];
    let new_vote = v + 1; 
    arr[id] = new_vote;
    is_down = true;
  //  document.getElementById("upvotes").innerHTML = new_vote.toString();

  socket.emit('downvote',{
    ballot : new_vote, 
    upvote : up_vote,
    tag : id
}); 

}

else{
var v = arr[id];
let new_vote = v + 1; 
arr[id] = new_vote;
is_down = true;
id = id - 1;
let up_vote = arr[id];
id = id + 1;


// document.getElementById("upvotes").innerHTML = new_vote.toString();
//    updateDisplay(); should be constantly called 

socket.emit('downvote',{
    ballot : new_vote, 
    upvote : up_vote,
    tag : id
}); 

}


}


function downvote1(id){


    output = document.getElementById('downvotes' + id);
        
    // //decrement here
    if(is_down1){
        var v = arr[id];
        let up_vote = arr[id-1];
        let new_vote = v - 1; 
        arr[id] = new_vote;
        //document.getElementById("upvotes").innerHTML = new_vote.toString();
        is_down1 = false;
    
        socket.emit('downvote',{
            ballot : new_vote, 
            upvote : up_vote,
            tag : id
        }); 
    }
    
    else if(is_up1){
        
        var v = arr[id-1];
        let up_vote = v - 1; 
        arr[id-1] = up_vote;
        is_up1 = false;
       // document.getElementById("downvotes").innerHTML = new_vote.toString();
        
        v = arr[id];
        let new_vote = v + 1; 
        arr[id] = new_vote;
        is_down1 = true;
      //  document.getElementById("upvotes").innerHTML = new_vote.toString();
    
      socket.emit('downvote',{
        ballot : new_vote, 
        upvote : up_vote,
        tag : id
    }); 
    
    }
    
    else{
    var v = arr[id];
    let new_vote = v + 1; 
    arr[id] = new_vote;
    is_down1 = true;
    id = id - 1;
    let up_vote = arr[id];
    id = id + 1;
    
    
    // document.getElementById("upvotes").innerHTML = new_vote.toString();
    //    updateDisplay(); should be constantly called 
    
    socket.emit('downvote',{
        ballot : new_vote, 
        upvote : up_vote,
        tag : id
    }); 
    
    }
    
    
    }


    function downvote2(id){


        output = document.getElementById('downvotes' + id);
            
        // //decrement here
        if(is_down2){
            var v = arr[id];
            let up_vote = arr[id-1];
            let new_vote = v - 1; 
            arr[id] = new_vote;
            //document.getElementById("upvotes").innerHTML = new_vote.toString();
            is_down2 = false;
        
            socket.emit('downvote',{
                ballot : new_vote, 
                upvote : up_vote,
                tag : id
            }); 
        }
        
        else if(is_up2){
            
            var v = arr[id-1];
            let up_vote = v - 1; 
            arr[id-1] = up_vote;
            is_up2 = false;
           // document.getElementById("downvotes").innerHTML = new_vote.toString();
            
            v = arr[id];
            let new_vote = v + 1; 
            arr[id] = new_vote;
            is_down2 = true;
          //  document.getElementById("upvotes").innerHTML = new_vote.toString();
        
          socket.emit('downvote',{
            ballot : new_vote, 
            upvote : up_vote,
            tag : id
        }); 
        
        }
        
        else{
        var v = arr[id];
        let new_vote = v + 1; 
        arr[id] = new_vote;
        is_down2 = true;
        id = id - 1;
        let up_vote = arr[id];
        id = id + 1;
        
        
        // document.getElementById("upvotes").innerHTML = new_vote.toString();
        //    updateDisplay(); should be constantly called 
        
        socket.emit('downvote',{
            ballot : new_vote, 
            upvote : up_vote,
            tag : id
        }); 
        
        }
        
        
        }
    
