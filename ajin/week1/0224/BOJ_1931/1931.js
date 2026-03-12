const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const n = Number(input.shift())
const time_table = input
  .map((value) => value.split(' ').map(Number))
  .sort((a, b) => {
    if (a[1] === b[1]) return a[0] - b[0]
    return a[1] - b[1]
  })

let answer = 0
let end_time = 0
for (const [start, end] of time_table) {
  if (start < end_time) continue

  end_time = end
  answer++
}
console.log(answer)
