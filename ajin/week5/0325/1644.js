const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim().split('\n')

const N = Number(input)
const prime = get_prime()

let answer = prime.find((number) => number === N) ? 1 : 0
let left = 0
let right = 1
let sum = prime[0] + (prime[1] || 0)
while(left < right && right < prime.length) {
  if (sum === N) answer++

  if (sum <= N) {
    right++
    sum += prime[right]
  } else {
    sum -= prime[left]
    left++
  } 
}

console.log(answer)

function get_prime() {
  const prime = Array(N + 1).fill(true)
  prime[1] = false

  for (let i = 2; i * i < N + 1; i++){
    if (!prime[i]) continue
    for (let j = i * i; j < N + 1; j += i) {
      prime[j] = false
    }
  }

  const result = []
  for (let i = 1; i < N + 1; i++) {
    if (prime[i]) result.push(i)
  }

  return result
}