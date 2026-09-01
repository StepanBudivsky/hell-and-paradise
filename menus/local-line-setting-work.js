import { currentInterval } from "../chart-data.js";
import { checkClass, switchGroupButtonActive } from "../control.js";
import { localSettingByInterval } from "../program-settings.js";

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

// вибір першої точки для хвиль
startDotBtnMax.addEventListener('click', () => switchGroupButtonActive(groupeStartDotBtn, startDotBtnMax));
startDotBtnMin.addEventListener('click', () => switchGroupButtonActive(groupeStartDotBtn, startDotBtnMin));

// Робота кнопок переключення видимості хвиль
wawe1Vis.addEventListener('click', () => { 
  wawe1Vis.classList.toggle('active');
  if (!checkClass(wawe1Vis)) {
    wawe2Vis.classList.add('active');
    wawe3Vis.classList.add('active');
    wawe4Vis.classList.add('active');
    wawe5Vis.classList.add('active');
  }
});
wawe2Vis.addEventListener('click', () => { 
  wawe2Vis.classList.toggle('active') 
  if (!checkClass(wawe2Vis)) {
    wawe3Vis.classList.add('active');
    wawe4Vis.classList.add('active');
    wawe5Vis.classList.add('active');
  } else {
    wawe1Vis.classList.remove('active');
  }
});
wawe3Vis.addEventListener('click', () => { 
  wawe3Vis.classList.toggle('active') 
  if (!checkClass(wawe3Vis)) {
    wawe4Vis.classList.add('active');
    wawe5Vis.classList.add('active');
  } else {
    wawe1Vis.classList.remove('active');
    wawe2Vis.classList.remove('active');
  }
});
wawe4Vis.addEventListener('click', () => { 
  wawe4Vis.classList.toggle('active') 
  if (!checkClass(wawe4Vis)) {
    wawe5Vis.classList.add('active');
  } else {
    wawe1Vis.classList.remove('active');
    wawe2Vis.classList.remove('active');
    wawe3Vis.classList.remove('active');
  }
});
wawe5Vis.addEventListener('click', () => {
  wawe5Vis.classList.toggle('active')
  if (checkClass(wawe5Vis)) {
    wawe1Vis.classList.remove('active');
    wawe2Vis.classList.remove('active');
    wawe3Vis.classList.remove('active');
    wawe4Vis.classList.remove('active');
  }
});

// робота кнопок переключення настройок рівня 1
level1Dir.addEventListener('click', () => level1Dir.classList.toggle('active'));
level1Vis.addEventListener('click', () => level1Vis.classList.toggle('active'));

// Робота кнопок вибору точки рівня 1
level1DotBtn1.addEventListener('click', () => switchGroupButtonActive(groupeLevel1Btn, level1DotBtn1));
level1DotBtn2.addEventListener('click', () => switchGroupButtonActive(groupeLevel1Btn, level1DotBtn2));
level1DotBtn3.addEventListener('click', () => switchGroupButtonActive(groupeLevel1Btn, level1DotBtn3));
level1DotBtn4.addEventListener('click', () => switchGroupButtonActive(groupeLevel1Btn, level1DotBtn4));
level1DotBtn5.addEventListener('click', () => switchGroupButtonActive(groupeLevel1Btn, level1DotBtn5));
level1DotBtn6.addEventListener('click', () => switchGroupButtonActive(groupeLevel1Btn, level1DotBtn6));
level1DotBtn7.addEventListener('click', () => switchGroupButtonActive(groupeLevel1Btn, level1DotBtn7));

// робота кнопок переключення настройок фібоначі
fiboVis.addEventListener('click', () => fiboVis.classList.toggle('active'));

// Робота кнопок вибору першої точки фібоначчі
startFiboBtn1.addEventListener('click', () => switchGroupButtonActive(groupeFiboStart, startFiboBtn1));
startFiboBtn2.addEventListener('click', () => switchGroupButtonActive(groupeFiboStart, startFiboBtn2));
startFiboBtn3.addEventListener('click', () => switchGroupButtonActive(groupeFiboStart, startFiboBtn3));
startFiboBtn4.addEventListener('click', () => switchGroupButtonActive(groupeFiboStart, startFiboBtn4));
startFiboBtn5.addEventListener('click', () => switchGroupButtonActive(groupeFiboStart, startFiboBtn5));
startFiboBtn6.addEventListener('click', () => switchGroupButtonActive(groupeFiboStart, startFiboBtn6));
startFiboBtn7.addEventListener('click', () => switchGroupButtonActive(groupeFiboStart, startFiboBtn7));

// Робота кнопок вибору другої точки фібоначчі
endFiboBtn1.addEventListener('click', () => switchGroupButtonActive(groupeFiboEnd, endFiboBtn1));
endFiboBtn2.addEventListener('click', () => switchGroupButtonActive(groupeFiboEnd, endFiboBtn2));
endFiboBtn3.addEventListener('click', () => switchGroupButtonActive(groupeFiboEnd, endFiboBtn3));
endFiboBtn4.addEventListener('click', () => switchGroupButtonActive(groupeFiboEnd, endFiboBtn4));
endFiboBtn5.addEventListener('click', () => switchGroupButtonActive(groupeFiboEnd, endFiboBtn5));
endFiboBtn6.addEventListener('click', () => switchGroupButtonActive(groupeFiboEnd, endFiboBtn6));
endFiboBtn7.addEventListener('click', () => switchGroupButtonActive(groupeFiboEnd, endFiboBtn7));

export function updateCurrentLocalLineSetting (){
  let currentSetting = localSettingByInterval[currentInterval];
  
  currentSetting.startDot = Number(!checkClass(startDotBtnMax)) * 0 + Number(!checkClass(startDotBtnMin)) * 1;
  console.log(localSettingByInterval[currentInterval]);

  currentSetting.wawe1Settings.wawe1Visibility = checkClass(wawe1Vis);
  currentSetting.wawe2Settings.wawe2Visibility = checkClass(wawe2Vis);
  currentSetting.wawe3Settings.wawe3Visibility = checkClass(wawe3Vis);
  currentSetting.wawe4Settings.wawe4Visibility = checkClass(wawe4Vis);
  currentSetting.wawe5Settings.wawe5Visibility = checkClass(wawe5Vis);

  currentSetting.wawe1Settings.wawe1Length = Number(wawe1Len.value);
  currentSetting.wawe2Settings.wawe2Length = Number(wawe2Len.value);
  currentSetting.wawe3Settings.wawe3Length = Number(wawe3Len.value);
  currentSetting.wawe4Settings.wawe4Length = Number(wawe4Len.value);
  currentSetting.wawe5Settings.wawe5Length = Number(wawe5Len.value);

  currentSetting.fibanachiSettings.fibanachiVisibility = checkClass(fiboVis);
  currentSetting.fibanachiSettings.fibanachiLength = Number(fiboLen.value);
  currentSetting.fibanachiSettings.fibanachiStart = Number(!checkClass(startFiboBtn1)) * 0 + Number(!checkClass(startFiboBtn2)) * 1 + Number(!checkClass(startFiboBtn3)) * 2 + Number(!checkClass(startFiboBtn4)) * 3 + Number(!checkClass(startFiboBtn5)) * 4 + Number(!checkClass(startFiboBtn6)) * 5 + Number(!checkClass(startFiboBtn7)) * 6;
  currentSetting.fibanachiSettings.fibanachiEnd = Number(!checkClass(endFiboBtn1)) * 0 + Number(!checkClass(endFiboBtn2)) * 1 + Number(!checkClass(endFiboBtn3)) * 2 + Number(!checkClass(endFiboBtn4)) * 3 + Number(!checkClass(endFiboBtn5)) * 4 + Number(!checkClass(endFiboBtn6)) * 5 + Number(!checkClass(endFiboBtn7)) * 6;

  currentSetting.level1Settings.level1DirectionUp = !checkClass(level1Dir);
  currentSetting.level1Settings.level1Visibility = checkClass(level1Vis);
  currentSetting.level1Settings.level1Length = Number(level1Len.value);
  currentSetting.level1Settings.level1Dot = Number(!checkClass(level1DotBtn1)) * 0 + Number(!checkClass(level1DotBtn2)) * 1 + Number(!checkClass(level1DotBtn3)) * 2 + Number(!checkClass(level1DotBtn4)) * 3 + Number(!checkClass(level1DotBtn5)) * 4 + Number(!checkClass(level1DotBtn6)) * 5 + Number(!checkClass(level1DotBtn7)) * 6;
}

export function setCurrentLocalLineSetting () {
  let currentSetting = localSettingByInterval[currentInterval];

  switchGroupButtonActive(groupeStartDotBtn, groupeStartDotBtn[currentSetting.startDot]);

  currentSetting.wawe1Settings.wawe1Visibility ? wawe1Vis.classList.remove('active') : wawe1Vis.classList.add('active');
  currentSetting.wawe2Settings.wawe2Visibility ? wawe2Vis.classList.remove('active') : wawe2Vis.classList.add('active');
  currentSetting.wawe3Settings.wawe3Visibility ? wawe3Vis.classList.remove('active') : wawe3Vis.classList.add('active');
  currentSetting.wawe4Settings.wawe4Visibility ? wawe4Vis.classList.remove('active') : wawe4Vis.classList.add('active');
  currentSetting.wawe5Settings.wawe5Visibility ? wawe5Vis.classList.remove('active') : wawe5Vis.classList.add('active');

  wawe1Len.value = currentSetting.wawe1Settings.wawe1Length;
  wawe2Len.value = currentSetting.wawe2Settings.wawe2Length;
  wawe3Len.value = currentSetting.wawe3Settings.wawe3Length;
  wawe4Len.value = currentSetting.wawe4Settings.wawe4Length;
  wawe5Len.value = currentSetting.wawe5Settings.wawe5Length;

  currentSetting.fibanachiSettings.fibanachiVisibility ? fiboVis.classList.remove('active') : fiboVis.classList.add('active');
  fiboLen.value = currentSetting.fibanachiSettings.fibanachiLength;
  switchGroupButtonActive(groupeFiboStart, groupeFiboStart[currentSetting.fibanachiSettings.fibanachiStart]);
  switchGroupButtonActive(groupeFiboEnd, groupeFiboEnd[currentSetting.fibanachiSettings.fibanachiEnd]);

  currentSetting.level1Settings.level1DirectionUp ? level1Dir.classList.remove('active') : level1Dir.classList.add('active');
  currentSetting.level1Settings.level1Visibility ? level1Vis.classList.remove('active') : level1Vis.classList.add('active');
  level1Len.value = currentSetting.level1Settings.level1Length;
  switchGroupButtonActive(groupeLevel1Btn, groupeLevel1Btn[currentSetting.level1Settings.level1Dot]);
}