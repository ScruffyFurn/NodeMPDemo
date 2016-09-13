// Game variables
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	input,			// Keyboard input
	localPlayer,	// Local player
    remotePlayers,  // Remote players array
    socket;         // WebSocket


function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the size of our canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise input
	input = new Input();

	// Place the player at a random starting position
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round(Math.random()*(canvas.height-5));

	// Init the local player
	localPlayer = new Player(startX, startY);

    // Init the array we will use to hold the remote players 
	remotePlayers = [];

    // Init the socket connection to our Azure NodeJS server
	socket = io.connect('http://atest11.azurewebsites.net:80');

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Window resize
    window.addEventListener("resize", onResize, false);

    // Input
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

    // Sockets
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);
};

// Key down
function onKeydown(e) {
	if (localPlayer) {
		input.onKeyDown(e);
	};
};

// Key up
function onKeyup(e) {
	if (localPlayer) {
		input.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Max out our canvas size
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

// Socket connect to the server
function onSocketConnected() {
    //Connected
    console.log("Connected to socket server");

    //Tell the server to create a new player
    socket.emit("new player",
                {
                    x: localPlayer.getX(),
                    y: localPlayer.getY()
                });
};

// Socket disconnect from the server
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

// New Player
function onNewPlayer(data) {
    //Display new player message in console
    console.log("New player connected: " + data.id);

    /*Create a new player with placement information
    from the server. Then set the id of the new player
    and add it to the remote players array*/
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = data.id;
    remotePlayers.push(newPlayer);
};

// Player moves
function onMovePlayer(data) {
    //Select the player to move
    var movePlayer = playerById(data.id);

    //Display console message if the id is not in the array
    if (!movePlayer) {
        console.log("Player not found: " + data.id);
        return;
    };

    //Set selected players position via setters
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

};

// Remove a Player
function onRemovePlayer(data) {
    //Find the selected player to remove
    var removePlayer = playerById(data.id);

    //Display a console message if the id is not in array
    if (!removePlayer) {
        console.log("Player not found: " + data.id);
        return;
    };

    //Remove the selected player from the remote player array
    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);

};


// Our game loop
function gameloop() {
	update();
	draw();

	window.requestAnimFrame(gameloop);
};


function update() {
    //Send movement data if the player has moved
    if (localPlayer.update(input)) {
        socket.emit("move player", { x: localPlayer.getX(), y: localPlayer.getY() });
    };
};


function draw() {
	//Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Draw the local player
	localPlayer.draw(ctx);

    //Draw all the remote players
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
	    remotePlayers[i].draw(ctx);
	};
};


// Player finder function
function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};

// Setup and unleash the hounds!
init();
gameloop();