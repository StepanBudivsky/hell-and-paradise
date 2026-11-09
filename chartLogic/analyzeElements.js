import { PIVOT_TIMEFRAMES } from "./analyzeConfig.js";

/* ------------------------------------------------------------------ */
/* Усі DOM-елементи аналізу в одному місці.                            */
/*                                                                     */
/* ELEMENTS[key] = {                                                   */
/*   situation – 4 текстові поля ситуації (або null)                   */
/*   fields    – { ключ в additional: елемент блоку }                  */
/*   total     – елемент з формулою підсумкової ваги                   */
/*   button    – кнопка показу ваг і множників                         */
/*   excludeBtn – кнопка "Σ": з active блок виключено із суми, або null */
/*   noMultBtn  – кнопка "×": з active множники блоку = 1, або null    */
/* }                                                                   */
/* Ключі збігаються з ключами в analyzeData та analyzeConfig.          */
/* ------------------------------------------------------------------ */
const $ = id => document.getElementById(id);

// <prefix>-previous-situation, <prefix>-current-situation, ...
const situation = prefix => ({
    previousSituation: $(`${prefix}-previous-situation`),
    currentSituation: $(`${prefix}-current-situation`),
    possibleSituationUp: $(`${prefix}-possible-situation-up`),
    possibleSituationDown: $(`${prefix}-possible-situation-down`),
});

// Кнопки виключення беруться за префіксом кнопки показу ваг:
// macdMultiplierActBtn -> macdExcludeBtn (Σ) і macdNoMultBtn (×).
// Якщо такої кнопки в розмітці немає (pattern без ×, trend без Σ), буде null.
const btnPrefix = button => button.replace("MultiplierActBtn", "");

const entry = ({ prefix = null, fields = {}, total, button, ...extra }) => ({
    situation: prefix ? situation(prefix) : null,
    fields: Object.fromEntries(Object.entries(fields).map(([key, id]) => [key, $(id)])),
    total: $(total),
    button: $(button),
    excludeBtn: $(`${btnPrefix(button)}ExcludeBtn`),
    noMultBtn: $(`${btnPrefix(button)}NoMultBtn`),
    ...extra,
});

export const ELEMENTS = {
    macd: entry({
        prefix: "macd",
        fields: {
            histogramTrend: "histogram-trend",
            macdTrend: "macd-trend",
            signalTrend: "signal-trend",
            approachAndRemoval: "macd-approach-and-removal",
        },
        total: "macd-total-weight",
        button: "macdMultiplierActBtn",
    }),

    ma: entry({
        prefix: "ma",
        fields: {
            m30Trend: "m30-trend",
            m10Trend: "m10-trend",
            approachAndRemoval: "ma-approach-and-removal",
            m30TrendBacket: "m30-trend-backet",
            m10TrendBacket: "m10-trend-backet",
            touching: "ma-touching",
        },
        total: "ma-total-weight",
        button: "maMultiplierActBtn",
        countFakeRetest: $("ma-count-fake-retest-text"),
    }),

    rsi: entry({
        prefix: "rsi",
        fields: {
            trend: "rsi-trend",
            zoneTightness: "rsi-zone-tightness",
            noisy: "rsi-noisy",
            amplitude: "rsi-amplitude",
            ritest: "rsi-ritest",
        },
        total: "rsi-total-weight",
        button: "rsiMultiplierActBtn",
    }),

    wawe: entry({
        prefix: "wave",
        fields: {
            waweZone: "wawe-zone",
            waweTightness: "wawe-tightness",
            waweCountInCandle: "wawe-count-in-candle",
            waweZigzag: "wawe-zigzag",
            touching: "wave-touching",
        },
        total: "wawe-total-weight",
        button: "waveMultiplierActBtn",
    }),

    standartFibanachi: entry({
        prefix: "fibanachi",
        fields: { touching: "fibanachi-touching" },
        total: "standartFibanachi-total-weight",
        button: "fibanachiMultiplierActBtn",
    }),

    // Pattern: лише ситуація і вага, додаткових блоків немає
    pattern: entry({
        prefix: "pattern",
        total: "pattern-total-weight",
        button: "patternMultiplierActBtn",
    }),

    autoFibanachi: entry({
        prefix: "autoFibanachi",
        fields: { touching: "autoFibanachi-touching" },
        total: "autoFibanachi-total-weight",
        button: "autoFibanachiMultiplierActBtn",
    }),

    trigger: entry({
        prefix: "trigger",
        fields: { touching: "trigger-touching" },
        total: "trigger-total-weight",
        button: "triggerMultiplierActBtn",
    }),

    // Trend: без основної ситуації, тільки додаткові блоки
    trend: entry({
        fields: {
            zigZagTrend: "zig-zag-trend",
            adxTrend: "adx-trend",
            adxState: "adx-state",
            volumeZone: "volume-zone",
            volumeStack: "volume-stack",
        },
        total: "trend-total-multiplier",
        button: "trendMultiplierActBtn",
    }),
};

for (const tf of PIVOT_TIMEFRAMES) {
    const prefix = `pivot-point-${tf}`;

    ELEMENTS[`pivotPoint_${tf}`] = entry({
        prefix,
        fields: {
            zone: `${prefix}-zone`,
            magnetism: `${prefix}-magnetism`,
            touching: `${prefix}-touching`,
        },
        total: `${prefix}-total-weight`,
        button: `pivotPoint${tf}MultiplierActBtn`,
        block: $(`${prefix}-block`),
    });
}