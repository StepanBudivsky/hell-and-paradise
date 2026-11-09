import { checkClass } from "../control.js";
import { INDICATORS, TREND_MULTIPLIERS } from "./analyzeConfig.js";
import { ELEMENTS } from "./analyzeElements.js";

const totalLongEl = document.getElementById("total-long");
const totalShortEl = document.getElementById("total-short");
const totalSumEl = document.getElementById("total-sum");
const confidenceEl = document.getElementById("confidence-element");

// Усі блоки з вагою (trend має окрему логіку)
const BLOCK_KEYS = Object.keys(ELEMENTS).filter(key => key !== "trend");

/* ------------------------------------------------------------------ */
/* Рендер                                                              */
/* ------------------------------------------------------------------ */
function renderBlock(key, data) {
    const { situation, fields, total, button } = ELEMENTS[key];

    if (!checkClass(button)) {
        total.innerText = "";
        return;
    }

    const weight = data[`${key}Weight`];
    situation.currentSituation.innerText += `. вага ${weight}`;

    // [ключ в additional, назва поля в data] – у тому ж порядку, що й у розрахунку.
    // У pattern множників немає, у підсумок іде лише вага.
    const multipliers = Object.entries(INDICATORS[key]?.multipliers ?? {});

    if (multipliers.length === 0) {
        total.innerText = weight;
        return;
    }

    const values = multipliers.map(([, dataName]) => data[dataName]);

    multipliers.forEach(([additionalKey], i) => {
        fields[additionalKey].innerText += `. множник ${values[i]}`;
    });

    total.innerText = `${weight} * (${values.join(" * ")}) = ${data[`${key}TotalWeight`].toFixed(2)}`;
}

// Trend: множники окремо для LONG і SHORT, діють на загальну суму
function renderTrend(data) {
    const { fields, total, button } = ELEMENTS.trend;

    if (!checkClass(button)) {
        total.innerText = "";
        return;
    }

    const names = Object.entries(TREND_MULTIPLIERS); // [ключ в additional, назва в data]
    const longs = names.map(([, name]) => data[`${name}MultiplierLong`]);
    const shorts = names.map(([, name]) => data[`${name}MultiplierShort`]);

    names.forEach(([additionalKey], i) => {
        fields[additionalKey].innerText += `. множник ${longs[i]} і ${shorts[i]}`;
    });

    total.innerText =
        `${longs.join(" * ")} = ${data.trendTotalMultiplierLong.toFixed(2)} і ` +
        `${shorts.join(" * ")} = ${data.trendTotalMultiplierShort.toFixed(2)}`;
}

function renderSummary(data) {
    const { textLong, textShort, longSum, shortSum, longPercent, shortPercent,
            totalSum, totalSumStatus, side, confidence, action } = data;

    totalLongEl.innerHTML = `${textLong} = Сума ваг &nbsp;<b>LONG: ${longSum.toFixed(2)} (${longPercent.toFixed(1)}%)</b>&nbsp`;
    totalShortEl.innerHTML = `${textShort} = Сума ваг  &nbsp;<b>SHORT: ${shortSum.toFixed(2)} (${shortPercent.toFixed(1)}%)</b>&nbsp;`;
    totalSumEl.innerHTML = `Загальна вага ринку: &nbsp;<b>${totalSum.toFixed(2)}</b>&nbsp;. ${totalSumStatus}`;

    confidenceEl.innerHTML = `Впевненість у &nbsp;<b> ${side}: ${confidence.toFixed(1)}%</b>&nbsp; Дія: ${action}`;
    confidenceEl.style.backgroundColor = side === "LONG" ? "#72da85" : "#ec6b6b";
}

// analyzeData залишено в сигнатурі для сумісності з викликами, всередині він більше не потрібен
export function updateUnifiedAnalyzeUI(analyzeData, result) {
    const data = result.data;

    BLOCK_KEYS.forEach(key => renderBlock(key, data));
    renderTrend(data);
    renderSummary(data);
}