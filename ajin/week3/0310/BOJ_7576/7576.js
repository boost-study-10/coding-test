const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [m, n] = input[0].split(' ').map(Number)
const box = []
for (let i = 1; i < n + 1; i++) {
  box.push(input[i].split(' ').map(Number))
}

const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
const starts = []

for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) {
    if (box[i][j] === 1) {
      starts.push([i, j])
    }
  }
}

const days = bfs(starts)
console.log(days)
  
function bfs(starts) {
  let max_days = 0
  let idx = 0
  const queue = []

  for (const [x, y] of starts) {
    queue.push([x, y])
  }

  while(idx < queue.length) {
    const [x, y] = queue[idx++]
    max_days = box[x][y]
    
    for (const [dx, dy] of directions) {
      const [nx, ny] = [dx + x, dy + y]
      
      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue
      if (box[nx][ny]) continue

      box[nx][ny] = max_days + 1
      queue.push([nx, ny])
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (!box[i][j]) return -1
    }
  }
  
  return max_days - 1
}