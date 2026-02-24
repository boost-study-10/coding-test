const input = require("fs")
  .readFileSync(
    process.platform === "linux" ? "/dev/stdin" : __dirname + "/input.txt",
  )
  .toString()
  .split("\n");

const [n, s] = input[0].split(" ").map(Number);
const nums = input[1].split(" ").map(Number);
let answer = 0;

for (let i = 1; i < n + 1; i++) {
  combination(nums, i, 0, []);
}
console.log(answer);

function combination(arr, r, index, cur) {
  if (cur.length === r) {
    const sum = cur.reduce((a, b) => a + b);
    if (sum === s) answer++;
    return;
  }

  for (let i = index; i < arr.length; i++) {
    cur.push(arr[i]);
    combination(arr, r, i + 1, cur);
    cur.pop();
  }
}
