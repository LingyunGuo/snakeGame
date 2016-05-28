// Constants
var WIDTH = 720;
var HEIGHT = 480;
var UNIT = 20;
var H_GRID = WIDTH / UNIT + 2;
var V_GRID = HEIGHT / UNIT + 2;
var OCCUPANT = { TAKEN: "1", FOOD: "2", SPACE: "0" };
//
var inGame;
var pause;
var score;
var turning;
// Class
var Position = function (x, y) {
    return { x: x, y: y };
};

$(document).ready(function () {
    var canvas = $('#canvas');
    var ctx = canvas.get(0).getContext("2d");
    var snake = {};
    var food = {};
    var coordinate = {
        fillGrid: fillGrid
    };
    var timer = {
        timeInterval: 180,
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
    pause = false;
    $(document).keydown(function (event) {
        if (inGame === true && pause === false) {
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

    function fillGrid(snake, cut) {
        if (cut) {
            var clearPos = snake.position[snake.position.length - 1];
            if (0 < clearPos.x < V_GRID && 0 < clearPos.y < H_GRID) {
                this.grid[clearPos.x][clearPos.y] = OCCUPANT.SPACE;
            }
            snake.position.pop();
        }

        var newPos = snake.position[0];

        if (0 < newPos.x < V_GRID && 0 < newPos.y < H_GRID) {
            this.grid[newPos.x][newPos.y] = OCCUPANT.TAKEN;
        }
    }

    function start() {
        score = 0;
        inGame = true;
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        init(coordinate, snake);
        $('.btnPanel').css("display", "none");
        $(".score_in_panel").html(score);
        $('.score2Wrap').css("display", "block");
        var fast = $('#myonoffswitch').attr("checked");
        if (fast) {
            console.log('fast');
            timer.set(100);
        }
        else {
            timer.set(180);
        }
        timer.run();
        generateFood();
    }
    function drawSnake(snake) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        if (food.position && food.type) {
            drawFood(food.position.x, food.position.y, food.type);
        }
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
        var tail = JSON.parse(JSON.stringify(snake.position[snake.position.length - 1]));
        var nextPos = JSON.parse(JSON.stringify(snake.position[0]));
        switch (dir) {
            case "+x":
                nextPos.x++;
                break;
            case "-x":
                nextPos.x--;
                break;
            case "+y":
                nextPos.y--;
                break;
            default:
                nextPos.y++;
                break;
        }
        var go = (coordinate.grid[nextPos.x][nextPos.y] === OCCUPANT.SPACE);
        var eat = (coordinate.grid[nextPos.x][nextPos.y] === OCCUPANT.FOOD);
        if (eat) {
            score += 10;
            $(".score_in_panel").html(score);
            snake.position.unshift(nextPos);
            snake.length++;
            food = {};
            generateFood();
            coordinate.fillGrid(snake, false);
            drawSnake(snake);
            if (turning) {
                turning = false;
            }
        }
        else if (go) {
            snake.position.unshift(nextPos);
            coordinate.fillGrid(snake, true);
            drawSnake(snake);
            if (turning) {
                turning = false;
            }
        }
        else {
            timer.stop(function () {
                inGame = false;
                pause = false;
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = '#E0E0E0';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                $("#btn_in_panel").html("Again");
                $(".score_in_panel").html(score);
                $('.btnPanel').css("display", "block");
                $('.score2Wrap').css("display", "none");
            });
            return;
        }
    }
    function turnSnake(newDir) {
        snake.direction = newDir;
        drawSnake(snake);
    }

    function generateFood() {
        var HorizontalRan;
        var VerticalRan;
        do {
            HorizontalRan = Math.floor((Math.random() * H_GRID) - 1);
            VerticalRan = Math.floor((Math.random() * V_GRID) - 1);
        }
        while (coordinate.grid[HorizontalRan][VerticalRan] !== OCCUPANT.SPACE);
        coordinate.grid[HorizontalRan][VerticalRan] = OCCUPANT.FOOD;
        food.position = Position(HorizontalRan, VerticalRan);
        food.type = Math.floor((Math.random() * 4) + 1);
        drawFood(HorizontalRan, VerticalRan, food.type);
    }
    function drawFood(x, y, type) {
        var img = document.getElementById("candy" + type);
        ctx.drawImage(img, (x - 1) * UNIT, (y - 1) * UNIT);
    }
    function keyboardHandler(key) {
        var currentDir = snake.direction;
        var newDir;
        if ([1, 2, 3, 4, 37, 38, 39, 40, 269, 270, 271, 272, 32].indexOf(key) >= 0 && !turning) {
            if (key !== 32) {
                turning = true;
            }
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
                case 32:
                    timer.stop(function () {
                        inGame = false;
                        pause = true;
                        ctx.globalAlpha = 0.4;
                        ctx.fillStyle = '#E0E0E0';
                        ctx.fillRect(0, 0, WIDTH, HEIGHT);
                        $("#btn_in_panel").html("Continue");
                        $('.btnPanel').css("display", "block");
                        $('.score2Wrap').css("display", "none");
                        $(".score_in_panel").html(score);
                        $(".switchWrap").css("display", "none");
                    });
                    break;
                default: break;
            }
            if (newDir !== undefined && currentDir !== newDir && currentDir[1] !== newDir[1]) {
                turnSnake(newDir);
            }
        }
    }
    $("#btn_in_panel").click(function () {
        if (inGame === false && pause === true) {
            pause = false;
            inGame = true;
            timer.run();
            ctx.globalAlpha = 1;
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            $('.btnPanel').css("display", "none");
            $('.score2Wrap').css("display", "block");
            $(".switchWrap").css("display", "inline-block");
            drawSnake(snake);
        }
        else if (inGame === false && pause === false) {
            start();
        }
    });
});


