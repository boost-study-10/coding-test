const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, k] = input[0].split(' ').map(Number)
const MAX_N = 100_000
const visited = Array.from({ length: MAX_N + 1 }, () => -1)

bfs()

console.log(visited[k])

function bfs() {
  let index = 0
  const queue = []

  visited[n] = 0
  queue.push(n)

  while(queue.length) {
    const position = queue[index++]
    if (position === k) return

    for (const d of [- 1, + 1, position]) {
      const next_position = d + position
      if (next_position < 0 || next_position > MAX_N) continue
      if (visited[next_position] !== -1) continue

      queue.push(next_position)
      visited[next_position] = visited[position] + 1
    }
  }
}
