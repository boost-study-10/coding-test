const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, m] = input[0].split(' ').map(Number)
const board = []
for (let i = 1; i < n + 1; i++) {
  board.push(input[i].split(' ').map(Number))
}

const candidates = []
const virus = []
for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) {
    if (!board[i][j]) {
      candidates.push([i, j])
    } 
    
    else if (board[i][j] === 2) {
      virus.push([i, j])
    }
  }
}

let answer = 0
const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]

make_walls(0, 0, [])

console.log(answer)

function make_walls(walls, index) {
  if (walls === 3) {
    const cnt = spread_virus(board.map((row) => [...row]))
    answer = Math.max(answer, cnt)
    return
  }

  for (let i = index; i < candidates.length; i++) {
    const [x, y] = candidates[i]

    board[x][y] = 1
    make_walls(walls + 1, i + 1)
    board[x][y] = 0
  }
}

function spread_virus(board) {
  let idx = 0
  const queue = []

  for (const [x, y] of virus) {
    queue.push([x, y])
  }

  while(idx < queue.length) {
    const [x, y] = queue[idx++]

    for (const [dx, dy] of directions) {
      const [nx, ny] = [dx + x, dy + y]

      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue
      if (board[nx][ny]) continue

      board[nx][ny] = 2
      queue.push([nx, ny])
    }
  }

  return count_safe_area(board)
}

function count_safe_area(board) {
  let cnt = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (!board[i][j]) cnt++
    }
  }

  return cnt
}