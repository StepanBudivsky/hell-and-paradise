import { findClosestLowerBoundIndex } from "../core/lib/find-closest-lower-bound-index.js";
import { klinesData } from "../chart-data.js";
import { dotsByInterval, globalSettingByInterval } from "../settingsData/program-settings.js";
import { changeTextStatus, createHorizontalLine } from "../render.js";

export function createPivotPointLine(
    status = true, 
    regim, 
    data, 
    interval, 
    startRenderingDot, 
    endRenderingDot
) {
    let useRegims = globalSettingByInterval[interval].pivotPointUseRegim;
        
    if (!useRegims.includes(regim)) {
        status = false;
    }
    
    if (!status) {
        data.history = [];
        data.lenLine = 0;
        return null;
    }

    const currentCandles = klinesData[interval];
    const regimCandles = klinesData[regim];

    // Захист від помилок, якщо дані ще не завантажились або індекси вийшли за межі
    if (!currentCandles || !regimCandles || currentCandles.length === 0 || regimCandles.length === 0) return null;
    
    // Корегуємо індекси, щоб вони не виходили за межі масиву
    const startIndexCurrent = Math.max(0, startRenderingDot);
    const endIndexCurrent = Math.min(currentCandles.length - 1, endRenderingDot);

    // Отримуємо час початку і кінця видимої області
    const visibleStartTime = currentCandles[startIndexCurrent].time;
    const visibleEndTime = currentCandles[endIndexCurrent].time;

    let currentIntervalScale = 1;
    if (interval === "1m") currentIntervalScale = 1;
    if (interval === "5m") currentIntervalScale = 5;
    if (interval === "15m") currentIntervalScale = 15;
    if (interval === "30m") currentIntervalScale = 30;
    if (interval === "1h") currentIntervalScale = 60;

    let scale = 1;
    if (regim === "1m") scale = 1;
    if (regim === "5m") scale = 5;
    if (regim === "15m") scale = 15;
    if (regim === "30m") scale = 30;
    if (regim === "1h") scale = 60;
    if (regim === "4h") scale = 240;
    if (regim === "1d") scale = 1440;

    const lenLine = scale / currentIntervalScale;
    data.lenLine = lenLine;
    data.history = [];

    // Знаходимо індекси у старшому таймфреймі (regim), які відповідають видимому часу
    // Використовуємо вашу функцію пошуку найближчого індексу знизу
    let startRegimIndex = findClosestLowerBoundIndex(regimCandles, visibleStartTime);
    let endRegimIndex = findClosestLowerBoundIndex(regimCandles, visibleEndTime);

    // Якщо функція не знайшла індекс, ставимо крайні межі
    if (startRegimIndex === -1) startRegimIndex = 0;
    if (endRegimIndex === -1) endRegimIndex = regimCandles.length - 1;

    // Щоб лінії півотів малювались коректно (завжди береться ПЕРЕДОСТАННЯ свічка),
    // нам потрібно брати дані від (startRegimIndex - 1), якщо це можливо.
    startRegimIndex = Math.max(0, startRegimIndex - 1);
    
    // Переконуємось, що не беремо останню незавершену свічку як розрахункову
    endRegimIndex = Math.min(endRegimIndex, regimCandles.length - 2);

    // Проходимо циклом ТІЛЬКИ по видимій області старшого таймфрейму
    for (let i = startRegimIndex; i <= endRegimIndex; i++) {
        const prevCandle = regimCandles[i];
        
        // Час, з якого починається відмальовування лінії (від початку наступної свічки)
        const openTime = prevCandle.time + 60 * scale; 
        
        const high = prevCandle.high;
        const low = prevCandle.low;
        const close = prevCandle.close;

        // Класичні формули Pivot Points
        const pp = (high + low + close) / 3;
        const firstResistance = (2 * pp) - low;
        const secondResistance = pp + (high - low);
        const thirdResistance = high + 2 * (pp - low);
        const firstSupport = (2 * pp) - high;
        const secondSupport = pp - (high - low);
        const thirdSupport = low - 2 * (high - pp); 

        // Шукаємо індекс на поточному графіку, де лінія має починатися
        const startLineIndex = findClosestLowerBoundIndex(currentCandles, openTime);

        // Якщо лінія починається за межами екрану зліва, ми її малюємо, 
        // щоб вона "входила" в екран. Але якщо вона повністю за межами — можна пропускати.
        
        data.history.push({
            start: startLineIndex,
            openTime: openTime,
            pivotPoint: pp,
            firstResistance: firstResistance,
            secondResistance: secondResistance,
            thirdResistance: thirdResistance,
            firstSupport: firstSupport,
            secondSupport: secondSupport,
            thirdSupport: thirdSupport
        });
    }
}


// стара версія півот поінта для останього
export function createPivotPointLines (status = true, regim, data, interval) {
    let useRegims = globalSettingByInterval[interval].pivotPointUseRegim;
        
    if (!useRegims.includes(regim)) {
        status = false;
    }
    if (!status) {
        
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
            

    // changeTextStatus(pivotPointText, true, pp);
    // changeTextStatus(firstResistanceText, true, (2 * pp) - low);
    // changeTextStatus(secondResistanceText, true, pp + (high - low));
    // changeTextStatus(thirdResistanceText, true, high + 2 * (pp - low));
    // changeTextStatus(firstSupportText, true, (2 * pp) - high);
    // changeTextStatus(secondSupportText, true, pp - (high - low));
    // changeTextStatus(thirdSupportText, true, low - 2 * (high - pp));

}