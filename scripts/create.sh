#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./scripts/create.sh {name} {week} {platform} {problem}

Example:
  ./scripts/create.sh chaewon week03 BOJ 2557
  ./scripts/create.sh chaewon 3 PGS "두 수의 합"
EOF
}

if [[ $# -ne 4 ]]; then
  usage
  exit 1
fi

name="$1"
week_input="$2"
platform="$(printf '%s' "$3" | tr '[:lower:]' '[:upper:]')"
problem_raw="$4"

if [[ "$name" == *"/"* ]]; then
  echo "Error: name must not contain '/'." >&2
  exit 1
fi

if [[ "$week_input" =~ ^[0-9]+$ ]]; then
  printf -v week "week%02d" "$week_input"
elif [[ "$week_input" =~ ^week([0-9]+)$ ]]; then
  printf -v week "week%02d" "${BASH_REMATCH[1]}"
else
  echo "Error: week must be a number (e.g. 3) or week format (e.g. week03)." >&2
  exit 1
fi

problem_slug="$(printf '%s' "$problem_raw" | sed -E 's/[[:space:]]+/_/g; s#/#-#g')"
target_dir="${name}/${week}"
target_file="${target_dir}/${platform}_${problem_slug}.md"

case "$platform" in
  BOJ) platform_name="백준" ;;
  PGS) platform_name="프로그래머스" ;;
  LTC) platform_name="리트코드" ;;
  CFS) platform_name="코드포스" ;;
  SEA) platform_name="삼성 SW Expert Academy" ;;
  ETC) platform_name="기타" ;;
  *) platform_name="$platform" ;;
esac

if [[ "$platform" == "BOJ" && "$problem_raw" =~ ^[0-9]+$ ]]; then
  problem_link="https://www.acmicpc.net/problem/${problem_raw}"
elif [[ "$platform" == "LTC" ]]; then
  problem_link="https://leetcode.com/problems/"
else
  problem_link=""
fi

mkdir -p "$target_dir"

if [[ -e "$target_file" ]]; then
  echo "Already exists: $target_file"
  exit 0
fi

cat >"$target_file" <<EOF
### 📖 풀이한 문제
- ${platform_name} ${problem_raw} - 문제 이름
- 문제 링크: ${problem_link}
- 난이도:
- 걸린 시간:

### 🧩 풀이 설계 / 막힌 부분
- 처음 접근 아이디어:
- 고려한 시간복잡도:
- 막힌 부분 / 해결 방법:

### ⭐️ 문제에서 주로 사용한 알고리즘
-

### 🧠 대략적인 코드 설명
-
EOF

echo "Created: $target_file"
