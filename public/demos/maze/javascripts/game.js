var nn = new NeuralNetwork(5, 5, 2);
var backup_dest = new Vector();
var score = 0;
var high_score = 0;

let currentMaze = 0;
let mazes = [];

function init_maze() {
  score = 0;
  let prevY = randInt(1, Math.floor(gridH-1));
  mazeMap = new Maze(h, w);

  for (var i = 0; i < 5; i++) {
    mazeMap = new Maze(h, w);
    gen_start_coords();

    // Destroy some walls
    for (let i = 0; i < mazeMap.gridMap.length; i++) {
      for (let j = 0; j < mazeMap.gridMap[i].length; j++) {
        if (Math.random() < 0.1 && i > 0 && i < w && j > 0 && j < h)
          mazeMap.gridMap[i][j] = 1;
      }
    }

    let rightY = randInt(1, Math.floor(gridH-1));

    mazes.push({
      leftY: prevY,
      m: mazeMap,
      rightY: rightY
    })

    prevY = rightY;
  }
}

function gen_start_coords() {
  while (true) {
    player.x = get_random_int(mazeMap.gridW);
    player.y = get_random_int(mazeMap.gridH);
    if (mazeMap.gridMap[player.x][player.y]) {
      break;
    }
  }
  while (true) {
    enemy.x = get_random_int(mazeMap.gridW);
    enemy.y = get_random_int(mazeMap.gridH);
    if (mazeMap.gridMap[enemy.x][enemy.y] && !(enemy.x == player.x && enemy.y == player.y)) {
      break;
    }
  }
}

function update_pos() {
  score += 1;
  if (score > high_score) {
    high_score = score;
  }
  var new_player = player.copy();
  if (keyMap[87] || keyMap[38]) { // w
    new_player.y -= 1;
  }
  if (keyMap[83] || keyMap[40]) { // s
    new_player.y += 1;
  }
  if (keyMap[65] || keyMap[37]) { // a
    new_player.x -= 1;
  }
  if (keyMap[68] || keyMap[39]) { // d
    new_player.x += 1;
  }

  // Collision detection
  let nextPlayer = new Vector();

  if (mazeMap.gridMap[new_player.x] && mazeMap.gridMap[new_player.x] && mazeMap.gridMap[new_player.x][player.y] && mazeMap.gridMap[new_player.x][new_player.y]) {
    nextPlayer.x = Math.sign(new_player.x-player.x);
  }
  if (mazeMap.gridMap[player.x] && mazeMap.gridMap[new_player.x] && mazeMap.gridMap[player.x][new_player.y] && mazeMap.gridMap[new_player.x][new_player.y]) {
    nextPlayer.y = Math.sign(new_player.y-player.y);
  }
  
  player.add(nextPlayer);
  
  check_death();
}

function enemy_sees_player()
{
  return pathfind(enemy, player).length <= 5;
}

function move_to_predicted_plr() {
  /*var result = nn.feedForward([enemy.x, enemy.y, last_seen_player.x, last_seen_player.y, time_not_seen_player]);
  var target = new Vector();
  target.x = Math.round(result[0] * mazeMap.gridW);
  target.y = Math.round(result[1] * mazeMap.gridH);
  var next_step = pathfind(enemy, target)[0];
  if (!next_step) {
    return;
  }
  if (!mazeMap.gridMap[next_step.x][next_step.y]) {
    move_to_predicted_plr();
  } else {
    enemy.x = next_step.x;
    enemy.y = next_step.y;
  }*/

  var next_step = pathfind(enemy, player)[0];
  if (!next_step) {
    return;
  }
  if (!mazeMap.gridMap[next_step.x][next_step.y]) {
    move_to_predicted_plr();
  } else {
    enemy.x = next_step.x;
    enemy.y = next_step.y;
  }
}

function train_nn()
{
  nn.train([enemy.x, enemy.y, last_seen_player.x, last_seen_player.y, time_not_seen_player], [player.x / mazeMap.gridW, player.y / mazeMap.gridH]);
}

function check_death()
{
  if (player.x == enemy.x && player.y == enemy.y)
  {
    init_maze();
  }
}

var move = false;

function update_enemy_pos()
{

  move = !move;
  if (!move) {
    return;
  }


  if (enemy_sees_player()) {
    if (time_not_seen_player !== 0) {
      train_nn();
    }
    time_not_seen_player = 0;
    last_seen_player.x = player.x;
    last_seen_player.y = player.y;
    var next_step = pathfind(enemy, player)[0];
    if (!next_step)
    {
      return;
    }
    enemy.x = next_step.x;
    enemy.y = next_step.y;

  } else {
    time_not_seen_player += 1;
    move_to_predicted_plr();
  }
  check_death();
}