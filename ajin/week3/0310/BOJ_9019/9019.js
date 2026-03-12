const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim().split('\n')

const t = Number(input[0])
const MAX_N = 10_000

const answer = []
for (let i = 1; i < t + 1; i++) {
  const [start, target] = input[i].split(' ').map(Number)

  const command = bfs(start, target)
  answer.push(command)
}

console.log(answer.join('\n'))

function bfs(start, target) {
  const visited = Array.from({ length: MAX_N + 1 }, () => false)
  let idx = 0
  const queue = []

  visited[start] = true
  queue.push([start, ''])

  while(idx < queue.length) {
    const [number, command] = queue[idx++]

    if (number === target) return command

    const nextNumber = [
      { n: number * 2 % MAX_N, c: 'D' }, 
      { n: number !== 0 ? number - 1 : 9999, c: 'S' },
      { n: left(number), c: 'L' },
      { n: right(number), c: 'R' }
    ]
    
    for (const { n, c } of nextNumber) {
      if (visited[n]) continue

      visited[n] = true
      queue.push([n, command + c])
    }
  }
}

function left(number) {
  return (number % 1000) * 10 + Math.floor(number / 1000)
}

function right(number) {
  return (number % 10) * 1000 + Math.floor(number / 10)
}