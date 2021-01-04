var canvas = document.getElementById('canvas');
var victoriesCounter = document.getElementById('victories');
var victories = 0;
var ctx = canvas.getContext('2d');
var counter = 0;
var dt = 0;
var now;
var last = timestamp();
var fps = 60;
var step = 1 / fps;
var width = canvas.width;
var height = canvas.height;
var player = { width: 10, height: 10 };
var cell = { width: 10, height: 10 };

var GRIDSIZE = 30;

var cells = [];
var tabGrid = [[]];
var firstCell = [];
var firstPos = [];


var entryCardinalPoint = "";
var exitCardinalPoint = "";

document.addEventListener('keydown', function (ev) { return onkey(ev, ev.keyCode, true); }, false);
document.addEventListener('keyup', function (ev) { return onkey(ev, ev.keyCode, false); }, false);

runGame();

function onkey(ev, key, down) {
  switch (key) {
    // Left
    case 37: player.left = down; ev.preventDefault(); return false;
    // Up
    case 38: player.up = down; ev.preventDefault(); return false;
    // Right
    case 39: player.right = down; ev.preventDefault(); return false;
    // Down
    case 40: player.down = down; ev.preventDefault(); return false;
  }
}
function frame() {
  now = timestamp();
  dt = dt + Math.min(1, (now - last) / 1000);
  while (dt > step) {
    dt = dt - step;
    update(step);
  }
  render(ctx, counter, dt);
  last = now;
  counter++;
  requestAnimationFrame(frame, canvas);
}

function update(dt) {

  cells[player.x][player.y] = 3;

  //left
  if (player.left && player.x != 0) {
    if (cells[player.x - 1][player.y] != null) {
      player.x -= 1;
    }
  }
  //right
  if (player.right && player.x != GRIDSIZE * 2) {
    if (cells[player.x + 1][player.y] != null) {
      player.x += 1;
    }
  }
  //up
  if (player.up && player.y != 0) {
    if (cells[player.x][player.y - 1] != null) {
      player.y -= 1;
    }
  }
  //down
  if (player.down && player.y != GRIDSIZE * 2) {
    if (cells[player.x][player.y + 1] != null) {
      player.y += 1;
    }
  }

  cells[player.x][player.y] = 2;
  printGrid();

  //victory
  if (cells[lastCell[0] * 2][lastCell[1] * 2] != 1) {
    console.log("YOU WON");
    victories++;
    runGame();
  }
}

function render(ctx, frame, dt) {
  printGrid();
}

function renderPlayer(dt) {
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function checkCell(x, y, lastX, lastY) {

  //check des bords
  if (x == 0 || y == 0 || x == GRIDSIZE - 1 || y == GRIDSIZE - 1) {
    return false;
  }
  //check des cotés
  if ((lastX != x + 1 && tabGrid[x + 1][y] == 1) || (lastX != x - 1 && tabGrid[x - 1][y] == 1) ||
    (lastY != y + 1 && tabGrid[x][y + 1] == 1) || (lastY != y - 1 && tabGrid[x][y - 1] == 1)) {
    return false;
  }
  else {
    //enregistrement de la case
    tabGrid[x][y] = 1;

    var positionsY = [-1, 1];         //stock des positions Y
    var positionsX = [-1, 1];         // et des X

    do {
      switch (Math.floor(Math.random() * 2)) {
        case 0:
          if (positionsX.length >= 1) {
            var randX = Math.floor(Math.random() * positionsX.length);
            checkCell(x + positionsX[randX], y, x, y);
            positionsX.splice(randX, 1);
          }
          break;
        case 1:
          if (positionsY.length >= 1) {
            var randY = Math.floor(Math.random() * positionsY.length);
            checkCell(x, y + positionsY[randY], x, y);
            positionsY.splice(randY, 1);
          }
          break;
      }
    } while (positionsX.length > 0 || positionsY.length > 0);

    return false;
  }
}

function getRndBorderCell() {
  var buffer = [];
  switch (Math.floor(Math.random() * 4)) {
    //top
    case 0:
      buffer = [Math.floor(Math.random() * (GRIDSIZE - 2)) + 1, 0];
      firstPos[0] = buffer[0];
      firstPos[1] = buffer[1];
      firstPos[1] += 1;
      if (entryCardinalPoint == "") {
        entryCardinalPoint = "N";
      }
      else {
        exitCardinalPoint = "N";
      }
      break;
    //bottom
    case 1:
      buffer = [Math.floor(Math.random() * (GRIDSIZE - 2)) + 1, GRIDSIZE - 1];
      firstPos[0] = buffer[0];
      firstPos[1] = buffer[1];
      firstPos[1] -= 1;
      if (entryCardinalPoint == "") {
        entryCardinalPoint = "S";
      }
      else {
        exitCardinalPoint = "S";
      }
      break;
    //left
    case 2:
      buffer = [0, Math.floor(Math.random() * (GRIDSIZE - 2)) + 1];
      firstPos[0] = buffer[0];
      firstPos[1] = buffer[1];
      firstPos[0] += 1;
      if (entryCardinalPoint == "") {
        entryCardinalPoint = "W";
      }
      else {
        exitCardinalPoint = "W";
      }
      break;
    //right
    case 3:
      buffer = [GRIDSIZE - 1, Math.floor(Math.random() * (GRIDSIZE - 2)) + 1];
      firstPos[0] = buffer[0];
      firstPos[1] = buffer[1];
      firstPos[0] -= 1;
      if (entryCardinalPoint == "") {
        entryCardinalPoint = "E";
      }
      else {
        exitCardinalPoint = "E";
      }
      break;
  }
  return buffer;
}

function runGame() {
  //print player's score
  victoriesCounter.textContent = victories;

  tabGrid = [];
  cells = [];
  firstCell = [];
  firstPos = [];

  entryCardinalPoint = "";
  exitCardinalPoint = "";
  for (var y = 0; y < GRIDSIZE; y++) {
    tabGrid.push(new Array(GRIDSIZE));
  }
  for (var y = 0; y < GRIDSIZE * 2; y++) {
    cells.push(new Array(GRIDSIZE * 2));
  }
  firstCell = getRndBorderCell();
  tabGrid[firstCell[0]][firstCell[1]] = 1;
  checkCell(firstPos[0], firstPos[1], firstCell[0], firstCell[1]);

  do {
    lastCell = getRndBorderCell();
  } while (!checkLastCell());
  tabGrid[lastCell[0]][lastCell[1]] = 1;
  player.x = firstCell[0] * 2;
  player.y = firstCell[1] * 2;
  cells[player.x][player.y] = 2;
  createGrid();
  frame();
}

function createGrid() {
  //add the lab cells to all the cells. If the case is empty, the value is 2, it the case is full, the value is 1
  for (var y = 0; y < GRIDSIZE; y++) {
    for (var x = 0; x < GRIDSIZE; x++) {
      cells[x * 2][y * 2] = tabGrid[x][y];
    }
  }

  for (var y = 0; y < GRIDSIZE * 2; y++) {
    for (var x = 0; x < GRIDSIZE * 2; x++) {
      if (!(x == 0 || y == 0 || x == GRIDSIZE * 2 - 1 || y == GRIDSIZE * 2 - 1)) {
        if (cells[x][y] == 1 || (cells[x][y - 1] == 1 && cells[x][y + 1] == 1) || (cells[x - 1][y] == 1 && cells[x + 1][y] == 1)) {
          cells[x][y] = 1;
        }
      }
      else {
        if (cells[x][y] == 1) {
          cells[x][y] = 1;
        }
      }
    }
  }
  printGrid()

}

function printGrid() {
  for (var y = 0; y < GRIDSIZE * 2 - 1; y++) {
    for (var x = 0; x < GRIDSIZE * 2 - 1; x++) {
      //path
      if (cells[x][y] == 1) {
        ctx.fillStyle = '#000000';
      }
      // Player
      else if (cells[x][y] == 2) {
        ctx.fillStyle = '#00ff00';
      }
      // Trail
      else if (cells[x][y] == 3) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      }
      // Wall
      else {
        ctx.fillStyle = '#000fff';
      }
	  
	  
      ctx.fillRect(cell.width * x, cell.height * y, cell.width, cell.height);
	  
	  
	  if (x == lastCell[0] * 2 && y == lastCell[1] * 2){
        ctx.fillStyle = '#00bb00';
		switch(exitCardinalPoint){
			case "N":
				ctx.fillRect(cell.width * x, cell.height * y, cell.width, cell.height / 2);
				break;
			case "S":
				ctx.fillRect(cell.width * x, cell.height * y + cell.height / 2, cell.width, cell.height / 2);
				break;
			case "E":
				ctx.fillRect(cell.width * x + cell.width / 2, cell.height * y, cell.width / 2, cell.height);			
				break;
			case "W":
				ctx.fillRect(cell.width * x, cell.height * y , cell.width / 2, cell.height);
				break;
		}
	  }
	  
    }
  }
}

function checkLastCell() {
  switch (entryCardinalPoint) {
    case "N":
      if (exitCardinalPoint == "S") {
        if (tabGrid[lastCell[0]][lastCell[1] - 1] == 1) {
          return true;
        }
      }
      break;
    case "S":
      if (exitCardinalPoint == "N") {
        if (tabGrid[lastCell[0]][lastCell[1] + 1] == 1) {
          return true;
        }
      }
      break;
    case "E":
      if (exitCardinalPoint == "W") {
        if (tabGrid[lastCell[0] + 1][lastCell[1]] == 1) {
          return true;
        }
      }
      break;
    case "W":
      if (exitCardinalPoint == "E") {
        if (tabGrid[lastCell[0] - 1][lastCell[1]] == 1) {
          return true;
        }
      }
      break;
  }
  return false;
}