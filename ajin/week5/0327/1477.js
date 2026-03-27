const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin': __dirname + '/input.txt').toString().split('\n')

const [N, M, L] = input[0].split(' ').map(Number)
const rest = input[1].split(' ').map(Number)
rest.push(0, L)
rest.sort((a, b) => a - b)

const gap = []
for (let i = 0; i < rest.length - 1; i++) {
  gap.push(rest[i + 1] - rest[i])
}
gap.sort((a, b) => a - b)

const answer = set_max_gap()
console.log(answer)

function set_max_gap() {
  let left = 0
  let right = L - 1
  let max_gap = L - 1

  while(left <= right) {
    const gap = Math.floor((left + right) / 2)
    const cnt = build_rest(gap)

    if (cnt <= M) {
      right = gap - 1
      max_gap = Math.min(max_gap, gap)
    } else {
      left = gap + 1
    }
  }

  return max_gap
}

function build_rest(max_gap) {
  let cnt = 0
  gap.forEach((cur) => {
    if (max_gap < cur) {
      cnt += Math.ceil(cur / max_gap) - 1
    }
  })

  return cnt
}