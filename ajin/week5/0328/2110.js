const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim().split('\n')

const [N, C] = input.shift().split(' ').map(Number)
const wifi = input.map(Number)
wifi.sort((a, b) => a - b)

let answer = 1
let left = 1
let right = Math.max(...wifi)
while(left <= right) {
  const mid = Math.floor((left + right) / 2)
  const num = add_wifi(mid)

  if (C <= num) {
    answer = Math.max(answer, mid)
    left = mid + 1
  } else {
    right = mid - 1
  }
}
console.log(answer)

function add_wifi(minGap) {
  let cnt = 1
  let pre = wifi[0]

  for (let i = 1; i < N; i++) {
    const gap = wifi[i] - pre

    if (gap < minGap) continue
    pre = wifi[i]
    cnt++
  }

  return cnt
}