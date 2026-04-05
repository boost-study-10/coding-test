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
      if (this.queue[pIndex] <= this.queue[index]) break

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

      const sIndex = right < this.size() && this.queue[right] < this.queue[left] ? right : left
      if (this.queue[index] <= this.queue[sIndex]) break

      this.#swap(index, sIndex)
      index = sIndex
    }
  }
}

const [N, M] = input[0].split(' ').map(Number)
const degree = Array(N + 1).fill(0)
const problems = Array.from({ length: N + 1 }, () => [])
Array.from({ length: N + 1 }, () => [])
for (let i = 1; i < M + 1; i++) {
  const [A, B] = input[i].split(' ').map(Number)
  problems[A].push(B)
  degree[B]++
}

const queue = new PriorityQueue()
for (let i = 1; i <= N; i++) {
  if (!degree[i]) queue.push(i)
}

const answer = []
for (let i = 0; i < N; i++) {
  const number = queue.pop()
  answer.push(number)

  for (const nextNumber of problems[number]) {
    degree[nextNumber]--

    if (!degree[nextNumber]) {
      queue.push(nextNumber)
    }
  }
}
console.log(answer.join(' '))