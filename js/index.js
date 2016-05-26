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
        timeInterval: 600,
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
    init(coordinate, snake);



    // Functions
    function init(coordinate, snake) {
        coordinate.grid = new Array(V_GRID);
        for (var i = 0; i < V_GRID; i++) {
            coordinate.grid[i] = new Array(H_GRID);
            if (i === 0 || i === V_GRID - 1) {
                for (var j = 0; j < H_GRID; j++) {
                    coordinate.grid[i][j] = OCCUPANT.TAKEN;
                }
            }
            else {
                for (var j = 0; j < H_GRID; j++) {
                    if (j === 0 || j === H_GRID - 1) {
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
        snake.head = snake.position[0];
        snake.tail = snake.position[snake.position.length - 1];
        snake.length = 4;
        snake.direction = { head: "+x", tail: "+x" };
        coordinate.fillGrid(snake);
        drawSnake(snake);
    }

    function fillGrid(snake) {
        for (var i = 0; i < snake.position.length; i++) {
            var pos = snake.position[i];
            if (0 < pos.x < H_GRID && 0 < pos.y < V_GRID) {
                this.grid[pos.y][pos.x] = OCCUPANT.TAKEN;
            }
            else {
                throw (new Error("Invalid coordinate position."));
            }
        }
        return;
    }

    function start() {
        inGame = true;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        init(coordinate, snake);
        // timer.run();
    }
    function drawSnake(snake) {
        drawHead(snake.direction.head, snake.head.x, snake.head.y);
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
});


