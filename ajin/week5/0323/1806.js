const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [N, S] = input[0].split(' ').map(Number)
const arr = input[1].split(' ').map(Number)

let answer = N + 1
let left = 0
let right = 0
let sum = arr[left]
while(left <= right && right < N) {
  if (sum < S) {
    right++
    sum += arr[right]
  } else {
    sum -= arr[left]
    answer = Math.min(answer, right - left + 1)
    left++
  }
}

console.log(answer === N + 1? 0 : answer)