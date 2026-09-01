
export const dots1m = [
  { id: "dot1", value: 999, lock: false },
  { id: "dot2", value: 999, lock: false },
  { id: "dot3", value: 999, lock: false },
  { id: "dot4", value: 999, lock: false },
  { id: "dot5", value: 999, lock: false },
  { id: "dot6", value: 999, lock: false },
  { id: "dot7", value: 999, lock: false },
  { id: "dot8", value: 999, lock: false },
];

export const dots5m = [
  { id: "dot1", value: 999, lock: false },
  { id: "dot2", value: 999, lock: false },
  { id: "dot3", value: 999, lock: false },
  { id: "dot4", value: 999, lock: false },
  { id: "dot5", value: 999, lock: false },
  { id: "dot6", value: 999, lock: false },
  { id: "dot7", value: 999, lock: false },
  { id: "dot8", value: 999, lock: false },
];

export const dots15m = [
  { id: "dot1", value: 999, lock: false },
  { id: "dot2", value: 999, lock: false },
  { id: "dot3", value: 999, lock: false },
  { id: "dot4", value: 999, lock: false },
  { id: "dot5", value: 999, lock: false },
  { id: "dot6", value: 999, lock: false },
  { id: "dot7", value: 999, lock: false },
  { id: "dot8", value: 999, lock: false },
];

export const dots30m = [
  { id: "dot1", value: 999, lock: false },
  { id: "dot2", value: 999, lock: false },
  { id: "dot3", value: 999, lock: false },
  { id: "dot4", value: 999, lock: false },
  { id: "dot5", value: 999, lock: false },
  { id: "dot6", value: 999, lock: false },
  { id: "dot7", value: 999, lock: false },
  { id: "dot8", value: 999, lock: false },
];

export const dots1h = [
  { id: "dot1", value: 999, lock: false },  
  { id: "dot2", value: 999, lock: false },
  { id: "dot3", value: 999, lock: false },
  { id: "dot4", value: 999, lock: false },
  { id: "dot5", value: 999, lock: false },
  { id: "dot6", value: 999, lock: false },
  { id: "dot7", value: 999, lock: false },
  { id: "dot8", value: 999, lock: false },
];

// Зберігаємо всі масиви у словнику для легкого доступу
export const dotsByInterval = {
  "1m": dots1m,
  "5m": dots5m,
  "15m": dots15m,
  "30m": dots30m,
  "1h": dots1h,
};

export const autoPlacementSetting = {
  "w1": 5,
  "w2": 3,
  "w3": 5,
  "w4": 5,
  "w5": 5,
};

export let PivotPointStatus = true;
export let PivotPointRegim = "1h";

export function setPivotPointStatus (status) {
  PivotPointStatus = status;
};

export function setPivotPointRegim (regim) {
  PivotPointRegim = regim;
};

export let globalRenderSettings1m = {
  stepBetweenChart: 60,
  pivotPointLength: 240,
  pivotPointUseRegim: ["1m", "5m", "15m", "30m", "1h", "4h", "1d"],
};

export let globalRenderSettings5m = {
  stepBetweenChart: 300,
  pivotPointLength: 48,
  pivotPointUseRegim: ["5m", "15m", "30m", "1h", "4h", "1d"],
};

export let globalRenderSettings15m = {
  stepBetweenChart: 900,
  pivotPointLength: 16,
  pivotPointUseRegim: ["15m", "30m", "1h", "4h", "1d"],
};

export let globalRenderSettings30m = {
  stepBetweenChart: 1800,
  pivotPointLength: 8,
  pivotPointUseRegim: ["30m", "1h", "4h", "1d"],
};

export let globalRenderSettings1h = {
  stepBetweenChart: 3600,
  pivotPointLength: 4,
  pivotPointUseRegim: ["1h", "4h", "1d"],
};

export const globalSettingByInterval = {
  "1m": globalRenderSettings1m,
  "5m": globalRenderSettings5m,
  "15m": globalRenderSettings15m,
  "30m": globalRenderSettings30m,
  "1h": globalRenderSettings1h,
};

export let localRenderSettings1m = {
  dots: dots1m,
  startDot: 0, // це значння Початкова точка хвиль
  wawe1Settings: {
    wawe1Length: 100,
    wawe1Visibility: true,
    // wawe1: wawe1_1m,
  },
  wawe2Settings: {
    wawe2Length: 100,
    wawe2Visibility: true,
  },
  wawe3Settings: {
    wawe3Length: 100,
    wawe3Visibility: true,
  },
  wawe4Settings: {
    wawe4Length: 100,
    wawe4Visibility: true,
  },
  wawe5Settings: {
    wawe5Length: 100,
    wawe5Visibility: true,
  },
  level1Settings: {
    level1Length: 100,
    level1Visibility: true,
    level1DirectionUp: true,
    level1Dot: 0,
  },
  fibanachiSettings: {
    fibanachiLength: 20,
    fibanachiVisibility: true,
    fibanachiStart: 0, // Значення першої підгрупи кнопок фібаначі
    fibanachiEnd: 6, // Значення другої підгрупи кнопок фібаначі
  },
  zigZagSettings:{
    zigZagVisible: true, 
    zigZagValue: 0.05,
  },
  pivotPointSetting: {
    regim1mVis: false,
    regim5mVis: false,
    regim15mVis: false,
    regim30mVis: false,
    regim1hVis: false,
    regim4hVis: true,
    regim1dVis: true,
  },
};

export let localRenderSettings5m = {
  dots: dots5m,
  startDot: 0, // це значння Початкова точка хвиль
  wawe1Settings: {
    wawe1Length: 100,
    wawe1Visibility: true,
  },
  wawe2Settings: {
    wawe2Length: 100,
    wawe2Visibility: true,
  },
  wawe3Settings: {
    wawe3Length: 100,
    wawe3Visibility: true,
  },
  wawe4Settings: {
    wawe4Length: 100,
    wawe4Visibility: true,
  },
  wawe5Settings: {
    wawe5Length: 100,
    wawe5Visibility: true,
  },
  level1Settings: {
    level1Length: 100,
    level1Visibility: true,
    level1DirectionUp: true,
    level1Dot: 0,
  },
  fibanachiSettings: {
    fibanachiLength: 20,
    fibanachiVisibility: true,
    fibanachiStart: 0, // Значення першої підгрупи кнопок фібаначі
    fibanachiEnd: 6, // Значення другої підгрупи кнопок фібаначі
  },
  zigZagSettings:{
    zigZagVisible: true, 
    zigZagValue: 0.05,
  },
  pivotPointSetting: {
    regim1mVis: false,
    regim5mVis: false,
    regim15mVis: false,
    regim30mVis: false,
    regim1hVis: false,
    regim4hVis: true,
    regim1dVis: true,
  },
};

export let localRenderSettings15m = {
  dots: dots15m,
  startDot: 0, // це значння Початкова точка хвиль
  wawe1Settings: {
    wawe1Length: 100,
    wawe1Visibility: true,
  },
  wawe2Settings: {
    wawe2Length: 100,
    wawe2Visibility: true,
  },
  wawe3Settings: {
    wawe3Length: 100,
    wawe3Visibility: true,
  },
  wawe4Settings: {
    wawe4Length: 100,
    wawe4Visibility: true,
  },
  wawe5Settings: {
    wawe5Length: 100,
    wawe5Visibility: true,
  },
  level1Settings: {
    level1Length: 100,
    level1Visibility: true,
    level1DirectionUp: true,
    level1Dot: 0,
  },
  fibanachiSettings: {
    fibanachiLength: 20,
    fibanachiVisibility: true,
    fibanachiStart: 0, // Значення першої підгрупи кнопок фібаначі
    fibanachiEnd: 6, // Значення другої підгрупи кнопок фібаначі
  },
  zigZagSettings:{
    zigZagVisible: true, 
    zigZagValue: 0.05,
  },
  pivotPointSetting: {
    regim1mVis: false,
    regim5mVis: false,
    regim15mVis: false,
    regim30mVis: false,
    regim1hVis: false,
    regim4hVis: true,
    regim1dVis: true,
  },
};

export let localRenderSettings30m = {
  dots: dots30m,
  startDot: 0, // це значння Початкова точка хвиль
  wawe1Settings: {
    wawe1Length: 100,
    wawe1Visibility: true,
  },
  wawe2Settings: {
    wawe2Length: 100,
    wawe2Visibility: true,
  },
  wawe3Settings: {
    wawe3Length: 100,
    wawe3Visibility: true,
  },
  wawe4Settings: {
    wawe4Length: 100,
    wawe4Visibility: true,
  },
  wawe5Settings: {
    wawe5Length: 100,
    wawe5Visibility: true,
  },
  level1Settings: {
    level1Length: 100,
    level1Visibility: true,
    level1DirectionUp: true,
    level1Dot: 0,
  },
  fibanachiSettings: {
    fibanachiLength: 20,
    fibanachiVisibility: true,
    fibanachiStart: 0, // Значення першої підгрупи кнопок фібаначі
    fibanachiEnd: 6, // Значення другої підгрупи кнопок фібаначі
  },
  zigZagSettings:{
    zigZagVisible: true, 
    zigZagValue: 0.05,
  },
  pivotPointSetting: {
    regim1mVis: false,
    regim5mVis: false,
    regim15mVis: false,
    regim30mVis: false,
    regim1hVis: false,
    regim4hVis: true,
    regim1dVis: true,
  },
};

export let localRenderSettings1h = {
  dots: dots1h,
  startDot: 0, // це значння Початкова точка хвиль
  wawe1Settings: {
    wawe1Length: 100,
    wawe1Visibility: true,
  },
  wawe2Settings: {
    wawe2Length: 100,
    wawe2Visibility: true,
  },
  wawe3Settings: {
    wawe3Length: 100,
    wawe3Visibility: true,
  },
  wawe4Settings: {
    wawe4Length: 100,
    wawe4Visibility: true,
  },
  wawe5Settings: {
    wawe5Length: 100,
    wawe5Visibility: true,
  },
  level1Settings: {
    level1Length: 100,
    level1Visibility: true,
    level1DirectionUp: true,
    level1Dot: 0,
  },
  fibanachiSettings: {
    fibanachiLength: 20,
    fibanachiVisibility: true,
    fibanachiStart: 0, // Значення першої підгрупи кнопок фібаначі
    fibanachiEnd: 6, // Значення другої підгрупи кнопок фібаначі
  },
  zigZagSettings:{
    zigZagVisible: true, 
    zigZagValue: 0.05,
  },
  pivotPointSetting: {
    regim1mVis: false,
    regim5mVis: false,
    regim15mVis: false,
    regim30mVis: false,
    regim1hVis: false,
    regim4hVis: true,
    regim1dVis: true,
  },
};

export const localSettingByInterval = {
  "1m": localRenderSettings1m,
  "5m": localRenderSettings5m,
  "15m": localRenderSettings15m,
  "30m": localRenderSettings30m,
  "1h": localRenderSettings1h,
};

/////////////////////////////////////////////////////
export let localRenderData1m = {
  wawes: {
    wawe1Data: [],
    wawe2Data: [],
    wawe3Data: [],
    wawe4Data: [],
    wawe5Data: [],
  },
  fibanachi: {
    fibanachi_0: 0,
    fibanachi_23: 0,
    fibanachi_38: 0,
    fibanachi_50: 0,
    fibanachi_61: 0,
    fibanachi_78: 0,
    fibanachi_100: 0,
    fibanachi_161: 0,
    fibanachi_261: 0,
    fibanachi_423: 0,
  },
  pivotPoint_1m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_5m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_15m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_30m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_1h: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_4h: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_1d: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
};

export let localRenderData5m = {
  wawes: {
    wawe1Data: [],
    wawe2Data: [],
    wawe3Data: [],
    wawe4Data: [],
    wawe5Data: [],
  },
  fibanachi: {
    fibanachi_0: 0,
    fibanachi_23: 0,
    fibanachi_38: 0,
    fibanachi_50: 0,
    fibanachi_61: 0,
    fibanachi_78: 0,
    fibanachi_100: 0,
    fibanachi_161: 0,
    fibanachi_261: 0,
    fibanachi_423: 0,
  },
  pivotPoint_1m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_5m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_15m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_30m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_1h: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_4h: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_1d: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
};

export let localRenderData15m = {
  wawes: {
    wawe1Data: [],
    wawe2Data: [],
    wawe3Data: [],
    wawe4Data: [],
    wawe5Data: [],
  },
  fibanachi: {
    fibanachi_0: 0,
    fibanachi_23: 0,
    fibanachi_38: 0,
    fibanachi_50: 0,
    fibanachi_61: 0,
    fibanachi_78: 0,
    fibanachi_100: 0,
    fibanachi_161: 0,
    fibanachi_261: 0,
    fibanachi_423: 0,
  },
  pivotPoint_1m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_5m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_15m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_30m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_1h: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_4h: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_1d: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
};

export let localRenderData30m = {
  wawes: {
    wawe1Data: [],
    wawe2Data: [],
    wawe3Data: [],
    wawe4Data: [],
    wawe5Data: [],
  },
  fibanachi: {
    fibanachi_0: 0,
    fibanachi_23: 0,
    fibanachi_38: 0,
    fibanachi_50: 0,
    fibanachi_61: 0,
    fibanachi_78: 0,
    fibanachi_100: 0,
    fibanachi_161: 0,
    fibanachi_261: 0,
    fibanachi_423: 0,
  },
  pivotPoint_1m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_5m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_15m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_30m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_1h: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_4h: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_1d: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
};

export let localRenderData1h = {
  wawes: {
    wawe1Data: [],
    wawe2Data: [],
    wawe3Data: [],
    wawe4Data: [],
    wawe5Data: [],
  },
  fibanachi: {
    fibanachi_0: 0,
    fibanachi_23: 0,
    fibanachi_38: 0,
    fibanachi_50: 0,
    fibanachi_61: 0,
    fibanachi_78: 0,
    fibanachi_100: 0,
    fibanachi_161: 0,
    fibanachi_261: 0,
    fibanachi_423: 0,
  },
  pivotPoint_1m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_5m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_15m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_30m: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_1h: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_4h: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
  pivotPoint_1d: {
    start: 0,
    openTime: 0,
    lenLine: 0,
    pivotPoint: 0,
    firstResistance: 0,
    secondResistance: 0,
    thirdResistance: 0,
    firstSupport: 0, 
    secondSupport: 0,
    thirdSupport: 0,
  },
};

export const localRenderDataByInterval = {
  "1m": localRenderData1m,
  "5m": localRenderData5m,
  "15m": localRenderData15m,
  "30m": localRenderData30m,
  "1h": localRenderData1h,
};

export let wawesData = {
  wawe1Data: [],
  wawe2Data: [],
  wawe3Data: [],
  wawe4Data: [],
  wawe5Data: [],
};