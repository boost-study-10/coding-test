const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [C, N] = input[0].split(' ').map(Number)
const city = []
for (let i = 1; i < N + 1; i++) {
  city.push(input[i].split(' ').map(Number))
}

const dp = Array(C + 1).fill(Infinity)
dp[0] = 0

for (const [cost, customer] of city) {
  for (let i = 0; i < customer; i++) {
    dp[i] = Math.min(dp[i], cost)
  }
  for (let i = customer; i <= C; i++) {
    dp[i] = Math.min(dp[i], dp[i - customer] + cost)
  }
}
console.log(dp[C])