import { analyzeDataByInterval } from "../program-analyze-data.js"
import { allScenarios, strategyBlocks } from "../settingsData/all-scenarios.js"

const text1m = {
    tweezers: document.getElementById("tweezers-entries-1m"),
    engulfing: document.getElementById("engulfing-entries-1m"),
    macd: document.getElementById("macd-entries-1m"),
    ma: document.getElementById("ma-entries-1m"),
    rsi: document.getElementById("rsi-entries-1m"),
    trigger: document.getElementById("trigger-entries-1m"),
    autoFibanachi: document.getElementById("autoFibanachi-entries-1m"),
    wawe: document.getElementById("wawe-entries-1m"),
    standartFibanachi: document.getElementById("standartFibanachi-entries-1m"),
    pivotPoint_5m: document.getElementById("pivot-point-5m-entries-1m"),
    pivotPoint_15m: document.getElementById("pivot-point-15m-entries-1m"),
    pivotPoint_30m: document.getElementById("pivot-point-30m-entries-1m"),
    pivotPoint_1h: document.getElementById("pivot-point-1h-entries-1m"),
    pivotPoint_4h: document.getElementById("pivot-point-4h-entries-1m"),
    pivotPoint_1d: document.getElementById("pivot-point-1d-entries-1m"),
}

const text5m = {
    tweezers: document.getElementById("tweezers-entries-5m"),
    engulfing: document.getElementById("engulfing-entries-5m"),
    macd: document.getElementById("macd-entries-5m"),
    ma: document.getElementById("ma-entries-5m"),
    rsi: document.getElementById("rsi-entries-5m"),
    trigger: document.getElementById("trigger-entries-5m"),
    autoFibanachi: document.getElementById("autoFibanachi-entries-5m"),
    wawe: document.getElementById("wawe-entries-5m"),
    standartFibanachi: document.getElementById("standartFibanachi-entries-5m"),
    pivotPoint_5m: document.getElementById("pivot-point-5m-entries-5m"),
    pivotPoint_15m: document.getElementById("pivot-point-15m-entries-5m"),
    pivotPoint_30m: document.getElementById("pivot-point-30m-entries-5m"),
    pivotPoint_1h: document.getElementById("pivot-point-1h-entries-5m"),
    pivotPoint_4h: document.getElementById("pivot-point-4h-entries-5m"),
    pivotPoint_1d: document.getElementById("pivot-point-1d-entries-5m"),
}

const text15m = {
    tweezers: document.getElementById("tweezers-entries-15m"),
    engulfing: document.getElementById("engulfing-entries-15m"),
    macd: document.getElementById("macd-entries-15m"),
    ma: document.getElementById("ma-entries-15m"),
    rsi: document.getElementById("rsi-entries-15m"),
    trigger: document.getElementById("trigger-entries-15m"),
    autoFibanachi: document.getElementById("autoFibanachi-entries-15m"),
    wawe: document.getElementById("wawe-entries-15m"),
    standartFibanachi: document.getElementById("standartFibanachi-entries-15m"),
    pivotPoint_5m: document.getElementById("pivot-point-5m-entries-15m"),
    pivotPoint_15m: document.getElementById("pivot-point-15m-entries-15m"),
    pivotPoint_30m: document.getElementById("pivot-point-30m-entries-15m"),
    pivotPoint_1h: document.getElementById("pivot-point-1h-entries-15m"),
    pivotPoint_4h: document.getElementById("pivot-point-4h-entries-15m"),
    pivotPoint_1d: document.getElementById("pivot-point-1d-entries-15m"),
}

const text30m = {
    tweezers: document.getElementById("tweezers-entries-30m"),
    engulfing: document.getElementById("engulfing-entries-30m"),
    macd: document.getElementById("macd-entries-30m"),
    ma: document.getElementById("ma-entries-30m"),
    rsi: document.getElementById("rsi-entries-30m"),
    trigger: document.getElementById("trigger-entries-30m"),
    autoFibanachi: document.getElementById("autoFibanachi-entries-30m"),
    wawe: document.getElementById("wawe-entries-30m"),
    standartFibanachi: document.getElementById("standartFibanachi-entries-30m"),
    pivotPoint_5m: document.getElementById("pivot-point-5m-entries-30m"),
    pivotPoint_15m: document.getElementById("pivot-point-15m-entries-30m"),
    pivotPoint_30m: document.getElementById("pivot-point-30m-entries-30m"),
    pivotPoint_1h: document.getElementById("pivot-point-1h-entries-30m"),
    pivotPoint_4h: document.getElementById("pivot-point-4h-entries-30m"),
    pivotPoint_1d: document.getElementById("pivot-point-1d-entries-30m"),
}

const text1h = {
    tweezers: document.getElementById("tweezers-entries-1h"),
    engulfing: document.getElementById("engulfing-entries-1h"),
    macd: document.getElementById("macd-entries-1h"),
    ma: document.getElementById("ma-entries-1h"),
    rsi: document.getElementById("rsi-entries-1h"),
    trigger: document.getElementById("trigger-entries-1h"),
    autoFibanachi: document.getElementById("autoFibanachi-entries-1h"),
    wawe: document.getElementById("wawe-entries-1h"),
    standartFibanachi: document.getElementById("standartFibanachi-entries-1h"),
    pivotPoint_5m: document.getElementById("pivot-point-5m-entries-1h"),
    pivotPoint_15m: document.getElementById("pivot-point-15m-entries-1h"),
    pivotPoint_30m: document.getElementById("pivot-point-30m-entries-1h"),
    pivotPoint_1h: document.getElementById("pivot-point-1h-entries-1h"),
    pivotPoint_4h: document.getElementById("pivot-point-4h-entries-1h"),
    pivotPoint_1d: document.getElementById("pivot-point-1d-entries-1h"),
}

const textByInterval = {
  "1m": text1m,
  "5m": text5m,
  "15m": text15m,
  "30m": text30m,
  "1h": text1h,
};

export function updateEntries() {
    const baseText = "Рітест";

    // Перебираємо кожен інтервал (1m, 5m, 15m, 30m, 1h)
    for (const interval in textByInterval) {
        // toLowerCase() Поглинання Пінцет

        const pattern = {
            tweezers: analyzeDataByInterval[interval].pattern.main.currentSituationText.includes("Пінцет"),
            engulfing: analyzeDataByInterval[interval].pattern.main.currentSituationText.includes("Поглинання"),
            weight: analyzeDataByInterval[interval].pattern.main.weight[interval], 
        };

        // Логіка зміни кольорі
        if (pattern.tweezers) {
            textByInterval[interval].tweezers.style.backgroundColor = pattern.weight > 0 ? "#72da85" : "#ec6b6b";
        } else {
            textByInterval[interval].tweezers.style.backgroundColor = "#ffffff";
        }

        if (pattern.engulfing) {
            textByInterval[interval].engulfing.style.backgroundColor = pattern.weight > 0 ? "#72da85" : "#ec6b6b";
        } else {
            textByInterval[interval].engulfing.style.backgroundColor = "#ffffff";
        }

        const macd = analyzeDataByInterval[interval].macd.main.currentID;

        // Логіка зміни кольорів
        if (allScenarios[macd].isTable) {
            textByInterval[interval].macd.style.backgroundColor = allScenarios[macd].direction > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].macd.innerText = allScenarios[macd].tableText;
        } else {
            textByInterval[interval].macd.style.backgroundColor = "#ffffff";
            textByInterval[interval].macd.innerText = "";
        }

        const ma = {
            id: analyzeDataByInterval[interval].ma.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].ma.main.currentID].direction,
            touch: strategyBlocks[analyzeDataByInterval[interval].ma.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (ma.touch.isTable) {
            textByInterval[interval].ma.style.backgroundColor = ma.touch.color;
            textByInterval[interval].ma.innerText = ma.touch.tableText;
        } else if (allScenarios[ma.id].isTable) {
            textByInterval[interval].ma.style.backgroundColor = ma.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].ma.innerText = allScenarios[ma.id].tableText;
        } else {
            textByInterval[interval].ma.style.backgroundColor = "#ffffff";
            textByInterval[interval].ma.innerText = "";
        }

        const rsi = analyzeDataByInterval[interval].rsi.main.currentID;

        // Логіка зміни кольорів
        if (allScenarios[rsi].isTable) {
            textByInterval[interval].rsi.style.backgroundColor = allScenarios[rsi].direction > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].rsi.innerText = allScenarios[rsi].tableText;
        } else {
            textByInterval[interval].rsi.style.backgroundColor = "#ffffff";
            textByInterval[interval].rsi.innerText = "";
        }

        const trigger = {
            id: analyzeDataByInterval[interval].trigger.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].trigger.main.currentID].direction, 
            touch: strategyBlocks[analyzeDataByInterval[interval].trigger.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (trigger.touch.isTable) {
            textByInterval[interval].trigger.style.backgroundColor = trigger.touch.color;
            textByInterval[interval].trigger.innerText = trigger.touch.tableText;
        } else if (allScenarios[trigger.id].isTable) {
            textByInterval[interval].trigger.style.backgroundColor = trigger.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].trigger.innerText = allScenarios[trigger.id].tableText;
        } else {
            textByInterval[interval].trigger.style.backgroundColor = "#ffffff";
            textByInterval[interval].trigger.innerText = "";
        }
    
        const autoFibanachi = {
            id: analyzeDataByInterval[interval].autoFibanachi.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].autoFibanachi.main.currentID].direction, 
            touch: strategyBlocks[analyzeDataByInterval[interval].autoFibanachi.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (autoFibanachi.touch.isTable) {
            textByInterval[interval].autoFibanachi.style.backgroundColor = autoFibanachi.touch.color;
            textByInterval[interval].autoFibanachi.innerText = autoFibanachi.touch.tableText;
        } else if (allScenarios[autoFibanachi.id].isTable) {
            textByInterval[interval].autoFibanachi.style.backgroundColor = autoFibanachi.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].autoFibanachi.innerText = allScenarios[autoFibanachi.id].tableText;
        } else {
            textByInterval[interval].autoFibanachi.style.backgroundColor = "#ffffff";
            textByInterval[interval].autoFibanachi.innerText = "";
        }

        const wawe = {
            id: analyzeDataByInterval[interval].wawe.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].wawe.main.currentID].direction, 
            touch: strategyBlocks[analyzeDataByInterval[interval].wawe.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (wawe.touch.isTable) {
            textByInterval[interval].wawe.style.backgroundColor = wawe.touch.color;
            textByInterval[interval].wawe.innerText = wawe.touch.tableText
        } else if (allScenarios[wawe.id].isTable) {
            textByInterval[interval].wawe.style.backgroundColor = wawe.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].wawe.innerText = allScenarios[wawe.id].tableText;
        } else {
            textByInterval[interval].wawe.style.backgroundColor = "#ffffff";
            textByInterval[interval].wawe.innerText = "";
        }

        const standartFibanachi = {
            id: analyzeDataByInterval[interval].standartFibanachi.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].standartFibanachi.main.currentID].direction, 
            touch: strategyBlocks[analyzeDataByInterval[interval].standartFibanachi.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (standartFibanachi.touch.isTable) {
            textByInterval[interval].standartFibanachi.style.backgroundColor = standartFibanachi.touch.color;
            textByInterval[interval].standartFibanachi.innerText = standartFibanachi.touch.tableText;
        } else if (allScenarios[standartFibanachi.id].isTable) {
            textByInterval[interval].standartFibanachi.style.backgroundColor = standartFibanachi.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].standartFibanachi.innerText = allScenarios[standartFibanachi.id].tableText;
        } else {
            textByInterval[interval].standartFibanachi.style.backgroundColor = "#ffffff";
            textByInterval[interval].standartFibanachi.innerText = "";
        }

        const pivotPoint_5m = {
            id: analyzeDataByInterval[interval].pivotPoint_5m.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].pivotPoint_5m.main.currentID].direction, 
            touch: strategyBlocks[analyzeDataByInterval[interval].pivotPoint_5m.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (pivotPoint_5m.touch.isTable) {
            textByInterval[interval].pivotPoint_5m.style.backgroundColor = pivotPoint_5m.touch.color;
            textByInterval[interval].pivotPoint_5m.innerText = pivotPoint_5m.touch.tableText;
        } else if (allScenarios[pivotPoint_5m.id].isTable) {
            textByInterval[interval].pivotPoint_5m.style.backgroundColor = pivotPoint_5m.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].pivotPoint_5m.innerText = allScenarios[pivotPoint_5m.id].tableText;
        } else {
            textByInterval[interval].pivotPoint_5m.style.backgroundColor = "#ffffff";
            textByInterval[interval].pivotPoint_5m.innerText = "";
        }

        const pivotPoint_15m = {
            id: analyzeDataByInterval[interval].pivotPoint_15m.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].pivotPoint_15m.main.currentID].direction, 
            touch: strategyBlocks[analyzeDataByInterval[interval].pivotPoint_15m.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (pivotPoint_15m.touch.isTable) {
            textByInterval[interval].pivotPoint_15m.style.backgroundColor = pivotPoint_15m.touch.color;
            textByInterval[interval].pivotPoint_15m.innerText = pivotPoint_15m.touch.tableText;
        } else if (allScenarios[pivotPoint_15m.id].isTable) {
            textByInterval[interval].pivotPoint_15m.style.backgroundColor = pivotPoint_15m.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].pivotPoint_15m.innerText = allScenarios[pivotPoint_15m.id].tableText;
        } else {
            textByInterval[interval].pivotPoint_15m.style.backgroundColor = "#ffffff";
            textByInterval[interval].pivotPoint_15m.innerText = "";
        }

        const pivotPoint_30m = {
            id: analyzeDataByInterval[interval].pivotPoint_30m.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].pivotPoint_30m.main.currentID].direction, 
            touch: strategyBlocks[analyzeDataByInterval[interval].pivotPoint_30m.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (pivotPoint_30m.touch.isTable) {
            textByInterval[interval].pivotPoint_30m.style.backgroundColor = pivotPoint_30m.touch.color;
            textByInterval[interval].pivotPoint_30m.innerText = pivotPoint_30m.touch.tableText;
        } else if (allScenarios[pivotPoint_30m.id].isTable) {
            textByInterval[interval].pivotPoint_30m.style.backgroundColor = pivotPoint_30m.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].pivotPoint_30m.innerText = allScenarios[pivotPoint_30m.id].tableText;
        } else {
            textByInterval[interval].pivotPoint_30m.style.backgroundColor = "#ffffff";
            textByInterval[interval].pivotPoint_30m.innerText = "";
        }

        const pivotPoint_1h = {
            id: analyzeDataByInterval[interval].pivotPoint_1h.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].pivotPoint_1h.main.currentID].direction, 
            touch: strategyBlocks[analyzeDataByInterval[interval].pivotPoint_1h.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (pivotPoint_1h.touch.isTable) {
            textByInterval[interval].pivotPoint_1h.style.backgroundColor = pivotPoint_1h.touch.color;
            textByInterval[interval].pivotPoint_1h.innerText = pivotPoint_1h.touch.tableText;
        } else if (allScenarios[pivotPoint_1h.id].isTable) {
            textByInterval[interval].pivotPoint_1h.style.backgroundColor = pivotPoint_1h.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].pivotPoint_1h.innerText = allScenarios[pivotPoint_1h.id].tableText;
        } else {
            textByInterval[interval].pivotPoint_1h.style.backgroundColor = "#ffffff";
            textByInterval[interval].pivotPoint_1h.innerText = "";
        }

        const pivotPoint_4h = {
            id: analyzeDataByInterval[interval].pivotPoint_4h.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].pivotPoint_4h.main.currentID].direction, 
            touch: strategyBlocks[analyzeDataByInterval[interval].pivotPoint_4h.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (pivotPoint_4h.touch.isTable) {
            textByInterval[interval].pivotPoint_4h.style.backgroundColor = pivotPoint_4h.touch.color;
            textByInterval[interval].pivotPoint_4h.innerText = pivotPoint_4h.touch.tableText;
        } else if (allScenarios[pivotPoint_4h.id].isTable) {
            textByInterval[interval].pivotPoint_4h.style.backgroundColor = pivotPoint_4h.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].pivotPoint_4h.innerText = allScenarios[pivotPoint_4h.id].tableText;
        } else {
            textByInterval[interval].pivotPoint_4h.style.backgroundColor = "#ffffff";
            textByInterval[interval].pivotPoint_4h.innerText = "";
        }

        const pivotPoint_1d = {
            id: analyzeDataByInterval[interval].pivotPoint_1d.main.currentID,
            weight: allScenarios[analyzeDataByInterval[interval].pivotPoint_1d.main.currentID].direction, 
            touch: strategyBlocks[analyzeDataByInterval[interval].pivotPoint_1d.additional.touching.currentID],
        };

        // Логіка зміни кольорів
        if (pivotPoint_1d.touch.isTable) {
            textByInterval[interval].pivotPoint_1d.style.backgroundColor = pivotPoint_1d.touch.color;
            textByInterval[interval].pivotPoint_1d.innerText = pivotPoint_1d.touch.tableText;
        } else if (allScenarios[pivotPoint_1d.id].isTable) {
            textByInterval[interval].pivotPoint_1d.style.backgroundColor = pivotPoint_1d.weight > 0 ? "#72da85" : "#ec6b6b";
            textByInterval[interval].pivotPoint_1d.innerText = allScenarios[pivotPoint_1d.id].tableText;
        } else {
            textByInterval[interval].pivotPoint_1d.style.backgroundColor = "#ffffff";
            textByInterval[interval].pivotPoint_1d.innerText = "";
        }
    }
}