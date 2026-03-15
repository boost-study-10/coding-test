const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, l, r] = input[0].split(' ').map(Number)
const board = []
for (let i = 1; i < n + 1; i++) {
  board.push(input[i].split(' ').map(Number))
}

const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
let day = 0

while(true) {
  const visited = Array.from({ length: n }, () => Array.from({ length: n }, () => false))
  let flag = false

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (visited[i][j]) continue
    
      if (bfs(i, j, visited)) flag = true
    }
  }

  if (!flag) break

  day++
}

console.log(day)

function bfs(startX, startY, visited) {
  let population = board[startX][startY]
  const area = [[startX, startY]]

  let idx = 0
  const queue = []

  queue.push([startX, startY])
  visited[startX][startY] = true

  while(idx < queue.length) {
    const [x, y] = queue[idx++]

    for (const [dx, dy] of directions) {
      const [nx, ny] = [dx + x, dy + y]

      if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue
      if (visited[nx][ny]) continue

      const diff = Math.abs(board[nx][ny] - board[x][y])
      if (diff < l || r < diff) continue

      visited[nx][ny] = true
      queue.push([nx, ny])

      area.push([nx, ny])
      population += board[nx][ny]
    }
  }

  if (area.length === 1) return false

  const average = Math.floor(population / area.length)
  for (const [x, y] of area) {
    board[x][y] = average
  }

  return true
}