const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim().split('\n')

const [N, M] = input.shift().split(' ').map(Number)
const time = input.map(v => BigInt(v))

const MAX_TIME = BigInt(M) * time[N - 1]
let answer = MAX_TIME
let left = 1n
let right = MAX_TIME
while (left <= right) {
  const mid = (left + right) / 2n
  const friends = review_friends(mid)

  if (M <= friends) {
    answer = mid
    right = mid - 1n
  } else {
    left = mid + 1n
  }
}
console.log(answer.toString())

function review_friends(max_time) {
  let cnt = 0n
  for (const t of time) {
    if (M < cnt) break
    cnt += max_time / t
  }

  return cnt
}