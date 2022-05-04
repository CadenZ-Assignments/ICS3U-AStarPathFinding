// the grid dimensions
const gridWidth = 20;
const gridHeight = 20;

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
let startCell: Cell;
let endCell: Cell;

// finished path
let path: Array<Position> = new Array<Position>();

// setup function is setting up how big each cell is based on the canvas dimensions and grid dimensions.
// it also creates the canvas and sets up the grid.

let restartButton: any;

function setup() {
  Cell.cellWidth = canvasWidth / gridWidth;
  Cell.cellHeight = canvasHeight / gridHeight;
  createCanvas(canvasWidth, canvasHeight);
  Helper.setupGrid();
  // setup path to go from top left to bottom right
  Helper.initPath(new Position(0, 0), new Position(gridWidth - 1, gridHeight - 1));

  restartButton = createButton("Restart path finding");
  restartButton.position(canvasWidth/2, canvasHeight + 50);
  restartButton.mousePressed(function() {
    Helper.initPath(new Position(0, 0), new Position(gridWidth - 1, gridHeight - 1));
  });
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

  // render path
  for (let i = 0; i < path.length; i++) {
    let pos = path[i];
    grid[pos.x][pos.y].render(color(0, 0, 255));
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
    
    // needs to reset path before calling retrace path because retrace path does not clear the path array. It only adds path to it.
    path = [];
    Helper.retracePath(winningCell, path);

    if (winningCell == endCell) {
      console.log("Annnnnnd we are done");
      // clear out the open set as we are done.
      openSet = [];
      closedSet = [];

      // same thing
      path = [];
      Helper.retracePath(winningCell, path);

      // add the end cell to path as well because retracePath does not add the base position to the array
      path.push(winningCell.position);
      return;
    }

    // basically removes the winning cell from the open set
    openSet = openSet.filter((cell) => cell != winningCell);
    closedSet.push(winningCell);

    /**
     * Instead of initializing neighbors when grid is being setup and storing it in the cell, we are getting the neighbors at algorithm run time.
     */
    let neighbors: Array<Cell> = Helper.getNeighbors(winningCell);
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      // if the neighbor is 
      if (neighbor.isObstructed) continue;

      // if closedSet does not contain  
      if (closedSet.indexOf(neighbor) == -1) {
        var tempG = neighbor.position.distance(endCell.position);

        let newG: boolean = false;
        // if openSet contains
        if (openSet.indexOf(neighbor) != -1) {
          if (tempG < neighbor.gCost) {
            neighbor.gCost = tempG;
            newG = true;
          }
        } else {
          neighbor.gCost = tempG;
          newG = true;
          openSet.push(neighbor);
        }

        if (newG) {
          neighbor.hCost = neighbor.position.distance(endCell.position);
          neighbor.fCost = neighbor.gCost + neighbor.hCost;
          neighbor.parent = winningCell;
        }
      }
    }

  } else {
    if (path.filter((element) => element == endCell.position).length == 0) {
      path = [];
      console.log("No Solution");
      return;
    }
  }
}

function mouseClicked() {
  let gridPos = Position.trueToGridPos(mouseX, mouseY);
  if (Helper.isValidPosition(gridPos)) {
    grid[gridPos.x][gridPos.y].toggleObstructed();
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
    openSet = [];
    closedSet = [];
    path = [];
    openSet.push(startCell);
  }

  export function isValidPosition(pos: Position): boolean {
    return pos.x < gridWidth && pos.x >= 0 && pos.y < gridHeight && pos.y >= 0;
  }



  const corners = true;

  export function getNeighbors(cell: Cell): Array<Cell> {
    var neighbors = new Array<Cell>();

    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        // the base node itself
        if (i == 0 && j == 0) {
          continue;
        }

        if (!corners && Math.abs(i) + Math.abs(j) > 1) {
          continue;
        }

        var x = cell.position.x + i;
        var y = cell.position.y + j;
        var pos = new Position(x, y);

        if (!isValidPosition(pos)) continue;

        neighbors.push(grid[x][y]);
      }
    }

    return neighbors;
  }

  /**
   * instead of using a loop we are using a recursive function.
   */
  export function retracePath(base: Cell, parents: Array<Position>) {
    if (base.parent === null)
    {
      parents.push(base.position);
      return;
    }

    parents.push(base.parent.position);
    retracePath(base.parent, parents);
  }
}