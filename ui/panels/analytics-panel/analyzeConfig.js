// Спільний конфіг індикаторів: використовується розрахунком і обома UI-файлами

/* ------------------------------------------------------------------ */
/* INDICATORS                                                          */
/* Ключ        – ключ в analyzeData (він же префікс у результаті)      */
/* multipliers – { ключ в additional: назва поля у результаті }        */
/* Порядок множників = порядок у добутку і у формулі в UI.             */
/* ------------------------------------------------------------------ */
export const INDICATORS = {
    macd: {
        multipliers: {
            histogramTrend: "histogramTrendMultiplier",
            macdTrend: "macdTrendMultiplier",
            signalTrend: "signalTrendMultiplier",
            approachAndRemoval: "macdApproachAndRemovalMultiplier",
        },
    },
    ma: {
        multipliers: {
            m30Trend: "m30TrendMultiplier",
            m10Trend: "m10TrendMultiplier",
            approachAndRemoval: "maApproachAndRemovalMultiplier",
            m30TrendBacket: "m30TrendBacketMultiplier",
            m10TrendBacket: "m10TrendBacketMultiplier",
            touching: "maTouchingMultiplier",
        },
    },
    rsi: {
        multipliers: {
            trend: "rsiTrendMultiplier",
            zoneTightness: "rsiZoneTightnessMultiplier",
            noisy: "rsiNoisyMultiplier",
            amplitude: "rsiAmplitudeMultiplier",
            ritest: "rsiRitestMultiplier",
        },
    },
    wawe: {
        multipliers: {
            waweZone: "waweZoneMultiplier",
            waweTightness: "waweTightnessMultiplier",
            waweCountInCandle: "waweCountInCandleMultiplier",
            waweZigzag: "waweZigzagMultiplier",
            touching: "waweTouchingMultiplier",
        },
    },
    standartFibanachi: {
        multipliers: {
            touching: "standartFibanachiTouchingMultiplier",
        },
    },
    autoFibanachi: {
        multipliers: {
            touching: "autoFibanachiTouchingMultiplier",
        },
    },
    trigger: {
        multipliers: {
            touching: "triggerTouchingMultiplier",
        },
    },
    pivotPoint_1m: {
        multipliers: {
            zone: "pivotPoint_1mZoneMultiplier",
            magnetism: "pivotPoint_1mMagnetismMultiplier",
            touching: "pivotPoint_1mTouchingMultiplier",
        },
    },
    pivotPoint_5m: {
        multipliers: {
            zone: "pivotPoint_5mZoneMultiplier",
            magnetism: "pivotPoint_5mMagnetismMultiplier",
            touching: "pivotPoint_5mTouchingMultiplier",
        },
    },
    pivotPoint_15m: {
        multipliers: {
            zone: "pivotPoint_15mZoneMultiplier",
            magnetism: "pivotPoint_15mMagnetismMultiplier",
            touching: "pivotPoint_15mTouchingMultiplier",
        },
    },
    pivotPoint_30m: {
        multipliers: {
            zone: "pivotPoint_30mZoneMultiplier",
            magnetism: "pivotPoint_30mMagnetismMultiplier",
            touching: "pivotPoint_30mTouchingMultiplier",
        },
    },
    pivotPoint_1h: {
        multipliers: {
            zone: "pivotPoint_1hZoneMultiplier",
            magnetism: "pivotPoint_1hMagnetismMultiplier",
            touching: "pivotPoint_1hTouchingMultiplier",
        },
    },
    pivotPoint_4h: {
        multipliers: {
            zone: "pivotPoint_4hZoneMultiplier",
            magnetism: "pivotPoint_4hMagnetismMultiplier",
            touching: "pivotPoint_4hTouchingMultiplier",
        },
    },
    pivotPoint_1d: {
        multipliers: {
            zone: "pivotPoint_1dZoneMultiplier",
            magnetism: "pivotPoint_1dMagnetismMultiplier",
            touching: "pivotPoint_1dTouchingMultiplier",
        },
    },
};

/* ------------------------------------------------------------------ */
/* TREND_MULTIPLIERS                                                   */
/* Ключі в analyzeData.trend.additional. Їхні множники (Long/Short)    */
/* діють на загальну суму LONG/SHORT.                                  */
/* ------------------------------------------------------------------ */
export const TREND_MULTIPLIERS = [
    "zigZagTrend",
    "adxTrend",
    "adxState",
    "volumeZone",
    "volumeStack",
];

/* ------------------------------------------------------------------ */
/* GROUP_ORDER                                                         */
/* Що входить у загальну суму (trigger розраховується, але в суму не   */
/* входить). Порядок важливий лише для textLong / textShort.           */
/* ------------------------------------------------------------------ */
export const GROUP_ORDER = [
    "macd",
    "ma",
    "rsi",
    "wawe",
    "standartFibanachi",
    "pattern",
    "autoFibanachi",
    "pivotPoint_1m",
    "pivotPoint_5m",
    "pivotPoint_15m",
    "pivotPoint_30m",
    "pivotPoint_1h",
    "pivotPoint_4h",
    "pivotPoint_1d",
];