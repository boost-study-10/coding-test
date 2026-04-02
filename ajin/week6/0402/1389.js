const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [N, M] = input[0].split(' ').map(Number)
const friends = Array.from({ length: N + 1 }, () => [])
for (let i = 1; i < M + 1; i++) {
  const [A, B] = input[i].split(' ').map(Number)
  friends[A].push(B)
  friends[B].push(A)
}

const kevin_bacon = Array.from({ length: N + 1 }, () => Array.from({ length: N + 1 }, () => 0))
let answer = { cnt: Infinity, number: 0 }

for (let i = 1; i <= N; i++) {
  const cnt = bfs(i)

  if (cnt < answer.cnt) {
    answer = { cnt, number: i }
  }
}
console.log(answer.number)

function bfs(start) {
  let idx = 0
  const queue = []

  queue.push(start)

  while(idx < queue.length) {
    const user = queue[idx++]

    for (const friend of friends[user]) {
      if (kevin_bacon[start][friend]) continue
      if (friend === start) continue

      queue.push(friend)
      kevin_bacon[start][friend] = kevin_bacon[start][user] + 1
    }
  }

  return kevin_bacon[start].reduce((a, b) => a + b, 0)
}