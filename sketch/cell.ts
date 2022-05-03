class Cell {
  public static cellWidth: number = 16;
  public static cellHeight: number = 16;
  
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

  render(color: any) {
    fill(color);
    noStroke();
    rect(this._position.trueX, this._position.trueY, Cell.cellWidth - 1, Cell.cellHeight - 1);
  }

  public get fCost() {
    return this._fCost;
  }
}