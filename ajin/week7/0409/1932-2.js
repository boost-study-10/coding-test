const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const n = Number(input[0])
const nums=  []
for (let i = 1; i < n + 1; i++) {
  nums.push(input[i].split(' ').map(Number))
}

const dp = Array.from({ length: n }, () => Array(n).fill(0))
dp[0][0] = nums[0][0]
for (let i = 1; i < n; i++) {
  for (let j = 0; j <= i; j++) {
    const [left, right] = [Math.max(0, j - 1), Math.min(i - 1, j)]
    dp[i][j] = nums[i][j] + Math.max(dp[i - 1][left], dp[i - 1][right])
  }
}

console.log(Math.max(...dp[n - 1]))