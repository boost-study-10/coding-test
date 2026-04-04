const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim().split('\n')

let idx = 0
const answer = []
const dp = {}
while(true) {
  const [a, b, c] = input[idx++].split(' ').map(Number)
  if (a === -1 && b === -1 && c === -1) break

  answer.push(`w(${a}, ${b}, ${c}) = ${w(a, b, c)}`)
}
console.log(answer.join('\n'))

function w(a, b, c) {  
  if (a <= 0 || b <= 0 || c <= 0) {
    return 1
  }

  if (a > 20 || b > 20 || c > 20) {
    return w(20, 20, 20)
  }

  const key = [a, b, c].join(':')
  if (dp[key]) return dp[key]

  if(a < b && b < c) {
    dp[key] = w(a, b, c - 1) + w(a, b - 1, c - 1) - w(a, b - 1, c)
  } else {
    dp[key] = w(a - 1, b, c) + w(a - 1, b - 1, c) + w(a - 1, b, c - 1) - w(a - 1, b - 1, c - 1)
  }

  return dp[key]
}