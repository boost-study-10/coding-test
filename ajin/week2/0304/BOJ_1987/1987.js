const input = require("fs")
  .readFileSync(
    process.platform === "linux" ? "/dev/stdin" : __dirname + "/input.txt",
  )
  .toString()
  .split("\n");

const [r, c] = input[0].split(" ").map(Number);
const board = [];
for (let i = 0; i < r; i++) {
  board.push(input[i + 1].split(""));
}

let answer = 0;
const dx = [0, 1, 0, -1];
const dy = [1, 0, -1, 0];
const visited = new Set(board[0][0]);
dfs(0, 0, 1);
console.log(answer);

function dfs(x, y, cnt) {
  answer = Math.max(answer, cnt);

  for (let i = 0; i < 4; i++) {
    const nx = dx[i] + x;
    const ny = dy[i] + y;
    if (nx < 0 || ny < 0 || nx >= r || ny >= c) continue;

    const next_alphabet = board[nx][ny];
    if (visited.has(next_alphabet)) continue;

    visited.add(next_alphabet);
    dfs(nx, ny, cnt + 1);
    visited.delete(next_alphabet);
  }
}
