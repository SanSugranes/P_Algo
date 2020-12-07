var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var counter = 0;
var dt = 0;
var now;
var last = timestamp();
var fps = 60;
var step = 1/fps;
var width = canvas.width;
var height = canvas.height;
var player = {width : 10, height : 10, x : 10, y : 10};

document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

frame();

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

  function frame() {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > step) {
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
    ctx.clearRect(0, 0, width, height);
    renderPlayer();
  }

  function renderPlayer(dt){
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }