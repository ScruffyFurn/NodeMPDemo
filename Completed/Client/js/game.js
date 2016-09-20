// Game variables
var canvas,         // Canvas DOM element
    ctx,            // Canvas rendering context
    input,          // Keyboard input
    localPlayer,    // Local player
    remotePlayers,  // Remote players array
    socket;         // WebSocket

function init(config) {
    if (window.Worker) {
        socket = new Worker('js/socket.js');
    }

    // Declare the canvas and rendering context
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Maximise the size of our canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialise input
    input = new Input();

    // Place the player at a random starting position
    var startX = Math.round(Math.random() * (canvas.width - 5)),
        startY = Math.round(Math.random() * (canvas.height - 5));

    // Init the local player
    localPlayer = new Player(startX, startY);

    // Init the array we will use to hold the remote players
    remotePlayers = [];

    // Init the socket connection to our Azure NodeJS server
    socket.postMessage(JSON.stringify({
        type: 'setup',
        data: {
            player: {
                x: localPlayer.getX(),
                y: localPlayer.getY()
            },
            config: config
        }
    }));

    socket.onmessage = function (event) {
        var message = JSON.parse(event.data);

        switch (message.type) {
            case 'setup':
                if (message.data.status) {
                    // Start listening for events
                    setEventHandlers();
                }
                break;

            case 'newPlayer':
                onNewPlayer(message.data);
                break;

            case 'movePlayer':
                onMovePlayer(message.data);
                break;

            case 'removePlayer':
                onRemovePlayer(message.data);
                break;
        }
    };
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
function setEventHandlers() {
    // Window resize
    window.addEventListener('resize', onResize, false);

    // Input
    window.addEventListener('keydown', onKeydown, false);
    window.addEventListener('keyup', onKeyup, false);
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

// New Player
function onNewPlayer(data) {
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
        console.log('Player not found: ' + data.id);
        return;
    };

    //Set selected players position via setters
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
};

// Remove a Player
function onRemovePlayer(data) {
    // Find the selected player to remove
    var removePlayer = playerById(data.id);

    // Display a console message if the id is not in array
    if (!removePlayer) {
        console.log('Player not found: ' + data.id);

        return;
    };

    // Remove the selected player from the remote player array
    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

// Our game loop
function gameloop() {
    update();
    draw();

    window.requestAnimFrame(gameloop);
};


function update() {
    // Send movement data if the player has moved
    if (localPlayer.update(input)) {
        socket.postMessage(JSON.stringify({
            type: 'move',
            data: {
                x: localPlayer.getX(),
                y: localPlayer.getY()
            }
        }));
    };
};


function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the local player
    localPlayer.draw(ctx);

    // Draw all the remote players
    remotePlayers.forEach(function (player) {
        player.draw(ctx);
    });
};


// Player finder function
function playerById(id) {
    return remotePlayers.find(function (player) {
        return remotePlayers[i].id === id;
    });
};