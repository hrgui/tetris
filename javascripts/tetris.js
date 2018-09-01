/**
 * Another tetris clone
 * @author hrgui
 */

(function() {
    // key presses
    var keys = {
        "KEY_UP": 38,
        "KEY_DOWN": 40,
        "KEY_LEFT": 37,
        "KEY_RIGHT": 39
    };
    var GRID_HEIGHT = 20;
    var GRID_WIDTH = 10;
    var GAME_SPEED = 333;

    var currentBlock;
    var htmlGrid = {};
    var map = {};

    var gameInterval;

    var EMPTY_COLOR = "black";
    var NEON_PURPLE = "#cc66ff";
    var NEON_BLUE = "#63c3e7";
    var NEON_RED = "#ec1341";
    var YELLOW = "yellow";
    var AQUA = "aqua";
    var LIME_GREEN = "#56d445";
    var ORANGE = "orange";


    function Block() {
        //4x4 grid
        this.grid = [
            [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
            [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
            [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
            [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR]
        ];

        this.x = GRID_WIDTH / 2 - 2;
        this.y = -1;
        var blockType = parseInt(Math.random() * 7);
        switch (blockType) {
            case 0: // stick
                this.grid[1] = [AQUA, AQUA, AQUA, AQUA];
                this.y = 0;
                break;
            case 1:
                this.grid[1][1] = YELLOW;
                this.grid[1][2] = YELLOW;
                this.grid[2][1] = YELLOW;
                this.grid[2][2] = YELLOW;
                break;
            case 2:
                this.grid[1][1] = NEON_PURPLE;
                this.grid[0][2] = NEON_PURPLE;
                this.grid[1][2] = NEON_PURPLE;
                this.grid[2][2] = NEON_PURPLE;
                break;
            case 3:
                this.grid[0][1] = LIME_GREEN;
                this.grid[1][1] = LIME_GREEN;
                this.grid[1][2] = LIME_GREEN;
                this.grid[2][2] = LIME_GREEN;
                break;
            case 4:
                this.grid[2][1] = NEON_RED;
                this.grid[1][1] = NEON_RED;
                this.grid[1][2] = NEON_RED;
                this.grid[0][2] = NEON_RED;
                break;
            case 5:
                this.grid[1][1] = NEON_BLUE;
                this.grid[2][1] = NEON_BLUE;
                this.grid[2][2] = NEON_BLUE;
                this.grid[2][3] = NEON_BLUE;
                break;
            case 6:
                this.grid[2][1] = ORANGE;
                this.grid[1][1] = ORANGE;
                this.grid[1][2] = ORANGE;
                this.grid[1][3] = ORANGE;
        }
    }

    function endGame() {
        console.log("game is lost");
        clearInterval(gameInterval);
        startGame();
    }

    function move(x, y) {
        if (checkCollision(x, y)) {
            if (y == 1) {
                if (currentBlock.y < 1) {
                    endGame();
                    return;
                } else {
                    var killBlock = false;
                    // if the block has reached some sort of ground....
                    for (var i = 0; i < 4; i++) {
                        for (var j = 0; j < 4; j++) {
                            if (currentBlock.grid[i][j] != EMPTY_COLOR) {
                                map[currentBlock.x + i][currentBlock.y + j] = currentBlock.grid[i][j];
                            }
                        };
                    };

                    // a linear search to look for a filled space
                    for (var j = 0; j < GRID_HEIGHT; j++) {
                        var filled = true; // assume true
                        for (var i = 0; i < GRID_WIDTH; i++) {
                            if (map[i][j] == EMPTY_COLOR) {
                                filled = false; // If we saw an empty color, then its not filled
                            }
                        }

                        // otherwise, if it is filled, we must remove the row
                        if (filled) {
                            removeRow(j);
                            killBlock = true;
                        }
                    }

                    // If it is the case that we end up clearing a row..., then we have to empty the block itself.
                    if (killBlock) {
                        for (var i = 0; i < 4; i++) {
                            for (var j = 0; j < 4; j++) {
                                currentBlock.grid[i][j] = EMPTY_COLOR;
                            }
                        }
                    }
                }
                currentBlock = new Block();
            }
        } else {
            currentBlock.x += x;
            currentBlock.y += y;
        }
        // collision?
        drawGrid();
    };

    function checkCollision(x, y) {
        if (!currentBlock) {
            return true;
        }

        var newx = currentBlock.x + x;
        var newy = currentBlock.y + y;

        // collision with the grid
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (currentBlock.grid[i][j] != EMPTY_COLOR) {
                    // if it's a block that we need to consider...
                    if (newx + i < 0 || newx + i > GRID_WIDTH - 1 || newy + j < 0 || newy + j > GRID_HEIGHT - 1) {
                        return true;
                    }
                }
            }
        }

        //collision with other blocks.
        for (var x = 0; x < GRID_WIDTH; x++) {
            for (var y = 0; y < GRID_HEIGHT; y++) {
                if (x >= newx && x < newx + 4) {
                    if (y >= newy && y < newy + 4) {
                        if (map[x][y] != EMPTY_COLOR) {
                            if (currentBlock.grid[x - newx][y - newy] != EMPTY_COLOR) {
                                return true;
                            }
                        }
                    }
                }
            }
        }

    }

    function drawTile(x, y, color) {
        htmlGrid[y][x].style.background = color;
    }


    function clearGrid() {
        var collection = document.getElementsByTagName("td");
        for (var i = 0; i < collection.length; i++) {
            collection[i].style.background = "pink";
        }
    }


    function drawGrid() {
        // clear the map
        clearGrid();

        for (var x = 0; x < GRID_WIDTH; x++) {
            for (y = 0; y < GRID_HEIGHT; y++) {
                drawTile(x, y, map[x][y]);
            }
        }
        if (currentBlock) {
            for (var x = 0; x < currentBlock.grid.length; x++) {
                for (var y = 0; y < currentBlock.grid[x].length; y++) {
                    if (currentBlock.grid[x][y] != EMPTY_COLOR) {
                        drawTile(currentBlock.x + x, currentBlock.y + y, currentBlock.grid[x][y]);
                    }

                }
            }
        }
    }

    function initMap() {
        for (var x = 0; x < GRID_WIDTH; x++) {
            map[x] = {};
            for (var y = 0; y < GRID_HEIGHT; y++) {
                map[x][y] = EMPTY_COLOR;
            }
        }
    }

    function rotateBlock() {
        var temp = [
            [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
            [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
            [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR],
            [EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR, EMPTY_COLOR]
        ];

        // first we copy and rotate the piece to the temporary array.
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                temp[3 - j][i] = currentBlock.grid[i][j];
            }
        };

        // Then we check the collisions of the temp array with the map borders
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (temp[i][j] != EMPTY_COLOR) {
                    if (currentBlock.x + i < 0 || currentBlock.x + i > GRID_WIDTH - 1 || currentBlock.y + j < 0 || currentBlock.j > GRID_HEIGHT - 1)
                        return; // dont allow rotation
                }
            }
        }

        // and now we check with the blocks on the map
        for (var x = 0; x < GRID_WIDTH; x++) {
            for (var y = 0; y < GRID_HEIGHT; y++) {
                if (x >= currentBlock.x && x < currentBlock.x + 4) {
                    if (y >= currentBlock.y && y < currentBlock.y + 4) {
                        if (map[x][y] != EMPTY_COLOR) {
                            if (temp[x - sPiece.x][y - sPiece.y] != EMPTY_COLOR) {
                                return;
                            }
                        }
                    }
                }
            }
        }
        // and if we are good, then great lets rotate the thing
        currentBlock.grid = temp;
    }

    function removeRow(row) {
        for (var x = 0; x < GRID_WIDTH; x++) {
            for (var y = row; y > 0; y--) {
                map[x][y] = map[x][y - 1];
            }
        }
    }

    function getChar(event) {
        if (event.which == 0 || event.which === null) {
            console.log("returned keycode");
            return event.keyCode;
        } else {
            console.log("returned which");
            return event.which;
        }
    }

    function handleKeyPressed(e) {
        var keyCode = getChar(e);
        switch (keyCode) {
            case keys.KEY_UP:
                rotateBlock();
                break;
            case keys.KEY_DOWN:
                move(0, 1);
                break;
            case keys.KEY_LEFT:
                move(-1, 0);
                break;
            case keys.KEY_RIGHT:
                move(1, 0);
                break;
            default:
                console.log(e.keyCode);
                break;
        }
    }

    function startGame() {
        initMap();
        currentBlock = new Block();
        document.onkeydown = handleKeyPressed;
        //document.onkeypress = handleKeyPressed;

        //Mobile stuff
        gameInterval = setInterval(function() {
            move(0, 1);
            drawGrid();
        }, GAME_SPEED);
    }

    function init(wrapper) {
        var table = document.createElement("table");
        table.cellPadding = 0;
        table.cellSpacing = 0;
        for (var i = 0; i < GRID_HEIGHT; i++) {
            var tr = table.insertRow(-1);
            htmlGrid[i] = {};
            for (var j = 0; j < GRID_WIDTH; j++) {
                var td = tr.insertCell(-1);
                htmlGrid[i][j] = td;
            }
        }
        wrapper.appendChild(table);
        startGame();
    };

    function initMobile(wrapper) {
        window.addEventListener('load', function() {
            var start = {
                x: 0,
                y: 0
            };
            var dist = {
                x: 0,
                y: 0
            };
            var THRESHOLD = {
                X: 25,
                Y: 10
            };
            var debug = document.getElementById("debug");

            wrapper.addEventListener('touchstart', function(e) {
                var touchObj = e.changedTouches[0]; // first touch point.
                start.x = parseInt(touchObj.pageX);
                start.y = parseInt(touchObj.pageY);
                debug.innerHTML = "START:" + start.x + "," + start.y;
                e.preventDefault();
            }, false);

            wrapper.addEventListener('touchmove', function(e) {
                var touchObj = e.changedTouches[0];
                e.preventDefault();
            }, false);

            wrapper.addEventListener('touchend', function(e) {
                var touchObj = e.changedTouches[0];
                dist.x = parseInt(touchObj.pageX) - start.x;
                dist.y = parseInt(touchObj.pageY) - start.y;
                debug.innerHTML = dist.x + "," + dist.y;

                if (dist.x > THRESHOLD.X) {
                    // move right
                    move(1, 0);
                } else if (dist.x < -THRESHOLD.X) {
                    // move left
                    move(-1, 0);
                } else if (dist.y < -THRESHOLD.Y) {
                    //rotateBlock
                    rotateBlock();
                } else if (dist.y > THRESHOLD.Y) {
                    // move down
                    move(0, 1);
                }
                e.preventDefault();
            });
        });

    }
    var wrapper = document.getElementById("tetris");
    initMobile(wrapper);
    init(wrapper);


})();