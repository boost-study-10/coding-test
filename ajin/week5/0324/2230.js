const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim().split('\n')

const [N, M] = input.shift().split(' ').map(Number)
const arr = input.map(Number)
arr.sort((a, b) => a - b)

const MAX_DIFF = 2_000_000_000
let answer = MAX_DIFF
let left = 0
let right = 0
while (left <= right && right < N) {
  const diff = Math.abs(arr[left] - arr[right])

  if (M <= diff) {
    answer = Math.min(answer, diff)
    left++
  } else {
    right++
  }
}
console.log(answer)