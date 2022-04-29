class Cell {
  public static readonly nodeSize: number = 16;

  private readonly _position: Position;
  private _fCost: number;
  private _gCost: number;
  private _hCost: number;

  constructor(position: Position) {
    this._position = position;
    this._fCost = 0;
    this._gCost = 0;
    this._hCost = 0;
  }

  render() {
    rect(
      this._position.x, 
      this._position.y,
      Cell.nodeSize,
      Cell.nodeSize
    );
  }
}