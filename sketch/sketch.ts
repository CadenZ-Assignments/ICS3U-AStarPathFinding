//ok. so at the top here, gridWidth and gridHeight is how many cells we should have on the x and y axis. in this case im just using 5, but we can change whenever we want to.


// the grid dimensions
const gridWidth = 5;
const gridHeight = 5;

// this is the canvas size. it is used to initialize the canvas. it is also used to calculate how big each cell should be to fit the entire canvas.

// canvas dimensions
const canvasWidth = 800;
const canvasHeight = 800;

// this is an 2D array, so it looks something like this:
// [
// [],
// []
//]
// it is an array that contains arrrays. in this case used to represent the grid. because the grid is a 2d space.
// 0 1 2 3 4
// 1
// 2
// 3

// the grid we are gonna be working with.
const grid = new Array<Array<Cell>>();

// the openset&closedSet is a part of the a* pathfinding algorithm. openSet represents cells that we have NOT evaluated yet. closedSet represents cells that we HAVE already evaluated. By evaluated i mean evaluated as a possible path in the pathfinding process.

// a* stuff
let openSet = new Array<Cell>();
let closedSet = new Array<Cell>();

// startCell is used by A* pathfinding as well. It represents where the pathfinding starts. End represents the end.

let startCell;
let endCell;

// setup function is setting up how big each cell is based on the canvas dimensions and grid dimensions.
// it also creates the canvas and sets up the grid.

function setup() {
  Cell.cellWidth = canvasWidth / gridWidth;
  Cell.cellHeight = canvasHeight / gridHeight;
  createCanvas(canvasWidth, canvasHeight);
  Helper.setupGrid();
  // setup path to go from top left to bottom right
  Helper.initPath(new Position(0, 0), new Position(gridWidth - 1, gridHeight - 1));
}

// draw function is self explanatory. It renders a background, and it renders all the cells on the grid.
function draw() {
  // clears screen
  background(0);

  // renders the grid
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      grid[i][j].render(255);
    }
  }

  // render open and close set over original grid
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].render(color(0, 255, 0));
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].render(color(255, 0, 0));
  }
  
  // path finding
  if (openSet.length > 0) {
    // still have cells left to evaluate
    
    // find the cell with the lowest F value
    let winningIndex = 0;

    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].fCost < openSet[winningIndex].fCost) {
        winningIndex = i;
      }
    }

    let winningCell = openSet[winningIndex];
    
    if (winningCell == endCell) {
      console.log("reached end");
    }

    // closedSet.push(winningCell);
    
  } else {
    // no solution
  }
}







// helper functions for the program
namespace Helper {

  // setup grid is used to actually setup the grid. It fills the 2D array. it loops through the first array. then fills them with the second array. if this is hard to understand see it this way. look at the grid rendered to the right.
  // you have 5 cells horizontally on every column, right?
  // each one of those is 1 array in the first array.
  // each column also contains 5 cells. therefore we have a 2d array. aka a 5x5 grid.
 
  /**
  * Instead using 1 loop to fill the rows, another to fill the "spots". only using 1 loop in total.
  */
  export function setupGrid() {
    // loop through amount of columns
    for (let i = 0; i < gridWidth; i++) {
      // create column
      let column = new Array<Cell>();
      // fill column with cells
      for (let j = 0; j < gridHeight; j++) {
        column.push(new Cell(new Position(i, j)));
      }
      grid.push(column);
    }
  }

  // this function is used to initialize the path that we are trying to pathfind through. It basically checks if the position you gave it is a valid position and sets the starting and ending position to what you gave it.
  export function initPath(start: Position, end: Position) {
    if (!isValidPosition(start) || !isValidPosition(end)) {
      return;
    }
  
    startCell = grid[start.x][start.y];
    endCell = grid[end.x][end.y];
    openSet.push(startCell);
  }
  
  export function isValidPosition(pos: Position): boolean {
    return pos.x < gridWidth && pos.x >= 0 && pos.y < gridHeight && pos.y >= 0;
  }
}