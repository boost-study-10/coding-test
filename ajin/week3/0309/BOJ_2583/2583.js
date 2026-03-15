const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [m, n, k] = input[0].split(' ').map(Number)
const board = Array.from({ length: m }, () => Array.from({ length: n }, () => 0))

for (let i = 1; i < k + 1; i++) {
  const [y1, x1, y2, x2] = input[i].split(' ').map(Number)  
  for (let x = x1; x < x2; x++) {
    for (let y = y1; y < y2; y++) {
      board[x][y] = 1
    }
  }
}

const visited = Array.from({ length: m }, () => Array.from({ length: n }, () => false))
const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
const answer = []

for (let x = 0; x < m; x++) {
  for (let y = 0; y < n; y++) {
    if (board[x][y] || visited[x][y]) continue

    const cnt = bfs(x, y)
    answer.push(cnt)
  }
}

answer.sort((a, b) => a - b)

console.log(answer.length)
console.log(answer.join(' '))

function bfs(startX, startY) {
  let cnt = 1
  let idx = 0
  const queue = []

  visited[startX][startY] = true
  queue.push([startX, startY])

  while(idx < queue.length) {
    const [x, y] = queue[idx++]

    for (const [dx, dy] of directions) {
      const nx = dx + x
      const ny = dy + y

      if (nx < 0 || ny < 0 || nx >= m || ny >= n) continue
      if (board[nx][ny] || visited[nx][ny]) continue

      cnt++
      visited[nx][ny] = true
      queue.push([nx, ny])
    }
  }

  return cnt
}
