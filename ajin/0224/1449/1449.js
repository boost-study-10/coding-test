const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, l] = input[0].split(' ').map(Number)
const points = input[1].split(' ').map(Number).sort((a, b) => a - b)

let answer = 0
let fixed_point = 0
for (const point of points) {
  if (point < fixed_point) continue

  fixed_point = point + l - 0.5
  answer++
}
console.log(answer)