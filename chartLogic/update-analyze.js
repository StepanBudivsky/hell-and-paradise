import { allScenarios, strategyBlocks } from "../settingsData/all-scenarios.js";
import { PIVOT_TIMEFRAMES } from "./analyzeConfig.js";
import { ELEMENTS } from "./analyzeElements.js";

/* ------------------------------------------------------------------ */
/* Опції рендеру блоків                                                */
/* X_FIELDS – блоки, де "X" у тексті замінюється на valueX             */
/* Фон фарбується для всіх блоків, крім "touching"                     */
/* ------------------------------------------------------------------ */
const X_FIELDS = {
    macd: ["histogramTrend", "macdTrend", "signalTrend"],
    ma: ["m30Trend", "m10Trend"],
    rsi: ["trend", "zoneTightness", "ritest"],
    wawe: ["waweZone", "waweTightness", "waweCountInCandle", "waweZigzag"],
    trend: ["adxTrend", "volumeStack"],
};

for (const tf of PIVOT_TIMEFRAMES) {
    X_FIELDS[`pivotPoint_${tf}`] = ["zone"];
}

/* ------------------------------------------------------------------ */
/* Рендер                                                              */
/* ------------------------------------------------------------------ */
const extractId = item => (typeof item === "object" && item !== null ? item.id : item);

// Працює і з масивами об'єктів { id: "..." }, і зі звичайними масивами ID ["U4001", ...]
const getScenarios = ids =>
    (ids || []).map(item => allScenarios[extractId(item)]).filter(Boolean);

function renderSituation(elements, main) {
    const previous = getScenarios(main.previousIDs);
    const current = getScenarios(main.currentIDs);
    const join = (list, fn) => list.map(fn).join("\n\n");

    elements.previousSituation.textContent = join(previous, s => s.situation);
    elements.currentSituation.textContent = join(current, s => s.situation);
    elements.possibleSituationUp.textContent = join(current, s => `${s.possibleLong} ${s.persentageLong}%`);
    elements.possibleSituationDown.textContent = join(current, s => `${s.possibleShort} ${s.persentageShort}%`);
}

// Pattern: тексти приходять уже готовими
function renderPatternSituation(elements, main) {
    elements.previousSituation.textContent = main.previousSituationText;
    elements.currentSituation.textContent = main.currentSituationText;
    elements.possibleSituationUp.textContent = main.possibleSituationUpText;
    elements.possibleSituationDown.textContent = main.possibleSituationDownText;
}

function renderFields(fields, additional, xKeys = []) {
    for (const [key, el] of Object.entries(fields)) {
        const item = additional[key];
        const block = strategyBlocks[item.currentID];

        el.textContent = xKeys.includes(key) ? block.situation.replace("X", item.valueX) : block.situation;

        if (key !== "touching") el.style.backgroundColor = block.color;
    }
}

export function updateAnalyze(analyzeData) {
    for (const [key, els] of Object.entries(ELEMENTS)) {
        const data = analyzeData[key];

        if (key === "pattern") renderPatternSituation(els.situation, data.main);
        else if (els.situation) renderSituation(els.situation, data.main);

        renderFields(els.fields, data.additional, X_FIELDS[key]);

        if (els.block) els.block.style.display = data.statusVis;

        if (els.countFakeRetest) {
            els.countFakeRetest.textContent = data.additional.countFakeRetest.situationText;
        }
    }
}