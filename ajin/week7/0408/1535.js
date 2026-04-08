const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const N = Number(input[0])
const people = []
people.push(input[1].split(' ').map(Number))
people.push(input[2].split(' ').map(Number))

const dp = Array(100).fill(0)
for (let i = 0; i < N; i++) {
  const [hp, joy] = [people[0][i], people[1][i]]
  for (let j = 99; j >= hp; j--) {
    dp[j] = Math.max(dp[j], dp[j - hp] + joy)
  }
}
console.log(dp[99])
