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

// лінії на графіку
const triggerVis = document.querySelector("#triggerVis");
const ma10Vis = document.querySelector("#ma10Vis");
const ma30Vis = document.querySelector("#ma30Vis");
const autoFibanachiVis = document.querySelector("#autoFibanachiVis");

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

// кнопки для повного виключення або повного виключення маркерів
const allOnLinesActBtn = document.querySelector("#allOnLinesActBtn");
const allOffLinesActBtn = document.querySelector("#allOffLinesActBtn");

// кнопки для повного виключення або повного виключення маркерів
const regim1ScenariosAll = document.querySelector("#regim1ScenariosAll");
const regim2ScenariosAll = document.querySelector("#regim2ScenariosAll");
const regim3ScenariosAll = document.querySelector("#regim3ScenariosAll");

// маркери
markerVisDivergenceMACD.addEventListener('click', () => markerVisDivergenceMACD.classList.toggle('active'));
markerVisDivergenceRSI.addEventListener('click', () => markerVisDivergenceRSI.classList.toggle('active'));
markerVisMA.addEventListener('click', () => markerVisMA.classList.toggle('active'));
markerVisMACD.addEventListener('click', () => markerVisMACD.classList.toggle('active'));
markerVisTrigger.addEventListener('click', () => markerVisTrigger.classList.toggle('active'));
markerVisAutoFibanachi.addEventListener('click', () => markerVisAutoFibanachi.classList.toggle('active'));
markerVisWawe.addEventListener('click', () => markerVisWawe.classList.toggle('active'));
markerVisFibanachi.addEventListener('click', () => markerVisFibanachi.classList.toggle('active'));
markerVisPivotPoint.addEventListener('click', () => markerVisPivotPoint.classList.toggle('active'));

// лінії на графіку
triggerVis.addEventListener('click', () => triggerVis.classList.toggle('active'));
ma10Vis.addEventListener('click', () => ma10Vis.classList.toggle('active'));
ma30Vis.addEventListener('click', () => ma30Vis.classList.toggle('active'));
autoFibanachiVis.addEventListener('click', () => autoFibanachiVis.classList.toggle('active'));

// MACD режими відображенння маркерів сценаріїв
regim1ScenariosMACD.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosMacdBtnGroupe, regim1ScenariosMACD);
});

regim2ScenariosMACD.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosMacdBtnGroupe, regim2ScenariosMACD);
});

regim3ScenariosMACD.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosMacdBtnGroupe, regim3ScenariosMACD);
});

// MA режими відображенння маркерів сценаріїв
regim1ScenariosMA.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosMaBtnGroupe, regim1ScenariosMA);
});

regim2ScenariosMA.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosMaBtnGroupe, regim2ScenariosMA);
});

regim3ScenariosMA.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosMaBtnGroupe, regim3ScenariosMA);
});

// RSI режими відображенння маркерів сценаріїв
regim1ScenariosRSI.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosRsiBtnGroupe, regim1ScenariosRSI);
});

regim2ScenariosRSI.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosRsiBtnGroupe, regim2ScenariosRSI);
});

regim3ScenariosRSI.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosRsiBtnGroupe, regim3ScenariosRSI);
});

// Wawe режими відображенння маркерів сценаріїв
regim1ScenariosWawe.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosWaweBtnGroupe, regim1ScenariosWawe);
});

regim2ScenariosWawe.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosWaweBtnGroupe, regim2ScenariosWawe);
});

regim3ScenariosWawe.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosWaweBtnGroupe, regim3ScenariosWawe);
});

// Fibonachi режими відображенння маркерів сценаріїв
regim1ScenariosFibonachi.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosFibonachiBtnGroupe, regim1ScenariosFibonachi);
});

regim2ScenariosFibonachi.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosFibonachiBtnGroupe, regim2ScenariosFibonachi);
});

regim3ScenariosFibonachi.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosFibonachiBtnGroupe, regim3ScenariosFibonachi);
});

// AutoFibanachi режими відображенння маркерів сценаріїв
regim1ScenariosAutoFibanachi.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosAutoFibanachiBtnGroupe, regim1ScenariosAutoFibanachi);
});

regim2ScenariosAutoFibanachi.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosAutoFibanachiBtnGroupe, regim2ScenariosAutoFibanachi);
});

regim3ScenariosAutoFibanachi.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosAutoFibanachiBtnGroupe, regim3ScenariosAutoFibanachi);
});

// Trigger режими відображенння маркерів сценаріїв
regim1ScenariosTrigger.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosTriggerBtnGroupe, regim1ScenariosTrigger);
});

regim2ScenariosTrigger.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosTriggerBtnGroupe, regim2ScenariosTrigger);
});

regim3ScenariosTrigger.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosTriggerBtnGroupe, regim3ScenariosTrigger);
});

// Pivot Point 5m режими відображенння маркерів сценаріїв
regim1ScenariosPivotPoint_5m.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_5mBtnGroupe, regim1ScenariosPivotPoint_5m);
});

regim2ScenariosPivotPoint_5m.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_5mBtnGroupe, regim2ScenariosPivotPoint_5m);
});

regim3ScenariosPivotPoint_5m.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_5mBtnGroupe, regim3ScenariosPivotPoint_5m);
});

// Pivot Point 15m режими відображенння маркерів сценаріїв
regim1ScenariosPivotPoint_15m.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_15mBtnGroupe, regim1ScenariosPivotPoint_15m);
});

regim2ScenariosPivotPoint_15m.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_15mBtnGroupe, regim2ScenariosPivotPoint_15m);
});

regim3ScenariosPivotPoint_15m.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_15mBtnGroupe, regim3ScenariosPivotPoint_15m);
});

// Pivot Point 30m режими відображенння маркерів сценаріїв
regim1ScenariosPivotPoint_30m.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_30mBtnGroupe, regim1ScenariosPivotPoint_30m);
});

regim2ScenariosPivotPoint_30m.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_30mBtnGroupe, regim2ScenariosPivotPoint_30m);
});

regim3ScenariosPivotPoint_30m.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_30mBtnGroupe, regim3ScenariosPivotPoint_30m);
});

// Pivot Point 1h режими відображенння маркерів сценаріїв
regim1ScenariosPivotPoint_1h.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_1hBtnGroupe, regim1ScenariosPivotPoint_1h);
});

regim2ScenariosPivotPoint_1h.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_1hBtnGroupe, regim2ScenariosPivotPoint_1h);
});

regim3ScenariosPivotPoint_1h.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_1hBtnGroupe, regim3ScenariosPivotPoint_1h);
});

// Pivot Point 4h режими відображенння маркерів сценаріїв
regim1ScenariosPivotPoint_4h.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_4hBtnGroupe, regim1ScenariosPivotPoint_4h);
});

regim2ScenariosPivotPoint_4h.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_4hBtnGroupe, regim2ScenariosPivotPoint_4h);
});

regim3ScenariosPivotPoint_4h.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_4hBtnGroupe, regim3ScenariosPivotPoint_4h);
});

// Pivot Point 1d режими відображенння маркерів сценаріїв
regim1ScenariosPivotPoint_1d.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_1dBtnGroupe, regim1ScenariosPivotPoint_1d);
});

regim2ScenariosPivotPoint_1d.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_1dBtnGroupe, regim2ScenariosPivotPoint_1d);
});

regim3ScenariosPivotPoint_1d.addEventListener('click', () => {
  switchGroupButtonActive(regimScenariosPivotPoint_1dBtnGroupe, regim3ScenariosPivotPoint_1d);
});

// включення всіх маркерів
allOnMarkerActBtn.addEventListener('click', () => { 
  markerVisDivergenceMACD.classList.remove('active');
  markerVisDivergenceRSI.classList.remove('active');
  markerVisMA.classList.remove('active');
  markerVisMACD.classList.remove('active');
  markerVisTrigger.classList.remove('active');
  markerVisAutoFibanachi.classList.remove('active');
  markerVisWawe.classList.remove('active');
  markerVisFibanachi.classList.remove('active');
  markerVisPivotPoint.classList.remove('active');
});

// виключення всіх маркерів
allOffMarkerActBtn.addEventListener('click', () => { 
  markerVisDivergenceMACD.classList.add('active');
  markerVisDivergenceRSI.classList.add('active');
  markerVisMA.classList.add('active');
  markerVisMACD.classList.add('active');
  markerVisTrigger.classList.add('active');
  markerVisAutoFibanachi.classList.add('active');
  markerVisWawe.classList.add('active');
  markerVisFibanachi.classList.add('active');
  markerVisPivotPoint.classList.add('active');
});

// включення всіх ліній
allOnLinesActBtn.addEventListener('click', () => { 
  triggerVis.classList.remove('active');
  ma10Vis.classList.remove('active');
  ma30Vis.classList.remove('active');
  autoFibanachiVis.classList.remove('active');
});

// виключення всіх ліній
allOffLinesActBtn.addEventListener('click', () => { 
  triggerVis.classList.add('active');
  ma10Vis.classList.add('active');
  ma30Vis.classList.add('active');
  autoFibanachiVis.classList.add('active');
});

// кнопки для повного виключення або повного виключення маркерів
// const regim1ScenariosAll = document.querySelector("#regim1ScenariosAll");
// const regim2ScenariosAll = document.querySelector("#regim2ScenariosAll");
// const regim3ScenariosAll = document.querySelector("#regim3ScenariosAll");

// виключення всіх маркерів сценаріїв
regim1ScenariosAll.addEventListener('click', () => { 
  switchGroupButtonActive(regimScenariosMacdBtnGroupe, regim1ScenariosMACD);
  switchGroupButtonActive(regimScenariosMaBtnGroupe, regim1ScenariosMA);
  switchGroupButtonActive(regimScenariosRsiBtnGroupe, regim1ScenariosRSI);
  switchGroupButtonActive(regimScenariosWaweBtnGroupe, regim1ScenariosWawe);
  switchGroupButtonActive(regimScenariosFibonachiBtnGroupe, regim1ScenariosFibonachi);
  switchGroupButtonActive(regimScenariosAutoFibanachiBtnGroupe, regim1ScenariosAutoFibanachi);
  switchGroupButtonActive(regimScenariosTriggerBtnGroupe, regim1ScenariosTrigger);
  switchGroupButtonActive(regimScenariosPivotPoint_5mBtnGroupe, regim1ScenariosPivotPoint_5m);
  switchGroupButtonActive(regimScenariosPivotPoint_15mBtnGroupe, regim1ScenariosPivotPoint_15m);
  switchGroupButtonActive(regimScenariosPivotPoint_30mBtnGroupe, regim1ScenariosPivotPoint_30m);
  switchGroupButtonActive(regimScenariosPivotPoint_1hBtnGroupe, regim1ScenariosPivotPoint_1h);
  switchGroupButtonActive(regimScenariosPivotPoint_4hBtnGroupe, regim1ScenariosPivotPoint_4h);
  switchGroupButtonActive(regimScenariosPivotPoint_1dBtnGroupe, regim1ScenariosPivotPoint_1d);
});

// включення всіх маркерів сценаріїв
regim2ScenariosAll.addEventListener('click', () => { 
  switchGroupButtonActive(regimScenariosMacdBtnGroupe, regim2ScenariosMACD);
  switchGroupButtonActive(regimScenariosMaBtnGroupe, regim2ScenariosMA);
  switchGroupButtonActive(regimScenariosRsiBtnGroupe, regim2ScenariosRSI);
  switchGroupButtonActive(regimScenariosWaweBtnGroupe, regim2ScenariosWawe);
  switchGroupButtonActive(regimScenariosFibonachiBtnGroupe, regim2ScenariosFibonachi);
  switchGroupButtonActive(regimScenariosAutoFibanachiBtnGroupe, regim2ScenariosAutoFibanachi);
  switchGroupButtonActive(regimScenariosTriggerBtnGroupe, regim2ScenariosTrigger);
  switchGroupButtonActive(regimScenariosPivotPoint_5mBtnGroupe, regim2ScenariosPivotPoint_5m);
  switchGroupButtonActive(regimScenariosPivotPoint_15mBtnGroupe, regim2ScenariosPivotPoint_15m);
  switchGroupButtonActive(regimScenariosPivotPoint_30mBtnGroupe, regim2ScenariosPivotPoint_30m);
  switchGroupButtonActive(regimScenariosPivotPoint_1hBtnGroupe, regim2ScenariosPivotPoint_1h);
  switchGroupButtonActive(regimScenariosPivotPoint_4hBtnGroupe, regim2ScenariosPivotPoint_4h);
  switchGroupButtonActive(regimScenariosPivotPoint_1dBtnGroupe, regim2ScenariosPivotPoint_1d);
});

// включення всіх останіх маркерів сценаріїв
regim3ScenariosAll.addEventListener('click', () => { 
  switchGroupButtonActive(regimScenariosMacdBtnGroupe, regim3ScenariosMACD);
  switchGroupButtonActive(regimScenariosMaBtnGroupe, regim3ScenariosMA);
  switchGroupButtonActive(regimScenariosRsiBtnGroupe, regim3ScenariosRSI);
  switchGroupButtonActive(regimScenariosWaweBtnGroupe, regim3ScenariosWawe);
  switchGroupButtonActive(regimScenariosFibonachiBtnGroupe, regim3ScenariosFibonachi);
  switchGroupButtonActive(regimScenariosAutoFibanachiBtnGroupe, regim3ScenariosAutoFibanachi);
  switchGroupButtonActive(regimScenariosTriggerBtnGroupe, regim3ScenariosTrigger);
  switchGroupButtonActive(regimScenariosPivotPoint_5mBtnGroupe, regim3ScenariosPivotPoint_5m);
  switchGroupButtonActive(regimScenariosPivotPoint_15mBtnGroupe, regim3ScenariosPivotPoint_15m);
  switchGroupButtonActive(regimScenariosPivotPoint_30mBtnGroupe, regim3ScenariosPivotPoint_30m);
  switchGroupButtonActive(regimScenariosPivotPoint_1hBtnGroupe, regim3ScenariosPivotPoint_1h);
  switchGroupButtonActive(regimScenariosPivotPoint_4hBtnGroupe, regim3ScenariosPivotPoint_4h);
  switchGroupButtonActive(regimScenariosPivotPoint_1dBtnGroupe, regim3ScenariosPivotPoint_1d);
});