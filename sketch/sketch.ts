// the grid dimensions
const gridWidth = 20;
const gridHeight = 20;

// this is the canvas size. it is used to initialize the canvas. it is also used to calculate how big each cell should be to fit the entire canvas.

// canvas dimensions
const canvasWidth = 800;
const canvasHeight = 800;

// the grid we are gonna be working with.
const grid = new Array<Array<Cell>>();

// the openset&closedSet is a part of the a* pathfinding algorithm. openSet represents cells that we have NOT evaluated yet. closedSet represents cells that we HAVE already evaluated. By evaluated i mean evaluated as a possible path in the pathfinding process.
let openSet = new Array<Cell>();
let closedSet = new Array<Cell>();

// startCell is used by A* pathfinding as well. It represents where the pathfinding starts. End represents the end.
let startCell: Cell;
let endCell: Cell;

// finished path
let path: Array<Position> = new Array<Position>();

// setup function is setting up how big each cell is based on the canvas dimensions and grid dimensions.
// it also creates the canvas and sets up the grid.
let restartButton: p5.Element;

function setup() {
  Cell.cellWidth = canvasWidth / gridWidth;
  Cell.cellHeight = canvasHeight / gridHeight;
  createCanvas(canvasWidth, canvasHeight);
  
  // * the process starts here
  // * this function is defined on line 189
  // * it basically initializes the 2d array.
  Helper.setupGrid();
  // setup path to go from top left to bottom right
  // * this initializes the path, tells the program that we are going to try to path find from left top to bottom right.
  Helper.initPath(new Position(0, 0), new Position(gridWidth - 1, gridHeight - 1));

  // * this is a button that allows you to restart the process of path finding
  restartButton = createButton("Restart path finding");
  restartButton.position(canvasWidth/2 - 100, canvasHeight + 50);
  restartButton.size(200, 30)
  restartButton.mousePressed(function() {
    Helper.initPath(new Position(0, 0), new Position(gridWidth - 1, gridHeight - 1));
  });
}

// draw function is self explanatory. It renders a background, and it renders all the cells on the grid.
function draw() {
  // clears screen
  background(0);

  // renders the grid
  // * this takes all the cells on the grid and draws a rectangle.
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      grid[i][j].render(255);
    }
  }

  // render open and close set over original grid
  // * this takes all the cells left to evaluate and draws a green rectangle
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].render(color(0, 255, 0));
  }

  // * this takes all the already evaluated cells and draws a red rectangle
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].render(color(255, 0, 0));
  }

  // render path
  // * this takes the optimal path and draws a blue rectangle.
  for (let i = 0; i < path.length; i++) {
    let pos = path[i];
    grid[pos.x][pos.y].render(color(0, 0, 255));
  }

  // path finding
  // * path finding starts here, only continue if there are more cells to evaluate 
  if (openSet.length > 0) {
    // still have cells left to evaluate

    // find the cell with the lowest F value
    // * F Value is the "cost". Each cell has a g cost which is pretty much how far away the cell is from the starting point. A H cost, which is how far away is the cell from the end point. FCost which is the sum of HCost and GCost
    // * winningIndex is the index of the cell with the lowest F cost, meaning the most optimal step to take to get to the end from the beginning.
    let winningIndex = 0;

    // * replaces the optimal step with a even better step if there is one
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].fCost < openSet[winningIndex].fCost) {
        winningIndex = i;
      }
    }

    // * gets the cell object from the openSet with its index
    let winningCell = openSet[winningIndex];
    
    // needs to reset path before calling retrace path because retrace path does not clear the path array. It only adds path to it.
    // * this tracks back which steps we have been taking to get to this point.
    path = [];
    Helper.retracePath(winningCell, path);

    // * if we have reached the end
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
    // * so here we take all the neighbors of the cell we are current on, so basically figuring out where we are going to go from where ever we are right now.
    let neighbors: Array<Cell> = Helper.getNeighbors(winningCell);
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      // if the neighbor is obstructed, meaning it is an obstacle. and if it is an obstacle, we can not go there.
      if (neighbor.isObstructed) continue;

      // * if closedSet does not contain the current neighbor we are checking
      if (closedSet.indexOf(neighbor) == -1) {
        // this basically evaluates the g value, aka distance to the end. If this is the best way to go here, then this is the correct cost. If it is not then we will go the other way to come here instead.
        var tempG = neighbor.position.distance(endCell.position);

        let newG: boolean = false;
        // if openSet contains
        // * so basically here we are initializing the cost and adding it to the openSet, meaning telling the program that this is a possible step to take next.
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
    // if the code reaches here meaning it has not reached the end and it has evaluated everything that can be evaluated. so there is no solution
    if (path.filter((element) => element == endCell.position).length == 0) {
      path = [];
      console.log("No Solution");
      return;
    }
  }
}


// * below here is just to add obstacles. it adds an obstacle whereever you click on the screen.

let dragging: boolean = false;
let createObstacle: boolean = false;

function mouseDragged(event: MouseEvent) {
  let gridPos = Position.trueToGridPos(event.offsetX, event.offsetY);
  if (Helper.isValidPosition(gridPos)) {
    let cell: Cell = grid[gridPos.x][gridPos.y];
    
    if (!dragging) {
      dragging = true;
      createObstacle = !cell.isObstructed;
    }

    cell.isObstructed = createObstacle;
  }
}

function mouseReleased() {
  dragging = false;
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

  // * there is this constant. if this is true then the program is allowed to path find diagnally
  const corners = false;

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