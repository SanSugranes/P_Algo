var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var counter = 0;
var dt = 0;
var now;
var last = timestamp();
var fps = 60;
var step = 1 / fps;
var width = canvas.width;
var height = canvas.height;
var player = { width: 10, height: 10, x: 10, y: 10 };
var cell = { width: 10, height: 10 };

var GRIDSIZE = 30;

var tabGrid = [[]];
var firstCell = [];
var firstPos = [];

for(var y = 0; y < GRIDSIZE; y++){
  tabGrid.push(new Array(GRIDSIZE));
}

var entryCardinalPoint = "";
var exitCardinalPoint = "";

document.addEventListener('keydown', function (ev) { return onkey(ev, ev.keyCode, true); }, false);
document.addEventListener('keyup', function (ev) { return onkey(ev, ev.keyCode, false); }, false);

frame();

function onkey(ev, key, down) {
  switch (key) {
    // Left
    case 37: console.log("Left"); ev.preventDefault(); return false;
    // Up
    case 38: console.log("Up"); ev.preventDefault(); return false;
    // Right
    case 39: console.log("Right"); ev.preventDefault(); return false;
    // Down
    case 40: console.log("Down"); ev.preventDefault(); return false;
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
}

function render(ctx, frame, dt) {
}

function renderPlayer(dt) {
  ctx.fillStyle = '#000000';
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

firstCell = getRndBorderCell();
tabGrid[firstCell[0]][firstCell[1]] = 1;
console.log(firstPos);
checkCell(firstPos[0], firstPos[1], firstCell[0], firstCell[1]);
console.log(firstCell);
console.log(tabGrid);
printGrid();

function printGrid() {
  for (var y = 0; y < GRIDSIZE; y++) {
    for (var x = 0; x < GRIDSIZE; x++) {
      if (tabGrid[x][y] == 1) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(cell.width * x, cell.height * y, cell.width, cell.height);
      }
      else {
        ctx.fillStyle = '#000fff';
        ctx.fillRect(cell.width * x, cell.height * y, cell.width, cell.height);
      }
    }
  }
}