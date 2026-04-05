const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname +'/input.txt').toString().split('\n')

const T = Number(input[0])
const n = Number(input[1])
const A = input[2].split(' ').map(Number)
const m = Number(input[3])
const B = input[4].split(' ').map(Number)

const Asum = new Map()
for (let i = 0; i < n; i++) {
  let s = 0
  for (let j = i; j < n; j++) {
    s += A[j]
    Asum.set(s, (Asum.get(s) || 0) + 1)
  }
}

let answer = 0
for (let i = 0; i < m; i++) {
  let s = 0
  for (let j = i; j < m; j++) {
    s += B[j]
    if (Asum.get(T - s)) {
      answer += Asum.get(T - s)
    }
  }
}

console.log(answer)