const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

class PriorityQueue {
  constructor() {
    this.queue = []
  }

  size() {
    return this.queue.length
  }

  push(value) {
    this.queue.push(value)
    this.#moveUp()
  }

  pop() {
    if (!this.size()) return undefined
    if (this.size() === 1) return this.queue.pop()

    const value = this.queue[0]
    this.queue[0] = this.queue.pop()
    this.#moveDown()

    return value
  }

  #swap(a, b) {
    [this.queue[a], this.queue[b]] = [this.queue[b], this.queue[a]]
  }

  #moveUp() {
    let index = this.size() - 1
    while(index) {
      const pIndex = Math.floor((index - 1) / 2)
      
      if (this.queue[pIndex][0] <= this.queue[index][0]) break

      this.#swap(index, pIndex)
      index = pIndex
    }
  }

  #moveDown() {
    let index = 0
    while(true) {
      const left = index * 2 + 1
      const right = index * 2 + 2

      if (this.size() <= left) break

      const sIndex = right < this.size() && this.queue[right][0] < this.queue[left][0] ? right : left

      if (this.queue[index][0] <= this.queue[sIndex][0]) break

      this.#swap(index, sIndex)
      index = sIndex
    }
  }
}

const [N, M] = input[0].split(' ').map(Number)
const lines = Array.from({ length: N + 1 }, () => [])
for (let i = 1; i < M + 1; i++) {
  const [A, B, C] = input[i].split(' ').map(Number)
  lines[A].push([B, C])
  lines[B].push([A, C])
}

const restore_lines = dijkstra()
console.log(restore_lines.length)
console.log(restore_lines.map((value) => value.join(' ')).join('\n'))

function dijkstra() {
  const visited = Array.from({ length: N + 1 }, () => Infinity)
  const queue = new PriorityQueue()
  const restore_lines = []

  visited[1] = 0
  queue.push([0, 1, 0])

  while(queue.size()) {
    const [time, computer, pre_computer] = queue.pop()
    if (visited[computer] < time) continue
    
    restore_lines.push([computer, pre_computer])
    for (const [next_computer, next_time] of lines[computer]) {
      if (visited[next_computer] <= time + next_time) continue

      visited[next_computer] = time + next_time
      queue.push([visited[next_computer], next_computer, computer])
    }
  }

  return restore_lines.slice(1)
}
