const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [N, M] = input[0].split(' ').map(Number)
const bus = []
for (let i = 1; i < M + 1; i++) {
  const [A, B, C] = input[i].split(' ').map(Number)
  bus.push([A, B, C])
}
console.log(bellman_ford())

function bellman_ford() {
  const distance = Array(N + 1).fill(Infinity)
  distance[1] = 0
  
  for (let i = 0; i < N; i++) {
    for (const [A, B, C] of bus) {
      if (distance[A] === Infinity) continue
      if (distance[B] <= distance[A] + C) continue
      
      distance[B] = distance[A] + C
      
      if (i === N - 1) return - 1
    }
  }

  return distance.slice(2).map((d) => d === Infinity ? -1 : d).join('\n')
}