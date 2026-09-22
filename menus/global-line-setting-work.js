import { currentInterval } from "../chart-data.js";
import { checkClass, switchGroupButtonActive } from "../control.js";
import { localSettingByInterval, setPivotPointStatus, setPivotPointRegim, globalSettingByInterval } from "../program-settings.js";

// настройки зіг загу
const ZigZagVis = document.querySelector("#ZigZagVis");
const ZigZagTrendVis = document.querySelector("#ZigZagTrendVis");
const zigZagInput = document.querySelector("#zigZagInput");

// Pivot Point 
const PivotPointVis = document.querySelector("#PivotPointVis");

const pivotPointBtn1m = document.querySelector("#pivotPointBtn1m");
const pivotPointBtn5m = document.querySelector("#pivotPointBtn5m");
const pivotPointBtn15m = document.querySelector("#pivotPointBtn15m");
const pivotPointBtn30m = document.querySelector("#pivotPointBtn30m");
const pivotPointBtn1h = document.querySelector("#pivotPointBtn1h");
const pivotPointBtn4h = document.querySelector("#pivotPointBtn4h");
const pivotPointBtn1d = document.querySelector("#pivotPointBtn1d");

const pivotPointBtnGroupe = [pivotPointBtn1m, pivotPointBtn5m, pivotPointBtn15m, pivotPointBtn30m, pivotPointBtn1h];

// MACD режими дивергенції 
const regim1MACD = document.querySelector("#regim1MACD");
const regim2MACD = document.querySelector("#regim2MACD");
const regim3MACD = document.querySelector("#regim3MACD");

const regimMacdBtnGroupe = [regim1MACD, regim2MACD, regim3MACD];

// Trigger режими 
const regim1Trigger = document.querySelector("#regim1Trigger");
const regim2Trigger = document.querySelector("#regim2Trigger");
const regim3Trigger = document.querySelector("#regim3Trigger");

const regimTriggerBtnGroupe = [regim1Trigger, regim2Trigger, regim3Trigger];

// Виключення блоків аналізу
const statusAnalazeBtn1m = document.querySelector("#statusAnalazeBtn1m");
const statusAnalazeBtn5m = document.querySelector("#statusAnalazeBtn5m");
const statusAnalazeBtn15m = document.querySelector("#statusAnalazeBtn15m");
const statusAnalazeBtn30m = document.querySelector("#statusAnalazeBtn30m");
const statusAnalazeBtn1h = document.querySelector("#statusAnalazeBtn1h");

// Виключення блоків дії
const statusActionBtn1m = document.querySelector("#statusActionBtn1m");
const statusActionBtn5m = document.querySelector("#statusActionBtn5m");
const statusActionBtn15m = document.querySelector("#statusActionBtn15m");
const statusActionBtn30m = document.querySelector("#statusActionBtn30m");
const statusActionBtn1h = document.querySelector("#statusActionBtn1h");

// кнопки збереження графіків вищого рівння на нищому рівні
const graph5mVis = document.querySelector("#graph5mVis");
const graph15mVis = document.querySelector("#graph15mVis");
const graph30mVis = document.querySelector("#graph30mVis");
const graph1hVis = document.querySelector("#graph1hVis");

// пінцет
const tweezersVis = document.querySelector("#tweezersVis");

// поглинання
const engulfingsVis = document.querySelector("#engulfingsVis");

// молот
const hammersVis = document.querySelector("#hammersVis");

// кнопки включеня/виключення авторостановки
const wawe1AutoVis = document.querySelector("#wawe1AutoVis");
const wawe2AutoVis = document.querySelector("#wawe2AutoVis");
const wawe3AutoVis = document.querySelector("#wawe3AutoVis");
const wawe4AutoVis = document.querySelector("#wawe4AutoVis");
const wawe5AutoVis = document.querySelector("#wawe5AutoVis");

// режими для відкриття угод
const cashLongDealBtn = document.querySelector("#cashLongDealBtn");
const cashShortDealBtn = document.querySelector("#cashShortDealBtn");

const regimDealGroupe = [cashLongDealBtn, cashShortDealBtn];

// Виключення розширеного тексту аналізу (відображення ваг і множників і результату)
const macdMultiplierActBtn = document.querySelector("#macdMultiplierActBtn");
const maMultiplierActBtn = document.querySelector("#maMultiplierActBtn");
const rsiMultiplierActBtn = document.querySelector("#rsiMultiplierActBtn");
const waveMultiplierActBtn = document.querySelector("#waveMultiplierActBtn");
const fibanachiMultiplierActBtn = document.querySelector("#fibanachiMultiplierActBtn");
const patternMultiplierActBtn = document.querySelector("#patternMultiplierActBtn");
const trendMultiplierActBtn = document.querySelector("#trendMultiplierActBtn");
const autoFibanachiMultiplierActBtn = document.querySelector("#autoFibanachiMultiplierActBtn");
const triggerMultiplierActBtn = document.querySelector("#triggerMultiplierActBtn");
const pivotPoint1mMultiplierActBtn = document.querySelector("#pivotPoint1mMultiplierActBtn");
const pivotPoint5mMultiplierActBtn = document.querySelector("#pivotPoint5mMultiplierActBtn");
const pivotPoint15mMultiplierActBtn = document.querySelector("#pivotPoint15mMultiplierActBtn");
const pivotPoint30mMultiplierActBtn = document.querySelector("#pivotPoint30mMultiplierActBtn");
const pivotPoint1hMultiplierActBtn = document.querySelector("#pivotPoint1hMultiplierActBtn");
const pivotPoint4hMultiplierActBtn = document.querySelector("#pivotPoint4hMultiplierActBtn");
const pivotPoint1dMultiplierActBtn = document.querySelector("#pivotPoint1dMultiplierActBtn");

// кнопки для повного виключення або повного виключення множників
const allOnMultiplierActBtn = document.querySelector("#allOnMultiplierActBtn");
const allOffMultiplierActBtn = document.querySelector("#allOffMultiplierActBtn");

// кнопки для переключення режимів входу чи на довго чи на коротко
const shortTermAgreementsBtn = document.querySelector("#shortTermAgreementsBtn");
const longTermAgreementsBtn = document.querySelector("#longTermAgreementsBtn");

// кнопки для переключення режимів входу чи на довго чи на коротко
shortTermAgreementsBtn.addEventListener('click', () => {
  switchGroupButtonActive([shortTermAgreementsBtn, longTermAgreementsBtn], shortTermAgreementsBtn);
});

longTermAgreementsBtn.addEventListener('click', () => {
  switchGroupButtonActive([shortTermAgreementsBtn, longTermAgreementsBtn], longTermAgreementsBtn);
});

// включення всіх множників
allOnMultiplierActBtn.addEventListener('click', () => { 
  macdMultiplierActBtn.classList.remove('active');
  maMultiplierActBtn.classList.remove('active');
  rsiMultiplierActBtn.classList.remove('active');
  waveMultiplierActBtn.classList.remove('active');
  fibanachiMultiplierActBtn.classList.remove('active');
  patternMultiplierActBtn.classList.remove('active');
  trendMultiplierActBtn.classList.remove('active');
  autoFibanachiMultiplierActBtn.classList.remove('active');
  triggerMultiplierActBtn.classList.remove('active');
  pivotPoint1mMultiplierActBtn.classList.remove('active');
  pivotPoint5mMultiplierActBtn.classList.remove('active');
  pivotPoint15mMultiplierActBtn.classList.remove('active');
  pivotPoint30mMultiplierActBtn.classList.remove('active');
  pivotPoint1hMultiplierActBtn.classList.remove('active');
  pivotPoint4hMultiplierActBtn.classList.remove('active');
  pivotPoint1dMultiplierActBtn.classList.remove('active');
});
// виключення всіх множників
allOffMultiplierActBtn.addEventListener('click', () => { 
  macdMultiplierActBtn.classList.add('active');
  maMultiplierActBtn.classList.add('active');
  rsiMultiplierActBtn.classList.add('active');
  waveMultiplierActBtn.classList.add('active');
  fibanachiMultiplierActBtn.classList.add('active');
  patternMultiplierActBtn.classList.add('active');
  trendMultiplierActBtn.classList.add('active');
  autoFibanachiMultiplierActBtn.classList.add('active');
  triggerMultiplierActBtn.classList.add('active');
  pivotPoint1mMultiplierActBtn.classList.add('active');
  pivotPoint5mMultiplierActBtn.classList.add('active');
  pivotPoint15mMultiplierActBtn.classList.add('active');
  pivotPoint30mMultiplierActBtn.classList.add('active');
  pivotPoint1hMultiplierActBtn.classList.add('active');
  pivotPoint4hMultiplierActBtn.classList.add('active');
  pivotPoint1dMultiplierActBtn.classList.add('active');
});

// Виключення розширеного тексту аналізу (відображення ваг і множників і результату)
macdMultiplierActBtn.addEventListener('click', () => macdMultiplierActBtn.classList.toggle('active'));
maMultiplierActBtn.addEventListener('click', () => maMultiplierActBtn.classList.toggle('active'));
rsiMultiplierActBtn.addEventListener('click', () => rsiMultiplierActBtn.classList.toggle('active'));
waveMultiplierActBtn.addEventListener('click', () => waveMultiplierActBtn.classList.toggle('active'));
fibanachiMultiplierActBtn.addEventListener('click', () => fibanachiMultiplierActBtn.classList.toggle('active'));
patternMultiplierActBtn.addEventListener('click', () => patternMultiplierActBtn.classList.toggle('active'));
trendMultiplierActBtn.addEventListener('click', () => trendMultiplierActBtn.classList.toggle('active'));
autoFibanachiMultiplierActBtn.addEventListener('click', () => autoFibanachiMultiplierActBtn.classList.toggle('active'));
triggerMultiplierActBtn.addEventListener('click', () => triggerMultiplierActBtn.classList.toggle('active'));
pivotPoint1mMultiplierActBtn.addEventListener('click', () => pivotPoint1mMultiplierActBtn.classList.toggle('active'));
pivotPoint5mMultiplierActBtn.addEventListener('click', () => pivotPoint5mMultiplierActBtn.classList.toggle('active'));
pivotPoint15mMultiplierActBtn.addEventListener('click', () => pivotPoint15mMultiplierActBtn.classList.toggle('active'));
pivotPoint30mMultiplierActBtn.addEventListener('click', () => pivotPoint30mMultiplierActBtn.classList.toggle('active'));
pivotPoint1hMultiplierActBtn.addEventListener('click', () => pivotPoint1hMultiplierActBtn.classList.toggle('active'));
pivotPoint4hMultiplierActBtn.addEventListener('click', () => pivotPoint4hMultiplierActBtn.classList.toggle('active'));
pivotPoint1dMultiplierActBtn.addEventListener('click', () => pivotPoint1dMultiplierActBtn.classList.toggle('active'));

// виключення блоків аналізу
statusAnalazeBtn1m.addEventListener('click', () => statusAnalazeBtn1m.classList.toggle('active'));
statusAnalazeBtn5m.addEventListener('click', () => statusAnalazeBtn5m.classList.toggle('active'));
statusAnalazeBtn15m.addEventListener('click', () => statusAnalazeBtn15m.classList.toggle('active'));
statusAnalazeBtn30m.addEventListener('click', () => statusAnalazeBtn30m.classList.toggle('active'));
statusAnalazeBtn1h.addEventListener('click', () => statusAnalazeBtn1h.classList.toggle('active'));

// Виключення блоків дії
statusActionBtn1m.addEventListener('click', () => statusActionBtn1m.classList.toggle('active'));
statusActionBtn5m.addEventListener('click', () => statusActionBtn5m.classList.toggle('active'));
statusActionBtn15m.addEventListener('click', () => statusActionBtn15m.classList.toggle('active'));
statusActionBtn30m.addEventListener('click', () => statusActionBtn30m.classList.toggle('active'));
statusActionBtn1h.addEventListener('click', () => statusActionBtn1h.classList.toggle('active'));

// Робота кнопок переключення роботи авторостановки
wawe1AutoVis.addEventListener('click', () => { 
  wawe1AutoVis.classList.toggle('active');
  if (!checkClass(wawe1AutoVis)) {
    wawe2AutoVis.classList.add('active');
    wawe3AutoVis.classList.add('active');
    wawe4AutoVis.classList.add('active');
    wawe5AutoVis.classList.add('active');
  }
});
wawe2AutoVis.addEventListener('click', () => { 
  wawe2AutoVis.classList.toggle('active') 
  if (!checkClass(wawe2AutoVis)) {
    wawe3AutoVis.classList.add('active');
    wawe4AutoVis.classList.add('active');
    wawe5AutoVis.classList.add('active');
  } else {
    wawe1AutoVis.classList.remove('active');
  }
});
wawe3AutoVis.addEventListener('click', () => { 
  wawe3AutoVis.classList.toggle('active') 
  if (!checkClass(wawe3AutoVis)) {
    wawe4AutoVis.classList.add('active');
    wawe5AutoVis.classList.add('active');
  } else {
    wawe1AutoVis.classList.remove('active');
    wawe2AutoVis.classList.remove('active');
  }
});
wawe4AutoVis.addEventListener('click', () => { 
  wawe4AutoVis.classList.toggle('active') 
  if (!checkClass(wawe4AutoVis)) {
    wawe5AutoVis.classList.add('active');
  } else {
    wawe1AutoVis.classList.remove('active');
    wawe2AutoVis.classList.remove('active');
    wawe3AutoVis.classList.remove('active');
  }
});
wawe5AutoVis.addEventListener('click', () => {
  wawe5AutoVis.classList.toggle('active')
  if (checkClass(wawe5AutoVis)) {
    wawe1AutoVis.classList.remove('active');
    wawe2AutoVis.classList.remove('active');
    wawe3AutoVis.classList.remove('active');
    wawe4AutoVis.classList.remove('active');
  }
});

// робота кнопки для переключення Zig Zag
ZigZagVis.addEventListener('click', () => ZigZagVis.classList.toggle('active'));

// робота кнопки для переключення видимості тренду Zig Zag
ZigZagTrendVis.addEventListener('click', () => ZigZagTrendVis.classList.toggle('active'));

// переключення режимів відображення точок дивергенцій macd на графіку
regim1MACD.addEventListener('click', () => {
  switchGroupButtonActive(regimMacdBtnGroupe, regim1MACD);
});

regim2MACD.addEventListener('click', () => {
  switchGroupButtonActive(regimMacdBtnGroupe, regim2MACD);
});

regim3MACD.addEventListener('click', () => {
  switchGroupButtonActive(regimMacdBtnGroupe, regim3MACD);
});

// переключення режимів Trigger
regim1Trigger.addEventListener('click', () => regim1Trigger.classList.toggle('active'));

regim2Trigger.addEventListener('click', () => regim2Trigger.classList.toggle('active'));

regim3Trigger.addEventListener('click', () => regim3Trigger.classList.toggle('active'));

// робота кнопок переключення настройок Pivot Point
PivotPointVis.addEventListener('click', () => PivotPointVis.classList.toggle('active'));

pivotPointBtn1m.addEventListener('click', () => {
  if (globalSettingByInterval[currentInterval].pivotPointUseRegim.includes("1m")) {
    pivotPointBtn1m.classList.toggle('active');
    localSettingByInterval[currentInterval].pivotPointSetting.regim1mVis = !checkClass(pivotPointBtn1m);
  }
});

pivotPointBtn5m.addEventListener('click', () => {
  if (globalSettingByInterval[currentInterval].pivotPointUseRegim.includes("5m")) {
    pivotPointBtn5m.classList.toggle('active');
    localSettingByInterval[currentInterval].pivotPointSetting.regim5mVis = !checkClass(pivotPointBtn5m);
  }
});

pivotPointBtn15m.addEventListener('click', () => {
  if (globalSettingByInterval[currentInterval].pivotPointUseRegim.includes("15m")) {
    pivotPointBtn15m.classList.toggle('active');
    localSettingByInterval[currentInterval].pivotPointSetting.regim15mVis = !checkClass(pivotPointBtn15m);
  }
});

pivotPointBtn30m.addEventListener('click', () => {
  if (globalSettingByInterval[currentInterval].pivotPointUseRegim.includes("30m")) {
    pivotPointBtn30m.classList.toggle('active');
    localSettingByInterval[currentInterval].pivotPointSetting.regim30mVis = !checkClass(pivotPointBtn30m);
  }
});
pivotPointBtn1h.addEventListener('click', () => {
  if (globalSettingByInterval[currentInterval].pivotPointUseRegim.includes("1h")) {
    pivotPointBtn1h.classList.toggle('active');
    localSettingByInterval[currentInterval].pivotPointSetting.regim1hVis = !checkClass(pivotPointBtn1h);
  }
});
pivotPointBtn4h.addEventListener('click', () => {
  if (globalSettingByInterval[currentInterval].pivotPointUseRegim.includes("4h")) {
    pivotPointBtn4h.classList.toggle('active');
    localSettingByInterval[currentInterval].pivotPointSetting.regim4hVis = !checkClass(pivotPointBtn4h);
  }
});

pivotPointBtn1d.addEventListener('click', () => {
  if (globalSettingByInterval[currentInterval].pivotPointUseRegim.includes("1d")) {
    pivotPointBtn1d.classList.toggle('active');
    localSettingByInterval[currentInterval].pivotPointSetting.regim1dVis = !checkClass(pivotPointBtn1d);
  }
});

// робота кнопок збереження графіків
graph5mVis.addEventListener('click', () => graph5mVis.classList.toggle('active'));
graph15mVis.addEventListener('click', () => graph15mVis.classList.toggle('active'));
graph30mVis.addEventListener('click', () => graph30mVis.classList.toggle('active'));
graph1hVis.addEventListener('click', () => graph1hVis.classList.toggle('active'));

// робота кнопки для переключення пінцетів
tweezersVis.addEventListener('click', () => tweezersVis.classList.toggle('active'));

// робота кнопки для переключення поглинання
engulfingsVis.addEventListener('click', () => engulfingsVis.classList.toggle('active'));

// робота кнопки для переключення молотів
hammersVis.addEventListener('click', () => hammersVis.classList.toggle('active'));

export function updateCurrentGlobalLineSetting (){
  let currentSetting = localSettingByInterval[currentInterval];
  
  setPivotPointStatus(checkClass(PivotPointVis));

  currentSetting.zigZagSettings.zigZagValue = Number(zigZagInput.value);
  currentSetting.zigZagSettings.zigZagVisible = checkClass(ZigZagVis);
}

export function setCurrentGlobalLineSetting () {
  let currentSetting = localSettingByInterval[currentInterval];

  currentSetting.zigZagSettings.zigZagVisible ? ZigZagVis.classList.remove('active') : ZigZagVis.classList.add('active');  
  zigZagInput.value = currentSetting.zigZagSettings.zigZagValue;

  currentSetting.pivotPointSetting.regim1mVis ? pivotPointBtn1m.classList.add('active') : pivotPointBtn1m.classList.remove('active');
  currentSetting.pivotPointSetting.regim5mVis ? pivotPointBtn5m.classList.add('active') : pivotPointBtn5m.classList.remove('active');
  currentSetting.pivotPointSetting.regim15mVis ? pivotPointBtn15m.classList.add('active') : pivotPointBtn15m.classList.remove('active');
  currentSetting.pivotPointSetting.regim30mVis ? pivotPointBtn30m.classList.add('active') : pivotPointBtn30m.classList.remove('active');
  currentSetting.pivotPointSetting.regim1hVis ? pivotPointBtn1h.classList.add('active') : pivotPointBtn1h.classList.remove('active');
  currentSetting.pivotPointSetting.regim4hVis ? pivotPointBtn4h.classList.add('active') : pivotPointBtn4h.classList.remove('active');
  currentSetting.pivotPointSetting.regim1dVis ? pivotPointBtn1d.classList.add('active') : pivotPointBtn1d.classList.remove('active');
}
