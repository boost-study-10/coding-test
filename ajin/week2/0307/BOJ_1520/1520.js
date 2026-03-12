const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [m, n] = input[0].split(' ').map(Number)
const board = []
for (let i = 1; i < m + 1; i++) {
  board.push(input[i].split(' ').map(Number))
}

const visited = Array.from({ length: m }, () => Array.from({ length: n }, () => -1))
const dx = [0, 1, 0, -1]
const dy = [1, 0, -1, 0]

console.log(dfs(0, 0))

function dfs(x, y) {
  if (x === m - 1 && y === n - 1) return 1
  if (visited[x][y] !== -1) return visited[x][y]

  visited[x][y] = 0

  for (let i = 0; i < 4; i++) {
    const nx = dx[i] + x
    const ny = dy[i] + y
    if (nx < 0 || ny < 0 || nx >= m || ny >= n) continue
    if (board[x][y] <= board[nx][ny]) continue

    visited[x][y] += dfs(nx, ny)
  }

  return visited[x][y]
}