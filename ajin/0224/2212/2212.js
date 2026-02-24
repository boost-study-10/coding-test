const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const n = Number(input[0])
const k = Number(input[1])
const sensor = input[2].split(' ').map(Number).sort((a, b)=> a - b)

const gap = []
for (let i = 0; i < n - 1; i++) {
  gap.push(sensor[i + 1] - sensor[i])
}

gap.sort((a, b) => a - b)
const centers = gap.slice(0, (n - 1) - (k - 1))
const answer = centers.reduce((a, b) => a + b, 0) 
console.log(answer)

