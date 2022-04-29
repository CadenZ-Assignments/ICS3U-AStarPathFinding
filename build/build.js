var Node = (function () {
    function Node(position) {
        this._position = position;
    }
    Node.prototype.render = function () {
    };
    Node.nodeSize = 16;
    return Node;
}());
var Position = (function () {
    function Position(x, y) {
        this._x = x;
        this._y = y;
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
    return Position;
}());
function setup() {
    createCanvas(windowWidth, windowHeight);
}
function draw() {
    background(100);
}
//# sourceMappingURL=build.js.map