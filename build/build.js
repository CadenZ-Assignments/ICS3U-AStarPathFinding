var Cell = (function () {
    function Cell(position) {
        this._position = position;
        this._fCost = 0;
        this._gCost = 0;
        this._hCost = 0;
    }
    Cell.prototype.render = function () {
        console.log(this._position.x);
        console.log(this._position.y);
        fill(255);
        stroke(10);
        rect(this._position.trueX, this._position.trueY, Cell.cellWidth - 1, Cell.cellHeight - 1);
    };
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
var gridWidth = 5;
var gridHeight = 5;
var canvasWidth = 800;
var canvasHeight = 800;
var grid = new Array();
var openSet = new Array();
var closedSet = new Array();
var startCell;
var endcell;
function setup() {
    Cell.cellWidth = canvasWidth / gridWidth;
    Cell.cellHeight = canvasHeight / gridHeight;
    createCanvas(canvasWidth, canvasHeight);
    Helper.setupGrid();
}
function draw() {
    background(0);
    for (var i = 0; i < gridWidth; i++) {
        for (var j = 0; j < gridHeight; j++) {
            grid[i][j].render();
        }
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
        endcell = grid[end.x][end.y];
    }
    Helper.initPath = initPath;
    function isValidPosition(pos) {
        return pos.x < gridWidth && pos.x >= 0 && pos.y < gridHeight && pos.y >= 0;
    }
    Helper.isValidPosition = isValidPosition;
})(Helper || (Helper = {}));
//# sourceMappingURL=build.js.map