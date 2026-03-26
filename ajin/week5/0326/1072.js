const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim()

const [X, Y] = input.split(' ').map(Number)
const Z = Math.floor(Y * 100 / X)

const MAX = 1_000_000_000 + 1
let answer = MAX
let start = 1
let end = MAX
while(start < end) {
  const cnt = Math.floor((start + end) / 2)
  const z = Math.floor((Y + cnt) * 100 / (X + cnt))

  if (Z < z) {
    answer = cnt
    end = cnt
  } else {
    start = cnt + 1
  }
}

console.log(answer === MAX ? -1 : answer)