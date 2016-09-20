// Simple input class

function Input(up, left, right, down) {
    var params = {
        up: up || false,
        left: left || false,
        right: right || false,
        down: down || false
    };

    function onKeyDown(e) {
        switch (e.keyCode) {
            case 37: // Left
                params.left = true;
                break;
            case 38: // Up
                params.up = true;
                break;
            case 39: // Right
                params.right = true;
                break;
            case 40: // Down
                params.down = true;
                break;
        };
    };

    function onKeyUp(e) {
        switch (e.keyCode) {
            case 37: // Left
                params.left = false;
                break;
            case 38: // Up
                params.up = false;
                break;
            case 39: // Right
                params.right = false;
                break;
            case 40: // Down
                params.down = false;
                break;
        };
    };

    return {
        params: params,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp
    };
};