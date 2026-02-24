const input = require("fs")
  .readFileSync(
    process.platform === "linux" ? "/dev/stdin" : __dirname + "/input.txt",
  )
  .toString()
  .split("\n");

const [n, m] = input.shift().split(" ").map(Number);
const board = [];
for (const row of input) {
  board.push(row.split(""));
}

const CHESS_LENGTH = 8;
let answer = CHESS_LENGTH * CHESS_LENGTH;
for (let i = 0; i < n - CHESS_LENGTH + 1; i++) {
  for (let j = 0; j < m - CHESS_LENGTH + 1; j++) {
    const white_cnt = paint_board(i, j, ["W", "B"]); // 흰 색: m 짝수 n 짝수, m 홀수 n 홀수 / 검정색: 나머지
    const black_cnt = paint_board(i, j, ["B", "W"]); // 흰 색: m 짝수 n 홀수, m 홀수 n 짝수 / 검정색: 나머지
    answer = Math.min(white_cnt, black_cnt, answer);
  }
}
console.log(answer);

function paint_board(row, col, colors) {
  let cnt = 0;
  for (let i = 0; i < CHESS_LENGTH; i++) {
    for (let j = 0; j < CHESS_LENGTH; j++) {
      const sign = (i + j) % 2;
      if (!sign) {
        // m + n이 짝수
        if (board[row + i][col + j] !== colors[sign]) cnt++;
      } else {
        // m + n이 홀수
        if (board[row + i][col + j] !== colors[sign]) cnt++;
      }
    }
  }

  return cnt;
}
