import { allScenarios, strategyBlocks } from "../settingsData/all-scenarios.js"

// MACD
const macdText = {
    previousSituation: document.getElementById("macd-previous-situation"),
    currentSituation: document.getElementById("macd-current-situation"),
    possibleSituationUp: document.getElementById("macd-possible-situation-up"),
    possibleSituationDown: document.getElementById("macd-possible-situation-down"),
    histogramTrend: document.getElementById("histogram-trend"),
    macdTrend: document.getElementById("macd-trend"), 
    signalTrend: document.getElementById("signal-trend"),
    approachAndRemoval: document.getElementById("macd-approach-and-removal"),
}

// fibanachi ручні
const standartFibanachiText = {
    previousSituation: document.getElementById("fibanachi-previous-situation"),
    currentSituation: document.getElementById("fibanachi-current-situation"),
    possibleSituationUp: document.getElementById("fibanachi-possible-situation-up"),
    possibleSituationDown: document.getElementById("fibanachi-possible-situation-down"),
    touching: document.getElementById("fibanachi-touching"),
}

// fibanachi автоматичні
const autoFibanachiText = {
    previousSituation: document.getElementById("autoFibanachi-previous-situation"),
    currentSituation: document.getElementById("autoFibanachi-current-situation"),
    possibleSituationUp: document.getElementById("autoFibanachi-possible-situation-up"),
    possibleSituationDown: document.getElementById("autoFibanachi-possible-situation-down"),
    touching: document.getElementById("autoFibanachi-touching"),
}

// MA10 i MA30
const maText = {
    previousSituation: document.getElementById("ma-previous-situation"),
    currentSituation: document.getElementById("ma-current-situation"),
    possibleSituationUp: document.getElementById("ma-possible-situation-up"),
    possibleSituationDown: document.getElementById("ma-possible-situation-down"),
    m30Trend: document.getElementById("m30-trend"),
    m10Trend: document.getElementById("m10-trend"),
    approachAndRemoval: document.getElementById("ma-approach-and-removal"),
    m30TrendBacket: document.getElementById("m30-trend-backet"),
    m10TrendBacket: document.getElementById("m10-trend-backet"),
    countFakeRetest: document.getElementById("ma-count-fake-retest-text"),
    touching: document.getElementById("ma-touching"),
}

// Pattern
const patternText = {
    previousSituation: document.getElementById("pattern-previous-situation"),
    currentSituation: document.getElementById("pattern-current-situation"),
    possibleSituationUp: document.getElementById("pattern-possible-situation-up"),
    possibleSituationDown: document.getElementById("pattern-possible-situation-down"),
}

// pivotPoint
const pivotPoint1mText = {
    previousSituation: document.getElementById("pivot-point-1m-previous-situation"),
    currentSituation: document.getElementById("pivot-point-1m-current-situation"),
    possibleSituationUp: document.getElementById("pivot-point-1m-possible-situation-up"),
    possibleSituationDown: document.getElementById("pivot-point-1m-possible-situation-down"),
    zone: document.getElementById("pivot-point-1m-zone"),
    block: document.getElementById("pivot-point-1m-block"), 
    magnetism: document.getElementById("pivot-point-1m-magnetism"),
    touching: document.getElementById("pivot-point-1m-touching"),
}

const pivotPoint5mText = {
    previousSituation: document.getElementById("pivot-point-5m-previous-situation"),
    currentSituation: document.getElementById("pivot-point-5m-current-situation"),
    possibleSituationUp: document.getElementById("pivot-point-5m-possible-situation-up"),
    possibleSituationDown: document.getElementById("pivot-point-5m-possible-situation-down"),
    zone: document.getElementById("pivot-point-5m-zone"),
    block: document.getElementById("pivot-point-5m-block"),
    magnetism: document.getElementById("pivot-point-5m-magnetism"),
    touching: document.getElementById("pivot-point-5m-touching"),
}

const pivotPoint15mText = {
    previousSituation: document.getElementById("pivot-point-15m-previous-situation"),
    currentSituation: document.getElementById("pivot-point-15m-current-situation"),
    possibleSituationUp: document.getElementById("pivot-point-15m-possible-situation-up"),
    possibleSituationDown: document.getElementById("pivot-point-15m-possible-situation-down"),
    zone: document.getElementById("pivot-point-15m-zone"),
    block: document.getElementById("pivot-point-15m-block"),
    magnetism: document.getElementById("pivot-point-15m-magnetism"),
    touching: document.getElementById("pivot-point-15m-touching"),
}

const pivotPoint30mText = {
    previousSituation: document.getElementById("pivot-point-30m-previous-situation"),
    currentSituation: document.getElementById("pivot-point-30m-current-situation"),
    possibleSituationUp: document.getElementById("pivot-point-30m-possible-situation-up"),
    possibleSituationDown: document.getElementById("pivot-point-30m-possible-situation-down"),
    zone: document.getElementById("pivot-point-30m-zone"),
    block: document.getElementById("pivot-point-30m-block"),
    magnetism: document.getElementById("pivot-point-30m-magnetism"),
    touching: document.getElementById("pivot-point-30m-touching"),
}

const pivotPoint1hText = {
    previousSituation: document.getElementById("pivot-point-1h-previous-situation"),
    currentSituation: document.getElementById("pivot-point-1h-current-situation"),
    possibleSituationUp: document.getElementById("pivot-point-1h-possible-situation-up"),
    possibleSituationDown: document.getElementById("pivot-point-1h-possible-situation-down"),
    zone: document.getElementById("pivot-point-1h-zone"),
    block: document.getElementById("pivot-point-1h-block"),
    magnetism: document.getElementById("pivot-point-1h-magnetism"),
    touching: document.getElementById("pivot-point-1h-touching"),
}

const pivotPoint4hText = {
    previousSituation: document.getElementById("pivot-point-4h-previous-situation"),
    currentSituation: document.getElementById("pivot-point-4h-current-situation"),
    possibleSituationUp: document.getElementById("pivot-point-4h-possible-situation-up"),
    possibleSituationDown: document.getElementById("pivot-point-4h-possible-situation-down"),
    zone: document.getElementById("pivot-point-4h-zone"),
    block: document.getElementById("pivot-point-4h-block"),
    magnetism: document.getElementById("pivot-point-4h-magnetism"),
    touching: document.getElementById("pivot-point-4h-touching"),
}

const pivotPoint1dText = {
    previousSituation: document.getElementById("pivot-point-1d-previous-situation"),
    currentSituation: document.getElementById("pivot-point-1d-current-situation"),
    possibleSituationUp: document.getElementById("pivot-point-1d-possible-situation-up"),
    possibleSituationDown: document.getElementById("pivot-point-1d-possible-situation-down"),
    zone: document.getElementById("pivot-point-1d-zone"),
    block: document.getElementById("pivot-point-1d-block"),
    magnetism: document.getElementById("pivot-point-1d-magnetism"),
    touching: document.getElementById("pivot-point-1d-touching"),
}

const pivotPiontTextByInterval = {
  "1m": pivotPoint1mText,
  "5m": pivotPoint5mText,
  "15m": pivotPoint15mText,
  "30m": pivotPoint30mText,
  "1h": pivotPoint1hText,
  "4h": pivotPoint4hText,
  "1d": pivotPoint1dText,
};

// rsi
const rsiText = {
    previousSituation: document.getElementById("rsi-previous-situation"),
    currentSituation: document.getElementById("rsi-current-situation"),
    possibleSituationUp: document.getElementById("rsi-possible-situation-up"),
    possibleSituationDown: document.getElementById("rsi-possible-situation-down"),
    trend: document.getElementById("rsi-trend"),
    zoneTightness: document.getElementById("rsi-zone-tightness"),
    noisy: document.getElementById("rsi-noisy"),
    amplitude: document.getElementById("rsi-amplitude"),
    ritest: document.getElementById("rsi-ritest"),
}

// trend
const trendText = {
    volumeZone: document.getElementById("volume-zone"),
    volumeStack: document.getElementById("volume-stack"),
    adxTrend: document.getElementById("adx-trend"),
    adxState: document.getElementById("adx-state"),
    zigZagTrend: document.getElementById("zig-zag-trend"),
}

// trigger
const triggerText = {
    previousSituation: document.getElementById("trigger-previous-situation"),
    currentSituation: document.getElementById("trigger-current-situation"),
    possibleSituationUp: document.getElementById("trigger-possible-situation-up"),
    possibleSituationDown: document.getElementById("trigger-possible-situation-down"),
    touching: document.getElementById("trigger-touching"),
}

// wawe
const waweText = {
    previousSituation: document.getElementById("wave-previous-situation"),
    currentSituation: document.getElementById("wave-current-situation"),
    possibleSituationUp: document.getElementById("wave-possible-situation-up"),
    possibleSituationDown: document.getElementById("wave-possible-situation-down"),
    zone: document.getElementById("wawe-zone"),
    tightness: document.getElementById("wawe-tightness"),
    countInCandle: document.getElementById("wawe-count-in-candle"),
    zigzag: document.getElementById("wawe-zigzag"),
    touching: document.getElementById("wave-touching"),
}

function updateIndicatorUI(textElements, indicatorData) {
  // 1. Отримуємо масиви об'єктів сценаріїв за ID
  // Працює і з масивами об'єктів { id: "..." }, і зі звичайними масивами ID ["U4001", ...]
  const extractId = item => (typeof item === 'object' && item !== null ? item.id : item);

  const prevList = (indicatorData.main.previousIDs || [])
    .map(item => allScenarios[extractId(item)])
    .filter(Boolean);

  const currList = (indicatorData.main.currentIDs || [])
    .map(item => allScenarios[extractId(item)])
    .filter(Boolean);

  // 2. Оновлюємо попередню ситуацію
  textElements.previousSituation.textContent = prevList
    .map(s => s.situation)
    .join('\n\n');

  // 3. Оновлюємо поточну ситуацію
  textElements.currentSituation.textContent = currList
    .map(s => s.situation)
    .join('\n\n');

  // 4. Оновлюємо ймовірності вгору (Up / Long)
  textElements.possibleSituationUp.textContent = currList
    .map(s => `${s.possibleLong} ${s.persentageLong}%`)
    .join('\n\n');

  // 5. Оновлюємо ймовірності вниз (Down / Short)
  textElements.possibleSituationDown.textContent = currList
    .map(s => `${s.possibleShort} ${s.persentageShort}%`)
    .join('\n\n');
}

export function updateAnalyze(analyzeData) {
    // MACD
    updateIndicatorUI(macdText, analyzeData.macd);

    macdText.histogramTrend.textContent = strategyBlocks[analyzeData.macd.additional.histogramTrend.currentID].situation.replace("X", analyzeData.macd.additional.histogramTrend.valueX);
    macdText.histogramTrend.style.backgroundColor = strategyBlocks[analyzeData.macd.additional.histogramTrend.currentID].color;

    macdText.macdTrend.textContent = strategyBlocks[analyzeData.macd.additional.macdTrend.currentID].situation.replace("X", analyzeData.macd.additional.macdTrend.valueX);
    macdText.macdTrend.style.backgroundColor = strategyBlocks[analyzeData.macd.additional.macdTrend.currentID].color;

    macdText.signalTrend.textContent = strategyBlocks[analyzeData.macd.additional.signalTrend.currentID].situation.replace("X", analyzeData.macd.additional.signalTrend.valueX);
    macdText.signalTrend.style.backgroundColor = strategyBlocks[analyzeData.macd.additional.signalTrend.currentID].color;

    macdText.approachAndRemoval.textContent = strategyBlocks[analyzeData.macd.additional.approachAndRemoval.currentID].situation;
    macdText.approachAndRemoval.style.backgroundColor = strategyBlocks[analyzeData.macd.additional.approachAndRemoval.currentID].color;

    // MA
    updateIndicatorUI(maText, analyzeData.ma);

    maText.countFakeRetest.textContent = analyzeData.ma.additional.countFakeRetest.situationText;

    maText.m30Trend.textContent = strategyBlocks[analyzeData.ma.additional.m30Trend.currentID].situation.replace("X", analyzeData.ma.additional.m30Trend.valueX);
    maText.m30Trend.style.backgroundColor = strategyBlocks[analyzeData.ma.additional.m30Trend.currentID].color;

    maText.m10Trend.textContent = strategyBlocks[analyzeData.ma.additional.m10Trend.currentID].situation.replace("X", analyzeData.ma.additional.m10Trend.valueX);
    maText.m10Trend.style.backgroundColor = strategyBlocks[analyzeData.ma.additional.m10Trend.currentID].color;

    maText.approachAndRemoval.textContent = strategyBlocks[analyzeData.ma.additional.approachAndRemoval.currentID].situation;
    maText.approachAndRemoval.style.backgroundColor = strategyBlocks[analyzeData.ma.additional.approachAndRemoval.currentID].color;

    maText.m30TrendBacket.textContent = strategyBlocks[analyzeData.ma.additional.m30TrendBacket.currentID].situation;
    maText.m30TrendBacket.style.backgroundColor = strategyBlocks[analyzeData.ma.additional.m30TrendBacket.currentID].color;

    maText.m10TrendBacket.textContent = strategyBlocks[analyzeData.ma.additional.m10TrendBacket.currentID].situation;
    maText.m10TrendBacket.style.backgroundColor = strategyBlocks[analyzeData.ma.additional.m10TrendBacket.currentID].color;

    maText.touching.textContent = strategyBlocks[analyzeData.ma.additional.touching.currentID].situation;

    // RSI
    updateIndicatorUI(rsiText, analyzeData.rsi);

    rsiText.trend.textContent = strategyBlocks[analyzeData.rsi.additional.trend.currentID].situation.replace("X", analyzeData.rsi.additional.trend.valueX);
    rsiText.trend.style.backgroundColor = strategyBlocks[analyzeData.rsi.additional.trend.currentID].color;

    rsiText.zoneTightness.textContent = strategyBlocks[analyzeData.rsi.additional.zoneTightness.currentID].situation.replace("X", analyzeData.rsi.additional.zoneTightness.valueX);
    rsiText.zoneTightness.style.backgroundColor = strategyBlocks[analyzeData.rsi.additional.zoneTightness.currentID].color;

    rsiText.noisy.textContent = strategyBlocks[analyzeData.rsi.additional.noisy.currentID].situation;
    rsiText.noisy.style.backgroundColor = strategyBlocks[analyzeData.rsi.additional.noisy.currentID].color;

    rsiText.amplitude.textContent = strategyBlocks[analyzeData.rsi.additional.amplitude.currentID].situation;
    rsiText.amplitude.style.backgroundColor = strategyBlocks[analyzeData.rsi.additional.amplitude.currentID].color;

    rsiText.ritest.textContent = strategyBlocks[analyzeData.rsi.additional.ritest.currentID].situation.replace("X", analyzeData.rsi.additional.ritest.valueX);
    rsiText.ritest.style.backgroundColor = strategyBlocks[analyzeData.rsi.additional.ritest.currentID].color;

    // WAWE
    updateIndicatorUI(waweText, analyzeData.wawe);

    waweText.zone.textContent = strategyBlocks[analyzeData.wawe.additional.waweZone.currentID].situation.replace("X", analyzeData.wawe.additional.waweZone.valueX);
    waweText.zone.style.backgroundColor = strategyBlocks[analyzeData.wawe.additional.waweZone.currentID].color;

    waweText.tightness.textContent = strategyBlocks[analyzeData.wawe.additional.waweTightness.currentID].situation.replace("X", analyzeData.wawe.additional.waweTightness.valueX);
    waweText.tightness.style.backgroundColor = strategyBlocks[analyzeData.wawe.additional.waweTightness.currentID].color;

    waweText.countInCandle.textContent = strategyBlocks[analyzeData.wawe.additional.waweCountInCandle.currentID].situation.replace("X", analyzeData.wawe.additional.waweCountInCandle.valueX);
    waweText.countInCandle.style.backgroundColor = strategyBlocks[analyzeData.wawe.additional.waweCountInCandle.currentID].color;

    waweText.zigzag.textContent = strategyBlocks[analyzeData.wawe.additional.waweZigzag.currentID].situation.replace("X", analyzeData.wawe.additional.waweZigzag.valueX);
    waweText.zigzag.style.backgroundColor = strategyBlocks[analyzeData.wawe.additional.waweZigzag.currentID].color;

    waweText.touching.textContent = strategyBlocks[analyzeData.wawe.additional.touching.currentID].situation;

    // Standart Fibanachi
    updateIndicatorUI(standartFibanachiText, analyzeData.standartFibanachi);

    standartFibanachiText.touching.textContent = strategyBlocks[analyzeData.standartFibanachi.additional.touching.currentID].situation;

    // Pattern
    patternText.previousSituation.textContent = analyzeData.pattern.main.previousSituationText;
    patternText.currentSituation.textContent = analyzeData.pattern.main.currentSituationText;
    patternText.possibleSituationUp.textContent = analyzeData.pattern.main.possibleSituationUpText;
    patternText.possibleSituationDown.textContent = analyzeData.pattern.main.possibleSituationDownText;

    // Trend
    trendText.zigZagTrend.textContent = strategyBlocks[analyzeData.trend.additional.zigZagTrend.currentID].situation;
    trendText.zigZagTrend.style.backgroundColor = strategyBlocks[analyzeData.trend.additional.zigZagTrend.currentID].color;

    trendText.adxTrend.textContent = strategyBlocks[analyzeData.trend.additional.adxTrend.currentID].situation.replace("X", analyzeData.trend.additional.adxTrend.valueX);
    trendText.adxTrend.style.backgroundColor = strategyBlocks[analyzeData.trend.additional.adxTrend.currentID].color;

    trendText.adxState.textContent = strategyBlocks[analyzeData.trend.additional.adxState.currentID].situation;
    trendText.adxState.style.backgroundColor = strategyBlocks[analyzeData.trend.additional.adxState.currentID].color;

    trendText.volumeZone.textContent = strategyBlocks[analyzeData.trend.additional.volumeZone.currentID].situation;
    trendText.volumeZone.style.backgroundColor = strategyBlocks[analyzeData.trend.additional.volumeZone.currentID].color;

    trendText.volumeStack.textContent = strategyBlocks[analyzeData.trend.additional.volumeStack.currentID].situation.replace("X", analyzeData.trend.additional.volumeStack.valueX);
    trendText.volumeStack.style.backgroundColor = strategyBlocks[analyzeData.trend.additional.volumeStack.currentID].color;

    // Auto Fibanachi
    updateIndicatorUI(autoFibanachiText, analyzeData.autoFibanachi);

    autoFibanachiText.touching.textContent = strategyBlocks[analyzeData.autoFibanachi.additional.touching.currentID].situation;

    // Trigger
    updateIndicatorUI(triggerText, analyzeData.trigger);

    triggerText.touching.textContent = strategyBlocks[analyzeData.trigger.additional.touching.currentID].situation;

    // Pivot Point 1m 
    updateIndicatorUI(pivotPiontTextByInterval["1m"], analyzeData.pivotPoint_1m);

    pivotPiontTextByInterval["1m"].block.style.display = analyzeData.pivotPoint_1m.statusVis;

    pivotPiontTextByInterval["1m"].zone.textContent = strategyBlocks[analyzeData.pivotPoint_1m.additional.zone.currentID].situation.replace("X", analyzeData.pivotPoint_1m.additional.zone.valueX);
    pivotPiontTextByInterval["1m"].zone.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_1m.additional.zone.currentID].color;

    pivotPiontTextByInterval["1m"].magnetism.textContent = strategyBlocks[analyzeData.pivotPoint_1m.additional.magnetism.currentID].situation;
    pivotPiontTextByInterval["1m"].magnetism.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_1m.additional.magnetism.currentID].color;
    
    pivotPiontTextByInterval["1m"].touching.textContent = strategyBlocks[analyzeData.pivotPoint_1m.additional.touching.currentID].situation;

    // Pivot Point 5m 
    updateIndicatorUI(pivotPiontTextByInterval["5m"], analyzeData.pivotPoint_5m);

    pivotPiontTextByInterval["5m"].block.style.display = analyzeData.pivotPoint_5m.statusVis;

    pivotPiontTextByInterval["5m"].zone.textContent = strategyBlocks[analyzeData.pivotPoint_5m.additional.zone.currentID].situation.replace("X", analyzeData.pivotPoint_5m.additional.zone.valueX);
    pivotPiontTextByInterval["5m"].zone.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_5m.additional.zone.currentID].color;

    pivotPiontTextByInterval["5m"].magnetism.textContent = strategyBlocks[analyzeData.pivotPoint_5m.additional.magnetism.currentID].situation;
    pivotPiontTextByInterval["5m"].magnetism.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_5m.additional.magnetism.currentID].color;
    
    pivotPiontTextByInterval["5m"].touching.textContent = strategyBlocks[analyzeData.pivotPoint_5m.additional.touching.currentID].situation;

    // Pivot Point 15m 
    updateIndicatorUI(pivotPiontTextByInterval["15m"], analyzeData.pivotPoint_15m);

    pivotPiontTextByInterval["15m"].block.style.display = analyzeData.pivotPoint_15m.statusVis;

    pivotPiontTextByInterval["15m"].zone.textContent = strategyBlocks[analyzeData.pivotPoint_15m.additional.zone.currentID].situation.replace("X", analyzeData.pivotPoint_15m.additional.zone.valueX);
    pivotPiontTextByInterval["15m"].zone.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_15m.additional.zone.currentID].color;

    pivotPiontTextByInterval["15m"].magnetism.textContent = strategyBlocks[analyzeData.pivotPoint_15m.additional.magnetism.currentID].situation;
    pivotPiontTextByInterval["15m"].magnetism.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_15m.additional.magnetism.currentID].color;
    
    pivotPiontTextByInterval["15m"].touching.textContent = strategyBlocks[analyzeData.pivotPoint_15m.additional.touching.currentID].situation;

    // Pivot Point 30m 
    updateIndicatorUI(pivotPiontTextByInterval["30m"], analyzeData.pivotPoint_30m);

    pivotPiontTextByInterval["30m"].block.style.display = analyzeData.pivotPoint_30m.statusVis;

    pivotPiontTextByInterval["30m"].zone.textContent = strategyBlocks[analyzeData.pivotPoint_30m.additional.zone.currentID].situation.replace("X", analyzeData.pivotPoint_30m.additional.zone.valueX);
    pivotPiontTextByInterval["30m"].zone.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_30m.additional.zone.currentID].color;

    pivotPiontTextByInterval["30m"].magnetism.textContent = strategyBlocks[analyzeData.pivotPoint_30m.additional.magnetism.currentID].situation;
    pivotPiontTextByInterval["30m"].magnetism.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_30m.additional.magnetism.currentID].color;
    
    pivotPiontTextByInterval["30m"].touching.textContent = strategyBlocks[analyzeData.pivotPoint_30m.additional.touching.currentID].situation;

    // Pivot Point 1h 
    updateIndicatorUI(pivotPiontTextByInterval["1h"], analyzeData.pivotPoint_1h);

    pivotPiontTextByInterval["1h"].block.style.display = analyzeData.pivotPoint_1h.statusVis;

    pivotPiontTextByInterval["1h"].zone.textContent = strategyBlocks[analyzeData.pivotPoint_1h.additional.zone.currentID].situation.replace("X", analyzeData.pivotPoint_1h.additional.zone.valueX);
    pivotPiontTextByInterval["1h"].zone.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_1h.additional.zone.currentID].color;

    pivotPiontTextByInterval["1h"].magnetism.textContent = strategyBlocks[analyzeData.pivotPoint_1h.additional.magnetism.currentID].situation;
    pivotPiontTextByInterval["1h"].magnetism.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_1h.additional.magnetism.currentID].color;
    
    pivotPiontTextByInterval["1h"].touching.textContent = strategyBlocks[analyzeData.pivotPoint_1h.additional.touching.currentID].situation;

    // Pivot Point 4h 
    updateIndicatorUI(pivotPiontTextByInterval["4h"], analyzeData.pivotPoint_4h);

    pivotPiontTextByInterval["4h"].block.style.display = analyzeData.pivotPoint_4h.statusVis;

    pivotPiontTextByInterval["4h"].zone.textContent = strategyBlocks[analyzeData.pivotPoint_4h.additional.zone.currentID].situation.replace("X", analyzeData.pivotPoint_4h.additional.zone.valueX);
    pivotPiontTextByInterval["4h"].zone.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_4h.additional.zone.currentID].color;

    pivotPiontTextByInterval["4h"].magnetism.textContent = strategyBlocks[analyzeData.pivotPoint_4h.additional.magnetism.currentID].situation;
    pivotPiontTextByInterval["4h"].magnetism.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_4h.additional.magnetism.currentID].color;
    
    pivotPiontTextByInterval["4h"].touching.textContent = strategyBlocks[analyzeData.pivotPoint_4h.additional.touching.currentID].situation;

    // Pivot Point 1d 
    updateIndicatorUI(pivotPiontTextByInterval["1d"], analyzeData.pivotPoint_1d);

    pivotPiontTextByInterval["1d"].block.style.display = analyzeData.pivotPoint_1d.statusVis;

    pivotPiontTextByInterval["1d"].zone.textContent = strategyBlocks[analyzeData.pivotPoint_1d.additional.zone.currentID].situation.replace("X", analyzeData.pivotPoint_1d.additional.zone.valueX);
    pivotPiontTextByInterval["1d"].zone.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_1d.additional.zone.currentID].color;

    pivotPiontTextByInterval["1d"].magnetism.textContent = strategyBlocks[analyzeData.pivotPoint_1d.additional.magnetism.currentID].situation;
    pivotPiontTextByInterval["1d"].magnetism.style.backgroundColor = strategyBlocks[analyzeData.pivotPoint_1d.additional.magnetism.currentID].color;
    
    pivotPiontTextByInterval["1d"].touching.textContent = strategyBlocks[analyzeData.pivotPoint_1d.additional.touching.currentID].situation;
}
