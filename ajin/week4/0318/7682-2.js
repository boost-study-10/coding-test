const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

let idx = 0
while(true) {
  const game = input[idx++].split('')
  if (game.join('') === 'end') break

  console.log(is_valid(game) ? 'valid' : 'invalid')
}

function is_valid(game) {
  let X = 0
  let O = 0

  game.forEach((cur) => {
    if (cur === 'X') X++
    if (cur === 'O') O++
  })

  const xWin = is_win(game, 'X')
  const oWin = is_win(game, 'O')

  if (!check_count(X, O)) return false
  if (xWin && oWin) return false
  if (xWin && !check_count(X, O, 'X')) return false
  if (oWin && !check_count(X, O, 'O')) return false
  if (!xWin && !oWin && !check_count(X, O, 'TIE')) return false

  return true
}

function is_win(board, value) {
  const win = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  return win.some((cur) => cur.every((i) => board[i] === value))
}

function check_count(X, O, win) {
  if (win === 'X') return X === O + 1
  if (win === 'O') return X === O
  if (win === 'TIE') return X + O === 9
  return X === O + 1 || X === O
}