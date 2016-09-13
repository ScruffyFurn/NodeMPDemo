/**************************************************
** GAME SERVER **
This holds all the logic for the game server.
To run: Type the follow in a cmd window with Admin 
privs
    node server.js  

** Coded by Mickey "ScruffyFurn" MacDonald  2014 **
**************************************************/


/**************************************************
** Requirements
**************************************************/
var util = require("util"),
   // io = require("socket.io"),
    express = require('express'),
    Player = require("./player").Player;
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 80;


/**************************************************
** Variables
**************************************************/
var 
    players;

/**************************************************
** Init function
**************************************************/
function init() {
    players = [];
    
    //Set our Socket.io server to listen on port 8000
    //socket = io.listen(80);
    //Set the event handlers
    setEventHandlers();

};

server.listen(port, function () {
    console.log('Updated : Server listening at port %d', port);
});

/**************************************************
** Set event handlers function
**************************************************/
var setEventHandlers = function () {
    io.sockets.on("connection", onSocketConnection);
};

/**************************************************
** On socket connection function
**************************************************/
function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
};

/**************************************************
** On client disconnect function
**************************************************/
function onClientDisconnect() {
    util.log("Player has disconnected: " + this.id);
    
    // Find the selected player to remove
    var removePlayer = playerById(this.id);
    
    // Return not found message of player is not in array
    if (!removePlayer) {
        util.log("Player not found: " + this.id);
        return;
    }    ;
    
    //Remove the selected player from the array
    players.splice(players.indexOf(removePlayer), 1);
    
    //Tell other players to remove the selected player
    this.broadcast.emit("remove player", { id: this.id });
};

/**************************************************
** On new player function
**************************************************/
function onNewPlayer(data) {
    /*This creates a new player instance using 
    position data sent by the connected client. 
    The identification number is stored for future 
    reference.*/
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;
    
    //Tell the other players about this new player
    this.broadcast.emit("new player",
                        {
        id: newPlayer.id,
        x: newPlayer.getX(),
        y: newPlayer.getY()
    });
    //Get the other players information for this new player
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player",
                  {
            id: existingPlayer.id,
            x: existingPlayer.getX(),
            y: existingPlayer.getY()
        });
    }    ;
    
    //Add this new player to the players array
    players.push(newPlayer);
};

/**************************************************
** On move player function
**************************************************/
function onMovePlayer(data) {
    //Select player to move
    var movePlayer = playerById(this.id);
    
    //Display message if id is not found in array
    if (!movePlayer) {
        util.log("Player not found: " + this.id);
        return;
    }    ;
    
    //Set selected players position data via setters
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
    
    //Tell the other players about the movement
    this.broadcast.emit("move player",
                        {
        id: movePlayer.id,
        x: movePlayer.getX(),
        y: movePlayer.getY()
    });

};

/**************************************************
** Player find helper function
**************************************************/
function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    }    ;
    
    return false;
}

//Run init function to start the ball rolling
init();