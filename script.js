const app = document.getElementById("app");
const progress = document.getElementById("progress");
const icon = document.getElementById("icon");
const timeEl = document.getElementById("time");

// ---- 設定 ----
const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

// ---- カラーテーマ ----
const COLOR_THEMES = [
  {
    focusBg: "#f5d3c8",
    focusText: "#e48e79",
    breakBg: "#f0eee9",
    breakText: "#333333",
  },
  {
    focusBg: "#ad9883",
    focusText: "#215db1",
    breakBg: "#f0eee9",
    breakText: "#333333",
  },
  {
    focusBg: "#b1d8b9",
    focusText: "#fb6401",
    breakBg: "#f0eee9",
    breakText: "#333333",
  },
  {
    focusBg: "#fbba16",
    focusText: "#00492c",
    breakBg: "#f0eee9",
    breakText: "#333333",
  },
  {
    focusBg: "#cadc70",
    focusText: "#92aab6",
    breakBg: "#f0eee9",
    breakText: "#333333",
  },
];
let currentTheme = COLOR_THEMES[0]; // 今の集中用
let nextTheme = null;              // 次の集中用

// ---- 状態 ----
let mode = "idle"; // idle | focus | break
let isRunning = false;
let duration = FOCUS_TIME;
let remaining = duration;
let timerId = null;

// ---- ユーティリティ ----
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ---- UI更新 ----
function updateUI() {
  timeEl.textContent = formatTime(remaining);

  const progressRatio = (duration - remaining) / duration;
  progress.style.height = `${progressRatio * 100}%`;
}

// ---- ランダムテーマ ----	
function pickRandomThemeExcept(exceptTheme) {
  let theme;
  do {
    const index = Math.floor(Math.random() * COLOR_THEMES.length);
    theme = COLOR_THEMES[index];
  } while (theme === exceptTheme);
  return theme;
}

// ---- モード切替 ----
function startFocus() {
  mode = "focus";
  duration = FOCUS_TIME;
  remaining = duration;
  isRunning = true;

  app.style.background = currentTheme.focusBg;
  progress.style.background = currentTheme.breakBg;
  timeEl.style.color = currentTheme.focusText;
  icon.style.color = currentTheme.focusText;

  icon.style.display = "none";
  timeEl.style.display = "block";

  startTimer();
}

function startBreak() {
  mode = "break";
  duration = BREAK_TIME;
  remaining = duration;
  isRunning = true;

  // ★ 次に使う色をここで決める
  nextTheme = pickRandomThemeExcept(currentTheme);

  app.style.background = currentTheme.breakBg;      // グレー
  progress.style.background = nextTheme.focusBg;   // 次の色がせり上がる
  timeEl.style.color = currentTheme.breakText;
  icon.style.color = currentTheme.breakText;

  startTimer();
}


// ---- タイマー ----
function startTimer() {
  clearInterval(timerId);
  updateUI();

  timerId = setInterval(() => {
    if (!isRunning) return;

    remaining--;
    updateUI();

  if (remaining <= 0) {
    clearInterval(timerId);
    progress.style.height = "0%";

    if (mode === "focus") {
      startBreak();
    } else {
      // ★ ここで色を確定
      currentTheme = nextTheme;
      startFocus();
    }
  }

  }, 1000);
}

// ---- 一時停止 / 再開 ----
function togglePause() {
  isRunning = !isRunning;
}

// ---- クリック操作 ----
app.addEventListener("click", () => {
  if (mode === "idle") {
    startFocus();
  } else {
    togglePause();
  }
});
