const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, k] = input[0].split(' ').map(Number)
const dp = Array.from({ length: k + 1 }, () => Array(n + 1).fill(0))

for (let i = 0; i <= n; i++) {
  dp[1][i] = 1
}

const MOD = 1_000_000_000
for (let i = 2; i <= k; i++) {
  dp[i][0] = 1
  for (let j = 1; j <= n; j++) {
    dp[i][j] = (dp[i - 1][j] + dp[i][j - 1]) % MOD
  }
}

console.log(dp[k][n])