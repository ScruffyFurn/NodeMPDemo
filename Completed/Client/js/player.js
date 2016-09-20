// Our player class

function Player(startX, startY) {
    var x = startX,
        y = startY,
        id,
        color,
        moveAmount = 2;

    // Getter and setters
    function getX() {
        return x;
    }

    function getY() {
        return y;
    }

    function setX(newX) {
        x = newX;
    }

    function setY(newY) {
        y = newY;
    }

    function update(keys) {
        // Save the position values
        var prevX = x,
            prevY = y;

        if (keys.params.up) {
            y -= moveAmount;
        } else if (keys.params.down) {
            y += moveAmount;
        };

        if (keys.params.left) {
            x -= moveAmount;
        } else if (keys.params.right) {
            x += moveAmount;
        };

        // Return true value if player has moved
        return (prevX != x || prevY != y) ? true : false;
    };

    // A little helper function to give us a random color
    function randomPieceOfTheRainbow() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';

        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }

    ctx.fillStyle = randomPieceOfTheRainbow();

    function draw(ctx) {
        ctx.fillRect(x - 5, y - 5, 10, 10);
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        update: update,
        draw: draw,
        id:id
    }
};