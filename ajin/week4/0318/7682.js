const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

let idx = 0
while(true) {
  const board = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => ''))

  const game = input[idx++].split('')
  if (game.join('') === 'end') break

  game.forEach((value, idx) => {
    const [x, y] = [Math.floor(idx / 3), idx % 3]
    board[x][y] = value
  })

  console.log(is_valid(board) ? 'valid' : 'invalid')
}


function is_valid(board) {
  const win = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ]

  const check = []
  for (const [[x1, y1],[x2, y2], [x3, y3]] of win) {
    if (board[x1][y1] === '.') continue

    if (board[x1][y1] === board[x2][y2] && board[x2][y2] === board[x3][y3]) {
      check.push(board[x1][y1])
    }
  }

  if (!check.length) return is_tie(board)

  const X = check.filter((cur) => cur === 'X').length
  const O = check.filter((cur) => cur === 'O').length
  if (X && O) return false

  return check_count(board, check[0])
}

function is_tie(board) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '.') return false
    }
  }

  return check_count(board)
}

function check_count(board, win = 'tie') {
  let X = 0
  let O = 0

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === 'X') X++
      if (board[i][j] === 'O') O++
    }
  }

  if (win === 'X') return X === O + 1
  if (win === 'O') return X === O
  return X === O + 1 || X === O
}