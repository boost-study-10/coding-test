const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const n = Number(input[0])
const dp = []
for (let i = 1; i < n + 1; i++) {
  const nums = input[i].split(' ').map(Number)
  dp.push([0, ...nums, ...Array(n - nums.length).fill(0)])
}

for (let i = 1; i < n; i++) {
  for (let j = 1; j <= i; j++) {
    dp[i][j] += Math.max(dp[i - 1][j - 1], dp[i - 1][j])
  }
  dp[i][i + 1] += dp[i - 1][i]
}
console.log(Math.max(...dp[n - 1]))