var tabGrid = ;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

function onkey(ev, key, down) {
    switch(key) {
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

  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, 20, 20);