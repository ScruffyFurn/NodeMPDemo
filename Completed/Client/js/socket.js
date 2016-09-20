importScripts('vendors/socket.io.js');

var socket;

onmessage = function _onmessage(event) {
    var message = JSON.parse(event.data);

    switch (message.type) {
        case 'setup':
            setSocket(message.data);
            postMessage(JSON.stringify({
                type: 'setup',
                data: {
                    status: true
                }
            }));

            break;

        case 'move':
            onUpdatePlayer(message.data);
            break;
    }
};

function setSocket(data) {
    socket = io.connect(data.config.url + ':' + data.config.port);

    // Sockets
    socket.on('connect', function onSocketConnected() {
        console.log('Connected to socket server');

        // Tell the server to create a new player
        socket.emit(
            'new player',
            {
                x: data.player.x,
                y: data.player.y
            }
        );
    });

    socket.on('disconnect', onSocketDisconnect);
    socket.on('new player', onNewPlayer);
    socket.on('move player', onMovePlayer);
    socket.on('remove player', onRemovePlayer);
}

// Socket disconnect from the server
function onSocketDisconnect() {
    console.log('Disconnected from socket server');
};

// New Player
function onNewPlayer(data) {
    //Display new player message in console
    console.log('New player connected: ' + data.id);

    postMessage(JSON.stringify({
        type: 'newPlayer',
        data: data
    }));
};

// Player moves
function onMovePlayer(data) {
    postMessage(JSON.stringify({
        type: 'movePlayer',
        data: data
    }));
};

// Remove a Player
function onRemovePlayer(data) {
    postMessage(JSON.stringify({
        type: 'removePlayer',
        data: data
    }));
};

function onUpdatePlayer(data) {
    socket.emit(
        'move player',
        {
            x: data.x,
            y: data.y
        }
    );
}