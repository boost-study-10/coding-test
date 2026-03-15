const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const n = Number(input[0])
const board = []
for (let i = 1; i < n + 1; i++) {
  board.push(input[i].split('').map(Number))
}

const dx = [0, 1, 0, -1]
const dy = [1, 0, -1, 0]
const house = []
let cnt = 0

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (!board[i][j]) continue

    board[i][j] = 0
    cnt = 1
    dfs(i, j)
    
    house.push(cnt)
  }
}

house.sort((a, b) => a - b)

console.log(house.length)
console.log(house.join('\n'))

function dfs(x, y) {
  for (let i = 0; i < 4; i++) {
    const nx = dx[i] + x
    const ny = dy[i] + y
    if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue
    if (!board[nx][ny]) continue

    board[nx][ny] = 0
    cnt++
    dfs(nx, ny)
  }
}