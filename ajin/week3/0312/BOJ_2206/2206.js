const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, m] = input[0].split(' ').map(Number)
const board = []
for (let i = 1; i < n + 1; i++) {
  board.push(input[i].split('').map(Number))
}

const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
console.log(bfs())

function bfs() {
  const visited = Array.from({ length: n } , () => Array.from({ length: m }, () => Array.from({ length: 2 }, () => 0)))
  let idx = 0
  const queue = []

  visited[0][0][0] = 1
  queue.push([0, 0, 0])

  while(idx < queue.length) {
    const [x, y, broken] = queue[idx++]
    if (x === n -1 && y === m - 1) {
      return visited[x][y][broken]
    }

    for (const [dx, dy] of directions) {
      const [nx, ny] = [dx + x, dy + y]
      
      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue
      if (visited[nx][ny][broken]) continue

      if (!board[nx][ny]) {
        visited[nx][ny][broken] = visited[x][y][broken] + 1
        queue.push([nx, ny, broken])
      }
      if (!broken && board[nx][ny]) {
        visited[nx][ny][1] = visited[x][y][0] + 1
        queue.push([nx, ny, 1])
      }
    }
  }

  return -1
}
