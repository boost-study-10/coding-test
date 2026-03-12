const input = require("fs")
  .readFileSync(
    process.platform === "linux" ? "/dev/stdin" : __dirname + "/input.txt",
  )
  .toString()
  .trim()
  .split("\n");

const board = input.map((row) => row.trim().split(" ").map(Number));
const n = 9;
const row = Array.from({ length: n }, () => new Set());
const col = Array.from({ length: n }, () => new Set());
const square = Array.from({ length: n }, () => new Set());
const blank = [];
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (board[i][j]) {
      add_number(
        row[i],
        col[j],
        square[Math.floor(i / 3) * 3 + Math.floor(j / 3)],
        board[i][j],
      );
    } else {
      blank.push([i, j]);
    }
  }
}

backtracking(0);

function backtracking(index) {
  if (index === blank.length) {
    for (const row of board) {
      console.log(row.join(" "));
    }

    return true;
  }

  const [r, c] = blank[index];
  for (let i = 1; i < n + 1; i++) {
    const square_index = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    if (row[r].has(i) || col[c].has(i) || square[square_index].has(i)) continue;

    board[r][c] = i;
    add_number(row[r], col[c], square[square_index], i);

    if (backtracking(index + 1)) return true;

    board[r][c] = 0;
    delete_number(row[r], col[c], square[square_index], i);
  }

  return false;
}

function add_number(a, b, c, number) {
  a.add(number);
  b.add(number);
  c.add(number);
}

function delete_number(a, b, c, number) {
  a.delete(number);
  b.delete(number);
  c.delete(number);
}
