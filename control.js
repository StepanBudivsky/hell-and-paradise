import { clearLine, setActiveSettings } from "./render.js";
import { initStateFromDots, updateAllUI, updateAllMarkers } from "./menus/dots-panel.js" 
import { setChartInterval } from "./chart-control.js";
import { setCurrentLocalLineSetting, updateCurrentLocalLineSetting } from "./menus/local-line-setting-work.js";
import { setCurrentGlobalLineSetting, updateCurrentGlobalLineSetting } from "./menus/global-line-setting-work.js";
import { setCurrentGlobalAnalazeInterval, setCurrentInterval } from "./chart-data.js";

// функція для вибору активної кнопки між багатьма
export function switchGroupButtonActive(groupe, activeBtn) {
  groupe.forEach(btn => {
    btn.classList.toggle("active", btn === activeBtn);
  });
}

export function checkClass (elem) {
  return !elem.classList.contains('active');
}

export function onIntervalChange(newInterval) {
  updateCurrentGlobalLineSetting();
  updateCurrentLocalLineSetting();
  setActiveSettings(newInterval);
  setCurrentInterval(newInterval);
  setChartInterval(newInterval);
  setCurrentGlobalLineSetting();
  setCurrentLocalLineSetting();
  // setActiveSettings(newInterval);
  initStateFromDots();
  // console.log(dotsByInterval[newInterval]);
  updateAllUI();
  updateAllMarkers();
}

const regim1mBtn = document.querySelector("#regim1mBtn");
const regim5mBtn = document.querySelector("#regim5mBtn");
const regim15mBtn = document.querySelector("#regim15mBtn");
const regim30mBtn = document.querySelector("#regim30mBtn");
const regim1hBtn = document.querySelector("#regim1hBtn");

const groupeRegimBtn = [regim1mBtn, regim5mBtn, regim15mBtn, regim30mBtn, regim1hBtn];

const regim1mBtnGlobalAnalaze = document.querySelector("#regim1mBtnGlobalAnalaze");
const regim5mBtnGlobalAnalaze = document.querySelector("#regim5mBtnGlobalAnalaze");
const regim15mBtnGlobalAnalaze = document.querySelector("#regim15mBtnGlobalAnalaze");
const regim30mBtnGlobalAnalaze = document.querySelector("#regim30mBtnGlobalAnalaze");
const regim1hBtnGlobalAnalaze = document.querySelector("#regim1hBtnGlobalAnalaze");

const groupeRegimGlobalAnalazeBtn = [regim1mBtnGlobalAnalaze, regim5mBtnGlobalAnalaze, regim15mBtnGlobalAnalaze, regim30mBtnGlobalAnalaze, regim1hBtnGlobalAnalaze];

regim1mBtn.addEventListener("click", () => {
  switchGroupButtonActive(groupeRegimBtn, regim1mBtn);
  clearLine();
  switchGroupButtonActive(groupeRegimGlobalAnalazeBtn, regim1mBtnGlobalAnalaze);
  setCurrentGlobalAnalazeInterval("1m");
  onIntervalChange("1m");
});

regim5mBtn.addEventListener("click", () => {
  switchGroupButtonActive(groupeRegimBtn, regim5mBtn);
  clearLine();
  switchGroupButtonActive(groupeRegimGlobalAnalazeBtn, regim5mBtnGlobalAnalaze);
  setCurrentGlobalAnalazeInterval("5m");
  onIntervalChange("5m");
});

regim15mBtn.addEventListener("click", () => {
  switchGroupButtonActive(groupeRegimBtn, regim15mBtn);
  clearLine();
  switchGroupButtonActive(groupeRegimGlobalAnalazeBtn, regim15mBtnGlobalAnalaze);
  setCurrentGlobalAnalazeInterval("15m");
  onIntervalChange("15m");
});

regim30mBtn.addEventListener("click", () => {
  switchGroupButtonActive(groupeRegimBtn, regim30mBtn);
  clearLine();
  switchGroupButtonActive(groupeRegimGlobalAnalazeBtn, regim30mBtnGlobalAnalaze);
  setCurrentGlobalAnalazeInterval("30m");
  onIntervalChange("30m");
});

regim1hBtn.addEventListener("click", () => {
  switchGroupButtonActive(groupeRegimBtn, regim1hBtn);
  clearLine();
  switchGroupButtonActive(groupeRegimGlobalAnalazeBtn, regim1hBtnGlobalAnalaze);
  setCurrentGlobalAnalazeInterval("1h");
  onIntervalChange("1h");
});

///

regim1mBtnGlobalAnalaze.addEventListener("click", () => {
  switchGroupButtonActive(groupeRegimGlobalAnalazeBtn, regim1mBtnGlobalAnalaze);
  setCurrentGlobalAnalazeInterval("1m");
});

regim5mBtnGlobalAnalaze.addEventListener("click", () => {
  switchGroupButtonActive(groupeRegimGlobalAnalazeBtn, regim5mBtnGlobalAnalaze);
  setCurrentGlobalAnalazeInterval("5m");
});

regim15mBtnGlobalAnalaze.addEventListener("click", () => {
  switchGroupButtonActive(groupeRegimGlobalAnalazeBtn, regim15mBtnGlobalAnalaze);
  setCurrentGlobalAnalazeInterval("15m");
});

regim30mBtnGlobalAnalaze.addEventListener("click", () => {
  switchGroupButtonActive(groupeRegimGlobalAnalazeBtn, regim30mBtnGlobalAnalaze);
  setCurrentGlobalAnalazeInterval("30m");
});

regim1hBtnGlobalAnalaze.addEventListener("click", () => {
  switchGroupButtonActive(groupeRegimGlobalAnalazeBtn, regim1hBtnGlobalAnalaze);
  setCurrentGlobalAnalazeInterval("1h");
});