const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

let index = 0
const t = Number(input[index++])
const directions = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]]

for (let i = 0; i < t; i++) {
  const I = Number(input[index++])
  const [x1, y1] = input[index++].split(' ').map(Number)
  const [x2, y2] = input[index++].split(' ').map(Number)

  console.log(bfs(I, x1, y1, x2, y2))
}

function bfs(n, startX, startY, endX, endY) {
  const visited = Array.from({ length: n }, () => Array.from({ length: n }, () => -1))
  let idx = 0
  const queue = []

  visited[startX][startY] = 0
  queue.push([startX, startY])

  while(idx < queue.length) {
    const [x, y] = queue[idx++]
    if (x === endX && y === endY) return visited[x][y]

    for (const [dx, dy] of directions) {
      const [nx, ny] = [dx + x, dy + y]
      
      if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue
      if (visited[nx][ny] !== -1) continue

      visited[nx][ny] = visited[x][y] + 1
      queue.push([nx, ny])
    }
  }
}