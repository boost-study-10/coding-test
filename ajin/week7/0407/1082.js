const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const N = BigInt(input[0])
const P = input[1].split(' ').map((n) => BigInt(n))
const M = Number(input[2])

const dp = Array(M + 1).fill(0n)
for (let num = N; num >= 0n; num--) {
  for (let m = P[num]; m <= M; m++) {
    const money = dp[m - P[num]] * 10n + num
    if (dp[m] < money) dp[m] = money
  }
}
console.log(dp[M].toString())