const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const n = Number(input[0])
const grid = []
for (let i = 1; i < n + 1; i++) {
  grid.push(input[i].split(''))
}

const dx = [0, 1, 0, -1]
const dy = [1, 0, -1, 0]
const visited = Array.from({ length: n }, () => Array.from({ length: n }, () => false))
const red_green_visited = Array.from({ length: n }, () => Array.from({ length: n }, () => false))

let normal = 0
let red_green = 0
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (!visited[i][j]) {
      if (grid[i][j] === 'B') red_green++
      normal++
      visited[i][j] = true
      dfs(grid[i][j], i, j)
    }

    if (!red_green_visited[i][j] && grid[i][j] !== 'B') {
      red_green++
      red_green_dfs(i, j)
    }
  }
}
console.log(normal, red_green)


function dfs(target, x, y) {
  for (let i = 0; i < 4; i++) {
    const nx = dx[i] + x
    const ny = dy[i] + y
    if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue
    if (visited[nx][ny]) continue
    if (target !== grid[nx][ny]) continue

    visited[nx][ny] = true
    dfs(target, nx, ny)
  }
}

function red_green_dfs(x, y) {
    for (let i = 0; i < 4; i++) {
    const nx = dx[i] + x
    const ny = dy[i] + y
    if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue
    if (red_green_visited[nx][ny]) continue
    if (grid[nx][ny] === 'B') continue

    red_green_visited[nx][ny] = true
    red_green_dfs(nx, ny)
  }
}