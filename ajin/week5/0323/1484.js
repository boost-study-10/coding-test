const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const G = Number(input[0])
const MAX_N = 50_000

let answer = []
let left = 1
let right = 2
while (left < right && right <= MAX_N) {
  const cur_g = right * right - left * left

  if (cur_g < G) right++
  else if (G < cur_g) left ++
  else {
    answer.push(right)
    left++
  }
}

if (!answer.length) console.log(-1)
else console.log(answer.join('\n'))