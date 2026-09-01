import { findClosestLowerBoundIndex } from "../calcFunction/various/find-closest-lower-bound-index.js";
import { currentInterval, klines, klinesData, mode, setCurrentInterval, setKlines } from "../chart-data.js";
import { dotsByInterval } from "../program-settings.js";

const graficLimitVis = document.querySelector("#graficLimitVis");
const graficLimitRelated = document.querySelector("#graficLimitRelated");
const graficLimitInput = document.querySelector("#graficLimitInput");
const graficLimitInputData = document.querySelector("#graficLimitInputData");
const renderingLimitInput = document.querySelector("#renderingLimitInput");
const synchronizationLimit = document.querySelector("#synchronizationLimit");

function checkLimit(interval) {
  if (Number(graficLimitInput.value)) {
    dotsByInterval[interval][7].value = Number(graficLimitInput.value) <= klinesData[interval].length - 1 ? Number(graficLimitInput.value) : klinesData[interval].length - 1;
    graficLimitInput.value = '';
  }
  
  if (graficLimitInputData.value !== "") {
    let dataLim = Math.floor(graficLimitInputData.valueAsNumber / 1000);
    let dataIndex = findClosestLowerBoundIndex(klinesData[interval], dataLim) - 1;

    dotsByInterval[interval][7].value = dataIndex !== -1 ? dataIndex : klinesData[interval].length - 1;
    graficLimitInputData.value = "";
  }

  if (synchronizationLimit.checked && interval !== '1m') {
    dotsByInterval[interval][7].value = findClosestLowerBoundIndex(klinesData[interval], klinesData["1m"][dotsByInterval["1m"][7].value].time) - 1;
  }

  if (!graficLimitRelated.classList.contains('active')) {
    dotsByInterval[interval][0].value = dotsByInterval[interval][7].value;
    dotsByInterval[interval][1].value = dotsByInterval[interval][7].value;
    dotsByInterval[interval][2].value = dotsByInterval[interval][7].value;
    dotsByInterval[interval][3].value = dotsByInterval[interval][7].value;
    dotsByInterval[interval][4].value = dotsByInterval[interval][7].value;
    dotsByInterval[interval][5].value = dotsByInterval[interval][7].value;
    dotsByInterval[interval][6].value = dotsByInterval[interval][7].value;
  }
}

export function getChartSettings(interval) {
  // Встановлення нового інтервалу та перевірка лімітів
  // setCurrentInterval(interval);
  checkLimit(interval);

  // Обмеження графіка
  if (!graficLimitVis.classList.contains('active') && interval === currentInterval) {
    setKlines(klinesData[interval].slice(1, dotsByInterval[interval][7].value + 2) || []);
  } else {
    setKlines(klinesData[interval]);
  }

  let dotsLimit = Number(renderingLimitInput.value);
  let startRenderingDot = 0;
  let endRenderingDot = klines.length - 1;

  if (mode === "test" && klines.length > dotsLimit) {
    startRenderingDot = dotsByInterval[interval][7].value - dotsLimit >= 0 ? dotsByInterval[interval][7].value - dotsLimit : 0;
    endRenderingDot = dotsByInterval[interval][7].value;
  }

  const klinesLimited = mode === "test" ? klines.slice(startRenderingDot, endRenderingDot) : klines;

  return {
    interval,
    klinesLimited,
    startRenderingDot,
    endRenderingDot,
  };
}