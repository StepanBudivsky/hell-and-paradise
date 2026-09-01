import { klinesData, currentInterval } from "../chart-data.js";
import { markersRsiScenarios, markersAutoFibanachi, markersDivergenceRsi, markersFibanachi, markersMA, markersMACD, markersMinMax, markersPivotPoint, markersTrigger, markersWawe } from "../chartLogic/chart-render-line.js";
import { candlestickSeries } from "../main.js";
import { dotsByInterval } from "../program-settings.js";

const pointIds = [
  "point1","point2","point3","point4","point5","point6","point7", "point8"
];

// Кеш секцій і <span> з UI, щоб не шукати кожного разу
const sections = {};
const displays = {};
const lockButtons = {}; // кнопки замка

pointIds.forEach((key, idx) => {
  const sec = document.querySelector(`.control-section[data-point="${key}"]`);
  sections[key] = sec;
  displays[key] = sec.querySelector(".value-display");
  lockButtons[key] = sec.querySelector("button.lock-btn");
});

// Локальний стан для індексів точок поточного інтервалу
let state = {};

// Ініціалізація state з dotsByInterval[currentInterval]
export function initStateFromDots() {
  const dots = dotsByInterval[currentInterval];
  state = {};
  for(let i = 0; i < pointIds.length; i++) {
    state[pointIds[i]] = dots[i].value;
  }
}

// Оновити UI для однієї секції (значення + кнопки)
export function updateUI(pointKey) {
  const max = klinesData[currentInterval].length - 1;
  const sec = sections[pointKey];
  const span = displays[pointKey];
  span.textContent = state[pointKey];

  const dots = dotsByInterval[currentInterval];
  const idx = pointIds.indexOf(pointKey);
  const locked = dots[idx].lock;

  // Блокуємо кнопки зміни якщо замок увімкнений
  sec.querySelectorAll("button[data-step]").forEach(btn => {
    const stepVal = Number(btn.dataset.step);
    const next = state[pointKey] + stepVal;
    btn.disabled = !klinesData[currentInterval].length || next < 0 || next > max || locked;
  });

  // Оновлюємо вигляд кнопки замка
  const lockBtn = lockButtons[pointKey];
  lockBtn.textContent = locked ? "🔒" : "🔓";

  // Додаємо або знімаємо клас locked для фону
  if (locked) {
    lockBtn.classList.add("locked");
  } else {
    lockBtn.classList.remove("locked");
  }
}


// Оновити всі UI-секції
export function updateAllUI() {
  pointIds.forEach(key => updateUI(key));
}

// Маркери на графіку (без змін)
export const markers = [
  { time: 0, position: "aboveBar", color: "#000", shape: "arrowDown", text: "Max", size: 2}, // point1
  { time: 0, position: "belowBar", color: "#000", shape: "arrowUp", text: "Min", size: 2 }, // point2
  { time: 0, position: "aboveBar", color: "#000", shape: "arrowDown", text: "1 W", size: 2 }, // point3
  { time: 0, position: "aboveBar", color: "#000", shape: "arrowDown", text: "2 W", size: 2 }, // point4
  { time: 0, position: "aboveBar", color: "#000", shape: "arrowDown", text: "3 W", size: 2 }, // point5
  { time: 0, position: "aboveBar", color: "#000", shape: "arrowDown", text: "4 W", size: 2 }, // point6
  { time: 0, position: "aboveBar", color: "#000", shape: "arrowDown", text: "5 W", size: 2 }, // point7
  { time: 0, position: "belowBar", color: "#ff0000ff", shape: "arrowUp", text: "lim", size: 2 }, // point8
];

// Оновити один маркер
export function updateMarker(pointKey, idx) {
  if (!klinesData[currentInterval][idx]) return;
  markers[pointIds.indexOf(pointKey)].time = klinesData[currentInterval][idx].time;
}

function updateMarkers(...groups) {
  const merged = groups.flat();
  const sorted = merged.sort((a, b) => a.time - b.time);
  candlestickSeries.setMarkers(sorted);
}

// Оновити всі маркери
export function updateAllMarkers() {
  pointIds.forEach(key => updateMarker(key, state[key]));
  updateMarkers(markersRsiScenarios, markersMinMax, markersDivergenceRsi, markersMACD, markersMA, markersTrigger, markersWawe, markersFibanachi, markersAutoFibanachi, markersPivotPoint, markers);
  // candlestickSeries.setMarkers([...markersMinMax, ...markersMACD, ...markersMA, ...markers]);
  // console.log([...markersMinMax, ...markers, ...markersMA])
}

// Обробка кліку по кнопках зміни значення (тільки якщо не заблоковано)
document.getElementById("control-panel").addEventListener("click", e => {
  // console.log(klinesData[currentInterval].length)
  // console.log(markersMA);
  const btn = e.target;

  // Якщо клік по кнопці зміни значення
  if (btn.matches("button[data-step]")) {
    const sec = btn.closest(".control-section");
    const key = sec.dataset.point;
    const dots = dotsByInterval[currentInterval];
    const idx = pointIds.indexOf(key);

    if (dots[idx].lock) {
      // Точка заблокована, кнопки не активні, тому просто ігноруємо
      return;
    }

    const stepVal = Number(btn.dataset.step);
    const next = state[key] + stepVal;
    const max = klinesData[currentInterval].length - 1;

    if (klinesData[currentInterval].length && next >= 0 && next <= max) {
      state[key] = next;
      dots[idx].value = next; // Оновлення в глобальному масиві
      updateUI(key);
      updateMarker(key, next);
      updateMarkers(markersRsiScenarios, markersMinMax, markersDivergenceRsi, markersMACD, markersMA, markersTrigger, markersWawe, markersFibanachi, markersAutoFibanachi, markersPivotPoint, markers);
      // candlestickSeries.setMarkers([...markersMinMax, ...markersMACD, ...markersMA, ...markers]);
    }
  }

  // Якщо клік по кнопці замка
  if (btn.matches("button.lock-btn")) {
    const sec = btn.closest(".control-section");
    const key = sec.dataset.point;
    const dots = dotsByInterval[currentInterval];
    const idx = pointIds.indexOf(key);

    // Перемикаємо стан lock
    dots[idx].lock = !dots[idx].lock;

    // Оновлюємо UI блоку
    updateUI(key);
  }
});

// --- Інші функції і логіка без змін ---
// Чекаємо, поки дані завантажаться, і ініціалізуємо точки + маркери
const wait = setInterval(() => {
  if (klinesData[currentInterval].length > 0) {
    clearInterval(wait);
    initStateFromDots();
    updateAllUI();
    updateAllMarkers();
  }
}, 100);

// робота кнопки лімітів
const graficLimitVis = document.querySelector("#graficLimitVis");
const graficLimitRelated = document.querySelector("#graficLimitRelated");

graficLimitVis.addEventListener('click', () => graficLimitVis.classList.toggle('active'));
graficLimitRelated.addEventListener('click', () => graficLimitRelated.classList.toggle('active'));




