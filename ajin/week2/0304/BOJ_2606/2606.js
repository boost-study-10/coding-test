const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const n = Number(input[0])
const k = Number(input[1])
const computers = Array.from({ length: n + 1 }, () => [])
for (let i = 2; i < k + 2; i++) {
  const [a, b] = input[i].split(' ').map(Number)
  computers[a].push(b)
  computers[b].push(a)
}

const visited = Array.from({ length: n + 1 }, () => false)
let answer = 0
visited[1] = true
dfs(1)
console.log(answer)

function dfs(index) {
  for (const next_computer of computers[index]) {
    if (visited[next_computer]) continue

    visited[next_computer] = true
    answer++
    dfs(next_computer)
  }
}
