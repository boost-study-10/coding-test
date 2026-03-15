const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const dx = [0, 1, 0, -1]
const dy = [1, 0, -1, 0]

let idx = 0
let t = Number(input[idx++])
while(t--) {
  let answer = 0
  const [m, n, k] = input[idx++].split(' ').map(Number)
  const ground = Array.from({ length: n }, () => Array.from({ length: m }, () => 0))
  
  for (let i = 0; i < k; i++) {
    const [y, x] = input[idx++].split(' ').map(Number)
    ground[x][y] = 1
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (ground[i][j] === 1) {
        answer++
        ground[i][j] = 2
        dfs(i, j)
      }
    }
  }

  console.log(answer)

  function dfs(x, y) {
    for (let i = 0; i < 4; i++) {
      const nx = dx[i] + x
      const ny = dy[i] + y
      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue
      if (ground[nx][ny] !== 1) continue
      
      ground[nx][ny] = 2
      dfs(nx, ny)
    }
  }
}