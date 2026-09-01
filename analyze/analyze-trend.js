import { calculateSlopeAngle } from "../calcFunction/various/mathematical-func.js";

const volumeZone = document.getElementById("volume-zone");
const volumeStack = document.getElementById("volume-stack");

const adxTrend = document.getElementById("adx-trend");
const adxState = document.getElementById("adx-state");

const zigZagTrend = document.getElementById("zig-zag-trend");

export function analyzeTrend(analyzeData, trendsData, dataAdx, klines) {
if (!klines || klines.length < 200) return null; // [cite: 25]

    const volumes = klines.map(k => k.volume ?? 0);
    const currentVolume = volumes[volumes.length - 1];
    const lastCandle = klines[klines.length - 1];
    
    // Колір залежно від напрямку свічки [cite: 12]
    const candleColor = lastCandle.close >= lastCandle.open ? "#72da85" : "#ec6b6b";

    // 1. Допоміжна функція для SMA
    const getSMA = (data, period) => {
        const slice = data.slice(-period);
        return slice.reduce((a, b) => a + b, 0) / period;
    };

    // 2. Підрахунок послідовності (Trend Count)
    const getVolumeTrendCount = (data) => {
        let count = 0;
        for (let i = data.length - 1; i > 0; i--) {
            if (data[i] > data[i - 1]) {
                if (count < 0) break;
                count++;
            } else if (data[i] < data[i - 1]) {
                if (count > 0) break;
                count--;
            } else {
                break;
            }
        }
        return count;
    };


    if (trendsData.lastTrend.type === "Downtrend") {
        analyzeData.additional.zigZagTrend.currentID = "B8025";
    }
    
    if (trendsData.lastTrend.type === "Uptrend") {
        analyzeData.additional.zigZagTrend.currentID = "B8024";
    }

    let zigZagTrend = trendsData.lastTrend.type === "Uptrend";
    let candleTrend = lastCandle.close >= lastCandle.open;

    // 3. Розрахунок середніх та коефіцієнтів
    const volumeSMA20 = getSMA(volumes, 20); // [cite: 20]
    const volumeSMA200 = getSMA(volumes, 200); // [cite: 24]

    const ratio20 = currentVolume / volumeSMA20; // [cite: 76]
    const ratio200 = currentVolume / volumeSMA200; // [cite: 77]

    const compositeRatio = (ratio20 * 0.4) + (ratio200 * 0.6); // [cite: 112]
    const trendCount = getVolumeTrendCount(volumes);

    // --- ЛОГІКА ДЛЯ VOLUME-ZONE (Тексти та Кольори) ---
    if (compositeRatio > 2.0) {
        analyzeData.additional.volumeZone.currentID = candleTrend ? "B8010" : "B8011";
    } else if (compositeRatio >= 1.3 && compositeRatio <= 2.0) {
        analyzeData.additional.volumeZone.currentID = candleTrend ? "B8012" : "B8013";
    } else if (compositeRatio >= 0.7 && compositeRatio < 1.3) {
        analyzeData.additional.volumeZone.currentID = candleTrend ? "B8014" : "B8015";
    } else if (compositeRatio >= 0.5 && compositeRatio < 0.7) {
        analyzeData.additional.volumeZone.currentID = candleTrend ? "B8016" : "B8017";
    } else {
        analyzeData.additional.volumeZone.currentID = candleTrend ? "B8018" : "B8019";
    }

    // --- ЛОГІКА ДЛЯ VOLUME-STACK (Динаміка) ---
    if (trendCount >= 3) {
        analyzeData.additional.volumeStack.currentID = candleTrend ? "B8020" : "B8021";
        analyzeData.additional.volumeStack.valueX = trendCount;
    } else if (trendCount <= -3) {
        analyzeData.additional.volumeStack.currentID = candleTrend ? "B8022" : "B8023";
        analyzeData.additional.volumeStack.valueX = Math.abs(trendCount);
    } else {
        analyzeData.additional.volumeStack.currentID = "B1000";
        analyzeData.additional.volumeStack.valueX = 0;
    }

    if (dataAdx.length > 1 && dataAdx[dataAdx.length - 1].value > dataAdx[dataAdx.length - 2].value) {
        analyzeData.additional.adxTrend.currentID = zigZagTrend ? "B8001" : "B8002";
        analyzeData.additional.adxTrend.valueX = calculateSlopeAngle(dataAdx[dataAdx.length - 2].value, dataAdx[dataAdx.length - 1].value);
    } else {
        analyzeData.additional.adxTrend.currentID = zigZagTrend ? "B8003" : "B8004";
        analyzeData.additional.adxTrend.valueX = calculateSlopeAngle(dataAdx[dataAdx.length - 2].value, dataAdx[dataAdx.length - 1].value);
    }

    if (dataAdx.length > 1 && dataAdx[dataAdx.length - 1].color === '#26a69a' ) {
        analyzeData.additional.adxState.currentID = zigZagTrend ? "B8005" : "B8006";
    }

    if (dataAdx.length > 1 && dataAdx[dataAdx.length - 1].color === '#ef5350' ) {
        analyzeData.additional.adxState.currentID = zigZagTrend ? "B8007" : "B8008";
    }

    if (dataAdx.length > 1 && dataAdx[dataAdx.length - 1].color === '#b96f19' ) {
        analyzeData.additional.adxState.currentID = "B8009";
    }
}