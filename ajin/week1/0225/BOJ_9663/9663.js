const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim()

const n = Number(input)
const col = Array.from({ length: n }, () => false)
const dir1 = Array.from({ length: n * 2 - 1 }, () => false)
const dir2 = Array.from({ length: n * 2 - 1 }, () => false)

let answer = 0
backtracking(0)
console.log(answer)

function backtracking(cnt) {
  if (cnt === n) {
    answer++
    return
  }

  const r = cnt
  for (let c = 0; c < n; c++) {
    if (col[c] || dir1[r + c] || dir2[r - c + n - 1]) continue

    col[c] = true
    dir1[r + c] = true
    dir2[r - c + n - 1] = true

    backtracking(cnt + 1)

    col[c] = false
    dir1[r + c] = false
    dir2[r - c + n - 1] = false

  }
}