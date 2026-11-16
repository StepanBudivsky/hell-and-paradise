/* ------------------------------------------------------------------ */
/* Усі DOM-елементи аналізу в одному місці.                            */
/*                                                                     */
/* ELEMENTS[key] = {                                                   */
/*   situation  – 4 текстові поля ситуації (або null)                  */
/*   fields     – { ключ в additional: елемент блоку }                 */
/*   total      – елемент з формулою підсумкової ваги                  */
/*   button     – кнопка показу ваг і множників                        */
/*   excludeBtn – кнопка "Σ": з active блок виключено із суми (або null) */
/*   noMultBtn  – кнопка "×": з active множники блоку = 1 (або null)   */
/* }                                                                   */
/* Ключі збігаються з ключами в analyzeData та analyzeConfig.          */
/* ------------------------------------------------------------------ */

export const ELEMENTS = {
    // MACD
    macd: {
        situation: {
            previousSituation: document.querySelector("#macd-previous-situation"),
            currentSituation: document.querySelector("#macd-current-situation"),
            possibleSituationUp: document.querySelector("#macd-possible-situation-up"),
            possibleSituationDown: document.querySelector("#macd-possible-situation-down"),
        },
        fields: {
            histogramTrend: document.querySelector("#histogram-trend"),
            macdTrend: document.querySelector("#macd-trend"),
            signalTrend: document.querySelector("#signal-trend"),
            approachAndRemoval: document.querySelector("#macd-approach-and-removal"),
        },
        total: document.querySelector("#macd-total-weight"),
        button: document.querySelector("#macdMultiplierActBtn"),
        excludeBtn: document.querySelector("#macdExcludeBtn"),
        noMultBtn: document.querySelector("#macdNoMultBtn"),
    },

    // MA10 i MA30
    ma: {
        situation: {
            previousSituation: document.querySelector("#ma-previous-situation"),
            currentSituation: document.querySelector("#ma-current-situation"),
            possibleSituationUp: document.querySelector("#ma-possible-situation-up"),
            possibleSituationDown: document.querySelector("#ma-possible-situation-down"),
        },
        fields: {
            m30Trend: document.querySelector("#m30-trend"),
            m10Trend: document.querySelector("#m10-trend"),
            approachAndRemoval: document.querySelector("#ma-approach-and-removal"),
            m30TrendBacket: document.querySelector("#m30-trend-backet"),
            m10TrendBacket: document.querySelector("#m10-trend-backet"),
            touching: document.querySelector("#ma-touching"),
        },
        total: document.querySelector("#ma-total-weight"),
        button: document.querySelector("#maMultiplierActBtn"),
        excludeBtn: document.querySelector("#maExcludeBtn"),
        noMultBtn: document.querySelector("#maNoMultBtn"),
        countFakeRetest: document.querySelector("#ma-count-fake-retest-text"),
    },

    // RSI
    rsi: {
        situation: {
            previousSituation: document.querySelector("#rsi-previous-situation"),
            currentSituation: document.querySelector("#rsi-current-situation"),
            possibleSituationUp: document.querySelector("#rsi-possible-situation-up"),
            possibleSituationDown: document.querySelector("#rsi-possible-situation-down"),
        },
        fields: {
            trend: document.querySelector("#rsi-trend"),
            zoneTightness: document.querySelector("#rsi-zone-tightness"),
            noisy: document.querySelector("#rsi-noisy"),
            amplitude: document.querySelector("#rsi-amplitude"),
            ritest: document.querySelector("#rsi-ritest"),
        },
        total: document.querySelector("#rsi-total-weight"),
        button: document.querySelector("#rsiMultiplierActBtn"),
        excludeBtn: document.querySelector("#rsiExcludeBtn"),
        noMultBtn: document.querySelector("#rsiNoMultBtn"),
    },

    // WAWE
    wawe: {
        situation: {
            previousSituation: document.querySelector("#wave-previous-situation"),
            currentSituation: document.querySelector("#wave-current-situation"),
            possibleSituationUp: document.querySelector("#wave-possible-situation-up"),
            possibleSituationDown: document.querySelector("#wave-possible-situation-down"),
        },
        fields: {
            waweZone: document.querySelector("#wawe-zone"),
            waweTightness: document.querySelector("#wawe-tightness"),
            waweCountInCandle: document.querySelector("#wawe-count-in-candle"),
            waweZigzag: document.querySelector("#wawe-zigzag"),
            touching: document.querySelector("#wave-touching"),
        },
        total: document.querySelector("#wawe-total-weight"),
        button: document.querySelector("#waveMultiplierActBtn"),
        excludeBtn: document.querySelector("#waveExcludeBtn"),
        noMultBtn: document.querySelector("#waveNoMultBtn"),
    },

    // Fibanachi ручні
    standartFibanachi: {
        situation: {
            previousSituation: document.querySelector("#fibanachi-previous-situation"),
            currentSituation: document.querySelector("#fibanachi-current-situation"),
            possibleSituationUp: document.querySelector("#fibanachi-possible-situation-up"),
            possibleSituationDown: document.querySelector("#fibanachi-possible-situation-down"),
        },
        fields: {
            touching: document.querySelector("#fibanachi-touching"),
        },
        total: document.querySelector("#standartFibanachi-total-weight"),
        button: document.querySelector("#fibanachiMultiplierActBtn"),
        excludeBtn: document.querySelector("#fibanachiExcludeBtn"),
        noMultBtn: document.querySelector("#fibanachiNoMultBtn"),
    },

    // Pattern (множників немає, тільки ситуація і вага)
    pattern: {
        situation: {
            previousSituation: document.querySelector("#pattern-previous-situation"),
            currentSituation: document.querySelector("#pattern-current-situation"),
            possibleSituationUp: document.querySelector("#pattern-possible-situation-up"),
            possibleSituationDown: document.querySelector("#pattern-possible-situation-down"),
        },
        fields: {},
        total: document.querySelector("#pattern-total-weight"),
        button: document.querySelector("#patternMultiplierActBtn"),
        excludeBtn: document.querySelector("#patternExcludeBtn"),
        noMultBtn: null,
    },

    // Fibanachi автоматичні
    autoFibanachi: {
        situation: {
            previousSituation: document.querySelector("#autoFibanachi-previous-situation"),
            currentSituation: document.querySelector("#autoFibanachi-current-situation"),
            possibleSituationUp: document.querySelector("#autoFibanachi-possible-situation-up"),
            possibleSituationDown: document.querySelector("#autoFibanachi-possible-situation-down"),
        },
        fields: {
            touching: document.querySelector("#autoFibanachi-touching"),
        },
        total: document.querySelector("#autoFibanachi-total-weight"),
        button: document.querySelector("#autoFibanachiMultiplierActBtn"),
        excludeBtn: document.querySelector("#autoFibanachiExcludeBtn"),
        noMultBtn: document.querySelector("#autoFibanachiNoMultBtn"),
    },

    // Trigger
    trigger: {
        situation: {
            previousSituation: document.querySelector("#trigger-previous-situation"),
            currentSituation: document.querySelector("#trigger-current-situation"),
            possibleSituationUp: document.querySelector("#trigger-possible-situation-up"),
            possibleSituationDown: document.querySelector("#trigger-possible-situation-down"),
        },
        fields: {
            touching: document.querySelector("#trigger-touching"),
        },
        total: document.querySelector("#trigger-total-weight"),
        button: document.querySelector("#triggerMultiplierActBtn"),
        excludeBtn: document.querySelector("#triggerExcludeBtn"),
        noMultBtn: document.querySelector("#triggerNoMultBtn"),
    },

    // Trend (без основної ситуації і без ваги, тільки множники)
    trend: {
        situation: null,
        fields: {
            zigZagTrend: document.querySelector("#zig-zag-trend"),
            adxTrend: document.querySelector("#adx-trend"),
            adxState: document.querySelector("#adx-state"),
            volumeZone: document.querySelector("#volume-zone"),
            volumeStack: document.querySelector("#volume-stack"),
        },
        total: document.querySelector("#trend-total-multiplier"),
        button: document.querySelector("#trendMultiplierActBtn"),
        excludeBtn: null,
        noMultBtn: document.querySelector("#trendNoMultBtn"),
    },

    // Pivot Point 1m
    pivotPoint_1m: {
        situation: {
            previousSituation: document.querySelector("#pivot-point-1m-previous-situation"),
            currentSituation: document.querySelector("#pivot-point-1m-current-situation"),
            possibleSituationUp: document.querySelector("#pivot-point-1m-possible-situation-up"),
            possibleSituationDown: document.querySelector("#pivot-point-1m-possible-situation-down"),
        },
        fields: {
            zone: document.querySelector("#pivot-point-1m-zone"),
            magnetism: document.querySelector("#pivot-point-1m-magnetism"),
            touching: document.querySelector("#pivot-point-1m-touching"),
        },
        total: document.querySelector("#pivot-point-1m-total-weight"),
        button: document.querySelector("#pivotPoint1mMultiplierActBtn"),
        excludeBtn: document.querySelector("#pivotPoint1mExcludeBtn"),
        noMultBtn: document.querySelector("#pivotPoint1mNoMultBtn"),
        block: document.querySelector("#pivot-point-1m-block"),
    },

    // Pivot Point 5m
    pivotPoint_5m: {
        situation: {
            previousSituation: document.querySelector("#pivot-point-5m-previous-situation"),
            currentSituation: document.querySelector("#pivot-point-5m-current-situation"),
            possibleSituationUp: document.querySelector("#pivot-point-5m-possible-situation-up"),
            possibleSituationDown: document.querySelector("#pivot-point-5m-possible-situation-down"),
        },
        fields: {
            zone: document.querySelector("#pivot-point-5m-zone"),
            magnetism: document.querySelector("#pivot-point-5m-magnetism"),
            touching: document.querySelector("#pivot-point-5m-touching"),
        },
        total: document.querySelector("#pivot-point-5m-total-weight"),
        button: document.querySelector("#pivotPoint5mMultiplierActBtn"),
        excludeBtn: document.querySelector("#pivotPoint5mExcludeBtn"),
        noMultBtn: document.querySelector("#pivotPoint5mNoMultBtn"),
        block: document.querySelector("#pivot-point-5m-block"),
    },

    // Pivot Point 15m
    pivotPoint_15m: {
        situation: {
            previousSituation: document.querySelector("#pivot-point-15m-previous-situation"),
            currentSituation: document.querySelector("#pivot-point-15m-current-situation"),
            possibleSituationUp: document.querySelector("#pivot-point-15m-possible-situation-up"),
            possibleSituationDown: document.querySelector("#pivot-point-15m-possible-situation-down"),
        },
        fields: {
            zone: document.querySelector("#pivot-point-15m-zone"),
            magnetism: document.querySelector("#pivot-point-15m-magnetism"),
            touching: document.querySelector("#pivot-point-15m-touching"),
        },
        total: document.querySelector("#pivot-point-15m-total-weight"),
        button: document.querySelector("#pivotPoint15mMultiplierActBtn"),
        excludeBtn: document.querySelector("#pivotPoint15mExcludeBtn"),
        noMultBtn: document.querySelector("#pivotPoint15mNoMultBtn"),
        block: document.querySelector("#pivot-point-15m-block"),
    },

    // Pivot Point 30m
    pivotPoint_30m: {
        situation: {
            previousSituation: document.querySelector("#pivot-point-30m-previous-situation"),
            currentSituation: document.querySelector("#pivot-point-30m-current-situation"),
            possibleSituationUp: document.querySelector("#pivot-point-30m-possible-situation-up"),
            possibleSituationDown: document.querySelector("#pivot-point-30m-possible-situation-down"),
        },
        fields: {
            zone: document.querySelector("#pivot-point-30m-zone"),
            magnetism: document.querySelector("#pivot-point-30m-magnetism"),
            touching: document.querySelector("#pivot-point-30m-touching"),
        },
        total: document.querySelector("#pivot-point-30m-total-weight"),
        button: document.querySelector("#pivotPoint30mMultiplierActBtn"),
        excludeBtn: document.querySelector("#pivotPoint30mExcludeBtn"),
        noMultBtn: document.querySelector("#pivotPoint30mNoMultBtn"),
        block: document.querySelector("#pivot-point-30m-block"),
    },

    // Pivot Point 1h
    pivotPoint_1h: {
        situation: {
            previousSituation: document.querySelector("#pivot-point-1h-previous-situation"),
            currentSituation: document.querySelector("#pivot-point-1h-current-situation"),
            possibleSituationUp: document.querySelector("#pivot-point-1h-possible-situation-up"),
            possibleSituationDown: document.querySelector("#pivot-point-1h-possible-situation-down"),
        },
        fields: {
            zone: document.querySelector("#pivot-point-1h-zone"),
            magnetism: document.querySelector("#pivot-point-1h-magnetism"),
            touching: document.querySelector("#pivot-point-1h-touching"),
        },
        total: document.querySelector("#pivot-point-1h-total-weight"),
        button: document.querySelector("#pivotPoint1hMultiplierActBtn"),
        excludeBtn: document.querySelector("#pivotPoint1hExcludeBtn"),
        noMultBtn: document.querySelector("#pivotPoint1hNoMultBtn"),
        block: document.querySelector("#pivot-point-1h-block"),
    },

    // Pivot Point 4h
    pivotPoint_4h: {
        situation: {
            previousSituation: document.querySelector("#pivot-point-4h-previous-situation"),
            currentSituation: document.querySelector("#pivot-point-4h-current-situation"),
            possibleSituationUp: document.querySelector("#pivot-point-4h-possible-situation-up"),
            possibleSituationDown: document.querySelector("#pivot-point-4h-possible-situation-down"),
        },
        fields: {
            zone: document.querySelector("#pivot-point-4h-zone"),
            magnetism: document.querySelector("#pivot-point-4h-magnetism"),
            touching: document.querySelector("#pivot-point-4h-touching"),
        },
        total: document.querySelector("#pivot-point-4h-total-weight"),
        button: document.querySelector("#pivotPoint4hMultiplierActBtn"),
        excludeBtn: document.querySelector("#pivotPoint4hExcludeBtn"),
        noMultBtn: document.querySelector("#pivotPoint4hNoMultBtn"),
        block: document.querySelector("#pivot-point-4h-block"),
    },

    // Pivot Point 1d
    pivotPoint_1d: {
        situation: {
            previousSituation: document.querySelector("#pivot-point-1d-previous-situation"),
            currentSituation: document.querySelector("#pivot-point-1d-current-situation"),
            possibleSituationUp: document.querySelector("#pivot-point-1d-possible-situation-up"),
            possibleSituationDown: document.querySelector("#pivot-point-1d-possible-situation-down"),
        },
        fields: {
            zone: document.querySelector("#pivot-point-1d-zone"),
            magnetism: document.querySelector("#pivot-point-1d-magnetism"),
            touching: document.querySelector("#pivot-point-1d-touching"),
        },
        total: document.querySelector("#pivot-point-1d-total-weight"),
        button: document.querySelector("#pivotPoint1dMultiplierActBtn"),
        excludeBtn: document.querySelector("#pivotPoint1dExcludeBtn"),
        noMultBtn: document.querySelector("#pivotPoint1dNoMultBtn"),
        block: document.querySelector("#pivot-point-1d-block"),
    },
};