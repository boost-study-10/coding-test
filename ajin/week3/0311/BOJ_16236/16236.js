const input = require("fs")
  .readFileSync(
    process.platform === "linux" ? "/dev/stdin" : __dirname + "/input.txt",
  )
  .toString()
  .split("\n");

const n = Number(input[0]);
const board = [];
for (let i = 1; i < n + 1; i++) {
  board.push(input[i].split(" ").map(Number));
}

const shark = { x: -1, y: -1, size: 2, eat: 0 };
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (!board[i][j]) continue;
    if (board[i][j] === 9) {
      shark.x = i;
      shark.y = j;
      board[i][j] = 0;
      continue;
    }
  }
}

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];
const time = move_shark();
console.log(time);

function move_shark() {
  let time = 0;

  while (true) {
    const fish = find_fish();
    if (!fish) return time;

    const { distance, x, y } = fish;
    time += distance;
    shark.eat++;
    board[x][y] = 0;

    if (shark.eat === shark.size) {
      shark.eat = 0;
      shark.size++;
    }

    shark.x = x;
    shark.y = y;
  }
}

function find_fish() {
  const fish = [];
  const visited = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => -1),
  );
  let idx = 0;
  const queue = [];

  visited[shark.x][shark.y] = 0;
  queue.push([shark.x, shark.y]);

  while (idx < queue.length) {
    const [x, y] = queue[idx++];

    if (board[x][y] && board[x][y] < shark.size) {
      fish.push({ distance: visited[x][y], x, y });
    }

    for (const [dx, dy] of directions) {
      const [nx, ny] = [dx + x, dy + y];

      if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
      if (visited[nx][ny] !== -1) continue;
      if (shark.size < board[nx][ny]) continue;

      visited[nx][ny] = visited[x][y] + 1;
      queue.push([nx, ny]);
    }
  }

  fish.sort((a, b) => {
    if (a.distance === b.distance) {
      if (a.x === b.x) return a.y - b.y;
      return a.x - b.x;
    }

    return a.distance - b.distance;
  });

  return fish[0];
}
