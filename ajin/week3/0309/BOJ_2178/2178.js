const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, m] = input[0].split(' ').map(Number)
const board = []
for (let i = 1; i < n + 1; i++) {
  board.push(input[i].split('').map(Number))
}

console.log(bfs(0, 0))

function bfs(startX, startY) {
  const visited = Array.from({ length: n }, () => Array.from({ length: m }, () => false))
  let idx = 0
  const queue = []
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]

  visited[startX][startY] = true
  queue.push([1, startX, startY])

  while(idx < queue.length) {
    const [cnt, x, y] = queue[idx++]

    if (x === n - 1 && y === m - 1) return cnt
    
    for (const [dx, dy] of directions) {
      const nx = dx + x
      const ny = dy + y

      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue
      if (visited[nx][ny]) continue
      if (!board[nx][ny]) continue

      visited[nx][ny] = true
      queue.push([cnt + 1, nx, ny])
    }
  }
}