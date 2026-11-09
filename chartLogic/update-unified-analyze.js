import { allScenarios, strategyBlocks } from "../settingsData/all-scenarios.js";
import { INDICATORS, TREND_MULTIPLIERS, GROUP_ORDER } from "./analyzeConfig.js";
import { ELEMENTS } from "./analyzeElements.js";

/* ------------------------------------------------------------------ */
/* Хелпери                                                             */
/* ------------------------------------------------------------------ */
const extractId = item => (typeof item === "object" && item !== null ? item.id : item);

const product = values => values.reduce((acc, value) => acc * value, 1);

const pickMultiplier = (status, block) => (status ? block.multiplierLong : block.multiplierShort);

// Кнопка активна (має клас active) = опція "виключити" ввімкнена.
// Якщо кнопки немає в розмітці – вважаємо, що нічого не виключено.
const isActive = btn => Boolean(btn) && btn.classList.contains("active");

function getIndicatorMetrics(indicatorData, interval) {
    const scenarios = (indicatorData.main.currentIDs || [])
        .map(item => allScenarios[extractId(item)])
        .filter(Boolean);

    // Сума ваг для вказаного інтервалу
    const weight = scenarios.reduce((sum, s) => sum + (s.weight?.[interval] || 0), 0);

    // Сумарний direction визначає статус (LONG/SHORT)
    const totalDirection = scenarios.reduce((sum, s) => sum + (s.direction || 0), 0);

    return { weight, status: totalDirection > 0 };
}

/** Рахує один індикатор і повертає плоскі поля: <key>Weight, <key>Status, <...>Multiplier, <key>TotalWeight */
function analyzeIndicator(key, analyzeData, interval) {
    const { weight, status } = getIndicatorMetrics(analyzeData[key], interval);
    const additional = analyzeData[key].additional;

    // Кнопка "×" з active: усі множники блоку стають 1, лишається чиста вага
    const noMult = isActive(ELEMENTS[key].noMultBtn);

    const multipliers = {};
    for (const [additionalKey, outName] of Object.entries(INDICATORS[key].multipliers)) {
        const block = strategyBlocks[additional[additionalKey].currentID];
        multipliers[outName] = noMult ? 1 : pickMultiplier(status, block);
    }

    return {
        [`${key}Weight`]: weight,
        [`${key}Status`]: status,
        ...multipliers,
        [`${key}TotalWeight`]: weight * product(Object.values(multipliers)),
    };
}

function analyzePattern(analyzeData, interval) {
    const { tweezersID, engulfingsID, weight } = analyzeData.pattern.main;

    return {
        patternWeight: allScenarios[tweezersID].weight[interval] + allScenarios[engulfingsID].weight[interval],
        patternStatus: weight[interval] > 0,
    };
}

function analyzeTrend(analyzeData) {
    const result = {};
    const longs = [];
    const shorts = [];

    // Кнопка "×" тренда з active: усі множники тренда стають 1
    const noMult = isActive(ELEMENTS.trend.noMultBtn);

    for (const [additionalKey, outName] of Object.entries(TREND_MULTIPLIERS)) {
        const block = strategyBlocks[analyzeData.trend.additional[additionalKey].currentID];
        const long = noMult ? 1 : block.multiplierLong;
        const short = noMult ? 1 : block.multiplierShort;

        result[`${outName}MultiplierLong`] = long;
        result[`${outName}MultiplierShort`] = short;
        longs.push(long);
        shorts.push(short);
    }

    result.trendTotalMultiplierLong = product(longs);
    result.trendTotalMultiplierShort = product(shorts);
    return result;
}

function getAction(confidence) {
    if (confidence < 20) return "Не входити (флет/шуми)";
    if (confidence <= 40) return "Входити з малим об'ємом";
    if (confidence <= 60) return "Входити з середнім об'ємом";
    if (confidence <= 80) return "Входити з великим об'ємом";
    return "Входити з максимальним об'ємом";
}

/* ------------------------------------------------------------------ */
/* Головна функція                                                     */
/* ------------------------------------------------------------------ */
export function updateUnifiedAnalyze(analyzeData, interval, dataResult) {
    // 1. Розрахунок усіх блоків
    let data = {};
    for (const key of Object.keys(INDICATORS)) {
        Object.assign(data, analyzeIndicator(key, analyzeData, interval));
    }
    Object.assign(data, analyzePattern(analyzeData, interval));
    Object.assign(data, analyzeTrend(analyzeData));

    // 2. Підсумкові ваги груп (блоки з кнопкою "Σ" з active у суму не йдуть)
    const groupWeights = GROUP_ORDER
        .filter(key => !isActive(ELEMENTS[key].excludeBtn))
        .map(key => (key === "pattern" ? data.patternWeight : data[`${key}TotalWeight`]));

    // 3. Розподіл на LONG / SHORT
    let longSum = 0;
    let shortSum = 0;
    let textLong = "";
    let textShort = "";

    for (const weight of groupWeights) {
        if (weight >= 0) {
            longSum += weight;
            if (weight) textLong += ` ${weight.toFixed(2)} *`;
        } else {
            shortSum += weight;
            textShort += ` ${weight.toFixed(2)} *`;
        }
    }

    // 4. Множники тренда
    longSum *= data.trendTotalMultiplierLong;
    textLong += ` ${data.trendTotalMultiplierLong.toFixed(2)}`;
    shortSum *= data.trendTotalMultiplierShort;
    textShort += ` ${data.trendTotalMultiplierShort.toFixed(2)}`;

    // 5. Відсотки LONG / SHORT і впевненість
    const absLong = Math.abs(longSum);
    const absShort = Math.abs(shortSum);
    const absoluteTotal = absLong + absShort;

    const longPercent = absoluteTotal > 0 ? (absLong / absoluteTotal) * 100 : 0;
    const shortPercent = absoluteTotal > 0 ? (absShort / absoluteTotal) * 100 : 0;
    const confidence = absoluteTotal > 0 ? (Math.abs(absLong - absShort) / absoluteTotal) * 100 : 0;
    const side = absLong >= absShort ? "LONG" : "SHORT";

    // 6. Дія і статус входу
    const action = getAction(confidence);
    const totalSum = longSum + shortSum;
    const totalSumStatus = Math.abs(totalSum) < 30 ? "Входити неможна (зона -30 до +30)" : "";

    dataResult.longSum = longSum;
    dataResult.longPercent = longPercent;
    dataResult.shortSum = shortSum;
    dataResult.shortPercent = shortPercent;
    dataResult.confidence = confidence;
    dataResult.side = side;

    return {
        data: {
            ...data,
            longSum, shortSum, totalSum, longPercent, shortPercent,
            side, confidence, action, totalSumStatus, textLong, textShort,
        },
    };
}