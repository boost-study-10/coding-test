const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim().split('\n')

const N = Number(input[0])
const arr = input[1].split(' ').map(Number)
arr.sort((a, b) => a - b)

let best = Infinity
let answer = []
arr.forEach((fixed, idx) => {
  let left = idx + 1
  let right = N - 1

  while(left < right) {
    const sum = fixed + arr[left] + arr[right]
    
    if (Math.abs(sum) < best) {
      answer = [fixed, arr[left], arr[right]]
      best = Math.abs(sum)
    }

    if (sum < 0) left++ 
    else if (0 < sum) right--
    else break
  }
})

console.log(answer.join(' '))
