#!/usr/bin/env node

/**
 * 주간 코딩테스트 풀이 집계 스크립트
 *
 * rules.yml을 읽어 지난 주(월~일)에 추가된 풀이 파일을 집계하고,
 * 멤버별 풀이 개수(counts)와 풀이 일수(days)를 JSON으로 출력합니다.
 *
 * @example
 * node scripts/evaluate.mjs
 * // => { "counts": { "ahyeon": 3, ... }, "days": { "ahyeon": 2, ... } }
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

/** rules.yml 파싱용 정규식 */
const PATTERNS = {
  SECTION: /^(\w+):$/ /** 섹션 시작 줄 (예: members:, file_patterns:) */,
  MEMBER_ID: /^(\w+):$/ /** 멤버 ID 줄 (예: ahyeon:) */,
  KEY_VALUE: /^(\w+):\s*(.+)$/ /** 키-값 쌍 (예: type: weekly_count) */,
  LIST_ITEM: /^- (.+)$/ /** 리스트 항목 (예: - BOJ_*.md) */,
};

/** rules.yml 상위 키.
 * 이 키들만 섹션 전환으로 인식합니다. (members 하위의 minjeong: 등은 제외).
 * */
const RULES_TOP_LEVEL_KEYS = ['members', 'platforms', 'file_patterns', 'week'];

const KST_OFFSET_MS = 9 * 60 * 60 * 1000; /** KST(UTC+9) 오프셋 (밀리초) */

/** glob → 정규식 변환 시 사용하는 규칙 */
const GLOB_RULES = {
  ESCAPE_SPECIAL_CHARS: /[.*+?^${}()|[\]\\]/g,
  WILDCARD_TO_ANY: /\*/g,
  KEEP_ORIGINAL: '\\$&',
  ANY_CHARS: '.*',
};
/** * 치환 전 임시 플레이스홀더 (이스케이프 후 .* 로 복원) */
const WILDCARD_PLACEHOLDER = '\u0000';

/** git log 실행 및 출력 파싱에 사용하는 설정 */
const GIT_CONFIG = {
  MAX_BUFFER: 2 * 1024 * 1024 /** execSync 최대 출력 버퍼 크기 (2MB) */,
  DATE_REGEX: /^\d{4}-\d{2}-\d{2}/ /** 커밋 날짜 줄에서 YYYY-MM-DD 추출용 */,
  ADDED_STATUS: 'A' /** 추가된 파일을 의미하는 git status 코드 */,
};

/** git 로그가 없거나 저장소가 아닐 때 반환하는 exit code */
const GIT_EXIT_NO_LOG = 1;
const GIT_EXIT_NOT_REPO = 128;

/**
 * 스크립트 실행 흐름
 *   1. 규칙 로드
 *   2. → 지난 주 구간 계산
 *   3. → Git에서 추가 파일 조회
 *   4. → 멤버별 집계
 *   5. → JSON 출력
 */
function main() {
  const rules = loadRules();
  const { since, until, weekStart, weekEnd } = getLastWeekRange();
  const entries = getFilesAddedInLastWeek(since, until);
  const aggregated = aggregate(entries, rules);
  const { pass, fail } = evaluatePassFail(aggregated, rules.members);

  const result = { ...aggregated, pass, fail };
  console.log(JSON.stringify(result, null, 2));

  const payload = buildDiscordPayload(result, rules.members, {
    weekStart,
    weekEnd,
  });
  const reportsDir = join(REPO_ROOT, 'reports');
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(
    join(reportsDir, 'discord-payload.json'),
    JSON.stringify(payload, null, 2),
    'utf8',
  );
}

main();

/**
 * rules.yml을 읽어 멤버 목록, 파일 패턴, 주간 설정을 반환합니다.
 * @returns {{ members: Object, file_patterns: string[], week: { start: string, end: string } }}
 */
function loadRules() {
  const raw = readFileSync(join(REPO_ROOT, 'rules.yml'), 'utf8');
  const rules = {
    members: {},
    file_patterns: [],
    week: { start: 'monday', end: 'sunday' },
  };

  let currentSection = null;
  let currentMember = null;

  raw.split('\n').forEach((line) => {
    const trimmed = line.trim().replace(/#.*$/, '').trim();
    if (!trimmed) return;

    const sectionMatch = trimmed.match(PATTERNS.SECTION);
    if (
      sectionMatch &&
      !trimmed.startsWith('-') &&
      RULES_TOP_LEVEL_KEYS.includes(sectionMatch[1])
    ) {
      currentSection = sectionMatch[1];
      currentMember = null;
      return;
    }

    switch (currentSection) {
      case 'members':
        currentMember = parseMemberSection(
          trimmed,
          currentMember,
          rules.members,
        );
        break;
      case 'file_patterns':
        parseListSection(trimmed, rules.file_patterns);
        break;
      case 'week':
        parseKeyValueSection(trimmed, rules.week);
        break;
    }
  });

  return rules;
}

/**
 * members 섹션 한 줄 처리. 새 멤버 이름이면 등록하고, 아니면 현재 멤버의 type/target/active 등을 저장합니다.
 * @param {string} line - 파싱할 줄
 * @param {string|null} currentMember - 현재 읽고 있는 멤버 ID
 * @param {Object} members - 규칙의 members 객체 (가변)
 * @returns {string|null} - 다음 줄부터 적용할 currentMember
 */
function parseMemberSection(line, currentMember, members) {
  const memberMatch = line.match(PATTERNS.MEMBER_ID);
  if (memberMatch) {
    const name = memberMatch[1];
    members[name] = {};
    return name;
  }

  if (currentMember) {
    const kv = line.match(PATTERNS.KEY_VALUE);
    if (kv) {
      const [, key, value] = kv;
      members[currentMember][key] = castValue(value.trim());
    }
  }
  return currentMember;
}

/**
 * file_patterns 같은 리스트 섹션 한 줄 처리 (예: "- BOJ_*.md").
 * @param {string} line - 파싱할 줄
 * @param {string[]} list - 추가할 배열 (가변)
 */
function parseListSection(line, list) {
  const match = line.match(PATTERNS.LIST_ITEM);
  if (match) list.push(match[1].trim());
}

/**
 * week 섹션의 key: value 줄을 파싱해 target 객체에 넣습니다 (예: start: monday).
 * @param {string} line - 파싱할 줄
 * @param {Object} target - 규칙의 week 객체 (가변)
 */
function parseKeyValueSection(line, target) {
  const kv = line.match(PATTERNS.KEY_VALUE);
  if (kv) target[kv[1].trim()] = kv[2].trim();
}

/**
 * YAML에서 읽은 문자열 값을 boolean / number / string 으로 변환합니다.
 * @param {string} v - 원시 문자열
 * @returns {boolean|number|string}
 */
function castValue(v) {
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (!isNaN(v)) return parseInt(v, 10);
  return v;
}

/**
 * 집계 대상인 "지난 주"의 시작(since)과 끝(until) 시각을 ISO 문자열로 반환합니다.
 * KST 기준 월요일 00:00 ~ 일요일 23:59:59 입니다.
 * @returns {{ since: string, until: string }}
 */
function getLastWeekRange() {
  const now = new Date();
  const kstNow = new Date(
    now.getTime() + now.getTimezoneOffset() * 60 * 1000 + KST_OFFSET_MS,
  );

  const lastMonday = getStartOfLastMonday(kstNow);
  const lastSunday = getEndOfLastSunday(lastMonday);

  const formatYMD = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return {
    since: lastMonday.toISOString().replace('.000', ''),
    until: lastSunday.toISOString().replace('.000', ''),
    weekStart: formatYMD(lastMonday),
    weekEnd: formatYMD(lastSunday),
  };
}

/**
 * 주어진 날짜가 속한 "그 다음 주"의 월요일 00:00:00 을 구한 뒤, 7일을 빼서 "지난 주 월요일 00:00"을 반환합니다.
 * @param {Date} date - 기준 시각 (KST 가정)
 * @returns {Date}
 */
function getStartOfLastMonday(date) {
  const result = new Date(date);
  const day = result.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - daysSinceMonday - 7);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 월요일 00:00 기준으로 해당 주 일요일 23:59:59 를 반환합니다.
 * @param {Date} monday - 지난 주 월요일 00:00
 * @returns {Date}
 */
function getEndOfLastSunday(monday) {
  const result = new Date(monday);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 지난 주(since~until)에 Git에서 새로 추가된(Added) `.md` 파일 목록을 반환합니다.
 * @param {string} since - ISO 시각 (이후 커밋만 대상)
 * @param {string} until - ISO 시각 (이전 커밋만 대상)
 * @returns {{ path: string, date: string|null }[]} - path: 파일 경로, date: YYYY-MM-DD 또는 null
 */
function getFilesAddedInLastWeek(since, until) {
  const output = executeGitLog(since, until);
  if (!output) return [];
  return parseGitOutput(output);
}

/**
 * git log를 실행해 해당 기간에 추가된 파일 정보가 담긴 원시 출력을 반환합니다.
 * 저장소가 없거나 해당 기간 커밋이 없으면 null을 반환합니다.
 * @param {string} since - --since 인자
 * @param {string} until - --until 인자
 * @returns {string|null}
 */
function executeGitLog(since, until) {
  const args = [
    `--since=${since}`,
    `--until=${until}`,
    '--diff-filter=A',
    '--name-status',
    '--format="%ad"',
    '--date=iso-strict',
    '-z',
    '-- .',
  ];

  try {
    return execSync(`git log ${args.join(' ')}`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      maxBuffer: GIT_CONFIG.MAX_BUFFER,
    });
  } catch (e) {
    if ([GIT_EXIT_NO_LOG, GIT_EXIT_NOT_REPO].includes(e.status)) return null;
    throw e;
  }
}

/**
 * `git log -z` 출력을 파싱해 `{ path, date }` 배열로 만듭니다.
 * 블록은 `NUL(\0)`로 구분되며, 날짜 줄 다음에 오는 `A\t`경로 줄만 수집합니다.
 * @param {string} output - git log 원시 출력
 * @returns {{ path: string, date: string|null }[]}
 */
function parseGitOutput(output) {
  const entries = [];
  let lastSeenDate = null;
  /** -z 사용 시 NUL로 구분된 청크: 날짜 | "\\nA" | 경로 가 반복됨 */
  const chunks = output
    .split('\0')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const chunk of chunks) {
    if (GIT_CONFIG.DATE_REGEX.test(chunk)) {
      lastSeenDate = chunk.slice(0, 10);
      continue;
    }
    if (chunk.includes('/') && chunk.endsWith('.md')) {
      entries.push({ path: chunk, date: lastSeenDate });
    }
  }

  return entries;
}

/**
 * rules.yml의 파일 패턴(예: BOJ_*.md)을 파일명 전체 일치용 정규식으로 변환합니다.
 * @param {string} glob - glob 패턴 (와일드카드 * 사용)
 * @returns {RegExp}
 */
function patternToRegex(glob) {
  const withPlaceholder = glob.replace(
    GLOB_RULES.WILDCARD_TO_ANY,
    WILDCARD_PLACEHOLDER,
  );
  const escaped = withPlaceholder
    .replace(GLOB_RULES.ESCAPE_SPECIAL_CHARS, GLOB_RULES.KEEP_ORIGINAL)
    .replace(new RegExp(WILDCARD_PLACEHOLDER, 'g'), GLOB_RULES.ANY_CHARS);
  return new RegExp(`^${escaped}$`);
}

/**
 * Git에서 수집한 추가 파일 목록을 rules 기준으로 필터링해, 멤버별 풀이 개수와 풀이 일수를 집계합니다.
 * `active: false` 인 멤버는 제외하며, `file_patterns`에 맞는 파일만 카운트합니다.
 * @param {{ path: string, date: string|null }[]} entries - getFilesAddedInLastWeek 결과
 * @param {Object} rules - loadRules() 결과
 * @returns {{ counts: Object<string, number>, days: Object<string, number> }}
 */
function aggregate(entries, rules) {
  const activeMemberNames = getActiveMemberNames(rules.members);
  const patterns = rules.file_patterns.map(patternToRegex);
  const storage = Object.fromEntries(
    activeMemberNames.map((name) => [name, { count: 0, dates: new Set() }]),
  );

  for (const entry of entries) {
    const info = extractMemberAndFile(entry.path);
    if (!info) continue;

    const { member, filename } = info;
    if (storage[member] && patterns.some((re) => re.test(filename))) {
      storage[member].count += 1;
      if (entry.date) storage[member].dates.add(entry.date);
    }
  }

  return formatFinalResult(activeMemberNames, storage);
}

/**
 * 경로에서 멤버 이름(첫 번째 디렉터리)과 파일명(마지막 세그먼트)을 추출합니다.
 * @param {string} path - `예: ahyeon/week01/PGS_123.md`
 * @returns {{ member: string, filename: string } | null} - parts.length < 2 이면 null
 */
function extractMemberAndFile(path) {
  const parts = path.split('/');
  if (parts.length < 2) return null;
  return {
    member: parts[0],
    filename: parts[parts.length - 1],
  };
}

/**
 * rules.members 중 active가 false가 아닌 멤버 이름만 배열로 반환합니다.
 * @param {Object} members - rules.members
 * @returns {string[]}
 */
function getActiveMemberNames(members) {
  return Object.entries(members)
    .filter(([, config]) => config.active !== false)
    .map(([name]) => name);
}

/**
 * 멤버별 count / dates Set 을 최종 출력 형식 { counts, days } 로 변환합니다.
 * @param {string[]} memberNames - 활성 멤버 목록
 * @param {Object} storage - 멤버별 { count, dates: Set }
 * @returns {{ counts: Object<string, number>, days: Object<string, number> }}
 */
function formatFinalResult(memberNames, storage) {
  const result = { counts: {}, days: {} };
  memberNames.forEach((name) => {
    const data = storage[name];
    result.counts[name] = data.count;
    result.days[name] = data.dates.size;
  });
  return result;
}

/**
 * 집계 결과와 rules.members를 비교해 목표 달성(pass) / 미달(fail) 목록을 반환합니다.
 * - weekly_count: counts[멤버] >= target 이면 pass
 * - weekly_days, daily: days[멤버] >= target 이면 pass
 * @param {{ counts: Object<string, number>, days: Object<string, number> }} aggregated - aggregate() 결과
 * @param {Object} members - rules.members
 * @returns {{ pass: string[], fail: string[] }}
 */
function evaluatePassFail(aggregated, members) {
  const pass = [];
  const fail = [];

  for (const [name, config] of Object.entries(members)) {
    if (config.active === false) continue;

    const target = config.target;
    if (target == null || typeof target !== 'number') continue;

    const type = config.type || 'weekly_count';
    const value =
      type === 'weekly_count'
        ? (aggregated.counts[name] ?? 0)
        : (aggregated.days[name] ?? 0);

    if (value >= target) {
      pass.push(name);
    } else {
      fail.push(name);
    }
  }

  return { pass, fail };
}

/**
 * 집계·판정 결과와 members 설정으로 Discord 메시지 본문을 만듭니다.
 * @param {{ counts: Object, days: Object, pass: string[], fail: string[] }} result - main에서 만든 최종 결과
 * @param {Object} members - rules.members
 * @param {{ weekStart: string, weekEnd: string }} [weekRange] - 표시용 주간 기간 (YYYY-MM-DD)
 * @returns {string}
 */
function buildDiscordMessage(result, members, weekRange) {
  const lines = ['📌 코딩테스트 스터디 주간 결과', ''];

  if (weekRange) {
    lines.push(`${weekRange.weekStart} ~ ${weekRange.weekEnd}`, '');
  }

  const formatLine = (name) => {
    const config = members[name];
    const target = config?.target ?? 0;
    const type = config?.type || 'weekly_count';
    const value =
      type === 'weekly_count'
        ? (result.counts[name] ?? 0)
        : (result.days[name] ?? 0);
    return `- ${name} (${value}/${target})`;
  };

  lines.push('✅ 통과');
  if (result.pass.length === 0) {
    lines.push('- (없음)');
  } else {
    result.pass.forEach((name) => lines.push(formatLine(name)));
  }
  lines.push('');

  lines.push('❌ 벌칙');
  if (result.fail.length === 0) {
    lines.push('- (없음)');
  } else {
    result.fail.forEach((name) => lines.push(formatLine(name)));
  }
  lines.push('');

  const totalCount = Object.values(result.counts).reduce((a, b) => a + b, 0);
  lines.push('📑 합계');
  lines.push(`총 풀이: ${totalCount}문제`);

  return lines.join('\n');
}

/**
 * Discord Webhook용 payload 객체를 만듭니다. content만 사용합니다.
 * @param {Object} result - main에서 만든 최종 결과
 * @param {Object} members - rules.members
 * @param {{ weekStart: string, weekEnd: string }} [weekRange] - 표시용 주간 기간
 * @returns {{ content: string }}
 */
function buildDiscordPayload(result, members, weekRange) {
  return {
    content: buildDiscordMessage(result, members, weekRange),
  };
}
