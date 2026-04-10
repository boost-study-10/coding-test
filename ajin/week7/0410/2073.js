const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [D, P] = input[0].split(' ').map(Number)
const pipes = []
for (let i = 1; i < P + 1; i++) {
  pipes.push(input[i].split(' ').map(Number))
}

const dp = [Infinity, ...Array(D).fill(0)]
for (const [L, C] of pipes) {
  for (let l = D; l >= L; l--) {
    dp[l] = Math.max(dp[l], Math.min(dp[l - L], C))
  }
}
console.log(dp[D])