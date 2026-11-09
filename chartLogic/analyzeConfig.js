// Спільний конфіг індикаторів: використовується розрахунком і обома UI-файлами

/* ------------------------------------------------------------------ */
/* Конфіг індикаторів                                                  */
/* key         – ключ в analyzeData (він же префікс у результаті)      */
/* multipliers – { ключ в additional: назва поля у результаті }        */
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
    standartFibanachi: { multipliers: { touching: "standartFibanachiTouchingMultiplier" } },
    autoFibanachi: { multipliers: { touching: "autoFibanachiTouchingMultiplier" } },
    trigger: { multipliers: { touching: "triggerTouchingMultiplier" } },
};

export const PIVOT_TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"];
for (const tf of PIVOT_TIMEFRAMES) {
    const key = `pivotPoint_${tf}`;
    INDICATORS[key] = {
        multipliers: {
            zone: `${key}ZoneMultiplier`,
            magnetism: `${key}MagnetismMultiplier`,
            touching: `${key}TouchingMultiplier`,
        },
    };
}

// Множники тренда діють на загальну суму LONG/SHORT
export const TREND_MULTIPLIERS = {
    zigZagTrend: "zigZagTrend",
    adxTrend: "adxTrend",
    adxState: "adxState",
    volumeZone: "volumeZone",
    volumeStack: "volumeStack",
};

// Що входить у загальну суму (trigger розраховується, але в суму не входить).
// Порядок важливий лише для textLong / textShort.
export const GROUP_ORDER = [
    "macd", "ma", "rsi", "wawe", "standartFibanachi", "pattern", "autoFibanachi",
    ...PIVOT_TIMEFRAMES.map(tf => `pivotPoint_${tf}`),
];