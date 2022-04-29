class Position {

  // position on the grid
  private readonly _x: number;
  private readonly _y: number;
  
  // the position used to render the position
  private readonly _trueX: number;
  private readonly _trueY: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;

    this._trueX = x*Cell.nodeSize;
    this._trueY = x*Cell.nodeSize;
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  public get trueX() {
    return this._trueX;
  }

  public get trueY() {
    return this._trueY;
  }

  public distance(other: Position): number
  {
    return Position.distanceBetween(this, other);
  }

  public static distanceBetween(a: Position, b: Position): number
  {
    // d = sqrt((x2-x1)^2 + (y2-y1)^2)
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }
}