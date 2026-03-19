const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, m] = input[0].split(' ').map(Number)
const arr = input[1].split(' ').map(Number)

let answer = 0
let left = 0
let right = 0
let sum = 0
while(right < n + 1) {
  if (sum <= m) {
    sum += arr[right]
    right++
  }
  else {
    sum -= arr[left]
    left++
  }

  if (m === sum) answer++
}
console.log(answer)