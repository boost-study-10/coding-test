const input = require("fs").readFileSync(process.platform === "linux" ? "/dev/stdin" : __dirname + "/input.txt").toString().split("\n");

const [r, c, k] = input[0].split(" ").map(Number);
let arr = [];
for (let i = 1; i < 4; i++) {
  arr.push(input[i].split(" ").map(Number));
}

const MAX_TIME = 100;
let time = 0;
for (; time < MAX_TIME + 1; time++) {
  if (arr[r - 1] && arr[r - 1][c - 1] === k) break;

  arr = arr.length < arr[0].length ? c_operation(arr) : r_operation(arr);
}

console.log(time <= MAX_TIME ? time : -1);

function r_operation(arr) {
  const result = Array.from({ length: arr.length }, () => []);
  let max_n = 0;

  for (let i = 0; i < arr.length; i++) {
    const map = new Map();
  
    arr[i].forEach((num )=> {
      if (!num) return;
      map.set(num, (map.get(num) ?? 0) + 1);
    })

    const row = [...map.entries()]
      .sort((a, b) => {
        if (a[1] === b[1]) return a[0] - b[0];
        return a[1] - b[1];
      });

    for (const [num, cnt] of row) {
      result[i].push(num, cnt);
    }

    max_n = Math.max(max_n, row.length * 2);
  }

  for (let i = 0; i < arr[0].length; i++) {
    const zero = Array.from({ length: max_n - result[i].length }, () => 0);
    result[i].push(...zero);
  }

  return result
}

function c_operation(arr) {
  return transpose_arr(r_operation(transpose_arr(arr)))
}

function transpose_arr(arr) {
  const result = Array.from({ length: arr[0].length }, () => Array.from({ length: arr.length }, () => 0));

  for (let i = 0; i < arr.length; i++) {
    arr[i].forEach((v, j) => result[j][i] = v);
  }

  return result;
}
