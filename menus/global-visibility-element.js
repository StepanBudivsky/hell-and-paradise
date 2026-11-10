import { checkClass, switchGroupButtonActive } from "../control.js";

// маркери
const markerVisDivergenceMACD = document.querySelector("#markerVisDivergenceMACD");
const markerVisDivergenceRSI = document.querySelector("#markerVisDivergenceRSI");
const markerVisMA = document.querySelector("#markerVisMA");
const markerVisMACD = document.querySelector("#markerVisMACD");
const markerVisTrigger = document.querySelector("#markerVisTrigger");
const markerVisAutoFibanachi = document.querySelector("#markerVisAutoFibanachi");
const markerVisWawe = document.querySelector("#markerVisWawe");
const markerVisFibanachi = document.querySelector("#markerVisFibanachi");
const markerVisPivotPoint = document.querySelector("#markerVisPivotPoint");
const markerVisScenarios = document.querySelector("#markerVisScenarios");

// лінії на графіку
const triggerVis = document.querySelector("#triggerVis");
const ma10Vis = document.querySelector("#ma10Vis");
const ma30Vis = document.querySelector("#ma30Vis");
const autoFibanachiVis = document.querySelector("#autoFibanachiVis");
const pivotPointVis = document.querySelector("#pivotPointVis");
const tweezersVis = document.querySelector("#tweezersVis");
const engulfingsVis = document.querySelector("#engulfingsVis");
const hammersVis = document.querySelector("#hammersVis");

// робота кнопки лімітів
const graficLimitVis = document.querySelector("#graficLimitVis");
const graficLimitRelated = document.querySelector("#graficLimitRelated");

// Tweezers режими відображенння маркерів сценаріїв
const regim1ScenariosTweezers = document.querySelector("#regim1ScenariosTweezers");
const regim2ScenariosTweezers = document.querySelector("#regim2ScenariosTweezers");
const regim3ScenariosTweezers = document.querySelector("#regim3ScenariosTweezers");

const regimScenariosTweezersBtnGroupe = [regim1ScenariosTweezers, regim2ScenariosTweezers, regim3ScenariosTweezers];

// Engulfings режими відображенння маркерів сценаріїв
const regim1ScenariosEngulfings = document.querySelector("#regim1ScenariosEngulfings");
const regim2ScenariosEngulfings = document.querySelector("#regim2ScenariosEngulfings");
const regim3ScenariosEngulfings = document.querySelector("#regim3ScenariosEngulfings");

const regimScenariosEngulfingsBtnGroupe = [regim1ScenariosEngulfings, regim2ScenariosEngulfings, regim3ScenariosEngulfings];

// MACD режими відображенння маркерів сценаріїв
const regim1ScenariosMACD = document.querySelector("#regim1ScenariosMACD");
const regim2ScenariosMACD = document.querySelector("#regim2ScenariosMACD");
const regim3ScenariosMACD = document.querySelector("#regim3ScenariosMACD");

const regimScenariosMacdBtnGroupe = [regim1ScenariosMACD, regim2ScenariosMACD, regim3ScenariosMACD];

// MA режими відображенння маркерів сценаріїв
const regim1ScenariosMA = document.querySelector("#regim1ScenariosMA");
const regim2ScenariosMA = document.querySelector("#regim2ScenariosMA");
const regim3ScenariosMA = document.querySelector("#regim3ScenariosMA");

const regimScenariosMaBtnGroupe = [regim1ScenariosMA, regim2ScenariosMA, regim3ScenariosMA];

// RSI режими відображенння маркерів сценаріїв
const regim1ScenariosRSI = document.querySelector("#regim1ScenariosRSI");
const regim2ScenariosRSI = document.querySelector("#regim2ScenariosRSI");
const regim3ScenariosRSI = document.querySelector("#regim3ScenariosRSI");

const regimScenariosRsiBtnGroupe = [regim1ScenariosRSI, regim2ScenariosRSI, regim3ScenariosRSI];

// Wawe режими відображенння маркерів сценаріїв
const regim1ScenariosWawe = document.querySelector("#regim1ScenariosWawe");
const regim2ScenariosWawe = document.querySelector("#regim2ScenariosWawe");
const regim3ScenariosWawe = document.querySelector("#regim3ScenariosWawe");

const regimScenariosWaweBtnGroupe = [regim1ScenariosWawe, regim2ScenariosWawe, regim3ScenariosWawe];

// Fibonachi режими відображенння маркерів сценаріїв
const regim1ScenariosFibonachi = document.querySelector("#regim1ScenariosFibonachi");
const regim2ScenariosFibonachi = document.querySelector("#regim2ScenariosFibonachi");
const regim3ScenariosFibonachi = document.querySelector("#regim3ScenariosFibonachi");

const regimScenariosFibonachiBtnGroupe = [regim1ScenariosFibonachi, regim2ScenariosFibonachi, regim3ScenariosFibonachi];

// AutoFibanachi режими відображенння маркерів сценаріїв
const regim1ScenariosAutoFibanachi = document.querySelector("#regim1ScenariosAutoFibanachi");
const regim2ScenariosAutoFibanachi = document.querySelector("#regim2ScenariosAutoFibanachi");
const regim3ScenariosAutoFibanachi = document.querySelector("#regim3ScenariosAutoFibanachi");

const regimScenariosAutoFibanachiBtnGroupe = [regim1ScenariosAutoFibanachi, regim2ScenariosAutoFibanachi, regim3ScenariosAutoFibanachi];

// Trigger режими відображенння маркерів сценаріїв
const regim1ScenariosTrigger = document.querySelector("#regim1ScenariosTrigger");
const regim2ScenariosTrigger = document.querySelector("#regim2ScenariosTrigger");
const regim3ScenariosTrigger = document.querySelector("#regim3ScenariosTrigger");

const regimScenariosTriggerBtnGroupe = [regim1ScenariosTrigger, regim2ScenariosTrigger, regim3ScenariosTrigger];

// Pivot Point 5m режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_5m = document.querySelector("#regim1ScenariosPivotPoint_5m");
const regim2ScenariosPivotPoint_5m = document.querySelector("#regim2ScenariosPivotPoint_5m");
const regim3ScenariosPivotPoint_5m = document.querySelector("#regim3ScenariosPivotPoint_5m");

const regimScenariosPivotPoint_5mBtnGroupe = [regim1ScenariosPivotPoint_5m, regim2ScenariosPivotPoint_5m, regim3ScenariosPivotPoint_5m];

// Pivot Point 15m режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_15m = document.querySelector("#regim1ScenariosPivotPoint_15m");
const regim2ScenariosPivotPoint_15m = document.querySelector("#regim2ScenariosPivotPoint_15m");
const regim3ScenariosPivotPoint_15m = document.querySelector("#regim3ScenariosPivotPoint_15m");

const regimScenariosPivotPoint_15mBtnGroupe = [regim1ScenariosPivotPoint_15m, regim2ScenariosPivotPoint_15m, regim3ScenariosPivotPoint_15m];

// Pivot Point 30m режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_30m = document.querySelector("#regim1ScenariosPivotPoint_30m");
const regim2ScenariosPivotPoint_30m = document.querySelector("#regim2ScenariosPivotPoint_30m");
const regim3ScenariosPivotPoint_30m = document.querySelector("#regim3ScenariosPivotPoint_30m");

const regimScenariosPivotPoint_30mBtnGroupe = [regim1ScenariosPivotPoint_30m, regim2ScenariosPivotPoint_30m, regim3ScenariosPivotPoint_30m];

// Pivot Point 1h режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_1h = document.querySelector("#regim1ScenariosPivotPoint_1h");
const regim2ScenariosPivotPoint_1h = document.querySelector("#regim2ScenariosPivotPoint_1h");
const regim3ScenariosPivotPoint_1h = document.querySelector("#regim3ScenariosPivotPoint_1h");

const regimScenariosPivotPoint_1hBtnGroupe = [regim1ScenariosPivotPoint_1h, regim2ScenariosPivotPoint_1h, regim3ScenariosPivotPoint_1h];

// Pivot Point 4h режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_4h = document.querySelector("#regim1ScenariosPivotPoint_4h");
const regim2ScenariosPivotPoint_4h = document.querySelector("#regim2ScenariosPivotPoint_4h");
const regim3ScenariosPivotPoint_4h = document.querySelector("#regim3ScenariosPivotPoint_4h");

const regimScenariosPivotPoint_4hBtnGroupe = [regim1ScenariosPivotPoint_4h, regim2ScenariosPivotPoint_4h, regim3ScenariosPivotPoint_4h];

// Pivot Point 1d режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_1d = document.querySelector("#regim1ScenariosPivotPoint_1d");
const regim2ScenariosPivotPoint_1d = document.querySelector("#regim2ScenariosPivotPoint_1d");
const regim3ScenariosPivotPoint_1d = document.querySelector("#regim3ScenariosPivotPoint_1d");

const regimScenariosPivotPoint_1dBtnGroupe = [regim1ScenariosPivotPoint_1d, regim2ScenariosPivotPoint_1d, regim3ScenariosPivotPoint_1d];

// кнопки для повного виключення або повного виключення маркерів
const allOnMarkerActBtn = document.querySelector("#allOnMarkerActBtn");
const allOffMarkerActBtn = document.querySelector("#allOffMarkerActBtn");

// кнопки для повного виключення або повного виключення ліній
const allOnLinesActBtn = document.querySelector("#allOnLinesActBtn");
const allOffLinesActBtn = document.querySelector("#allOffLinesActBtn");

// кнопки для повного виключення або повного виключення маркерів
const regim1ScenariosAll = document.querySelector("#regim1ScenariosAll");
const regim2ScenariosAll = document.querySelector("#regim2ScenariosAll");
const regim3ScenariosAll = document.querySelector("#regim3ScenariosAll");

// кнопки для повного вимкнення або ввімкнення і маркерів, і ліній одразу
const allOffVisActBtn = document.querySelector("#allOffVisActBtn");
const allOnVisActBtn = document.querySelector("#allOnVisActBtn");

// кнопки виключення індикатора із суми (Σ)
const macdExcludeBtn = document.querySelector("#macdExcludeBtn");
const maExcludeBtn = document.querySelector("#maExcludeBtn");
const rsiExcludeBtn = document.querySelector("#rsiExcludeBtn");
const waveExcludeBtn = document.querySelector("#waveExcludeBtn");
const fibanachiExcludeBtn = document.querySelector("#fibanachiExcludeBtn");
const patternExcludeBtn = document.querySelector("#patternExcludeBtn");
const autoFibanachiExcludeBtn = document.querySelector("#autoFibanachiExcludeBtn");
const triggerExcludeBtn = document.querySelector("#triggerExcludeBtn");
const pivotPoint1mExcludeBtn = document.querySelector("#pivotPoint1mExcludeBtn");
const pivotPoint5mExcludeBtn = document.querySelector("#pivotPoint5mExcludeBtn");
const pivotPoint15mExcludeBtn = document.querySelector("#pivotPoint15mExcludeBtn");
const pivotPoint30mExcludeBtn = document.querySelector("#pivotPoint30mExcludeBtn");
const pivotPoint1hExcludeBtn = document.querySelector("#pivotPoint1hExcludeBtn");
const pivotPoint4hExcludeBtn = document.querySelector("#pivotPoint4hExcludeBtn");
const pivotPoint1dExcludeBtn = document.querySelector("#pivotPoint1dExcludeBtn");
 
// кнопки виключення множників індикатора (×)
const macdNoMultBtn = document.querySelector("#macdNoMultBtn");
const maNoMultBtn = document.querySelector("#maNoMultBtn");
const rsiNoMultBtn = document.querySelector("#rsiNoMultBtn");
const waveNoMultBtn = document.querySelector("#waveNoMultBtn");
const fibanachiNoMultBtn = document.querySelector("#fibanachiNoMultBtn");
const trendNoMultBtn = document.querySelector("#trendNoMultBtn");
const autoFibanachiNoMultBtn = document.querySelector("#autoFibanachiNoMultBtn");
const triggerNoMultBtn = document.querySelector("#triggerNoMultBtn");
const pivotPoint1mNoMultBtn = document.querySelector("#pivotPoint1mNoMultBtn");
const pivotPoint5mNoMultBtn = document.querySelector("#pivotPoint5mNoMultBtn");
const pivotPoint15mNoMultBtn = document.querySelector("#pivotPoint15mNoMultBtn");
const pivotPoint30mNoMultBtn = document.querySelector("#pivotPoint30mNoMultBtn");
const pivotPoint1hNoMultBtn = document.querySelector("#pivotPoint1hNoMultBtn");
const pivotPoint4hNoMultBtn = document.querySelector("#pivotPoint4hNoMultBtn");
const pivotPoint1dNoMultBtn = document.querySelector("#pivotPoint1dNoMultBtn");

// кнопки для повного вимкнення або ввімкнення блоків аналізу
const allOffExcludeActBtn = document.querySelector("#allOffExcludeActBtn");
const allOnExcludeActBtn = document.querySelector("#allOnExcludeActBtn");

// кнопки для повного вимкнення або ввімкнення множників аналізу
const allOffMultActBtn = document.querySelector("#allOffMultActBtn");
const allOnMultActBtn = document.querySelector("#allOnMultActBtn");

/* ==========================================================================
   БЛОК 1: СТРУКТУРИ ДАНИХ ТА КОНФІГУРАЦІЯ
   ========================================================================== */

// Списки UI-елементів для масового керування видимістю на графіку
const allMarkers = [
  markerVisScenarios,
  markerVisDivergenceMACD, markerVisDivergenceRSI, markerVisMA, 
  markerVisMACD, markerVisTrigger, markerVisAutoFibanachi, 
  markerVisWawe, markerVisFibanachi, markerVisPivotPoint
];

const allLines = [
  triggerVis, ma10Vis, ma30Vis, autoFibanachiVis, pivotPointVis,
  tweezersVis, engulfingsVis, hammersVis,
];

// Кнопки виключення індикаторів із суми
const allExcludeBtns = [
  macdExcludeBtn, maExcludeBtn, rsiExcludeBtn, waveExcludeBtn, fibanachiExcludeBtn, patternExcludeBtn, autoFibanachiExcludeBtn, triggerExcludeBtn, pivotPoint1mExcludeBtn, pivotPoint5mExcludeBtn, pivotPoint15mExcludeBtn, pivotPoint30mExcludeBtn, pivotPoint1hExcludeBtn, pivotPoint4hExcludeBtn, pivotPoint1dExcludeBtn
];
 
// Кнопки виключення множників індикаторів
const allNoMultBtns = [
  macdNoMultBtn, maNoMultBtn, rsiNoMultBtn, waveNoMultBtn, fibanachiNoMultBtn, trendNoMultBtn, autoFibanachiNoMultBtn, triggerNoMultBtn, pivotPoint1mNoMultBtn, pivotPoint5mNoMultBtn, pivotPoint15mNoMultBtn, pivotPoint30mNoMultBtn, pivotPoint1hNoMultBtn, pivotPoint4hNoMultBtn, pivotPoint1dNoMultBtn
];

const limitChartBtn = [
  graficLimitVis, graficLimitRelated
];

/**
 * Конфігураційна матриця для режимів відображення сценаріїв.
 * Кожен підмасив формує зв'язок: [Група кнопок, Кнопка_Режим1, Кнопка_Режим2, Кнопка_Режим3]
 */
const scenariosConfig = [ 
  [regimScenariosTweezersBtnGroupe, regim1ScenariosTweezers, regim2ScenariosTweezers, regim3ScenariosTweezers],
  [regimScenariosEngulfingsBtnGroupe, regim1ScenariosEngulfings, regim2ScenariosEngulfings, regim3ScenariosEngulfings],
  [regimScenariosMacdBtnGroupe, regim1ScenariosMACD, regim2ScenariosMACD, regim3ScenariosMACD],
  [regimScenariosMaBtnGroupe, regim1ScenariosMA, regim2ScenariosMA, regim3ScenariosMA],
  [regimScenariosRsiBtnGroupe, regim1ScenariosRSI, regim2ScenariosRSI, regim3ScenariosRSI],
  [regimScenariosWaweBtnGroupe, regim1ScenariosWawe, regim2ScenariosWawe, regim3ScenariosWawe],
  [regimScenariosFibonachiBtnGroupe, regim1ScenariosFibonachi, regim2ScenariosFibonachi, regim3ScenariosFibonachi],
  [regimScenariosAutoFibanachiBtnGroupe, regim1ScenariosAutoFibanachi, regim2ScenariosAutoFibanachi, regim3ScenariosAutoFibanachi],
  [regimScenariosTriggerBtnGroupe, regim1ScenariosTrigger, regim2ScenariosTrigger, regim3ScenariosTrigger],
  [regimScenariosPivotPoint_5mBtnGroupe, regim1ScenariosPivotPoint_5m, regim2ScenariosPivotPoint_5m, regim3ScenariosPivotPoint_5m],
  [regimScenariosPivotPoint_15mBtnGroupe, regim1ScenariosPivotPoint_15m, regim2ScenariosPivotPoint_15m, regim3ScenariosPivotPoint_15m],
  [regimScenariosPivotPoint_30mBtnGroupe, regim1ScenariosPivotPoint_30m, regim2ScenariosPivotPoint_30m, regim3ScenariosPivotPoint_30m],
  [regimScenariosPivotPoint_1hBtnGroupe, regim1ScenariosPivotPoint_1h, regim2ScenariosPivotPoint_1h, regim3ScenariosPivotPoint_1h],
  [regimScenariosPivotPoint_4hBtnGroupe, regim1ScenariosPivotPoint_4h, regim2ScenariosPivotPoint_4h, regim3ScenariosPivotPoint_4h],
  [regimScenariosPivotPoint_1dBtnGroupe, regim1ScenariosPivotPoint_1d, regim2ScenariosPivotPoint_1d, regim3ScenariosPivotPoint_1d]
];

// Усі елементи видимості на графіку (маркери + лінії)
const allVisibilityElements = [...allMarkers, ...allLines, ...limitChartBtn];

// щоб кнопки "all on/off" для маркерів і ліній їх не чіпали)
const indicatorToggleBtns = [...allExcludeBtns, ...allNoMultBtns];

/* ==========================================================================
   БЛОК 2: ЛОГІКА ДЛЯ МАРКЕРІВ ТА ЛІНІЙ (TOGGLE, MASS ON/OFF)
   ========================================================================== */

// Перемикання стану 'active' при кліку на будь-який індивідуальний маркер чи лінію
allVisibilityElements.forEach(element => {
  element.addEventListener('click', () => element.classList.toggle('active'));
});

// Перемикання стану 'active' для кнопок виключення індикаторів і множників
indicatorToggleBtns.forEach(element => {
  element.addEventListener('click', () => element.classList.toggle('active'));
});

// Масове вимкнення ВСІХ маркерів і ліній (додаємо клас активності)
allOffVisActBtn.addEventListener('click', () => {
  allVisibilityElements.forEach(element => element.classList.add('active'));
});

// Масове ввімкнення ВСІХ маркерів і ліній (видаляємо клас активності)
allOnVisActBtn.addEventListener('click', () => {
  allVisibilityElements.forEach(element => element.classList.remove('active'));
});

// Масове ввімкнення всіх маркерів (видаляємо клас активності)
allOnMarkerActBtn.addEventListener('click', () => { 
  allMarkers.forEach(marker => marker.classList.remove('active'));
});

// Масове вимкнення всіх маркерів (додаємо клас активності)
allOffMarkerActBtn.addEventListener('click', () => { 
  allMarkers.forEach(marker => marker.classList.add('active'));
});

// Масове ввімкнення всіх ліній
allOnLinesActBtn.addEventListener('click', () => { 
  allLines.forEach(line => line.classList.remove('active'));
});

// Масове вимкнення всіх ліній
allOffLinesActBtn.addEventListener('click', () => { 
  allLines.forEach(line => line.classList.add('active'));
});

// Масове вимкнення ВСІХ блоків аналізу
allOffExcludeActBtn.addEventListener('click', () => {
  allExcludeBtns.forEach(element => element.classList.add('active'));
});

// Масове ввімкнення ВСІХ блоків аналізу
allOnExcludeActBtn.addEventListener('click', () => {
  allExcludeBtns.forEach(element => element.classList.remove('active'));
});

// Масове вимкнення ВСІХ блоків маркерів
allOffMultActBtn.addEventListener('click', () => {
  allNoMultBtns.forEach(element => element.classList.add('active'));
});

// Масове ввімкнення ВСІХ блоків маркерів
allOnMultActBtn.addEventListener('click', () => {
  allNoMultBtns.forEach(element => element.classList.remove('active'));
});

/* ==========================================================================
   БЛОК 3: ЛОГІКА КЕРУВАННЯ СЦЕНАРІЯМИ ЗА РЕЖИМАМИ
   ========================================================================== */

// Автоматичне призначення кліків на кожну індивідуальну кнопку режиму в матриці
scenariosConfig.forEach(([group, btn1, btn2, btn3]) => {
  btn1.addEventListener('click', () => switchGroupButtonActive(group, btn1));
  btn2.addEventListener('click', () => switchGroupButtonActive(group, btn2));
  btn3.addEventListener('click', () => switchGroupButtonActive(group, btn3));
});

// Кнопка перемикання ВСІХ індикаторів на Режим 1
regim1ScenariosAll.addEventListener('click', () => { 
  scenariosConfig.forEach(([group, btn1]) => switchGroupButtonActive(group, btn1));
});

// Кнопка перемикання ВСІХ індикаторів на Режим 2 (btn1 пропускаємо через '_')
regim2ScenariosAll.addEventListener('click', () => { 
  scenariosConfig.forEach(([group, _, btn2]) => switchGroupButtonActive(group, btn2));
});

// Кнопка перемикання ВСІХ індикаторів на Режим 3 (btn1 та btn2 пропускаємо через '_' та '__')
regim3ScenariosAll.addEventListener('click', () => { 
  scenariosConfig.forEach(([group, _, __, btn3]) => switchGroupButtonActive(group, btn3));
});
