var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

let divisions = 31; // MUST BE ODD

var scale;
let gridW, gridH;
let w, h;

var player, last_seen_player, pred_player, enemy, time_not_seen_player;
var playerImage, enemyImage, wallImage, groundImage;

function setup() {
  // Set viewport
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scale = window.innerWidth/divisions;

  gridW = window.innerWidth/scale;
  gridH = window.innerHeight/scale;

  w = (gridW - 1)/2;
  h = (gridH - 1)/2;

  $(window).resize(function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    scale = window.innerWidth/divisions;

    gridW = window.innerWidth/scale;
    gridH = window.innerHeight/scale;

    w = (gridW - 1)/2;
    h = (gridH - 1)/2;
  })

  // Objects
  player = new Vector();

  last_seen_player = new Vector();
  pred_player = new Vector();
  enemy = new Vector();
  time_not_seen_player = Infinity;

  // Preload images

  playerImage = new Image();
  playerImage.src = "Sprites/Player.png";

  enemyImage = new Image();
  enemyImage.src = "Sprites/Enemy.png";

  wallImage = new Image();
  wallImage.src = "Sprites/Wall.png";

  //var torchwall = GIF();
 // torchwall.src = "Sprites/TorchWall.png";

  groundImage = document.getElementById("ground");

  init_maze(w, h);
  gen_start_coords();
}

let counter = 0;
function update() {
  mazeMap = mazes[currentMaze].m;
  if (counter > 8) {
    update_pos();
    update_enemy_pos();
    counter = 0;
  } else {
    counter++;
  }
}

function draw() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";

  // Draw maze
  for(var x = 0; x < mazeMap.gridW; ++x)
  {
    for(var y = 0; y < mazeMap.gridH; ++y)
    {
      if(mazeMap.gridMap[x][y] != 0) {
        drawImageTopLeft(groundImage, scale * x, scale * y, scale, scale);
      } else {
        drawImageTopLeft(wallImage, scale * x, scale * y, scale, scale);
      }
    }
  }

  // Draw players
  drawImageTopLeft(playerImage, scale * player.x, scale * player.y, scale, scale);
  drawImageTopLeft(enemyImage, scale * enemy.x, scale * enemy.y, scale, scale);

  drawText("Score: " + score + "; High Score: " + high_score, 50, 50, "20px Arial", "lime");
}

// Keyboard events

var keyMap = {};
onkeydown = onkeyup = function(e){
  e = e || event; 
  keyMap[e.keyCode] = e.type == 'keydown';
};

// Game loop

var fps = 1000;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

function loop(showFPS, callback) {
    requestAnimationFrame(loop);
    
    now = Date.now();
    delta = now - then;
       
    if (delta > interval) {
        then = now - (delta % interval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update();
        draw();
    }
}

// Run
setup();
loop();