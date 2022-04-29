class Position {
  private readonly _x: number;
  private readonly _y: number;
  
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }
}