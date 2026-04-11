const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const N = Number(input[0])
const dp = Array(N + 1).fill(0)
dp[0] = 1
dp[2] = 3

for (let i = 4; i <= N; i += 2) {
  dp[i] = dp[i - 2] * 3
  for (let j = 4; j <= i; j += 2) {
    dp[i] += dp[i - j] * 2
  }
}
console.log(dp[N])