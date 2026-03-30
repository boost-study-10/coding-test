const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [N, M] = input[0].split(' ').map(Number)
const trees = input[1].split(' ').map(Number)
trees.sort((a, b) => a - b)

let answer = 0
let left = 0
let right = Math.max(...trees)
while(left <= right) {
  const mid = Math.floor((left + right) / 2)
  const remain = cut_trees(mid)

  if (M <= remain) {
    answer = Math.max(answer, mid)
    left = mid + 1
  } else {
    right = mid - 1
  }
}
console.log(answer)

function cut_trees(max_height) {
  let remain = 0
  for (const tree of trees) {
    remain += Math.max(0, tree - max_height)
  }

  return remain
}