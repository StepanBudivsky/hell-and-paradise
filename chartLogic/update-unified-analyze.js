import { allScenarios, strategyBlocks } from "../settingsData/all-scenarios.js";

function getMultiplier(status, multiplierLong, multiplierShort) {
    return status ? multiplierLong : multiplierShort;
}

function getIndicatorMetrics(indicatorData, interval) {
  const extractId = item => (typeof item === 'object' && item !== null ? item.id : item);

  const currentScenarios = (indicatorData.main.currentIDs || [])
    .map(item => allScenarios[extractId(item)])
    .filter(Boolean);

  // Підсумовуємо вагу (weight) для вказаного інтервалу
  const weight = currentScenarios.reduce((sum, s) => {
    return sum + (s.weight?.[interval] || 0);
  }, 0);

  // Підсумовуємо direction або визначаємо статус
  const totalDirection = currentScenarios.reduce((sum, s) => sum + (s.direction || 0), 0);
  const status = totalDirection > 0;

  return { weight, status };
}

export function updateUnifiedAnalyze(analyzeData, interval, dataResult) {
    // MACD
    let { weight: macdWeight, status: macdStatus } = getIndicatorMetrics(analyzeData.macd, interval);
    // let macdWeight = allScenarios[analyzeData.macd.main.currentID].weight[interval];
    // let macdStatus = allScenarios[analyzeData.macd.main.currentID].direction > 0;

    let histogramTrendMultiplier = getMultiplier(
        macdStatus, 
        strategyBlocks[analyzeData.macd.additional.histogramTrend.currentID].multiplierLong, 
        strategyBlocks[analyzeData.macd.additional.histogramTrend.currentID].multiplierShort
    );

    let macdTrendMultiplier = getMultiplier(
        macdStatus, 
        strategyBlocks[analyzeData.macd.additional.macdTrend.currentID].multiplierLong, 
        strategyBlocks[analyzeData.macd.additional.macdTrend.currentID].multiplierShort
    );

    let signalTrendMultiplier = getMultiplier(
        macdStatus, 
        strategyBlocks[analyzeData.macd.additional.signalTrend.currentID].multiplierLong, 
        strategyBlocks[analyzeData.macd.additional.signalTrend.currentID].multiplierShort
    );

    let macdApproachAndRemovalMultiplier = getMultiplier(
        macdStatus, 
        strategyBlocks[analyzeData.macd.additional.approachAndRemoval.currentID].multiplierLong, 
        strategyBlocks[analyzeData.macd.additional.approachAndRemoval.currentID].multiplierShort
    );

    let macdTotalWeight = macdWeight * (histogramTrendMultiplier * macdTrendMultiplier * signalTrendMultiplier * macdApproachAndRemovalMultiplier);

    // MA
    let { weight: maWeight, status: maStatus } = getIndicatorMetrics(analyzeData.ma, interval);

    // let maWeight = allScenarios[analyzeData.ma.main.currentID].weight[interval];
    // let maStatus = allScenarios[analyzeData.ma.main.currentID].direction > 0;

    let m30TrendMultiplier = getMultiplier(
        maStatus, 
        strategyBlocks[analyzeData.ma.additional.m30Trend.currentID].multiplierLong, 
        strategyBlocks[analyzeData.ma.additional.m30Trend.currentID].multiplierShort
    );

    let m10TrendMultiplier = getMultiplier(
        maStatus, 
        strategyBlocks[analyzeData.ma.additional.m10Trend.currentID].multiplierLong, 
        strategyBlocks[analyzeData.ma.additional.m10Trend.currentID].multiplierShort
    );
    
    let maApproachAndRemovalMultiplier = getMultiplier(
        maStatus, 
        strategyBlocks[analyzeData.ma.additional.approachAndRemoval.currentID].multiplierLong, 
        strategyBlocks[analyzeData.ma.additional.approachAndRemoval.currentID].multiplierShort
    );
    
    let m30TrendBacketMultiplier = getMultiplier(
        maStatus, 
        strategyBlocks[analyzeData.ma.additional.m30TrendBacket.currentID].multiplierLong, 
        strategyBlocks[analyzeData.ma.additional.m30TrendBacket.currentID].multiplierShort
    );
    
    let m10TrendBacketMultiplier = getMultiplier(
        maStatus, 
        strategyBlocks[analyzeData.ma.additional.m10TrendBacket.currentID].multiplierLong, 
        strategyBlocks[analyzeData.ma.additional.m10TrendBacket.currentID].multiplierShort
    );

    let maTouchingMultiplier = getMultiplier(
        maStatus, 
        strategyBlocks[analyzeData.ma.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.ma.additional.touching.currentID].multiplierShort
    );
    
    let maTotalWeight = maWeight * (m30TrendMultiplier * m10TrendMultiplier * maApproachAndRemovalMultiplier * m30TrendBacketMultiplier * m10TrendBacketMultiplier * maTouchingMultiplier);

    // RSI
    let { weight: rsiWeight, status: rsiStatus } = getIndicatorMetrics(analyzeData.rsi, interval);

    // let rsiWeight = allScenarios[analyzeData.rsi.main.currentID].weight[interval];
    // let rsiStatus = allScenarios[analyzeData.rsi.main.currentID].direction > 0;

    let rsiTrendMultiplier = getMultiplier(
        rsiStatus, 
        strategyBlocks[analyzeData.rsi.additional.trend.currentID].multiplierLong, 
        strategyBlocks[analyzeData.rsi.additional.trend.currentID].multiplierShort
    );

    let rsiZoneTightnessMultiplier = getMultiplier(
        rsiStatus, 
        strategyBlocks[analyzeData.rsi.additional.zoneTightness.currentID].multiplierLong, 
        strategyBlocks[analyzeData.rsi.additional.zoneTightness.currentID].multiplierShort
    );

    let rsiNoisyMultiplier = getMultiplier(
        rsiStatus, 
        strategyBlocks[analyzeData.rsi.additional.noisy.currentID].multiplierLong, 
        strategyBlocks[analyzeData.rsi.additional.noisy.currentID].multiplierShort
    );

    let rsiAmplitudeMultiplier = getMultiplier(
        rsiStatus, 
        strategyBlocks[analyzeData.rsi.additional.amplitude.currentID].multiplierLong, 
        strategyBlocks[analyzeData.rsi.additional.amplitude.currentID].multiplierShort
    );

    let rsiRitestMultiplier = getMultiplier(
        rsiStatus, 
        strategyBlocks[analyzeData.rsi.additional.ritest.currentID].multiplierLong, 
        strategyBlocks[analyzeData.rsi.additional.ritest.currentID].multiplierShort
    );

    let rsiTotalWeight = rsiWeight * (rsiTrendMultiplier * rsiZoneTightnessMultiplier * rsiNoisyMultiplier * rsiAmplitudeMultiplier * rsiRitestMultiplier);

    // WAWE
    let { weight: waweWeight, status: waweStatus } = getIndicatorMetrics(analyzeData.wawe, interval);

    // let waweWeight = allScenarios[analyzeData.wawe.main.currentID].weight[interval];
    // let waweStatus = allScenarios[analyzeData.wawe.main.currentID].direction > 0;

    let waweZoneMultiplier = getMultiplier(
        waweStatus, 
        strategyBlocks[analyzeData.wawe.additional.waweZone.currentID].multiplierLong, 
        strategyBlocks[analyzeData.wawe.additional.waweZone.currentID].multiplierShort
    );
    
    let waweTightnessMultiplier = getMultiplier(
        waweStatus, 
        strategyBlocks[analyzeData.wawe.additional.waweTightness.currentID].multiplierLong, 
        strategyBlocks[analyzeData.wawe.additional.waweTightness.currentID].multiplierShort
    );
    
    let waweCountInCandleMultiplier = getMultiplier(
        waweStatus, 
        strategyBlocks[analyzeData.wawe.additional.waweCountInCandle.currentID].multiplierLong, 
        strategyBlocks[analyzeData.wawe.additional.waweCountInCandle.currentID].multiplierShort
    );
    
    let waweZigzagMultiplier = getMultiplier(
        waweStatus, 
        strategyBlocks[analyzeData.wawe.additional.waweZigzag.currentID].multiplierLong, 
        strategyBlocks[analyzeData.wawe.additional.waweZigzag.currentID].multiplierShort
    );
    
    let waweTouchingMultiplier = getMultiplier(
        waweStatus, 
        strategyBlocks[analyzeData.wawe.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.wawe.additional.touching.currentID].multiplierShort
    );
    
    let waweTotalWeight = waweWeight * (waweZoneMultiplier * waweTightnessMultiplier * waweCountInCandleMultiplier * waweZigzagMultiplier * waweTouchingMultiplier);

    // Standart Fibanachi
    let { weight: standartFibanachiWeight, status: standartFibanachiStatus } = getIndicatorMetrics(analyzeData.standartFibanachi, interval);

    // let standartFibanachiWeight = allScenarios[analyzeData.standartFibanachi.main.currentID].weight[interval];
    // let standartFibanachiStatus = allScenarios[analyzeData.standartFibanachi.main.currentID].direction > 0;

    let standartFibanachiTouchingMultiplier = getMultiplier(
        standartFibanachiStatus, 
        strategyBlocks[analyzeData.standartFibanachi.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.standartFibanachi.additional.touching.currentID].multiplierShort
    );

    let standartFibanachiTotalWeight = standartFibanachiWeight * (standartFibanachiTouchingMultiplier);

    // Pattern
    // let patternWeight = analyzeData.pattern.main.weight[interval];
    let patternWeight = allScenarios[analyzeData.pattern.main.tweezersID].weight[interval] + allScenarios[analyzeData.pattern.main.engulfingsID].weight[interval];
    let patternStatus = analyzeData.pattern.main.weight[interval] > 0;

    // Trend
    let zigZagTrendMultiplierLong = strategyBlocks[analyzeData.trend.additional.zigZagTrend.currentID].multiplierLong;
    let zigZagTrendMultiplierShort = strategyBlocks[analyzeData.trend.additional.zigZagTrend.currentID].multiplierShort;

    let adxTrendMultiplierLong = strategyBlocks[analyzeData.trend.additional.adxTrend.currentID].multiplierLong;
    let adxTrendMultiplierShort = strategyBlocks[analyzeData.trend.additional.adxTrend.currentID].multiplierShort; 

    let adxStateMultiplierLong = strategyBlocks[analyzeData.trend.additional.adxState.currentID].multiplierLong;
    let adxStateMultiplierShort = strategyBlocks[analyzeData.trend.additional.adxState.currentID].multiplierShort; 

    let volumeZoneMultiplierLong = strategyBlocks[analyzeData.trend.additional.volumeZone.currentID].multiplierLong;
    let volumeZoneMultiplierShort = strategyBlocks[analyzeData.trend.additional.volumeZone.currentID].multiplierShort;

    let volumeStackMultiplierLong = strategyBlocks[analyzeData.trend.additional.volumeStack.currentID].multiplierLong;
    let volumeStackMultiplierShort = strategyBlocks[analyzeData.trend.additional.volumeStack.currentID].multiplierShort;  

    let trendTotalMultiplierLong = zigZagTrendMultiplierLong * adxTrendMultiplierLong * adxStateMultiplierLong * volumeZoneMultiplierLong * volumeStackMultiplierLong;
    let trendTotalMultiplierShort = zigZagTrendMultiplierShort * adxTrendMultiplierShort * adxStateMultiplierShort * volumeZoneMultiplierShort * volumeStackMultiplierShort;

    // Auto Fibanachi
    let { weight: autoFibanachiWeight, status: autoFibanachiStatus } = getIndicatorMetrics(analyzeData.autoFibanachi, interval);

    // let autoFibanachiWeight = allScenarios[analyzeData.autoFibanachi.main.currentID].weight[interval];
    // let autoFibanachiStatus = allScenarios[analyzeData.autoFibanachi.main.currentID].direction > 0;

    let autoFibanachiTouchingMultiplier = getMultiplier(
        autoFibanachiStatus, 
        strategyBlocks[analyzeData.autoFibanachi.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.autoFibanachi.additional.touching.currentID].multiplierShort
    );

    let autoFibanachiTotalWeight = autoFibanachiWeight * (autoFibanachiTouchingMultiplier);

    // Trigger
    let { weight: triggerWeight, status: triggerStatus } = getIndicatorMetrics(analyzeData.trigger, interval);

    // let triggerWeight = allScenarios[analyzeData.trigger.main.currentID].weight[interval];
    // let triggerStatus = allScenarios[analyzeData.trigger.main.currentID].direction > 0;

    let triggerTouchingMultiplier = getMultiplier(
        triggerStatus, 
        strategyBlocks[analyzeData.trigger.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.trigger.additional.touching.currentID].multiplierShort
    );

    let triggerTotalWeight = triggerWeight * (triggerTouchingMultiplier);

    // Pivot Point 1m 
    let { weight: pivotPoint_1mWeight, status: pivotPoint_1mStatus } = getIndicatorMetrics(analyzeData.pivotPoint_1m, interval);

    // let pivotPoint_1mWeight = allScenarios[analyzeData.pivotPoint_1m.main.currentID].weight[interval];
    // let pivotPoint_1mStatus = allScenarios[analyzeData.pivotPoint_1m.main.currentID].direction > 0;

    let pivotPoint_1mZoneMultiplier = getMultiplier(
        pivotPoint_1mStatus, 
        strategyBlocks[analyzeData.pivotPoint_1m.additional.zone.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_1m.additional.zone.currentID].multiplierShort
    );
    
    let pivotPoint_1mMagnetismMultiplier = getMultiplier(
        pivotPoint_1mStatus, 
        strategyBlocks[analyzeData.pivotPoint_1m.additional.magnetism.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_1m.additional.magnetism.currentID].multiplierShort
    );
    
    let pivotPoint_1mTouchingMultiplier = getMultiplier(
        pivotPoint_1mStatus, 
        strategyBlocks[analyzeData.pivotPoint_1m.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_1m.additional.touching.currentID].multiplierShort
    );
    
    let pivotPoint_1mTotalWeight = pivotPoint_1mWeight * (pivotPoint_1mZoneMultiplier * pivotPoint_1mMagnetismMultiplier * pivotPoint_1mTouchingMultiplier);

    // Pivot Point 5m 
    let { weight: pivotPoint_5mWeight, status: pivotPoint_5mStatus } = getIndicatorMetrics(analyzeData.pivotPoint_5m, interval);

    // let pivotPoint_5mWeight = allScenarios[analyzeData.pivotPoint_5m.main.currentID].weight[interval];
    // let pivotPoint_5mStatus = allScenarios[analyzeData.pivotPoint_5m.main.currentID].direction > 0;

    let pivotPoint_5mZoneMultiplier = getMultiplier(
        pivotPoint_5mStatus, 
        strategyBlocks[analyzeData.pivotPoint_5m.additional.zone.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_5m.additional.zone.currentID].multiplierShort
    );
    
    let pivotPoint_5mMagnetismMultiplier = getMultiplier(
        pivotPoint_5mStatus, 
        strategyBlocks[analyzeData.pivotPoint_5m.additional.magnetism.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_5m.additional.magnetism.currentID].multiplierShort
    );
    
    let pivotPoint_5mTouchingMultiplier = getMultiplier(
        pivotPoint_5mStatus, 
        strategyBlocks[analyzeData.pivotPoint_5m.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_5m.additional.touching.currentID].multiplierShort
    );
    
    let pivotPoint_5mTotalWeight = pivotPoint_5mWeight * (pivotPoint_5mZoneMultiplier * pivotPoint_5mMagnetismMultiplier * pivotPoint_5mTouchingMultiplier);

    // Pivot Point 15m 
    let { weight: pivotPoint_15mWeight, status: pivotPoint_15mStatus } = getIndicatorMetrics(analyzeData.pivotPoint_15m, interval);

    // let pivotPoint_15mWeight = allScenarios[analyzeData.pivotPoint_15m.main.currentID].weight[interval];
    // let pivotPoint_15mStatus = allScenarios[analyzeData.pivotPoint_15m.main.currentID].direction > 0;

    let pivotPoint_15mZoneMultiplier = getMultiplier(
        pivotPoint_15mStatus, 
        strategyBlocks[analyzeData.pivotPoint_15m.additional.zone.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_15m.additional.zone.currentID].multiplierShort
    );
    
    let pivotPoint_15mMagnetismMultiplier = getMultiplier(
        pivotPoint_15mStatus, 
        strategyBlocks[analyzeData.pivotPoint_15m.additional.magnetism.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_15m.additional.magnetism.currentID].multiplierShort
    );
    
    let pivotPoint_15mTouchingMultiplier = getMultiplier(
        pivotPoint_15mStatus, 
        strategyBlocks[analyzeData.pivotPoint_15m.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_15m.additional.touching.currentID].multiplierShort
    );
    
    let pivotPoint_15mTotalWeight = pivotPoint_15mWeight * (pivotPoint_15mZoneMultiplier * pivotPoint_15mMagnetismMultiplier * pivotPoint_15mTouchingMultiplier);

    // Pivot Point 30m 
    let { weight: pivotPoint_30mWeight, status: pivotPoint_30mStatus } = getIndicatorMetrics(analyzeData.pivotPoint_30m, interval);

    // let pivotPoint_30mWeight = allScenarios[analyzeData.pivotPoint_30m.main.currentID].weight[interval];
    // let pivotPoint_30mStatus = allScenarios[analyzeData.pivotPoint_30m.main.currentID].direction > 0;

    let pivotPoint_30mZoneMultiplier = getMultiplier(
        pivotPoint_30mStatus, 
        strategyBlocks[analyzeData.pivotPoint_30m.additional.zone.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_30m.additional.zone.currentID].multiplierShort
    );
    
    let pivotPoint_30mMagnetismMultiplier = getMultiplier(
        pivotPoint_30mStatus, 
        strategyBlocks[analyzeData.pivotPoint_30m.additional.magnetism.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_30m.additional.magnetism.currentID].multiplierShort
    );
    
    let pivotPoint_30mTouchingMultiplier = getMultiplier(
        pivotPoint_30mStatus, 
        strategyBlocks[analyzeData.pivotPoint_30m.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_30m.additional.touching.currentID].multiplierShort
    );
    
    let pivotPoint_30mTotalWeight = pivotPoint_30mWeight * (pivotPoint_30mZoneMultiplier * pivotPoint_30mMagnetismMultiplier * pivotPoint_30mTouchingMultiplier);

    // Pivot Point 1h
    let { weight: pivotPoint_1hWeight, status: pivotPoint_1hStatus } = getIndicatorMetrics(analyzeData.pivotPoint_1h, interval);
    
    // let pivotPoint_1hWeight = allScenarios[analyzeData.pivotPoint_1h.main.currentID].weight[interval];
    // let pivotPoint_1hStatus = allScenarios[analyzeData.pivotPoint_1h.main.currentID].direction > 0;

    let pivotPoint_1hZoneMultiplier = getMultiplier(
        pivotPoint_1hStatus, 
        strategyBlocks[analyzeData.pivotPoint_1h.additional.zone.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_1h.additional.zone.currentID].multiplierShort
    );
    
    let pivotPoint_1hMagnetismMultiplier = getMultiplier(
        pivotPoint_1hStatus, 
        strategyBlocks[analyzeData.pivotPoint_1h.additional.magnetism.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_1h.additional.magnetism.currentID].multiplierShort
    );
    
    let pivotPoint_1hTouchingMultiplier = getMultiplier(
        pivotPoint_1hStatus, 
        strategyBlocks[analyzeData.pivotPoint_1h.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_1h.additional.touching.currentID].multiplierShort
    );
    
    let pivotPoint_1hTotalWeight = pivotPoint_1hWeight * (pivotPoint_1hZoneMultiplier * pivotPoint_1hMagnetismMultiplier * pivotPoint_1hTouchingMultiplier);

    // Pivot Point 4h
    let { weight: pivotPoint_4hWeight, status: pivotPoint_4hStatus } = getIndicatorMetrics(analyzeData.pivotPoint_4h, interval);
    
    // let pivotPoint_4hWeight = allScenarios[analyzeData.pivotPoint_4h.main.currentID].weight[interval];
    // let pivotPoint_4hStatus = allScenarios[analyzeData.pivotPoint_4h.main.currentID].direction > 0;

    let pivotPoint_4hZoneMultiplier = getMultiplier(
        pivotPoint_4hStatus, 
        strategyBlocks[analyzeData.pivotPoint_4h.additional.zone.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_4h.additional.zone.currentID].multiplierShort
    );
    
    let pivotPoint_4hMagnetismMultiplier = getMultiplier(
        pivotPoint_4hStatus, 
        strategyBlocks[analyzeData.pivotPoint_4h.additional.magnetism.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_4h.additional.magnetism.currentID].multiplierShort
    );
    
    let pivotPoint_4hTouchingMultiplier = getMultiplier(
        pivotPoint_4hStatus, 
        strategyBlocks[analyzeData.pivotPoint_4h.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_4h.additional.touching.currentID].multiplierShort
    );
    
    let pivotPoint_4hTotalWeight = pivotPoint_4hWeight * (pivotPoint_4hZoneMultiplier * pivotPoint_4hMagnetismMultiplier * pivotPoint_4hTouchingMultiplier);

    // Pivot Point 1d 
    let { weight: pivotPoint_1dWeight, status: pivotPoint_1dStatus } = getIndicatorMetrics(analyzeData.pivotPoint_1d, interval);

    // let pivotPoint_1dWeight = allScenarios[analyzeData.pivotPoint_1d.main.currentID].weight[interval];
    // let pivotPoint_1dStatus = allScenarios[analyzeData.pivotPoint_1d.main.currentID].direction > 0;

    let pivotPoint_1dZoneMultiplier = getMultiplier(
        pivotPoint_1dStatus, 
        strategyBlocks[analyzeData.pivotPoint_1d.additional.zone.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_1d.additional.zone.currentID].multiplierShort
    );
    
    let pivotPoint_1dMagnetismMultiplier = getMultiplier(
        pivotPoint_1dStatus, 
        strategyBlocks[analyzeData.pivotPoint_1d.additional.magnetism.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_1d.additional.magnetism.currentID].multiplierShort
    );
    
    let pivotPoint_1dTouchingMultiplier = getMultiplier(
        pivotPoint_1dStatus, 
        strategyBlocks[analyzeData.pivotPoint_1d.additional.touching.currentID].multiplierLong, 
        strategyBlocks[analyzeData.pivotPoint_1d.additional.touching.currentID].multiplierShort
    );
    
    let pivotPoint_1dTotalWeight = pivotPoint_1dWeight * (pivotPoint_1dZoneMultiplier * pivotPoint_1dMagnetismMultiplier * pivotPoint_1dTouchingMultiplier);

    // let groupAllTotalWeight = [macdTotalWeight, maTotalWeight, rsiTotalWeight, waweTotalWeight, 
    //     standartFibanachiTotalWeight, patternWeight, autoFibanachiTotalWeight, triggerTotalWeight,
    //     pivotPoint_1mTotalWeight, pivotPoint_5mTotalWeight, pivotPoint_15mTotalWeight, pivotPoint_30mTotalWeight, 
    //     pivotPoint_1hTotalWeight, pivotPoint_4hTotalWeight, pivotPoint_1dTotalWeight];

    let groupAllTotalWeight = [macdTotalWeight, maTotalWeight, rsiTotalWeight, waweTotalWeight, 
        standartFibanachiTotalWeight, patternWeight, autoFibanachiTotalWeight,
        pivotPoint_1mTotalWeight, pivotPoint_5mTotalWeight, pivotPoint_15mTotalWeight, pivotPoint_30mTotalWeight, 
        pivotPoint_1hTotalWeight, pivotPoint_4hTotalWeight, pivotPoint_1dTotalWeight];

    // 1. Початковий розподіл по групах
    let longSum = 0;
    let shortSum = 0;

    let textLong = "";
    let textShort = "";

    groupAllTotalWeight.forEach(weight => {
        if (weight >= 0) {
            longSum += weight;
            textLong += weight ? ` ${weight.toFixed(2)} *` : ""; 
        } else {
            shortSum += weight;
            textShort += weight ? ` ${weight.toFixed(2)} *` : ""; 
        }
    });

    // 2. Застосування твоїх мультиплікаторів
    longSum = longSum * trendTotalMultiplierLong;
    textLong += ` ${trendTotalMultiplierLong.toFixed(2)}`;
    shortSum = shortSum * trendTotalMultiplierShort;
    textShort += ` ${trendTotalMultiplierShort.toFixed(2)}`;

    // 3. Загальна вага по модулю
    let absoluteTotal = Math.abs(longSum) + Math.abs(shortSum);

    // 4. Твоя логіка відсотків LONG/SHORT (частка від загального)
    let longPercent = 0;
    let shortPercent = 0;
    if (absoluteTotal > 0) {
        longPercent = (Math.abs(longSum) / absoluteTotal) * 100;
        shortPercent = (Math.abs(shortSum) / absoluteTotal) * 100;
    }

    // 5. Розрахунок Впевненості (Confidence) [cite: 9, 19]
    let side = Math.abs(longSum) >= Math.abs(shortSum) ? "LONG" : "SHORT";
    let confidence = 0;
    if (absoluteTotal > 0) {
        // Формула: |сила_лонг - сила_шорт| / (сума) [cite: 19]
        let difference = Math.abs(Math.abs(longSum) - Math.abs(shortSum));
        confidence = (difference / absoluteTotal) * 100;
    }

    // 6. Визначення дії за твоєю таблицею 
    let action = "";
    if (confidence < 20) {
        action = "Не входити (флет/шуми)"; 
    } else if (confidence <= 40) {
        action = "Входити з малим об'ємом"; 
    } else if (confidence <= 60) {
        action = "Входити з середнім об'ємом"; 
    } else if (confidence <= 80) {
        action = "Входити з великим об'ємом"; 
    } else {
        action = "Входити з максимальним об'ємом"; 
    }
    
    let totalSum = longSum + shortSum;
    let totalSumStatus = Math.abs(totalSum) < 30 ? "Входити неможна (зона -30 до +30)" : ""; 

    dataResult.longSum = longSum;
    dataResult.longPercent = longPercent;
    dataResult.shortSum = shortSum;
    dataResult.shortPercent = shortPercent;
    dataResult.confidence = confidence;
    dataResult.side = side;

    return {
    data: {
        // macd
        macdWeight, macdStatus, histogramTrendMultiplier, macdTrendMultiplier,
        signalTrendMultiplier, macdApproachAndRemovalMultiplier, macdTotalWeight,
        // ma
        maWeight, maStatus, m30TrendMultiplier, m10TrendMultiplier, maApproachAndRemovalMultiplier,
        m30TrendBacketMultiplier, m10TrendBacketMultiplier, maTouchingMultiplier, maTotalWeight,
        // rsi
        rsiWeight, rsiStatus, rsiTrendMultiplier, rsiZoneTightnessMultiplier, rsiNoisyMultiplier,
        rsiAmplitudeMultiplier, rsiRitestMultiplier, rsiTotalWeight,
        // wawe
        waweWeight, waweStatus, waweZoneMultiplier, waweTightnessMultiplier, waweCountInCandleMultiplier, 
        waweZigzagMultiplier, waweTouchingMultiplier, waweTotalWeight,
        // standartFibanachi
        standartFibanachiWeight, standartFibanachiStatus, standartFibanachiTouchingMultiplier, 
        standartFibanachiTotalWeight,
        // pattern
        patternWeight, patternStatus,
        // trend
        zigZagTrendMultiplierLong, zigZagTrendMultiplierShort, adxTrendMultiplierLong, adxTrendMultiplierShort,
        adxStateMultiplierLong, adxStateMultiplierShort, volumeZoneMultiplierLong, volumeZoneMultiplierShort, 
        volumeStackMultiplierLong, volumeStackMultiplierShort, trendTotalMultiplierLong, trendTotalMultiplierShort,
        // autoFibanachi
        autoFibanachiWeight, autoFibanachiStatus, autoFibanachiTouchingMultiplier, autoFibanachiTotalWeight,
        // trigger
        triggerWeight, triggerStatus, triggerTouchingMultiplier, triggerTotalWeight,
        // pp1m
        pivotPoint_1mWeight, pivotPoint_1mStatus, pivotPoint_1mZoneMultiplier, pivotPoint_1mMagnetismMultiplier,
        pivotPoint_1mTouchingMultiplier, pivotPoint_1mTotalWeight,
        // pp5m
        pivotPoint_5mWeight, pivotPoint_5mStatus, pivotPoint_5mZoneMultiplier, pivotPoint_5mMagnetismMultiplier,
        pivotPoint_5mTouchingMultiplier, pivotPoint_5mTotalWeight,
        // pp15m
        pivotPoint_15mWeight, pivotPoint_15mStatus, pivotPoint_15mZoneMultiplier, pivotPoint_15mMagnetismMultiplier,
        pivotPoint_15mTouchingMultiplier, pivotPoint_15mTotalWeight,
        // pp30m
        pivotPoint_30mWeight, pivotPoint_30mStatus, pivotPoint_30mZoneMultiplier, pivotPoint_30mMagnetismMultiplier,
        pivotPoint_30mTouchingMultiplier, pivotPoint_30mTotalWeight,
        // pp1h
        pivotPoint_1hWeight, pivotPoint_1hStatus, pivotPoint_1hZoneMultiplier, pivotPoint_1hMagnetismMultiplier,
        pivotPoint_1hTouchingMultiplier, pivotPoint_1hTotalWeight,
        // pp4h
        pivotPoint_4hWeight, pivotPoint_4hStatus, pivotPoint_4hZoneMultiplier, pivotPoint_4hMagnetismMultiplier,
        pivotPoint_4hTouchingMultiplier, pivotPoint_4hTotalWeight,
        // pp1d
        pivotPoint_1dWeight, pivotPoint_1dStatus, pivotPoint_1dZoneMultiplier, pivotPoint_1dMagnetismMultiplier, pivotPoint_1dTouchingMultiplier, pivotPoint_1dTotalWeight,
        // summary
        longSum, shortSum, totalSum, longPercent, shortPercent, side, confidence, action, totalSumStatus, textLong, textShort,
    }, 
  };
}