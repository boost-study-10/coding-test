const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const N = Number(input[0])
const cost = []
for (let i = 1; i < N + 1; i++) {
  cost.push(input[i].split(' ').map(Number))
}

const colors = [[0, 1, 2], [1, 2, 0], [2, 0, 1]]
for (let i = 1; i < N; i++) {
  for (let [a, b, c] of colors) {
    cost[i][a] += Math.min(cost[i - 1][b], cost[i - 1][c])
  }
}

console.log(Math.min(...cost[N - 1]))