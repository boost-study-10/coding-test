const input = require("fs")
  .readFileSync(
    process.platform === "linux" ? "/dev/stdin" : __dirname + "/input.txt",
  )
  .toString()
  .split("\n");

const n = Number(input[0]);
const question = [];
for (let i = 1; i < n + 1; i++) {
  question.push(input[i].split(" ").map(Number));
}

let answer = 0;
const N = 9;
const R = 3;
const checked = Array.from({ length: N + 1 }, () => false);

permutation([]);
console.log(answer);

function permutation(cur) {
  if (cur.length === R) {
    if (check_question(cur)) answer++;
    return;
  }

  for (let i = 1; i < N + 1; i++) {
    if (checked[i]) continue;

    cur.push(i);
    checked[i] = true;

    permutation(cur);

    cur.pop();
    checked[i] = false;
  }
}

function check_question(abc) {
  for (const [num, strike, ball] of question) {
    const num_arr = String(num).split("").map(Number);
    const [s, b] = get_strike_ball(abc, num_arr);
    if (strike !== s || ball !== b) return false;
  }

  return true;
}

function get_strike_ball(abc, num) {
  let strike = 0;
  let ball = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (abc[i] === num[j]) i === j ? strike++ : ball++;
    }
  }

  return [strike, ball];
}
