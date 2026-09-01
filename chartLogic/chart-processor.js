import { klines } from "../chart-data.js";
import { dotsByInterval, localRenderDataByInterval, localSettingByInterval } from "../program-settings.js";
import { pivotPiontLinesByInterval } from "../main.js";

import { calculateADX } from "../indecators/find-adx.js";
import { analyzeADXTrends, syncZigzagColors } from "../calcFunction/various/adx-trend-coloring-func.js";
import { calculateMA, calculateMACD, calculateRSI } from "../indecators/ema-macd-rsi-ma-indecator.js";
import { findMacdSegments } from "../indecators/find-macd-segments.js";
import { extractColoredMarkers } from "../indecators/find-min-max-dots.js";
import { findDivergencesWithMarkers } from "../indecators/find-last-rsi-divergence.js";
import { categorizeZones, createAutoFibo, createZoneLine, getAllRSIZones } from "../indecators/find-zones-rsi.js";
import { findLastTrendSegment } from "../indecators/find-last-trend-segment.js";
import { calculateZigZagClassic } from "../indecators/ZigZagIndecator.js";
import { fillMissingPoints } from "../calcFunction/various/additons-points-func.js";
import { getLastTwoTrendArrays } from "../indecators/find-last-two-trend.js";
import { createPivotPointLines } from "../renderFunction/create-pivot-point-lines.js";

import { findTweezersSeries } from "../indecators/find-tweezers-series.js";
import { findHammersSeries } from "../indecators/find-hammers-series.js";
import { findEngulfingSeries } from "../indecators/find-engulfing-series.js";

import { analyzeMACD } from "../analyze/analyze-macd.js";
import { analyzeRSI } from "../analyze/analyze-rsi.js";
import { analyzeTrigger } from "../analyze/analyze-trigger.js";
import { analyzeTrend } from "../analyze/analyze-trend.js";
import { analyzeFibanachi } from "../analyze/analyze-fibanachi.js";
import { analyzeWaves } from "../analyze/analyze-wave.js";
import { analyzePattern } from "../analyze/analyze-pattern.js";
import { analyzePivotPoint } from "../analyze/analyze-pivot-point.js";
import { analyzeMA } from "../analyze/analyze-ma.js";
import { renderSettings } from "../render.js";

const rsiAmplitude = document.querySelector("#rsiAmplitude");
const priceAmplitude = document.querySelector("#priceAmplitude");

const promFactor = document.querySelector("#prom-factor");
const minSegLen = document.querySelector("#min-seg-len");
const minDistance = document.querySelector("#min-distance");

const regim1MACD = document.querySelector("#regim1MACD");
const regim2MACD = document.querySelector("#regim2MACD");
const regim3MACD = document.querySelector("#regim3MACD");

const regim1Trigger = document.querySelector("#regim1Trigger");
const regim2Trigger = document.querySelector("#regim2Trigger");
const regim3Trigger = document.querySelector("#regim3Trigger");

// пінцет
const tweezersMinLen = document.querySelector("#tweezersMinLen");

// поглинання
const engulfingsMinLen = document.querySelector("#engulfingsMinLen");

// молот
const hammersMinLen = document.querySelector("#hammersMinLen");

export function chartProcessor(settings, analyzeData) {
  const { klinesLimited, startRenderingDot, endRenderingDot, interval } = settings;

  // робота обємів
  const volumeData = klines.map(c => ({
    time: c.time,
    value: c.volume ?? 0,
    color: c.close >= c.open ? "#26a69a" : "#f23645", // зелений/червоний
  }));

  // робота ADX 
  const adxValue = analyzeADXTrends(calculateADX(klines, 14));

  // робота MACD
  const macd = calculateMACD(klines);

  // обмежені значення MACD під область рендирингу
  const macdLimited = macd.macd.slice(startRenderingDot, endRenderingDot);
  const macdSignalLimited = macd.signal.slice(startRenderingDot, endRenderingDot);
  const macdHistogramLimited = macd.histogram.slice(startRenderingDot, endRenderingDot);

  // знаходження дивергецій на MACD
  const macdSegment = findMacdSegments(
    macdHistogramLimited,
    Number(promFactor?.value ?? 0),
    Number(minSegLen?.value ?? 5),
    Number(minDistance?.value ?? 3)
  );

  // зарашній режим відображення маркерів дивергенцій MACD
  const currentMacdRegim = regim1MACD.classList.contains('active') * 1 + regim2MACD.classList.contains('active') * 2 + regim3MACD.classList.contains('active') * 3;

  // створення маркерів дивергенцій MACD
  const markersMinMax = extractColoredMarkers(macdSegment, currentMacdRegim);

  // аналіз MACD i створення маркерів
  const markersMACD = analyzeMACD(analyzeData.macd, macdLimited, macdSignalLimited, macdHistogramLimited, macdSegment, klinesLimited);

  // робота RSI
  const rsiValue = calculateRSI(klines);
  
  // обмежені значення RSI під область рендирингу
  const rsiValueLimited = rsiValue.slice(startRenderingDot, endRenderingDot);

  // знаходження дивергецій на RSI
  const divergenseRsi = findDivergencesWithMarkers(rsiValueLimited, klinesLimited);

  // створення маркерів дивергенцій RSI
  const markersDivergenceRsi = divergenseRsi.markers;

  // аналіз RSI i створення маркерів на рітести і також створення точко для відрисовки трігера
  const rsiZone = analyzeRSI(analyzeData.rsi, rsiValueLimited, divergenseRsi.uniqueDivergenceIndices);

  // rsiLine.setMarkers(rsiZone.markerRetest);

  // аналіз Трігера i створення маркерів на рітести
  const markersTrigger = analyzeTrigger(analyzeData.trigger, rsiZone, klinesLimited);

  // знаходження всіх зон вище 70 і нище 30 на RSI
  const allZones = getAllRSIZones(rsiValueLimited);

  // Розділяємо їх на категорії
  const { overbought, oversold } = categorizeZones(allZones);
  
  // Вибір активного режиму для аналізу автоматичних фібанначі
  const currentTriggerRegim = Math.max(regim1Trigger.classList.contains('active') * 2, regim2Trigger.classList.contains('active') * 3, regim3Trigger.classList.contains('active') * 1);
  
  // перемінна даними для аналізу
  let currentLastTrigger = 0;

  // збереження значинь режимів
  let autoFiboValueStart = createAutoFibo(false); 
  let autoFiboValueExtrem = createAutoFibo(false); 
  let autoFiboValueEnd = createAutoFibo(false); 

  if (regim1Trigger.classList.contains('active')) {
    const resOverbought = createZoneLine(overbought, klines, 1);
    const resOversold = createZoneLine(oversold, klines, 1);
    autoFiboValueStart = createAutoFibo(true, resOverbought.group, resOversold.group, klines); 

    if (currentTriggerRegim === 2) currentLastTrigger = autoFiboValueStart;
  }

  if (regim2Trigger.classList.contains('active')) {
    const resOverbought = createZoneLine(overbought, klines, 2);
    const resOversold = createZoneLine(oversold, klines, 2);
    autoFiboValueExtrem = createAutoFibo(true, resOverbought.group, resOversold.group, klines); 

    if (currentTriggerRegim === 3) currentLastTrigger = autoFiboValueExtrem;
  }

  if (regim3Trigger.classList.contains('active')) {
    const resOverbought = createZoneLine(overbought, klines, 3);
    const resOversold = createZoneLine(oversold, klines, 3);
    autoFiboValueEnd = createAutoFibo(true, resOverbought.group, resOversold.group, klines); 

    if (currentTriggerRegim === 1) currentLastTrigger = autoFiboValueEnd;
  }

  let markersAutoFibanachi = [];

  // аналіз авто фібаначі і створення маркерів на рітестах
  if (currentLastTrigger) {
    markersAutoFibanachi = analyzeFibanachi(analyzeData.autoFibanachi, klinesLimited, currentLastTrigger.lastGroup.start, currentLastTrigger.lastGroup.end, currentLastTrigger.lastGroup.line, "#bda539", 2);
  }

  // робота М10
  const ma10 = calculateMA(klinesLimited, 10);

  // ковш на M10
  const ma10Trend = findLastTrendSegment(ma10);

  // робота М30
  const ma30 = calculateMA(klinesLimited, 30);

  // ковш на MA30
  const ma30Trend = findLastTrendSegment(ma30);

  // аналіз MA і створення маркерів
  const markersMA = analyzeMA(analyzeData.ma, ma10, ma30, ma10Trend, ma30Trend, klinesLimited);

  // робота зіг загу
  const zigzag = calculateZigZagClassic(klinesLimited, 0, localSettingByInterval[interval].zigZagSettings.zigZagValue);
  
  // хуй його знає шо за херня тре добре перевірити нашо воно тут
  const zigzagLineClear = zigzag.line;
  
  // заповнений варіант зіг зага
  zigzag.line = syncZigzagColors(adxValue, fillMissingPoints(zigzag.line, renderSettings.stepBetweenChart));

  // розрахунок трендів зіг зага
  const trendsData = getLastTwoTrendArrays(zigzagLineClear);

  // аналіз тренду
  analyzeTrend(analyzeData.trend, trendsData, adxValue, klinesLimited);

  const curDot = dotsByInterval[interval];

  const markersWawe = analyzeWaves(analyzeData.wawe, klinesLimited, localSettingByInterval[interval].startDot, localRenderDataByInterval[interval].wawes, curDot, zigzag);

  const fiboSetting = localSettingByInterval[interval].fibanachiSettings;
  const fiboStart = curDot[fiboSetting.fibanachiStart].value;
  const fiboEnd = curDot[fiboSetting.fibanachiEnd].value + fiboSetting.fibanachiLength > klinesLimited.length - 1 ? klinesLimited.length - 1 : curDot[fiboSetting.fibanachiEnd].value + fiboSetting.fibanachiLength;

  const markersFibanachi = analyzeFibanachi(analyzeData.standartFibanachi, klinesLimited, fiboStart, fiboEnd, localRenderDataByInterval[interval].fibanachi, "#d6179d", 1);

  createPivotPointLines(localSettingByInterval[interval].pivotPointSetting.regim1mVis, "1m", localRenderDataByInterval[interval].pivotPoint_1m, interval);
  createPivotPointLines(localSettingByInterval[interval].pivotPointSetting.regim5mVis, "5m", localRenderDataByInterval[interval].pivotPoint_5m, interval);
  createPivotPointLines(localSettingByInterval[interval].pivotPointSetting.regim15mVis, "15m", localRenderDataByInterval[interval].pivotPoint_15m, interval);
  createPivotPointLines(localSettingByInterval[interval].pivotPointSetting.regim30mVis, "30m", localRenderDataByInterval[interval].pivotPoint_30m, interval);
  createPivotPointLines(localSettingByInterval[interval].pivotPointSetting.regim1hVis, "1h", localRenderDataByInterval[interval].pivotPoint_1h, interval);
  createPivotPointLines(localSettingByInterval[interval].pivotPointSetting.regim4hVis, "4h", localRenderDataByInterval[interval].pivotPoint_4h, interval);
  createPivotPointLines(localSettingByInterval[interval].pivotPointSetting.regim1dVis, "1d", localRenderDataByInterval[interval].pivotPoint_1d, interval);
  
  const markersPivotPoint_1m = analyzePivotPoint(analyzeData.pivotPoint_1m, klinesLimited, localRenderDataByInterval[interval].pivotPoint_1m, "1m");
  const markersPivotPoint_5m = analyzePivotPoint(analyzeData.pivotPoint_5m, klinesLimited, localRenderDataByInterval[interval].pivotPoint_5m, "5m");
  const markersPivotPoint_15m = analyzePivotPoint(analyzeData.pivotPoint_15m, klinesLimited, localRenderDataByInterval[interval].pivotPoint_15m, "15m");
  const markersPivotPoint_30m = analyzePivotPoint(analyzeData.pivotPoint_30m, klinesLimited, localRenderDataByInterval[interval].pivotPoint_30m, "30m");
  const markersPivotPoint_1h = analyzePivotPoint(analyzeData.pivotPoint_1h, klinesLimited, localRenderDataByInterval[interval].pivotPoint_1h, "1h");
  const markersPivotPoint_4h = analyzePivotPoint(analyzeData.pivotPoint_4h, klinesLimited, localRenderDataByInterval[interval].pivotPoint_4h, "4h");
  const markersPivotPoint_1d = analyzePivotPoint(analyzeData.pivotPoint_1d, klinesLimited, localRenderDataByInterval[interval].pivotPoint_1d, "1d");

  const markersPivotPoint = [...markersPivotPoint_1m, ...markersPivotPoint_5m, ...markersPivotPoint_15m, ...markersPivotPoint_30m, ...markersPivotPoint_1h, ...markersPivotPoint_4h, ...markersPivotPoint_1d];

  // робота пінцетів
  const tweezers = findTweezersSeries(klinesLimited, Number(tweezersMinLen.value));
  
  // робота молотів
  const hammers = findHammersSeries(klinesLimited, Number(hammersMinLen.value));

  // робота поглинання
  const engulfings = findEngulfingSeries(klinesLimited, {
    swingConfirm: 1,
    confirmBars: Number(engulfingsMinLen.value), 
    confirmMode: 'direction', // або 'closeBeyondLevel'
    untilBreak: true,
    breakPad: 0,
    color: '#ffaa00ff',
    levelMode: 'mid',
  });

  // аналіз всіх патернів
  analyzePattern(analyzeData.pattern, tweezers.signals, engulfings.signals, klinesLimited.length);

  return {
    data: {
      volumeData, adxValue, tweezers, hammers, engulfings,
      macd, macdSegment, rsiValue, rsiZone, autoFiboValueStart, autoFiboValueExtrem, autoFiboValueEnd,
      ma10, ma10Trend, ma30, ma30Trend, zigzag, trendsData, interval,
    }, 
    markers: {
      markersMinMax, markersMACD, markersDivergenceRsi, markersTrigger, markersAutoFibanachi,
      markersMA, markersWawe, markersFibanachi, markersPivotPoint,
    }
  };
}