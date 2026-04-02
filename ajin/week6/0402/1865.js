const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

let index = 0
const TC = Number(input[index++])
for (let i = 0; i < TC; i++) {
  const [N, M, W] = input[index++].split(' ').map(Number)
  const roads = []

  for (let j = 0; j < M; j++) {
    const [S, E, T] = input[index++].split(' ').map(Number)
    roads.push([S, E, T])
    roads.push([E, S, T])
  }
  for (let j = 0; j < W; j++) {
    const [S, E, T] = input[index++].split(' ').map(Number)
    roads.push([S, E, -T])
  }
  for (let j = 1; j <= N; j++) {
    roads.push([0, j, 0])
  }

  console.log(bellman_ford(N, roads))
}

function bellman_ford(N, roads) {
  const distance = Array.from({ length: N + 1 }, () => Infinity)
  distance[0] = 0

  for (let i = 0; i <= N; i++) {
    for (const [S, E, T] of roads) {
      if (distance[S] === Infinity) continue
      if (distance[E] <= distance[S] + T) continue

      distance[E] = distance[S] + T

      if (i === N) return 'YES'
    }
  }

  return 'NO'
}