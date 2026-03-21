const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim().split('\n')

const n = Number(input.shift())
const nums = input.map(Number)
const answer = []

const sum = nums.reduce((a, b) => a + b, 0)
answer.push(Math.round((sum / n)))
if (answer[0] === -0) answer[0] = 0

nums.sort((a, b) => a - b)
answer.push(nums[Math.floor(n / 2)])

const num_map = new Map()
nums.forEach((num) => {
  num_map.set(num, (num_map.get(num) ?? 0) + 1)
})
const num_cnt = [...num_map.entries()].sort((a, b) => {
  if (a[1] === b[1]) return a[0] - b[0]
  return b[1] - a[1]
})
const max_cnt = num_cnt[1] && num_cnt[0][1] === num_cnt[1][1] ? num_cnt[1][0] : num_cnt[0][0]
answer.push(max_cnt)

answer.push(nums[n - 1] - nums[0])

console.log(answer.join('\n'))