// Constants
var WIDTH = 720;
var HEIGHT = 480;
var UNIT = 20;
var H_GRID = WIDTH / UNIT + 2;
var V_GRID = HEIGHT / UNIT + 2;
var OCCUPANT = { TAKEN: "1", FOOD: "2", SPACE: "0" };
//
var inGame;

// Class
var Position = function (x, y) {
    return { x: x, y: y };
};



$(document).ready(function () {
    var canvas = $('#canvas');
    var ctx = canvas.get(0).getContext("2d");
    var snake = {};
    var coordinate = {
        fillGrid: fillGrid
    };
    var timer = {
        timeInterval: 300,
        run: function () {
            this.interval = setInterval(moveSnake, this.timeInterval);
        },
        set: function (newInterval) {
            this.timeInterval = newInterval;
        },
        stop: function (cb) {
            clearInterval(this.interval);
            cb();
        }
    };
    inGame = false;
    start();
    $(document).keydown(function (event) {
        if (inGame === true) {
            keyboardHandler(event.which);
        }
    });

    // Functions
    function init(coordinate, snake) {
        coordinate.grid = new Array(H_GRID);
        for (var i = 0; i < H_GRID; i++) {
            coordinate.grid[i] = new Array(V_GRID);
            if (i === 0 || i === H_GRID - 1) {
                for (var j = 0; j < V_GRID; j++) {
                    coordinate.grid[i][j] = OCCUPANT.TAKEN;
                }
            }
            else {
                for (var j = 0; j < V_GRID; j++) {
                    if (j === 0 || j === V_GRID - 1) {
                        coordinate.grid[i][j] = OCCUPANT.TAKEN;
                    }
                    else {
                        coordinate.grid[i][j] = OCCUPANT.SPACE;
                    }
                }
            }
        }
        snake.position = [];
        snake.position.push(Position(4, 1));
        snake.position.push(Position(3, 1));
        snake.position.push(Position(2, 1));
        snake.position.push(Position(1, 1));
        snake.length = 4;
        snake.direction = "+x";
        for (var i = 0; i < snake.position.length; i++) {
            var pos = snake.position[i];
            if (0 < pos.x < V_GRID && 0 < pos.y < H_GRID) {
                coordinate.grid[pos.x][pos.y] = OCCUPANT.TAKEN;
            }
            else {
                throw (new Error("Invalid coordinate position."));
            }
        }
        drawSnake(snake);
    }

    function fillGrid(snake) {
        var clearPos = snake.position[snake.position.length - 1];
        var newPos = snake.position[0];
        if (0 < clearPos.x < V_GRID && 0 < clearPos.y < H_GRID) {
            this.grid[clearPos.x][clearPos.y] = OCCUPANT.SPACE;
        }
        if (0 < newPos.x < V_GRID && 0 < newPos.y < H_GRID) {
            this.grid[newPos.x][newPos.y] = OCCUPANT.TAKEN;
        }
    }

    function start() {
        inGame = true;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        init(coordinate, snake);
        timer.run();
    }
    function drawSnake(snake) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        drawHead(snake.direction, snake.position[0].x, snake.position[0].y);
        for (var i = 1; i < snake.position.length; i++) {
            drawTail(snake.position[i].x, snake.position[i].y);
        }
    }
    function drawHead(dir, x, y) {
        var img = document.getElementById("head_icon" + dir);
        ctx.drawImage(img, (x - 1) * UNIT, (y - 1) * UNIT);
    }
    function drawTail(x, y) {
        var img = document.getElementById("tail_icon");
        ctx.drawImage(img, (x - 1) * UNIT, (y - 1) * UNIT);
    }

    function moveSnake() {
        var dir = snake.direction;
        for (var i = snake.position.length - 1; i > 0; i--) {
            snake.position[i] = JSON.parse(JSON.stringify(snake.position[i - 1]));
        }
        switch (dir) {
            case "+x":
                snake.position[0].x++;
                break;
            case "-x":
                snake.position[0].x--;
                break;
            case "+y":
                snake.position[0].y--;
                break;
            default:
                snake.position[0].y++;
                break;
        }
        var go = (coordinate.grid[x][y] !== OCCUPANT.TAKEN);
        if (go) {
            coordinate.fillGrid(snake);
            drawSnake(snake);
        }
        else {
            timer.stop(function () {
                inGame = false;
                console.log('game failed');
            });
        }
    }
    function turnSnake(newDir) {
        snake.direction = newDir;
        drawSnake(snake);
    }
    function keyboardHandler(key) {
        var currentDir = snake.direction;
        var newDir;
        switch (key) {
            case 1:
            case 38:
            case 269:
                newDir = "+y";
                break;
            case 2:
            case 40:
            case 270:
                newDir = "-y";
                break;
            case 3:
            case 37:
            case 271:
                newDir = "-x";
                break;
            case 4:
            case 39:
            case 272:
                newDir = "+x";
                break;
            default:
                console.log("key not implemented yet");
        }
        if (newDir !== undefined && currentDir !== newDir && currentDir[1] !== newDir[1]) {
            turnSnake(newDir);
        }
    }
});


