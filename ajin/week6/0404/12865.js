const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [N, K] = input[0].split(' ').map(Number)
const items = []
for (let i = 1; i < N + 1; i++) {
  items.push(input[i].split(' ').map(Number))
}

const bags = Array(K + 1).fill(0)
for (const [W, V] of items) {
  for (let i = K; i >= W; i--) {
    bags[i] = Math.max(bags[i], bags[i - W] + V)
  }
}
console.log(bags[K])