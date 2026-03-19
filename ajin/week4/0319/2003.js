const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, m] = input[0].split(' ').map(Number)
const arr = input[1].split(' ').map(Number)

const sum_arr = [0]
let sum = 0
for (const cur of arr) {
  sum += cur
  sum_arr.push(sum)
}

let answer = 0
let left = 0
let right = 0
while(right < n + 1) {
  const sum = sum_arr[right] - sum_arr[left]
  
  if (m === sum) {
    answer++
    right++
  }
  else if (m < sum) left++
  else if (m > sum) right++
}
console.log(answer)