import { checkClass } from "../control.js"
import { allScenarios, strategyBlocks } from "../settingsData/all-scenarios.js"

// MACD
const macdText = {
    currentSituation: document.getElementById("macd-current-situation"),
    histogramTrend: document.getElementById("histogram-trend"),
    macdTrend: document.getElementById("macd-trend"), 
    signalTrend: document.getElementById("signal-trend"),
    approachAndRemoval: document.getElementById("macd-approach-and-removal"),
    macdTotalWeight: document.getElementById("macd-total-weight"),
}

// fibanachi ручні
const standartFibanachiText = {
    currentSituation: document.getElementById("fibanachi-current-situation"),
    touching: document.getElementById("fibanachi-touching"),
    standartFibanachiTotalWeight: document.getElementById("standartFibanachi-total-weight"),
}

// fibanachi автоматичні
const autoFibanachiText = {
    currentSituation: document.getElementById("autoFibanachi-current-situation"),
    touching: document.getElementById("autoFibanachi-touching"),
    autoFibanachiTotalWeight: document.getElementById("autoFibanachi-total-weight"),
}

// MA10 i MA30
const maText = {
    currentSituation: document.getElementById("ma-current-situation"),
    m30Trend: document.getElementById("m30-trend"),
    m10Trend: document.getElementById("m10-trend"),
    approachAndRemoval: document.getElementById("ma-approach-and-removal"),
    m30TrendBacket: document.getElementById("m30-trend-backet"),
    m10TrendBacket: document.getElementById("m10-trend-backet"),
    touching: document.getElementById("ma-touching"),
    maTotalWeight: document.getElementById("ma-total-weight"),
}

// Pattern
const patternText = {
    currentSituation: document.getElementById("pattern-current-situation"),
    patternTotalWeight: document.getElementById("pattern-total-weight"),
}

// pivotPoint
const pivotPoint1mText = {
    currentSituation: document.getElementById("pivot-point-1m-current-situation"),
    zone: document.getElementById("pivot-point-1m-zone"),
    block: document.getElementById("pivot-point-1m-block"), 
    magnetism: document.getElementById("pivot-point-1m-magnetism"),
    touching: document.getElementById("pivot-point-1m-touching"),
    total: document.getElementById("pivot-point-1m-total-weight"),
}

const pivotPoint5mText = {
    currentSituation: document.getElementById("pivot-point-5m-current-situation"),
    zone: document.getElementById("pivot-point-5m-zone"),
    block: document.getElementById("pivot-point-5m-block"),
    magnetism: document.getElementById("pivot-point-5m-magnetism"),
    touching: document.getElementById("pivot-point-5m-touching"),
    total: document.getElementById("pivot-point-5m-total-weight"),
}

const pivotPoint15mText = {
    currentSituation: document.getElementById("pivot-point-15m-current-situation"),
    zone: document.getElementById("pivot-point-15m-zone"),
    block: document.getElementById("pivot-point-15m-block"),
    magnetism: document.getElementById("pivot-point-15m-magnetism"),
    touching: document.getElementById("pivot-point-15m-touching"),
    total: document.getElementById("pivot-point-15m-total-weight"),
}

const pivotPoint30mText = {
    currentSituation: document.getElementById("pivot-point-30m-current-situation"),
    zone: document.getElementById("pivot-point-30m-zone"),
    block: document.getElementById("pivot-point-30m-block"),
    magnetism: document.getElementById("pivot-point-30m-magnetism"),
    touching: document.getElementById("pivot-point-30m-touching"),
    total: document.getElementById("pivot-point-30m-total-weight"),
}

const pivotPoint1hText = {
    currentSituation: document.getElementById("pivot-point-1h-current-situation"),
    zone: document.getElementById("pivot-point-1h-zone"),
    block: document.getElementById("pivot-point-1h-block"),
    magnetism: document.getElementById("pivot-point-1h-magnetism"),
    touching: document.getElementById("pivot-point-1h-touching"),
    total: document.getElementById("pivot-point-1h-total-weight"),
}

const pivotPoint4hText = {
    currentSituation: document.getElementById("pivot-point-4h-current-situation"),
    zone: document.getElementById("pivot-point-4h-zone"),
    block: document.getElementById("pivot-point-4h-block"),
    magnetism: document.getElementById("pivot-point-4h-magnetism"),
    touching: document.getElementById("pivot-point-4h-touching"),
    total: document.getElementById("pivot-point-4h-total-weight"),
}

const pivotPoint1dText = {
    currentSituation: document.getElementById("pivot-point-1d-current-situation"),
    zone: document.getElementById("pivot-point-1d-zone"),
    block: document.getElementById("pivot-point-1d-block"),
    magnetism: document.getElementById("pivot-point-1d-magnetism"),
    touching: document.getElementById("pivot-point-1d-touching"),
    total: document.getElementById("pivot-point-1d-total-weight"),
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
    currentSituation: document.getElementById("rsi-current-situation"),
    trend: document.getElementById("rsi-trend"),
    zoneTightness: document.getElementById("rsi-zone-tightness"),
    noisy: document.getElementById("rsi-noisy"),
    amplitude: document.getElementById("rsi-amplitude"),
    ritest: document.getElementById("rsi-ritest"),
    rsiTotalWeight: document.getElementById("rsi-total-weight"),
}

// trend
const trendText = {
    volumeZone: document.getElementById("volume-zone"),
    volumeStack: document.getElementById("volume-stack"),
    adxTrend: document.getElementById("adx-trend"),
    adxState: document.getElementById("adx-state"),
    zigZagTrend: document.getElementById("zig-zag-trend"),
    trendTotalMultiplier: document.getElementById("trend-total-multiplier"),
}

// trigger
const triggerText = {
    currentSituation: document.getElementById("trigger-current-situation"),
    touching: document.getElementById("trigger-touching"),
    triggerTotalMultiplier: document.getElementById("trigger-total-weight"),
}

// wawe
const waweText = {
    currentSituation: document.getElementById("wave-current-situation"),
    zone: document.getElementById("wawe-zone"),
    tightness: document.getElementById("wawe-tightness"),
    countInCandle: document.getElementById("wawe-count-in-candle"),
    zigzag: document.getElementById("wawe-zigzag"),
    touching: document.getElementById("wave-touching"),
    waweTotalWeight: document.getElementById("wawe-total-weight"),
}

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

let totalLong = document.getElementById("total-long");
let totalShort = document.getElementById("total-short"); 
let totalSumWeight = document.getElementById("total-sum");
let confidenceElement = document.getElementById("confidence-element");

export function updateUnifiedAnalyzeUI(analyzeData, data) {
    const {
        macdWeight, macdStatus, histogramTrendMultiplier, macdTrendMultiplier,
        signalTrendMultiplier, macdApproachAndRemovalMultiplier, macdTotalWeight,
        maWeight, maStatus, m30TrendMultiplier, m10TrendMultiplier, maApproachAndRemovalMultiplier,
        m30TrendBacketMultiplier, m10TrendBacketMultiplier, maTouchingMultiplier, maTotalWeight,
        rsiWeight, rsiStatus, rsiTrendMultiplier, rsiZoneTightnessMultiplier, rsiNoisyMultiplier,
        rsiAmplitudeMultiplier, rsiRitestMultiplier, rsiTotalWeight,
        waweWeight, waweStatus, waweZoneMultiplier, waweTightnessMultiplier, waweCountInCandleMultiplier,
        waweZigzagMultiplier, waweTouchingMultiplier, waweTotalWeight,
        standartFibanachiWeight, standartFibanachiStatus, standartFibanachiTouchingMultiplier,
        standartFibanachiTotalWeight,
        patternWeight, patternStatus,
        zigZagTrendMultiplierLong, zigZagTrendMultiplierShort, adxTrendMultiplierLong, adxTrendMultiplierShort,
        adxStateMultiplierLong, adxStateMultiplierShort, volumeZoneMultiplierLong, volumeZoneMultiplierShort,
        volumeStackMultiplierLong, volumeStackMultiplierShort, trendTotalMultiplierLong, trendTotalMultiplierShort,
        autoFibanachiWeight, autoFibanachiStatus, autoFibanachiTouchingMultiplier, autoFibanachiTotalWeight,
        triggerWeight, triggerStatus, triggerTouchingMultiplier, triggerTotalWeight,
        pivotPoint_1mWeight, pivotPoint_1mStatus, pivotPoint_1mZoneMultiplier, pivotPoint_1mMagnetismMultiplier,
        pivotPoint_1mTouchingMultiplier, pivotPoint_1mTotalWeight,
        pivotPoint_5mWeight, pivotPoint_5mStatus, pivotPoint_5mZoneMultiplier, pivotPoint_5mMagnetismMultiplier,
        pivotPoint_5mTouchingMultiplier, pivotPoint_5mTotalWeight,
        pivotPoint_15mWeight, pivotPoint_15mStatus, pivotPoint_15mZoneMultiplier, pivotPoint_15mMagnetismMultiplier,
        pivotPoint_15mTouchingMultiplier, pivotPoint_15mTotalWeight,
        pivotPoint_30mWeight, pivotPoint_30mStatus, pivotPoint_30mZoneMultiplier, pivotPoint_30mMagnetismMultiplier,
        pivotPoint_30mTouchingMultiplier, pivotPoint_30mTotalWeight,
        pivotPoint_1hWeight, pivotPoint_1hStatus, pivotPoint_1hZoneMultiplier, pivotPoint_1hMagnetismMultiplier,
        pivotPoint_1hTouchingMultiplier, pivotPoint_1hTotalWeight,
        pivotPoint_4hWeight, pivotPoint_4hStatus, pivotPoint_4hZoneMultiplier, pivotPoint_4hMagnetismMultiplier,
        pivotPoint_4hTouchingMultiplier, pivotPoint_4hTotalWeight,
        pivotPoint_1dWeight, pivotPoint_1dStatus, pivotPoint_1dZoneMultiplier, pivotPoint_1dMagnetismMultiplier,
        pivotPoint_1dTouchingMultiplier, pivotPoint_1dTotalWeight,
        longSum, shortSum, totalSum, longPercent, shortPercent, side, confidence, action, totalSumStatus, textLong, textShort,
    } = data.data;

    // MACD
    if (checkClass(macdMultiplierActBtn)) {
        macdText.currentSituation.textContent += `. вага ${macdWeight}`;

        macdText.histogramTrend.innerText += `. множник ${histogramTrendMultiplier}`;

        macdText.macdTrend.innerText += `. множник ${macdTrendMultiplier}`;

        macdText.signalTrend.innerText += `. множник ${signalTrendMultiplier}`;

        macdText.approachAndRemoval.innerText += `. множник ${macdApproachAndRemovalMultiplier}`;

        macdText.macdTotalWeight.innerText = `${macdWeight} * (${histogramTrendMultiplier} * ${macdTrendMultiplier} * ${signalTrendMultiplier} * ${macdApproachAndRemovalMultiplier}) = ${macdTotalWeight.toFixed(2)}`;
    } else {
        macdText.macdTotalWeight.innerText = "";
    }

    // MA 
    if (checkClass(maMultiplierActBtn)) {
        maText.currentSituation.innerText += `. вага ${maWeight}`;

        maText.m30Trend.innerText += `. множник ${m30TrendMultiplier}`;

        maText.m10Trend.innerText += `. множник ${m10TrendMultiplier}`;

        maText.approachAndRemoval.innerText += `. множник ${maApproachAndRemovalMultiplier}`;

        maText.m30TrendBacket.innerText += `. множник ${m30TrendBacketMultiplier}`;

        maText.m10TrendBacket.innerText += `. множник ${m10TrendBacketMultiplier}`;

        maText.touching.innerText += `. множник ${maTouchingMultiplier}`;

        maText.maTotalWeight.innerText = `${maWeight} * (${m30TrendMultiplier} * ${m10TrendMultiplier} * ${maApproachAndRemovalMultiplier} * ${m30TrendBacketMultiplier} * ${m10TrendBacketMultiplier} * ${maTouchingMultiplier}) = ${maTotalWeight.toFixed(2)}`;
    } else {
        maText.maTotalWeight.innerText = "";
    }

    // RSI 
    if (checkClass(rsiMultiplierActBtn)) {
        rsiText.currentSituation.innerText += `. вага ${rsiWeight}`;

        rsiText.trend.innerText += `. множник ${rsiTrendMultiplier}`;

        rsiText.zoneTightness.innerText += `. множник ${rsiZoneTightnessMultiplier}`;

        rsiText.noisy.innerText += `. множник ${rsiNoisyMultiplier}`;

        rsiText.amplitude.innerText += `. множник ${rsiAmplitudeMultiplier}`;

        rsiText.ritest.innerText += `. множник ${rsiRitestMultiplier}`;

        rsiText.rsiTotalWeight.innerText = `${rsiWeight} * (${rsiTrendMultiplier} * ${rsiZoneTightnessMultiplier} * ${rsiNoisyMultiplier} * ${rsiAmplitudeMultiplier} * ${rsiRitestMultiplier}) = ${rsiTotalWeight.toFixed(2)}`;
    } else {
        rsiText.rsiTotalWeight.innerText = "";
    }

    // WAWE
    if (checkClass(waveMultiplierActBtn)) {
        waweText.currentSituation.innerText += `. вага ${waweWeight}`;

        waweText.zone.innerText += `. множник ${waweZoneMultiplier}`;

        waweText.tightness.innerText += `. множник ${waweTightnessMultiplier}`;

        waweText.countInCandle.innerText += `. множник ${waweCountInCandleMultiplier}`;

        waweText.zigzag.innerText += `. множник ${waweZigzagMultiplier}`;

        waweText.touching.innerText +=  `. множник ${waweTouchingMultiplier}`;

        waweText.waweTotalWeight.innerText = `${waweWeight} * (${waweZoneMultiplier} * ${waweTightnessMultiplier} * ${waweCountInCandleMultiplier} * ${waweZigzagMultiplier} * ${waweTouchingMultiplier}) = ${waweTotalWeight.toFixed(2)}`;
    } else {
        waweText.waweTotalWeight.innerText = "";
    }

    // Standart Fibanachi
    if (checkClass(fibanachiMultiplierActBtn)) {
        standartFibanachiText.currentSituation.innerText += `. вага ${standartFibanachiWeight}`;

        standartFibanachiText.touching.innerText += `. множник ${standartFibanachiTouchingMultiplier}`;

        standartFibanachiText.standartFibanachiTotalWeight.innerText = `${standartFibanachiWeight} * (${standartFibanachiTouchingMultiplier}) = ${standartFibanachiTotalWeight.toFixed(2)}`;
    } else {
        standartFibanachiText.standartFibanachiTotalWeight.innerText = "";
    }

    // Patern
    if (checkClass(patternMultiplierActBtn)) {
        patternText.currentSituation.innerText += `. вага ${patternWeight}`;

        patternText.patternTotalWeight.innerText = patternWeight;
    } else {
        patternText.patternTotalWeight.innerText = "";
    }

    // Trend
    if (checkClass(trendMultiplierActBtn)) {
        trendText.zigZagTrend.innerText += `. множник ${zigZagTrendMultiplierLong} і ${zigZagTrendMultiplierShort}`;

        trendText.adxTrend.innerText += `. множник ${adxTrendMultiplierLong} і ${adxTrendMultiplierShort}`;

        trendText.adxState.innerText += `. множник ${adxStateMultiplierLong} і ${adxStateMultiplierShort}`;

        trendText.volumeZone.innerText += `. множник ${volumeZoneMultiplierLong} і ${volumeZoneMultiplierShort}`;

        trendText.volumeStack.innerText += `. множник ${volumeStackMultiplierLong} і ${volumeStackMultiplierShort}`;

        trendText.trendTotalMultiplier.innerText = `${zigZagTrendMultiplierLong} * ${adxTrendMultiplierLong} * ${adxStateMultiplierLong} * ${volumeZoneMultiplierLong} * ${volumeStackMultiplierLong} = ${trendTotalMultiplierLong.toFixed(2)} і ${zigZagTrendMultiplierShort} * ${adxTrendMultiplierShort} * ${adxStateMultiplierShort} * ${volumeZoneMultiplierShort} * ${volumeStackMultiplierShort} = ${trendTotalMultiplierShort.toFixed(2)}`;
    } else {
        trendText.trendTotalMultiplier.innerText = "";
    }

    // Auto Fibanachi
    if (checkClass(autoFibanachiMultiplierActBtn)) {
        autoFibanachiText.currentSituation.innerText += `. вага ${autoFibanachiWeight}`;

        autoFibanachiText.touching.innerText += `. множник ${autoFibanachiTouchingMultiplier}`;

        autoFibanachiText.autoFibanachiTotalWeight.innerText = `${autoFibanachiWeight} * (${autoFibanachiTouchingMultiplier}) = ${autoFibanachiTotalWeight.toFixed(2)}`;
    } else {
        autoFibanachiText.autoFibanachiTotalWeight.innerText = "";
    }

    // Trigger
    if (checkClass(triggerMultiplierActBtn)) {
        triggerText.currentSituation.innerText += `. вага ${triggerWeight}`;

        triggerText.touching.innerText += `. множник ${triggerTouchingMultiplier}`;

        triggerText.triggerTotalMultiplier.innerText = `${triggerWeight} * (${triggerTouchingMultiplier}) = ${triggerTotalWeight.toFixed(2)}`;
    } else {
        triggerText.triggerTotalMultiplier.innerText = "";
    }

    // Pivot Point 1m
    if (checkClass(pivotPoint1mMultiplierActBtn)) {
        pivotPiontTextByInterval["1m"].currentSituation.innerText += `. вага ${pivotPoint_1mWeight}`; 

        pivotPiontTextByInterval["1m"].zone.innerText += `. множник ${pivotPoint_1mZoneMultiplier}`;

        pivotPiontTextByInterval["1m"].magnetism.innerText += `. множник ${pivotPoint_1mMagnetismMultiplier}`;

        pivotPiontTextByInterval["1m"].touching.innerText += `. множник ${pivotPoint_1mTouchingMultiplier}`;

        pivotPiontTextByInterval["1m"].total.innerText = `${pivotPoint_1mWeight} * (${pivotPoint_1mZoneMultiplier} * ${pivotPoint_1mMagnetismMultiplier} * ${pivotPoint_1mTouchingMultiplier}) = ${pivotPoint_1mTotalWeight.toFixed(2)}`;
    } else {
        pivotPiontTextByInterval["1m"].total.innerText = "";
    }

    // Pivot Point 5m 
    if (checkClass(pivotPoint5mMultiplierActBtn)) {
        pivotPiontTextByInterval["5m"].currentSituation.innerText += `. вага ${pivotPoint_5mWeight}`; 

        pivotPiontTextByInterval["5m"].zone.innerText += `. множник ${pivotPoint_5mZoneMultiplier}`;

        pivotPiontTextByInterval["5m"].magnetism.innerText += `. множник ${pivotPoint_5mMagnetismMultiplier}`;
    
        pivotPiontTextByInterval["5m"].touching.innerText += `. множник ${pivotPoint_5mTouchingMultiplier}`;

        pivotPiontTextByInterval["5m"].total.innerText = `${pivotPoint_5mWeight} * (${pivotPoint_5mZoneMultiplier} * ${pivotPoint_5mMagnetismMultiplier} * ${pivotPoint_5mTouchingMultiplier}) = ${pivotPoint_5mTotalWeight.toFixed(2)}`;
    } else {
        pivotPiontTextByInterval["5m"].total.innerText = "";
    }

    // Pivot Point 15m 
    if (checkClass(pivotPoint15mMultiplierActBtn)) {
        pivotPiontTextByInterval["15m"].currentSituation.innerText += `. вага ${pivotPoint_15mWeight}`; 

        pivotPiontTextByInterval["15m"].zone.innerText += `. множник ${pivotPoint_15mZoneMultiplier}`;

        pivotPiontTextByInterval["15m"].magnetism.innerText += `. множник ${pivotPoint_15mMagnetismMultiplier}`;
    
        pivotPiontTextByInterval["15m"].touching.innerText += `. множник ${pivotPoint_15mTouchingMultiplier}`;

        pivotPiontTextByInterval["15m"].total.innerText = `${pivotPoint_15mWeight} * (${pivotPoint_15mZoneMultiplier} * ${pivotPoint_15mMagnetismMultiplier} * ${pivotPoint_15mTouchingMultiplier}) = ${pivotPoint_15mTotalWeight.toFixed(2)}`;
    } else {
        pivotPiontTextByInterval["15m"].total.innerText = "";
    }

    // Pivot Point 30m 
    if (checkClass(pivotPoint30mMultiplierActBtn)) {
        pivotPiontTextByInterval["30m"].currentSituation.innerText += `. вага ${pivotPoint_30mWeight}`; 

        pivotPiontTextByInterval["30m"].zone.innerText += `. множник ${pivotPoint_30mZoneMultiplier}`;

        pivotPiontTextByInterval["30m"].magnetism.innerText += `. множник ${pivotPoint_30mMagnetismMultiplier}`;

        pivotPiontTextByInterval["30m"].touching.innerText += `. множник ${pivotPoint_30mTouchingMultiplier}`;

        pivotPiontTextByInterval["30m"].total.innerText = `${pivotPoint_30mWeight} * (${pivotPoint_30mZoneMultiplier} * ${pivotPoint_30mMagnetismMultiplier} * ${pivotPoint_30mTouchingMultiplier}) = ${pivotPoint_30mTotalWeight.toFixed(2)}`;
    } else {
        pivotPiontTextByInterval["30m"].total.innerText = "";
    }

    // Pivot Point 1h 
    if (checkClass(pivotPoint1hMultiplierActBtn)) {
        pivotPiontTextByInterval["1h"].currentSituation.innerText += `. вага ${pivotPoint_1hWeight}`; 

        pivotPiontTextByInterval["1h"].zone.innerText += `. множник ${pivotPoint_1hZoneMultiplier}`;

        pivotPiontTextByInterval["1h"].magnetism.innerText += `. множник ${pivotPoint_1hMagnetismMultiplier}`;
    
        pivotPiontTextByInterval["1h"].touching.innerText += `. множник ${pivotPoint_1hTouchingMultiplier}`;

        pivotPiontTextByInterval["1h"].total.innerText = `${pivotPoint_1hWeight} * (${pivotPoint_1hZoneMultiplier} * ${pivotPoint_1hMagnetismMultiplier} * ${pivotPoint_1hTouchingMultiplier}) = ${pivotPoint_1hTotalWeight.toFixed(2)}`;
    } else {
        pivotPiontTextByInterval["1h"].total.innerText = "";
    }

    // Pivot Point 4h 
    if (checkClass(pivotPoint4hMultiplierActBtn)) {
        pivotPiontTextByInterval["4h"].currentSituation.innerText += `. вага ${pivotPoint_4hWeight}`; 

        pivotPiontTextByInterval["4h"].zone.innerText += `. множник ${pivotPoint_4hZoneMultiplier}`;
    
        pivotPiontTextByInterval["4h"].magnetism.innerText += `. множник ${pivotPoint_4hMagnetismMultiplier}`;
    
        pivotPiontTextByInterval["4h"].touching.innerText += `. множник ${pivotPoint_4hTouchingMultiplier}`;

        pivotPiontTextByInterval["4h"].total.innerText = `${pivotPoint_4hWeight} * (${pivotPoint_4hZoneMultiplier} * ${pivotPoint_4hMagnetismMultiplier} * ${pivotPoint_4hTouchingMultiplier}) = ${pivotPoint_4hTotalWeight.toFixed(2)}`;
    } else {
        pivotPiontTextByInterval["4h"].total.innerText = "";
    }

    // Pivot Point 1d 
    if (checkClass(pivotPoint1dMultiplierActBtn)) {
        pivotPiontTextByInterval["1d"].currentSituation.innerText += `${allScenarios[analyzeData.pivotPoint_1d.main.currentID].situation}. вага ${pivotPoint_1dWeight}`; 

        pivotPiontTextByInterval["1d"].zone.innerText += `. множник ${pivotPoint_1dZoneMultiplier}`;

        pivotPiontTextByInterval["1d"].magnetism.innerText += `. множник ${pivotPoint_1dMagnetismMultiplier}`;
    
        pivotPiontTextByInterval["1d"].touching.innerText += `. множник ${pivotPoint_1dTouchingMultiplier}`;

        pivotPiontTextByInterval["1d"].total.innerText = `${pivotPoint_1dWeight} * (${pivotPoint_1dZoneMultiplier} * ${pivotPoint_1dMagnetismMultiplier} * ${pivotPoint_1dTouchingMultiplier}) = ${pivotPoint_1dTotalWeight.toFixed(2)}`;
    } else {
        pivotPiontTextByInterval["1d"].total.innerText = "";
    }

    // 7. Виведення ВСІХ даних
    totalLong.innerHTML = `${textLong} = Сума ваг &nbsp;<b>LONG: ${longSum.toFixed(2)} (${longPercent.toFixed(1)}%)</b>&nbsp`;
    totalShort.innerHTML = `${textShort} = Сума ваг  &nbsp;<b>SHORT: ${shortSum.toFixed(2)} (${shortPercent.toFixed(1)}%)</b>&nbsp;`;
    totalSumWeight.innerHTML = `Загальна вага ринку: &nbsp;<b>${totalSum.toFixed(2)}</b>&nbsp;. ${totalSumStatus}`;
    
    confidenceElement.innerHTML = `Впевненість у &nbsp;<b> ${side}: ${confidence.toFixed(1)}%</b>&nbsp; Дія: ${action}`;
    confidenceElement.style.backgroundColor = side === "LONG" ? "#72da85" : "#ec6b6b";
}
