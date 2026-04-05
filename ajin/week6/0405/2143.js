const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname +'/input.txt').toString().split('\n')

const T = Number(input[0])
const n = Number(input[1])
const A = input[2].split(' ').map(Number)
const m = Number(input[3])
const B = input[4].split(' ').map(Number)

const Asum = []
const Bsum = []
get_sum(A, n, Asum)
get_sum(B, m, Bsum)
Asum.sort((a, b) => a - b)
Bsum.sort((a, b) => a - b)

let answer = 0
for (const a of Asum) {
  const b = T - a
  const left = bisect_B_left(b)
  const right = bisect_B_right(b)
  if (Bsum.length <= left || right < 0) continue
  
  answer += right - left + 1
}
console.log(answer)

function bisect_B_left(b) {
  let left = 0
  let right = Bsum.length - 1
  while(left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (Bsum[mid] < b) left = mid + 1
    else if (b <= Bsum[mid]) right = mid - 1
  }

  return left
}

function bisect_B_right(b) {
  let left = 0
  let right = Bsum.length - 1
  while(left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (Bsum[mid] <= b) left = mid + 1
    else if (b < Bsum[mid]) right = mid - 1
  }

  return right
}

function get_sum(arr, n, sum) {
  for (let i = 0; i < n; i++) {
    let s = 0
    for (let j = i; j < n; j++) {
      s += arr[j]
      sum.push(s)
    }
  }
}