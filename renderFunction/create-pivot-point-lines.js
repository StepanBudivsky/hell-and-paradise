import { findClosestLowerBoundIndex } from "../calcFunction/various/find-closest-lower-bound-index.js";
import { klinesData } from "../chart-data.js";
import { dotsByInterval, globalSettingByInterval } from "../program-settings.js";
import { changeTextStatus, createHorizontalLine } from "../render.js";

export function createPivotPointLines (status = true, regim, data, interval) {
    let useRegims = globalSettingByInterval[interval].pivotPointUseRegim;
        
    if (!useRegims.includes(regim)) {
        status = false;
    }
    if (!status) {
        // Обнулення ліній
        // line.pivotPoint.setData([]);
        // line.firstResistance.setData([]);
        // line.secondResistance.setData([]);
        // line.thirdResistance.setData([]);
        // line.firstSupport.setData([]);
        // line.secondSupport.setData([]);
        // line.thirdSupport.setData([]);
        
        // // Обнулення текстів
        // changeTextStatus(pivotPointText, false);
        // changeTextStatus(firstResistanceText, false);
        // changeTextStatus(secondResistanceText, false);
        // changeTextStatus(thirdResistanceText, false);
        // changeTextStatus(firstSupportText, false);
        // changeTextStatus(secondSupportText, false);
        // changeTextStatus(thirdSupportText, false);
        
        data.start = 0;
        data.pivotPoint = 0;
        data.firstResistance =  0;
        data.secondResistance = 0;
        data.thirdResistance = 0;
        data.firstSupport = 0;
        data.secondSupport = 0;
        data.thirdSupport = 0; 

        return null;
    }

    let currentIntervalScale = 1;

    if (interval === "1m") currentIntervalScale = 1;
    if (interval === "5m") currentIntervalScale = 5;
    if (interval === "15m") currentIntervalScale = 15;
    if (interval === "30m") currentIntervalScale = 30;
    if (interval === "1h") currentIntervalScale = 60;

    // Pivot point
    let scale = 1;

    if (regim === "1m") scale = 1;
    if (regim === "5m") scale = 5;
    if (regim === "15m") scale = 15;
    if (regim === "30m") scale = 30;
    if (regim === "1h") scale = 60;
    if (regim === "4h") scale = 240;
    if (regim === "1d") scale = 1440;

    const lenLine = scale / currentIntervalScale;

    data.lenLine = scale / currentIntervalScale;

    // Зберігаємо передостанню свічку
    const prevCandle = klinesData[regim][klinesData[regim].length - 2]; 
    // const prevCandle = candles[0]; // перша з двох — передостання

    // const openTime = Number(prevCandle[0]) / 1000 + 60 * scale;

    const openTime = prevCandle.time + 60 * scale;

    data.openTime = prevCandle.time + 60 * scale;

    const high = prevCandle.high;
    const low = prevCandle.low;
    const close = prevCandle.close;

    const pp = (high + low + close) / 3;

    data.start = findClosestLowerBoundIndex(klinesData[interval], openTime);
    data.pivotPoint = pp;
    data.firstResistance =  (2 * pp) - low;
    data.secondResistance = pp + (high - low);
    data.thirdResistance = high + 2 * (pp - low);
    data.firstSupport = (2 * pp) - high;
    data.secondSupport = pp - (high - low);
    data.thirdSupport = low - 2 * (high - pp); 

    // line.pivotPoint.setData(createHorizontalLine(openTime, data.pivotPoint, lenLine)); 
    // line.firstResistance.setData(createHorizontalLine(openTime, data.firstResistance, lenLine)); 
    // line.secondResistance.setData(createHorizontalLine(openTime, data.secondResistance, lenLine));
    // line.thirdResistance.setData(createHorizontalLine(openTime, data.thirdResistance, lenLine)); 
    // line.firstSupport.setData(createHorizontalLine(openTime, data.firstSupport, lenLine)); 
    // line.secondSupport.setData(createHorizontalLine(openTime, data.secondSupport, lenLine));
    // line.thirdSupport.setData(createHorizontalLine(openTime, data.thirdSupport, lenLine));  
    
    // // Зберігаємо передостанню свічку
    // console.log(prevCandleIndex);
    // // const prevCandle = klinesData[regim][klinesData[regim].length - 2]; 
    // const prevCandle = prevCandleIndex === -1 ? klinesData[regim][klinesData[regim].length - 2] : klinesData[regim][prevCandleIndex - 1]; 

    // console.log(prevCandle);
            

    // changeTextStatus(pivotPointText, true, pp);
    // changeTextStatus(firstResistanceText, true, (2 * pp) - low);
    // changeTextStatus(secondResistanceText, true, pp + (high - low));
    // changeTextStatus(thirdResistanceText, true, high + 2 * (pp - low));
    // changeTextStatus(firstSupportText, true, (2 * pp) - high);
    // changeTextStatus(secondSupportText, true, pp - (high - low));
    // changeTextStatus(thirdSupportText, true, low - 2 * (high - pp));

}


// export function createPivotPointLines (status = true, lenLine = 0, regim) {
//     let useRegims = globalSettingByInterval[currentInterval].pivotPointUseRegim;
        
//     if (!useRegims.includes(regim)) {
//         status = false;
//     }
//     if (!status) {
//         // Обнулення ліній
//         pivotPoint.setData([]);
//         firstResistance.setData([]);
//         secondResistance.setData([]);
//         thirdResistance.setData([]);
//         firstSupport.setData([]);
//         secondSupport.setData([]);
//         thirdSupport.setData([]);
        
//         // Обнулення текстів
//         changeTextStatus(pivotPointText, false);
//         changeTextStatus(firstResistanceText, false);
//         changeTextStatus(secondResistanceText, false);
//         changeTextStatus(thirdResistanceText, false);
//         changeTextStatus(firstSupportText, false);
//         changeTextStatus(secondSupportText, false);
//         changeTextStatus(thirdSupportText, false);
        
//         return null;
//     }

//     let currentIntervalScale = 1;

//     if (currentInterval === "1m") currentIntervalScale = 1;
//     if (currentInterval === "5m") currentIntervalScale = 5;
//     if (currentInterval === "15m") currentIntervalScale = 15;
//     if (currentInterval === "30m") currentIntervalScale = 30;
//     if (currentInterval === "1h") currentIntervalScale = 60;

//     // Pivot point
//     let scale = 1;

//     if (regim === "1m") scale = 1;
//     if (regim === "5m") scale = 5;
//     if (regim === "15m") scale = 15;
//     if (regim === "30m") scale = 30;
//     if (regim === "1h") scale = 60;

//     lenLine = scale / currentIntervalScale;
    
//     // Зберігаємо передостанню свічку
//     const prevCandleIndex = findClosestLowerBoundIndex(klinesData[regim], klinesData[currentInterval][dotsByInterval[currentInterval][7].value].time);
//     console.log(prevCandleIndex);
//     // const prevCandle = klinesData[regim][klinesData[regim].length - 2]; 
//     const prevCandle = prevCandleIndex === -1 ? klinesData[regim][klinesData[regim].length - 2] : klinesData[regim][prevCandleIndex - 1]; 

//     console.log(prevCandle);

//     const openTime = prevCandle.time + 60 * scale;
//     // const open = parseFloat(prevCandle[1]);
//     const high = prevCandle.high;
//     const low = prevCandle.low;
//     const close = prevCandle.close;
//     const pp = (high + low + close) / 3;

//     pivotPoint.setData(createHorizontalLine(openTime, pp, lenLine)); 
//     firstResistance.setData(createHorizontalLine(openTime, (2 * pp) - low, lenLine)); 
//     secondResistance.setData(createHorizontalLine(openTime, pp + (high - low), lenLine));
//     thirdResistance.setData(createHorizontalLine(openTime, high + 2 * (pp - low), lenLine)); 
//     firstSupport.setData(createHorizontalLine(openTime, (2 * pp) - high, lenLine)); 
//     secondSupport.setData(createHorizontalLine(openTime, pp - (high - low), lenLine));
//     thirdSupport.setData(createHorizontalLine(openTime, low - 2 * (high - pp), lenLine));  
            

//     changeTextStatus(pivotPointText, true, pp);
//     changeTextStatus(firstResistanceText, true, (2 * pp) - low);
//     changeTextStatus(secondResistanceText, true, pp + (high - low));
//     changeTextStatus(thirdResistanceText, true, high + 2 * (pp - low));
//     changeTextStatus(firstSupportText, true, (2 * pp) - high);
//     changeTextStatus(secondSupportText, true, pp - (high - low));
//     changeTextStatus(thirdSupportText, true, low - 2 * (high - pp));

//     // console.log('Передостання свічка BTCUSDT (4h):', prevCandleObj);

// }