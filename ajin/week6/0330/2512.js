const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const N = Number(input[0])
const request_budgets = input[1].split(' ').map(Number)
request_budgets.sort((a, b) => a - b)
const max_budget = Number(input[2])

let answer = 0
let left = 0
let right = Math.max(...request_budgets)
while(left <= right) {
  const mid = Math.floor((left + right) / 2)
  const budgets = divide_budget(mid)
  
  if (budgets <= max_budget) {
    answer = Math.max(answer, mid)
    left = mid + 1
  } else {
    right = mid - 1
  }
}

console.log(answer)


function divide_budget(limit) {
  let sum = 0
  for (const budget of request_budgets) {
    sum += Math.min(limit, budget)
  }

  return sum
}