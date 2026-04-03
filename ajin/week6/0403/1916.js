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

const N = Number(input[0])
const M = Number(input[1])
const bus = Array.from({ length: N + 1}, () => [])
for (let i = 2; i < M + 2; i++) {
  const [s, e, c] = input[i].split(' ').map(Number)
  bus[s].push([e, c])
}
const [start_city, end_city] = input[M + 2].split(' ').map(Number)

console.log(dijkstra())

function dijkstra() {
  const visited = Array.from({ length: N + 1 }, () => Infinity)
  const queue = new PriorityQueue()

  visited[start_city] = 0
  queue.push([0, start_city])

  while(queue.size()) {
    const [cost, city] = queue.pop()
    if (city === end_city) return cost

    for (const [next_city, next_cost] of bus[city]) {
      if (visited[next_city] <= cost + next_cost) continue

      visited[next_city] = cost + next_cost
      queue.push([visited[next_city], next_city])
    }
  }
}