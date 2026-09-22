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

// MACD режими дивергенції 
const regim1MACD = document.querySelector("#regim1MACD");
const regim2MACD = document.querySelector("#regim2MACD");
const regim3MACD = document.querySelector("#regim3MACD");

const regimMacdBtnGroupe = [regim1MACD, regim2MACD, regim3MACD];

// Trigger режими 
const regim1Trigger = document.querySelector("#regim1Trigger");
const regim2Trigger = document.querySelector("#regim2Trigger");
const regim3Trigger = document.querySelector("#regim3Trigger");

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

/* ==========================================================================
   БЛОК 1: СТРУКТУРИ ДАНИХ ТА КОНФІГУРАЦІЯ
   ========================================================================== */

// Масив усіх кнопок-множників
const allMultipliers = [
  macdMultiplierActBtn, maMultiplierActBtn, rsiMultiplierActBtn, 
  waveMultiplierActBtn, fibanachiMultiplierActBtn, patternMultiplierActBtn, 
  trendMultiplierActBtn, autoFibanachiMultiplierActBtn, triggerMultiplierActBtn, 
  pivotPoint1mMultiplierActBtn, pivotPoint5mMultiplierActBtn, pivotPoint15mMultiplierActBtn, 
  pivotPoint30mMultiplierActBtn, pivotPoint1hMultiplierActBtn, pivotPoint4hMultiplierActBtn, 
  pivotPoint1dMultiplierActBtn
];

// Масив групи кнопок угод (короткострокові / довгострокові)
const agreementTypeGroup = [shortTermAgreementsBtn, longTermAgreementsBtn];

// Масив усіх кнопок аналізу та дії для таймфреймів
const statusTimeframeButtons = [
  statusAnalazeBtn1m, statusAnalazeBtn5m, statusAnalazeBtn15m, statusAnalazeBtn30m, statusAnalazeBtn1h,
  statusActionBtn1m, statusActionBtn5m, statusActionBtn15m, statusActionBtn30m, statusActionBtn1h
];

// Масив усіх елементів, які лише перемикають свій клас 'active' при кліку
const simpleToggleElements = [
  ZigZagVis, ZigZagTrendVis, PivotPointVis,
  regim1Trigger, regim2Trigger, regim3Trigger,
  graph5mVis, graph15mVis, graph30mVis, graph1hVis,
  tweezersVis, engulfingsVis, hammersVis
];

// Група кнопок для режимів відображення MACD
const macdRegimButtons = [regim1MACD, regim2MACD, regim3MACD];

/**
 * Конфігурація поведінки кнопок авторозстановки хвиль.
 * Формат: [Кнопка, [Кнопки для вимкнення (add active)], [Кнопки для ввімкнення (remove active)]]
 */
const waveBehaviorConfig = [
  [wawe1AutoVis, [wawe2AutoVis, wawe3AutoVis, wawe4AutoVis, wawe5AutoVis], []],
  [wawe2AutoVis, [wawe3AutoVis, wawe4AutoVis, wawe5AutoVis], [wawe1AutoVis]],
  [wawe3AutoVis, [wawe4AutoVis, wawe5AutoVis], [wawe1AutoVis, wawe2AutoVis]],
  [wawe4AutoVis, [wawe5AutoVis], [wawe1AutoVis, wawe2AutoVis, wawe3AutoVis]],
  [wawe5AutoVis, [], [wawe1AutoVis, wawe2AutoVis, wawe3AutoVis, wawe4AutoVis]]
];

/**
 * Матриця конфігурації для таймфреймів Pivot Point.
 * Використовується спільно для обробки кліків та ініціалізації глобальних налаштувань.
 * Формат: [ЕлементКнопки, РядокТаймфрейму, НазваКлючаВНалаштуваннях]
 */
const pivotPointTimeframeConfig = [
  [pivotPointBtn1m, '1m', 'regim1mVis'],
  [pivotPointBtn5m, '5m', 'regim5mVis'],
  [pivotPointBtn15m, '15m', 'regim15mVis'],
  [pivotPointBtn30m, '30m', 'regim30mVis'],
  [pivotPointBtn1h, '1h', 'regim1hVis'],
  [pivotPointBtn4h, '4h', 'regim4hVis'],
  [pivotPointBtn1d, '1d', 'regim1dVis']
];


/* ==========================================================================
   БЛОК 2: ОБРОБНИКИ ПОДІЙ (ІНТЕРФЕЙС ТА КНОПКИ)
   ========================================================================== */

// Переключення режимів входу (надовго чи накоротко) через радіо-групу
agreementTypeGroup.forEach(btn => {
  btn.addEventListener('click', () => switchGroupButtonActive(agreementTypeGroup, btn));
});

// Масове включення всіх множників (видаляємо клас активності)
allOnMultiplierActBtn.addEventListener('click', () => { 
  allMultipliers.forEach(btn => btn.classList.remove('active'));
});

// Масове виключення всіх множників (додаємо клас активності)
allOffMultiplierActBtn.addEventListener('click', () => { 
  allMultipliers.forEach(btn => btn.classList.add('active'));
});

// Індивідуальне переключення стану (toggle) для кожної кнопки-множника
allMultipliers.forEach(btn => {
  btn.addEventListener('click', () => btn.classList.toggle('active'));
});

// Навішуємо toggle ефекти на всі кнопки таймфреймів (Аналіз та Дії)
statusTimeframeButtons.forEach(btn => {
  btn.addEventListener('click', () => btn.classList.toggle('active'));
});

// Автоматичне призначення toggle для всього списку простих перемикачів
simpleToggleElements.forEach(element => {
  element.addEventListener('click', () => element.classList.toggle('active'));
});

// Переключення режимів відображення точок дивергенцій MACD
macdRegimButtons.forEach(btn => {
  btn.addEventListener('click', () => switchGroupButtonActive(regimMacdBtnGroupe, btn));
});


/* ==========================================================================
   БЛОК 3: СКЛАДНА КАСКАДНА ТА ДИНАМІЧНА ЛОГІКА
   ========================================================================== */

// Запуск каскадної логіки для авторозстановки хвиль на основі матриці waveBehaviorConfig
waveBehaviorConfig.forEach(([currentBtn, toTurnOff, toTurnOn]) => {
  currentBtn.addEventListener('click', () => {
    currentBtn.classList.toggle('active');
    const isActive = checkClass(currentBtn);

    if (!isActive) {
      // Якщо кнопку ВИМКНЕНО (немає класу active) — гасимо залежні наступні кнопки
      toTurnOff.forEach(btn => btn.classList.add('active'));
    } else {
      // Якщо кнопку ВВІМКНЕНО (є клас active) — запалюємо залежні попередні кнопки
      toTurnOn.forEach(btn => btn.classList.remove('active'));
    }
  });
});

// Динамічна обробка кліків на таймфрейми Pivot Point із перевіркою глобальних прав доступу
pivotPointTimeframeConfig.forEach(([btn, timeframe, settingKey]) => {
  btn.addEventListener('click', () => {
    const hasAccess = globalSettingByInterval[currentInterval]?.pivotPointUseRegim.includes(timeframe);

    if (hasAccess) {
      btn.classList.toggle('active');
      
      // Записуємо інвертований стан класу в об'єкт налаштувань за динамічним ключем
      localSettingByInterval[currentInterval].pivotPointSetting[settingKey] = !checkClass(btn);
    }
  });
});


/* ==========================================================================
   БЛОК 4: ФУНКЦІЇ ЕКСПОРТУ (ІМПОРТ/ЕКСПОРТ СТАНУ НАЛАШТУВАНЬ)
   ========================================================================== */

/**
 * Зчитує поточний стан з інтерфейсу (DOM) та зберігає його у глобальний об'єкт налаштувань
 */
export function updateCurrentGlobalLineSetting () {
  const currentSetting = localSettingByInterval[currentInterval];
  
  setPivotPointStatus(checkClass(PivotPointVis));

  currentSetting.zigZagSettings.zigZagValue = Number(zigZagInput.value);
  currentSetting.zigZagSettings.zigZagVisible = checkClass(ZigZagVis);
}

/**
 * Приймає збережені налаштування з об'єкта та синхронізує з ними стан кнопок в інтерфейсі
 */
export function setCurrentGlobalLineSetting () {
  const currentSetting = localSettingByInterval[currentInterval];

  // Синхронізація стану ZigZag (якщо visible = true, то remove active, тобто інверсовано)
  ZigZagVis.classList.toggle('active', !currentSetting.zigZagSettings.zigZagVisible);  
  zigZagInput.value = currentSetting.zigZagSettings.zigZagValue;

  // Автоматична синхронізація станів усіх кнопок Pivot Point на основі конфігурації
  pivotPointTimeframeConfig.forEach(([btn, _, settingKey]) => {
    const isVisible = currentSetting.pivotPointSetting[settingKey];
    
    // Якщо у налаштуваннях true — додаємо клас active, якщо false — видаляємо
    btn.classList.toggle('active', isVisible);
  });
}
