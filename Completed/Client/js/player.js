// Our player class

var Player = function(startX, startY) {
	var x = startX,
		y = startY,
        id,
        color,
		moveAmount = 2;

    // Getter and setters
	var getX = function () {
	    return x;
	};

	var getY = function () {
	    return y;
	};

	var setX = function (newX) {
	    x = newX;
	};

	var setY = function (newY) {
	    y = newY;
	};

	var update = function (keys) {

        // Save the position values
	    var prevX = x,
            prevY = y;

		if (keys.up) {
			y -= moveAmount;
		} else if (keys.down) {
			y += moveAmount;
		};

		if (keys.left) {
			x -= moveAmount;
		} else if (keys.right) {
			x += moveAmount;
		};

	    //Return true value if player has moved
		return (prevX != x || prevY != y) ? true : false;
	};

    //A little helper function to give us a random color
	randomPieceOfTheRainbow = function () {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

	ctx.fillStyle = randomPieceOfTheRainbow();

	var draw = function (ctx) {
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