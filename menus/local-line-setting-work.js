import { currentInterval } from "../chart-data.js";
import { checkClass, switchGroupButtonActive } from "../control.js";
import { localSettingByInterval } from "../settingsData/program-settings.js";

// зміна початкової точки хвиль
const startDotBtnMax = document.querySelector("#startDotBtnMax");
const startDotBtnMin = document.querySelector("#startDotBtnMin");
const groupeStartDotBtn = [startDotBtnMax, startDotBtnMin];

// найстройки хвиль
const wawe1Len = document.querySelector("#wawe1Len");
const wawe2Len = document.querySelector("#wawe2Len");
const wawe3Len = document.querySelector("#wawe3Len");
const wawe4Len = document.querySelector("#wawe4Len");
const wawe5Len = document.querySelector("#wawe5Len");

const wawe1Vis = document.querySelector("#wawe1Vis");
const wawe2Vis = document.querySelector("#wawe2Vis");
const wawe3Vis = document.querySelector("#wawe3Vis");
const wawe4Vis = document.querySelector("#wawe4Vis");
const wawe5Vis = document.querySelector("#wawe5Vis");

// настройки фібоначі
const fiboLen = document.querySelector("#fiboLen");
const fiboVis = document.querySelector("#fiboVis");

const startFiboBtn1 = document.querySelector("#startFiboBtn1");
const startFiboBtn2 = document.querySelector("#startFiboBtn2");
const startFiboBtn3 = document.querySelector("#startFiboBtn3");
const startFiboBtn4 = document.querySelector("#startFiboBtn4");
const startFiboBtn5 = document.querySelector("#startFiboBtn5");
const startFiboBtn6 = document.querySelector("#startFiboBtn6");
const startFiboBtn7 = document.querySelector("#startFiboBtn7");

const groupeFiboStart = [startFiboBtn1, startFiboBtn2, startFiboBtn3, startFiboBtn4, startFiboBtn5, startFiboBtn6, startFiboBtn7];

const endFiboBtn1 = document.querySelector("#endFiboBtn1");
const endFiboBtn2 = document.querySelector("#endFiboBtn2");
const endFiboBtn3 = document.querySelector("#endFiboBtn3");
const endFiboBtn4 = document.querySelector("#endFiboBtn4");
const endFiboBtn5 = document.querySelector("#endFiboBtn5");
const endFiboBtn6 = document.querySelector("#endFiboBtn6");
const endFiboBtn7 = document.querySelector("#endFiboBtn7");

const groupeFiboEnd = [endFiboBtn1, endFiboBtn2, endFiboBtn3, endFiboBtn4, endFiboBtn5, endFiboBtn6, endFiboBtn7];

// настройки першого рівня
const level1Len = document.querySelector("#level1Len");
const level1Dir = document.querySelector("#level1Dir");
const level1Vis = document.querySelector("#level1Vis");

const level1DotBtn1 = document.querySelector("#level1DotBtn1");
const level1DotBtn2 = document.querySelector("#level1DotBtn2");
const level1DotBtn3 = document.querySelector("#level1DotBtn3");
const level1DotBtn4 = document.querySelector("#level1DotBtn4");
const level1DotBtn5 = document.querySelector("#level1DotBtn5");
const level1DotBtn6 = document.querySelector("#level1DotBtn6");
const level1DotBtn7 = document.querySelector("#level1DotBtn7");

const groupeLevel1Btn = [level1DotBtn1, level1DotBtn2, level1DotBtn3, level1DotBtn4, level1DotBtn5, level1DotBtn6, level1DotBtn7];


/* ==========================================================================
   БЛОК 1: СТРУКТУРИ ДАНИХ ТА КОНФІГУРАЦІЯ
   ========================================================================== */

// Усі радіо-групи кнопок вибору точок (порядок кнопок у групі = значення в налаштуваннях)
const radioGroups = [groupeStartDotBtn, groupeLevel1Btn, groupeFiboStart, groupeFiboEnd];

// Масив елементів, які лише перемикають свій клас 'active' при кліку
const simpleToggleElements = [level1Dir, level1Vis, fiboVis];

/**
 * Конфігурація поведінки кнопок видимості хвиль.
 * Формат: [Кнопка, [Кнопки для вимкнення (add active)], [Кнопки для ввімкнення (remove active)]]
 */
const waveVisBehaviorConfig = [
  [wawe1Vis, [wawe2Vis, wawe3Vis, wawe4Vis, wawe5Vis], []],
  [wawe2Vis, [wawe3Vis, wawe4Vis, wawe5Vis], [wawe1Vis]],
  [wawe3Vis, [wawe4Vis, wawe5Vis], [wawe1Vis, wawe2Vis]],
  [wawe4Vis, [wawe5Vis], [wawe1Vis, wawe2Vis, wawe3Vis]],
  [wawe5Vis, [], [wawe1Vis, wawe2Vis, wawe3Vis, wawe4Vis]]
];

/**
 * Матриця конфігурації хвиль для синхронізації з налаштуваннями.
 * Формат: [КнопкаВидимості, ПолеДовжини, НомерХвилі]
 * Ключі в налаштуваннях формуються динамічно: wawe{N}Settings / wawe{N}Visibility / wawe{N}Length
 */
const waveSettingsConfig = [
  [wawe1Vis, wawe1Len, 1],
  [wawe2Vis, wawe2Len, 2],
  [wawe3Vis, wawe3Len, 3],
  [wawe4Vis, wawe4Len, 4],
  [wawe5Vis, wawe5Len, 5]
];


/* ==========================================================================
   БЛОК 2: ДОПОМІЖНІ ФУНКЦІЇ
   ========================================================================== */

/**
 * Повертає індекс вибраної кнопки в радіо-групі.
 * Вибрана кнопка = та, на якій НЕМАЄ класу 'active' (checkClass повертає false).
 * Якщо жодна не вибрана — повертає 0.
 */
function getSelectedIndex(group) {
  return Math.max(0, group.findIndex(btn => !checkClass(btn)));
}

/**
 * Синхронізує кнопку видимості з булевим значенням.
 * visible = true -> прибираємо 'active'; visible = false -> додаємо 'active' (інверсія).
 */
function setVisibilityClass(btn, visible) {
  btn.classList.toggle('active', !visible);
}


/* ==========================================================================
   БЛОК 3: ОБРОБНИКИ ПОДІЙ (ІНТЕРФЕЙС ТА КНОПКИ)
   ========================================================================== */

// Радіо-групи: перша точка хвиль, точка рівня 1, початок та кінець фібоначчі
radioGroups.forEach(group => {
  group.forEach(btn => {
    btn.addEventListener('click', () => switchGroupButtonActive(group, btn));
  });
});

// Прості перемикачі: напрямок рівня 1, видимість рівня 1, видимість фібоначчі
simpleToggleElements.forEach(element => {
  element.addEventListener('click', () => element.classList.toggle('active'));
});


/* ==========================================================================
   БЛОК 4: СКЛАДНА КАСКАДНА ЛОГІКА
   ========================================================================== */

// Каскадна логіка видимості хвиль на основі матриці waveVisBehaviorConfig
waveVisBehaviorConfig.forEach(([currentBtn, toTurnOff, toTurnOn]) => {
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


/* ==========================================================================
   БЛОК 5: ФУНКЦІЇ ЕКСПОРТУ (ІМПОРТ/ЕКСПОРТ СТАНУ НАЛАШТУВАНЬ)
   ========================================================================== */

/**
 * Зчитує поточний стан з інтерфейсу (DOM) та зберігає його в локальний об'єкт налаштувань
 */
export function updateCurrentLocalLineSetting () {
  const currentSetting = localSettingByInterval[currentInterval];

  currentSetting.startDot = getSelectedIndex(groupeStartDotBtn);

  // Хвилі: видимість та довжина (динамічні ключі за номером хвилі)
  waveSettingsConfig.forEach(([visBtn, lenInput, n]) => {
    currentSetting[`wawe${n}Settings`][`wawe${n}Visibility`] = checkClass(visBtn);
    currentSetting[`wawe${n}Settings`][`wawe${n}Length`] = Number(lenInput.value);
  });

  // Фібоначчі
  currentSetting.fibanachiSettings.fibanachiVisibility = checkClass(fiboVis);
  currentSetting.fibanachiSettings.fibanachiLength = Number(fiboLen.value);
  currentSetting.fibanachiSettings.fibanachiStart = getSelectedIndex(groupeFiboStart);
  currentSetting.fibanachiSettings.fibanachiEnd = getSelectedIndex(groupeFiboEnd);

  // Рівень 1
  currentSetting.level1Settings.level1DirectionUp = checkClass(level1Dir);
  currentSetting.level1Settings.level1Visibility = checkClass(level1Vis);
  currentSetting.level1Settings.level1Length = Number(level1Len.value);
  currentSetting.level1Settings.level1Dot = getSelectedIndex(groupeLevel1Btn);
}

/**
 * Приймає збережені налаштування з об'єкта та синхронізує з ними стан кнопок в інтерфейсі
 */
export function setCurrentLocalLineSetting () {
  const currentSetting = localSettingByInterval[currentInterval];

  switchGroupButtonActive(groupeStartDotBtn, groupeStartDotBtn[currentSetting.startDot]);

  // Хвилі: видимість та довжина (динамічні ключі за номером хвилі)
  waveSettingsConfig.forEach(([visBtn, lenInput, n]) => {
    setVisibilityClass(visBtn, currentSetting[`wawe${n}Settings`][`wawe${n}Visibility`]);
    lenInput.value = currentSetting[`wawe${n}Settings`][`wawe${n}Length`];
  });

  // Фібоначчі
  setVisibilityClass(fiboVis, currentSetting.fibanachiSettings.fibanachiVisibility);
  fiboLen.value = currentSetting.fibanachiSettings.fibanachiLength;
  switchGroupButtonActive(groupeFiboStart, groupeFiboStart[currentSetting.fibanachiSettings.fibanachiStart]);
  switchGroupButtonActive(groupeFiboEnd, groupeFiboEnd[currentSetting.fibanachiSettings.fibanachiEnd]);

  // Рівень 1
  setVisibilityClass(level1Dir, currentSetting.level1Settings.level1DirectionUp);
  setVisibilityClass(level1Vis, currentSetting.level1Settings.level1Visibility);
  level1Len.value = currentSetting.level1Settings.level1Length;
  switchGroupButtonActive(groupeLevel1Btn, groupeLevel1Btn[currentSetting.level1Settings.level1Dot]);
}