const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, m] = input[0].split(' ').map(Number)
const graph = Array.from({ length: n + 1 }, () => [])
for (let i = 1; i < m + 1; i++) {
  const [a, b] = input[i].split(' ').map(Number)
  graph[a].push(b)
  graph[b].push(a)
}

const visited = Array.from({ length: n + 1 }, () => false)
let cnt = 0
for (let i = 1; i < n + 1; i++) {
  if (visited[i]) continue

  cnt++
  bfs(i)
}

console.log(cnt)

function bfs(start) {
  let idx = 0
  const queue = []

  visited[start] = true
  queue.push(start)

  while(idx < queue.length) {
    const node = queue[idx++]

    for (const nextNode of graph[node]) {
      if (visited[nextNode]) continue

      visited[nextNode] = true
      queue.push(nextNode)
    }
  }
}