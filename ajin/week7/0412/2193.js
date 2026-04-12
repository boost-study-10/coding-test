const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const N = Number(input[0])
const dp = Array(N + 1).fill(0)
dp[1] = 1
if (2 <= N) dp[2] = 1

for (let i = 3; i <= N; i++) {
  dp[i] = dp[i - 1] + dp[i - 2]
}

console.log(dp[N])