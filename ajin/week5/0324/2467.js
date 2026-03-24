const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const N = Number(input[0])
const arr = input[1].split(' ').map(Number)
arr.sort((a, b) => a - b)

const value = []
let left = 0
let right = N - 1
while(left < right) {
  const diff = arr[right] + arr[left]
  value.push({ diff: Math.abs(diff), left, right })

  if (diff < 0) {
    left++
  } else if (0 < diff) {
    right--
  } else {
    break
  }
}

value.sort((a, b) => a.diff - b.diff)
console.log(arr[value[0].left], arr[value[0].right])