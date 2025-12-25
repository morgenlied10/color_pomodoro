const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let total = FOCUS_TIME;
let remaining = total;
let running = false;
let mode = "focus"; // focus | break
let lastTimestamp = null;
let state = "idle"; // idle | running | paused

const timeEl = document.getElementById("time");
const overlay = document.getElementById("overlay");
const base = document.getElementById("base");
const startBtn = document.getElementById("start");
const runningUI = document.getElementById("running-ui");
const pauseBtn = document.getElementById("pause");

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateUI() {
  timeEl.textContent = formatTime(remaining);
  overlay.style.height = `${(1 - remaining / total) * 100}%`;
}

function updatePauseIcon() {
  pauseBtn.textContent = state === "paused" ? "▶" : "⏸";
}

function setState(newState) {
  state = newState;

  if (state === "idle") {
    startBtn.style.display = "block";
    runningUI.style.display = "none";
  } else {
    startBtn.style.display = "none";
    runningUI.style.display = "flex";
  }
}

function switchMode() {
  if (mode === "focus") {
    mode = "break";
    total = BREAK_TIME;
    base.style.background = "#e0e0dc";
    overlay.style.background = "#ffb703";
  } else {
    mode = "focus";
    total = FOCUS_TIME;
    base.style.background = "#ffb703";
    overlay.style.background = "#e0e0dc";
  }
  remaining = total;
  overlay.style.height = "0%";
}

function tick(timestamp) {
  if (!running) return;

  if (!lastTimestamp) lastTimestamp = timestamp;
  const delta = Math.floor((timestamp - lastTimestamp) / 1000);

  if (delta > 0) {
    remaining -= delta;
    lastTimestamp += delta * 1000;
    updateUI();

    if (remaining <= 0) {
      switchMode();
    }
  }

  requestAnimationFrame(tick);
}

/* ===== ボタン処理 ===== */

startBtn.onclick = () => {
  if (state === "idle") {
    setState("running");
    running = true;
    lastTimestamp = null;
    updatePauseIcon();
    requestAnimationFrame(tick);
  }
};

pauseBtn.onclick = () => {
  if (state === "running") {
    running = false;
    state = "paused";
    lastTimestamp = null;
  } else if (state === "paused") {
    running = true;
    state = "running";
    lastTimestamp = null;
    requestAnimationFrame(tick);
  }

  updatePauseIcon();
};

document.getElementById("stop").onclick = () => {
  running = false;
  mode = "focus";
  total = FOCUS_TIME;
  remaining = total;
  base.style.background = "#ffb703";
  overlay.style.background = "#e0e0dc";
  overlay.style.height = "0%";
  updateUI();
  setState("idle");
  updatePauseIcon();
};

/* 初期化 */
updateUI();
setState("idle");
updatePauseIcon();
