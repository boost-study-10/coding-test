const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const n = Number(input[0])
const arr = input[1].split(' ').map(Number)

arr.sort((a, b) => a - b)

let answer = 0
arr.forEach((num, index) => {
  let left = 0
  let right = n - 1

  while(left < right && right < n) {
    if (right === index) {
      right--
      continue
    }
    if (left === index) {
      left++
      continue
    }

    const sum = arr[left] + arr[right]

    if (num < sum) right--
    else if (sum < num) left++
    else {
      answer++
      break
    }
  }
})

console.log(answer)