function pathfind(start, end) {
  start.g = 0;
  var open_li = [start];
  var closed_li = [];
  while (true) {
    if (open_li.length == 0) {
      return [];
    }
    var lowest_cost = Infinity;
    var lowest_idx;
    for (var i = 0; i < open_li.length; i++) {
      if (dist(open_li[i], end) < lowest_cost)
      {
        lowest_cost = dist(open_li[i], end);
        lowest_idx = i;
      }
    }
    best = open_li[lowest_idx];
    closed_li.push(best);
    // Return if best doesn't exist
    if (best.length <= 0) {
      return [];
    }
    if (best.x == end.x && best.y == end.y) { // end square found
      var path = [];
      while (best != start)
      {
        path.push(best);
        best = closed_li[best.parent];
      }
      return path.reverse();
    }
    open_li.splice(lowest_idx, 1);
    var adjacent = [];
    adjacent.push(best.copy());
    adjacent.push(best.copy());
    adjacent.push(best.copy());
    adjacent.push(best.copy());
    adjacent[0].x -= 1;
    adjacent[1].x += 1;
    adjacent[2].y -= 1;
    adjacent[3].y += 1;
    for (var j = 0; j < adjacent.length; j++) {
      if (adjacent[j] && mazeMap.gridMap[adjacent[j].x] && !mazeMap.gridMap[adjacent[j].x][adjacent[j].y]) {
        continue;
      }
      var invalid = false;
      for (var c = 0; c < closed_li.length; c++) {
        if (closed_li[c].x == adjacent[j].x && closed_li[c].y == adjacent[j].y) {
          invalid = true;
          break;
        }
      }
      if (invalid) {
        continue;
      }
      var in_open_list = false;
      var open_idx;
      for (c = 0; c < open_li.length; c++) {
        if (open_li[c].x == adjacent[j].x && open_li[c].y == adjacent[j].y) {
          in_open_list = true;
          open_idx = c;
          break;
        }
      }
      if (!in_open_list) {
        adjacent[j].parent = closed_li.length - 1;
        adjacent[j].g = best.g + 1;
        adjacent[j].h = dist(adjacent[j], end);
        adjacent[j].f = adjacent[j].g + adjacent[j].h;
        open_li.push(adjacent[j]);
      } else {
        if (best.g + 1 < open_li[open_idx].g) {
          open_li[open_idx].parent = closed_li.length - 1;
          open_li[open_idx].g = best.g + 1;
          open_li[open_idx].f = open_li[open_idx].g + open_li[open_idx].h;
        }
      }
    }
  }
}