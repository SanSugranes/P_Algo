var canvas = $("#canvas");
ctx = canvas.getContext('2d');

document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

function onkey(ev, key, down) {
    switch(key) {
      case KEY.LEFT:  console.log("Hello world."); ev.preventDefault(); return false;
      case KEY.RIGHT: player.right = down; ev.preventDefault(); return false;
      case KEY.SPACE: player.jump  = down; ev.preventDefault(); return false;
    }
  }