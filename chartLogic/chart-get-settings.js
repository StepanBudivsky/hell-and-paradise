import { findClosestLowerBoundIndex } from "../core/lib/find-closest-lower-bound-index.js";
import { currentInterval, klines, klinesData, mode, setKlines } from "../chart-data.js";
import { dotsByInterval } from "../settingsData/program-settings.js";

const graficLimitVis = document.querySelector("#graficLimitVis");
const graficLimitRelated = document.querySelector("#graficLimitRelated");
const graficLimitInput = document.querySelector("#graficLimitInput");
const graficLimitInputData = document.querySelector("#graficLimitInputData");
const renderingLimitInput = document.querySelector("#renderingLimitInput");
const synchronizationLimit = document.querySelector("#synchronizationLimit");

// Індекс "головної" точки ліміту в dotsByInterval[interval]
const LIMIT_DOT = 7;
// Кількість залежних точок (0..6), які слідують за лімітом
const RELATED_DOTS_COUNT = 7;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Індекс останньої ЗАКРИТОЇ свічки на момент time (в секундах).
// findClosestLowerBoundIndex повертає свічку, що містить цей час (вона ще формується),
// тому віднімаємо 1, щоб не брати дані з майбутнього.
// Окремо обробляємо -1, який функція повертає і для "до всіх даних", і для "після всіх".
function getLastClosedIndex(data, time) {
  const lastIndex = data.length - 1;
  if (lastIndex < 0 || !Number.isFinite(time)) return 0;

  // Час пізніше за останню свічку: вона містить цей час, тож остання закрита це lastIndex - 1
  const containingIndex = time > data[lastIndex].time
    ? lastIndex
    : findClosestLowerBoundIndex(data, time);

  // containingIndex === -1 означає "раніше за всі дані", тоді беремо першу свічку
  return clamp(containingIndex - 1, 0, lastIndex);
}

function checkLimit(interval) {
  const data = klinesData[interval];
  if (!data || data.length === 0) return;

  const dots = dotsByInterval[interval];
  const maxIndex = data.length - 1;

  // Ліміт за номером свічки
  const limitByIndex = Number(graficLimitInput.value);
  if (Number.isFinite(limitByIndex) && limitByIndex > 0) {
    dots[LIMIT_DOT].value = clamp(Math.floor(limitByIndex), 0, maxIndex);
    graficLimitInput.value = "";
  }

  // Ліміт за датою
  if (graficLimitInputData.value !== "") {
    const ms = graficLimitInputData.valueAsNumber;

    if (Number.isFinite(ms)) {
      const dataLim = Math.floor(ms / 1000); // мс -> секунди (time у свічках у секундах)
      dots[LIMIT_DOT].value = getLastClosedIndex(data, dataLim);
    }

    graficLimitInputData.value = "";
  }

  // Синхронізація з 1m
  if (synchronizationLimit.checked && interval !== "1m") {
    const data1m = klinesData["1m"];
    const dots1m = dotsByInterval["1m"];
    const candle1m = data1m?.[dots1m?.[LIMIT_DOT]?.value];

    if (candle1m) {
      dots[LIMIT_DOT].value = getLastClosedIndex(data, candle1m.time);
    }
  }

  // Якщо точки не пов'язані окремо, вони всі стоять на ліміті
  if (!graficLimitRelated.classList.contains("active")) {
    for (let i = 0; i < RELATED_DOTS_COUNT; i++) {
      dots[i].value = dots[LIMIT_DOT].value;
    }
  }
}

export function getChartSettings(interval) {
  // Перевірка лімітів (мутує dotsByInterval і очищає поля вводу)
  checkLimit(interval);

  const data = klinesData[interval] ?? [];
  const limitValue = dotsByInterval[interval][LIMIT_DOT].value;

  // Обмеження графіка.
  // Індекси klines збігаються з klinesData: остання свічка має індекс limitValue.
  if (!graficLimitVis.classList.contains("active") && interval === currentInterval) {
    setKlines(data.slice(0, limitValue + 1));
  } else {
    setKlines(data);
  }

  const dotsLimit = Math.max(Number(renderingLimitInput.value) || 0, 0);

  // Вікно рендерингу: [startRenderingDot, endRenderingDot), межа end виключна.
  // За замовчуванням (реальний час) це всі свічки, включно з поточною.
  let startRenderingDot = 0;
  let endRenderingDot = klines.length;

  if (mode === "test") {
    // +1, щоб поточна свічка (з індексом ліміту) потрапила у вікно
    // так само, як у реальному часі
    endRenderingDot = Math.min(limitValue + 1, klines.length);

    if (dotsLimit > 0) {
      startRenderingDot = Math.max(endRenderingDot - dotsLimit, 0);
    }
  }

  const klinesLimited = klines.slice(startRenderingDot, endRenderingDot);

  return {
    interval,
    klinesLimited,
    startRenderingDot,
    endRenderingDot,
  };
}