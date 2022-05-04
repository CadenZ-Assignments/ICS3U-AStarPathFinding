var Cell = (function () {
    function Cell(position) {
        this._position = position;
        this.parent = null;
        this.fCost = 0;
        this.gCost = 0;
        this.hCost = 0;
    }
    Cell.prototype.render = function (color) {
        fill(color);
        noStroke();
        rect(this._position.trueX, this._position.trueY, Cell.cellWidth - 1, Cell.cellHeight - 1);
    };
    Object.defineProperty(Cell.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Cell.cellWidth = 16;
    Cell.cellHeight = 16;
    return Cell;
}());
var Position = (function () {
    function Position(x, y) {
        this._x = x;
        this._y = y;
        this._trueX = x * Cell.cellWidth;
        this._trueY = y * Cell.cellHeight;
    }
    Object.defineProperty(Position.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "trueX", {
        get: function () {
            return this._trueX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "trueY", {
        get: function () {
            return this._trueY;
        },
        enumerable: true,
        configurable: true
    });
    Position.prototype.distance = function (other) {
        return Position.distanceBetween(this, other);
    };
    Position.distanceBetween = function (a, b) {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    };
    return Position;
}());
var gridWidth = 20;
var gridHeight = 20;
var canvasWidth = 800;
var canvasHeight = 800;
var grid = new Array();
var openSet = new Array();
var closedSet = new Array();
var startCell;
var endCell;
var path = new Array();
function setup() {
    Cell.cellWidth = canvasWidth / gridWidth;
    Cell.cellHeight = canvasHeight / gridHeight;
    createCanvas(canvasWidth, canvasHeight);
    Helper.setupGrid();
    Helper.initPath(new Position(0, 0), new Position(gridWidth - 1, gridHeight - 1));
}
function draw() {
    background(0);
    for (var i = 0; i < gridWidth; i++) {
        for (var j = 0; j < gridHeight; j++) {
            grid[i][j].render(255);
        }
    }
    for (var i = 0; i < openSet.length; i++) {
        openSet[i].render(color(0, 255, 0));
    }
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].render(color(255, 0, 0));
    }
    for (var i = 0; i < path.length; i++) {
        var pos = path[i];
        grid[pos.x][pos.y].render(color(0, 0, 255));
    }
    if (openSet.length > 0) {
        var winningIndex = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].fCost < openSet[winningIndex].fCost) {
                winningIndex = i;
            }
        }
        var winningCell_1 = openSet[winningIndex];
        Helper.retracePath(winningCell_1, path);
        if (winningCell_1 == endCell) {
            console.log("Annnnnnd we are done");
            openSet = [];
            path.push(winningCell_1.position);
            return;
        }
        openSet = openSet.filter(function (cell) { return cell != winningCell_1; });
        closedSet.push(winningCell_1);
        var neighbors = Helper.getNeighbors(winningCell_1);
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (closedSet.indexOf(neighbor) == -1) {
                var tempG = neighbor.position.distance(startCell.position);
                if (openSet.indexOf(neighbor) != -1) {
                    if (tempG < neighbor.gCost) {
                        neighbor.gCost = tempG;
                    }
                }
                else {
                    neighbor.gCost = tempG;
                    openSet.push(neighbor);
                }
                neighbor.hCost = neighbor.position.distance(endCell.position);
                neighbor.fCost = neighbor.gCost + neighbor.hCost;
                neighbor.parent = winningCell_1;
            }
        }
    }
    else {
    }
}
var Helper;
(function (Helper) {
    function setupGrid() {
        for (var i = 0; i < gridWidth; i++) {
            var column = new Array();
            for (var j = 0; j < gridHeight; j++) {
                column.push(new Cell(new Position(i, j)));
            }
            grid.push(column);
        }
    }
    Helper.setupGrid = setupGrid;
    function initPath(start, end) {
        if (!isValidPosition(start) || !isValidPosition(end)) {
            return;
        }
        startCell = grid[start.x][start.y];
        endCell = grid[end.x][end.y];
        openSet.push(startCell);
    }
    Helper.initPath = initPath;
    function isValidPosition(pos) {
        return pos.x < gridWidth && pos.x >= 0 && pos.y < gridHeight && pos.y >= 0;
    }
    Helper.isValidPosition = isValidPosition;
    var corners = true;
    function getNeighbors(cell) {
        var neighbors = new Array();
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) {
                    continue;
                }
                if (!corners && Math.abs(i) + Math.abs(j) > 1) {
                    continue;
                }
                var x = cell.position.x + i;
                var y = cell.position.y + j;
                var pos = new Position(x, y);
                if (!isValidPosition(pos))
                    continue;
                neighbors.push(grid[x][y]);
            }
        }
        return neighbors;
    }
    Helper.getNeighbors = getNeighbors;
    function retracePath(base, parents) {
        if (base.parent === null) {
            parents.push(base.position);
            return;
        }
        parents.push(base.parent.position);
        retracePath(base.parent, parents);
    }
    Helper.retracePath = retracePath;
})(Helper || (Helper = {}));
//# sourceMappingURL=build.js.map