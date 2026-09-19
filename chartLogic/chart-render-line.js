import { getPointsFromLine } from "../calcFunction/various/additons-points-func.js";
import { klines } from "../chart-data.js";
import {
  chart,
  candlestickSeries,
  macdLine,
  signalLine,
  divergenceLine,
  macdHistogram,
  rsiLine,
  ma10Line,
  ma30Line,
  ma10LineTrend,
  ma30LineTrend,
  divergenceLineRSI,
  tweezersLine,
  hammersLine,
  engulfingsLine,
  volumeSeries,
  zigzagLineClassic,
  zigzagLineUpTrend,
  zigzagLineDownTrend, 
  zigzagLineFletTrend,
  adxLine,
  pivotPiontLinesByInterval,
  rsiOversoldZoneLine,
  rsiOversoldZoneMinLine,
  rsiOverboughtZoneLine,
  rsiOverboughtZoneMaxLine,
  autoFibanachiStart,
  autoFibanachiExtrem,
  autoFibanachiEnd
} from "../main.js";
import { updateAllMarkers } from "../menus/dots-panel.js";

import { initPointsPanel } from "../menus/global-analytics-panel.js";
import { localSettingByInterval,localRenderDataByInterval  } from "../program-settings.js";
import { renderPivotPointLines } from "../renderFunction/render-pivot-point-line.js";

export let zigzag = [];

export let markersMinMax = [];
export let markersDivergenceRsi = [];
export let markersMA = [];
export let markersMACD = [];
export let markersTrigger = [];
export let markersAutoFibanachi = [];
export let markersWawe = [];
export let markersFibanachi = [];
export let markersPivotPoint = [];

export let markersRsiScenarios = [];

// зіг заг
const ZigZagTrendVis = document.querySelector("#ZigZagTrendVis");

// пінцет
const tweezersVis = document.querySelector("#tweezersVis");

// поглинання
const engulfingsVis = document.querySelector("#engulfingsVis");

// молот
const hammersVis = document.querySelector("#hammersVis");

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

export function renderChartLine(renderData, settings, markersScenarios) {
  const { klinesLimited } = settings;
  const { 
    volumeData, adxValue, tweezers, hammers, engulfings, 
    macd, macdSegment, rsiValue, rsiZone, autoFiboValueStart, 
    autoFiboValueExtrem, autoFiboValueEnd, ma10, ma10Trend, 
    ma30, ma30Trend, trendsData, interval 
  } = renderData.data;
  zigzag = renderData.data.zigzag;
  // console.log(renderData.markers);

  markersMinMax = !markerVisDivergenceMACD.classList.contains('active') ? renderData.markers.markersMinMax : [];
  markersDivergenceRsi = !markerVisDivergenceRSI.classList.contains('active') ? renderData.markers.markersDivergenceRsi : [];
  markersMA = !markerVisMA.classList.contains('active') ? renderData.markers.markersMA : [];
  markersMACD = !markerVisMACD.classList.contains('active') ? renderData.markers.markersMACD : [];
  markersTrigger = !markerVisTrigger.classList.contains('active') ? renderData.markers.markersTrigger : [];
  markersAutoFibanachi = !markerVisAutoFibanachi.classList.contains('active') ? renderData.markers.markersAutoFibanachi : [];
  markersWawe = !markerVisWawe.classList.contains('active') ? renderData.markers.markersWawe : [];
  markersFibanachi = !markerVisFibanachi.classList.contains('active') ? renderData.markers.markersFibanachi : [];
  markersPivotPoint = !markerVisPivotPoint.classList.contains('active') ? renderData.markers.markersPivotPoint : [];

  markersRsiScenarios = markersScenarios;
  // console.log(markersRsiScenarios);

  candlestickSeries.setData(klines);

  volumeSeries.setData(volumeData);
  
  adxLine.setData(adxValue);
  
  tweezersLine.setData(!tweezersVis.classList.contains('active') ? tweezers.series : []);
  
  hammersLine.setData(!hammersVis.classList.contains('active') ? hammers : []);  
  
  engulfingsLine.setData(!engulfingsVis.classList.contains('active') ? engulfings.series : []);
    
  macdLine.setData(macd.macd);
  signalLine.setData(macd.signal);
  macdHistogram.setData(macd.histogram);

  divergenceLine.setData(macdSegment);

  rsiLine.setData(rsiValue);

  if (!triggerVis.classList.contains('active')) {
    rsiOverboughtZoneLine.setData([
      { time: klines[rsiZone.overboughtZone.start].time, value: klines[rsiZone.overboughtZone.start].high },
      { time: klines[rsiZone.overboughtZone.end].time, value: klines[rsiZone.overboughtZone.start].high }
    ]);

    rsiOverboughtZoneMaxLine.setData([
      { time: klines[rsiZone.overboughtZone.max].time, value: klines[rsiZone.overboughtZone.max].high },
      { time: klines[rsiZone.overboughtZone.end].time, value: klines[rsiZone.overboughtZone.max].high }
    ]);

    rsiOversoldZoneLine.setData([
      { time: klines[rsiZone.oversoldZone.start].time, value: klines[rsiZone.oversoldZone.start].low },
      { time: klines[rsiZone.oversoldZone.end].time, value: klines[rsiZone.oversoldZone.start].low }
    ]);

    rsiOversoldZoneMinLine.setData([
      { time: klines[rsiZone.oversoldZone.min].time, value: klines[rsiZone.oversoldZone.min].low },
      { time: klines[rsiZone.oversoldZone.end].time, value: klines[rsiZone.oversoldZone.min].low }
    ]);
  } else {
    rsiOverboughtZoneLine.setData([]);

    rsiOverboughtZoneMaxLine.setData([]);

    rsiOversoldZoneLine.setData([]);

    rsiOversoldZoneMinLine.setData([]);
  }

  if (!autoFibanachiVis.classList.contains('active')) {
    autoFibanachiStart.fibanachi_0.setData(autoFiboValueStart.line.autoFib0);
    autoFibanachiStart.fibanachi_23.setData(autoFiboValueStart.line.autoFib23);
    autoFibanachiStart.fibanachi_38.setData(autoFiboValueStart.line.autoFib38);
    autoFibanachiStart.fibanachi_50.setData(autoFiboValueStart.line.autoFib50);
    autoFibanachiStart.fibanachi_61.setData(autoFiboValueStart.line.autoFib61);
    autoFibanachiStart.fibanachi_78.setData(autoFiboValueStart.line.autoFib78);
    autoFibanachiStart.fibanachi_100.setData(autoFiboValueStart.line.autoFib100);

    autoFibanachiExtrem.fibanachi_0.setData(autoFiboValueExtrem.line.autoFib0);
    autoFibanachiExtrem.fibanachi_23.setData(autoFiboValueExtrem.line.autoFib23);
    autoFibanachiExtrem.fibanachi_38.setData(autoFiboValueExtrem.line.autoFib38);
    autoFibanachiExtrem.fibanachi_50.setData(autoFiboValueExtrem.line.autoFib50);
    autoFibanachiExtrem.fibanachi_61.setData(autoFiboValueExtrem.line.autoFib61);
    autoFibanachiExtrem.fibanachi_78.setData(autoFiboValueExtrem.line.autoFib78);
    autoFibanachiExtrem.fibanachi_100.setData(autoFiboValueExtrem.line.autoFib100);

    autoFibanachiEnd.fibanachi_0.setData(autoFiboValueEnd.line.autoFib0);
    autoFibanachiEnd.fibanachi_23.setData(autoFiboValueEnd.line.autoFib23);
    autoFibanachiEnd.fibanachi_38.setData(autoFiboValueEnd.line.autoFib38);
    autoFibanachiEnd.fibanachi_50.setData(autoFiboValueEnd.line.autoFib50);
    autoFibanachiEnd.fibanachi_61.setData(autoFiboValueEnd.line.autoFib61);
    autoFibanachiEnd.fibanachi_78.setData(autoFiboValueEnd.line.autoFib78);
    autoFibanachiEnd.fibanachi_100.setData(autoFiboValueEnd.line.autoFib100);
  } else {
    autoFibanachiStart.fibanachi_0.setData([]);
    autoFibanachiStart.fibanachi_23.setData([]);
    autoFibanachiStart.fibanachi_38.setData([]);
    autoFibanachiStart.fibanachi_50.setData([]);
    autoFibanachiStart.fibanachi_61.setData([]);
    autoFibanachiStart.fibanachi_78.setData([]);
    autoFibanachiStart.fibanachi_100.setData([]);

    autoFibanachiExtrem.fibanachi_0.setData([]);
    autoFibanachiExtrem.fibanachi_23.setData([]);
    autoFibanachiExtrem.fibanachi_38.setData([]);
    autoFibanachiExtrem.fibanachi_50.setData([]);
    autoFibanachiExtrem.fibanachi_61.setData([]);
    autoFibanachiExtrem.fibanachi_78.setData([]);
    autoFibanachiExtrem.fibanachi_100.setData([]);

    autoFibanachiEnd.fibanachi_0.setData([]);
    autoFibanachiEnd.fibanachi_23.setData([]);
    autoFibanachiEnd.fibanachi_38.setData([]);
    autoFibanachiEnd.fibanachi_50.setData([]);
    autoFibanachiEnd.fibanachi_61.setData([]);
    autoFibanachiEnd.fibanachi_78.setData([]);
    autoFibanachiEnd.fibanachi_100.setData([]);
  }

  if (!ma10Vis.classList.contains('active')) {
    ma10Line.setData(ma10);
    ma10LineTrend.setData(ma10Trend);
  } else {
    ma10Line.setData([]);
    ma10LineTrend.setData([]);
  }

  if (!ma30Vis.classList.contains('active')) {
    ma30Line.setData(ma30);
    ma30LineTrend.setData(ma30Trend);
  } else {
    ma30Line.setData([]);
    ma30LineTrend.setData([]);
  }


  if (localSettingByInterval[interval].zigZagSettings.zigZagVisible) {
    zigzagLineClassic.setData(zigzag.line);
  } else {
    zigzagLineClassic.setData([]);
  }

  // Очищаємо всі лінії перед малюванням
  zigzagLineUpTrend.setData([]);
  zigzagLineDownTrend.setData([]);

  if (!ZigZagTrendVis.classList.contains('active')){
    if (trendsData.preLastTrend.type === "Uptrend") {
      zigzagLineUpTrend.setData(trendsData.preLastTrend.points);
      zigzagLineDownTrend.setData(trendsData.lastTrend.points);
    } else {
      zigzagLineUpTrend.setData(trendsData.lastTrend.points);
      zigzagLineDownTrend.setData(trendsData.preLastTrend.points);
    }
  }

  renderPivotPointLines(pivotPiontLinesByInterval["1m"], localRenderDataByInterval[interval].pivotPoint_1m);
  renderPivotPointLines(pivotPiontLinesByInterval["5m"], localRenderDataByInterval[interval].pivotPoint_5m);
  renderPivotPointLines(pivotPiontLinesByInterval["15m"], localRenderDataByInterval[interval].pivotPoint_15m);
  renderPivotPointLines(pivotPiontLinesByInterval["30m"], localRenderDataByInterval[interval].pivotPoint_30m);
  renderPivotPointLines(pivotPiontLinesByInterval["1h"], localRenderDataByInterval[interval].pivotPoint_1h);
  renderPivotPointLines(pivotPiontLinesByInterval["4h"], localRenderDataByInterval[interval].pivotPoint_4h);
  renderPivotPointLines(pivotPiontLinesByInterval["1d"], localRenderDataByInterval[interval].pivotPoint_1d);

  // ініціалізація даних про всі дивергенції на MACD
  initPointsPanel({
    chart,  
    candles: klines,          // масив свічок
    points: markersMinMax,
    sectionEl: document.querySelector('[data-point="macd-divergence"]'),
    totalCountEl: document.getElementById("macdDivergenceTotalCount"),
    // visibleBars: 40,
  });

  // ініціалізація даних про всі пінцети
  const tweezerPoints = getPointsFromLine(tweezers.series);
  
  initPointsPanel({
    chart,
    candles: klines,
    points: tweezerPoints, // Передаємо ТІЛЬКИ "правильні" точки (982, 992 і т.д.)
    totalCountEl: document.querySelector('#tweezersTotalCount'),
    sectionEl: document.querySelector('.control-section[data-point="tweezers"]'),
  });

  // ініціалізація даних про всі поглинання
  const engulfingsPoints = getPointsFromLine(engulfings.series);
  
  initPointsPanel({
    chart,
    candles: klines,
    points: engulfingsPoints, // Передаємо ТІЛЬКИ "правильні" точки (982, 992 і т.д.)
    totalCountEl: document.querySelector('#engulfingsTotalCount'),
    sectionEl: document.querySelector('.control-section[data-point="engulfings"]'),
  });

  // ініціалізація даних про всі молоти
  const hammersPoints = getPointsFromLine(hammers);

  initPointsPanel({
    chart,
    candles: klines,
    points: hammersPoints, // Передаємо ТІЛЬКИ "правильні" точки (982, 992 і т.д.)
    totalCountEl: document.querySelector('#hammersTotalCount'),
    sectionEl: document.querySelector('.control-section[data-point="hammers"]'),
  });  

  updateAllMarkers();
}