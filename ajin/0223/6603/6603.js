const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const R = 6
const answer = []
for (const test_case of input) {
  if(Number(test_case) === 0) break
  
  const arr = test_case.split(' ').map(Number)
  const k = arr.shift()
  combination(arr.sort((a, b) => a - b), [], 0)
  answer.push('')
}
answer.pop()
console.log(answer.join('\n'))

function combination(arr, cur, index) {
  if (cur.length === R) {
    answer.push(cur.join(' '))
    return
  }
  
  for (let i = index; i < arr.length; i++) {
    cur.push(arr[i])
    combination(arr, cur, i + 1)
    cur.pop()
  }
}