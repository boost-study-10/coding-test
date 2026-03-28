const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim().split('\n')

const N = Number(input[0])
const arr = input[1].split(' ').map(Number)
arr.sort((a, b) => a - b)

const M = Number(input[2])
const nums = input[3].split(' ').map(Number)

const answer = []
for (const num of nums) {
  answer.push(find_num(num))
}
console.log(answer.join('\n'))

function find_num(num) {
  let left = 0
  let right = N - 1
  while(left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (arr[mid] < num) {
      left = mid + 1
    } else if (num < arr[mid]) {
      right = mid - 1
    } else return 1
  }

  return 0
}