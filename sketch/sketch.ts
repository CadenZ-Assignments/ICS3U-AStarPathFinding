// the grid dimensions
const gridWidth = 5;
const gridHeight = 5;

// the grid we are gonna be working with.
const grid = new Array<Array<Cell>>(gridWidth);

// a* stuff
let openSet = new Array<Cell>();
let closedSet = new Array<Cell>();

let startCell;
let endcell;

function setup() {
  createCanvas(200, 200);
  Helper.setupGrid();
}

function draw() {
  background(100);
}

// helper functions for the program
namespace Helper {
  /**
  * Instead using 1 loop to fill the rows, another to fill the "spots". only using 1 loop in total.
  */
  export function setupGrid() {
    // loop through amount of rows
    for (let i = 0; i < gridWidth; i++) {
      // create row
      let row = new Array<Cell>(gridHeight);
      // fill row with column
      for (let j = 0; j < gridHeight; j++) {
        row.push(new Cell(new Position(i, j)));
      }
      grid.push(row);
    }
  }
  
  export function initPath(start: Position, end: Position) {
    if (!isValidPosition(start) || !isValidPosition(end)) {
      return;
    }
  
    startCell = grid[start.x][start.y];
    endcell = grid[end.x][end.y];
  }
  
  export function isValidPosition(pos: Position): boolean {
    return pos.x < gridWidth && pos.x >= 0 && pos.y < gridHeight && pos.y >= 0;
  }8
}