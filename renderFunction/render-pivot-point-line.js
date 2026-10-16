import { findClosestLowerBoundIndex } from "../calcFunction/various/find-closest-lower-bound-index.js";
import { currentInterval, klinesData } from "../chart-data.js";
import { dotsByInterval, globalSettingByInterval } from "../program-settings.js";
import { changeTextStatus, createHorizontalLine } from "../render.js";

export function renderPivotPointLine(line, data, visStatus) {
    // Якщо історія порожня або data.history взагалі не існує (статус false)
    if (!data.history || data.history.length === 0 || !visStatus) {
        // Обнулення ліній
        line.pivotPoint.setData([]);
        line.firstResistance.setData([]);
        line.secondResistance.setData([]);
        line.thirdResistance.setData([]);
        line.firstSupport.setData([]);
        line.secondSupport.setData([]);
        line.thirdSupport.setData([]);
        return;
    }

    // Створюємо масиви для накопичення всіх сегментів кожної лінії
    const allPivotPoints = [];
    const allFirstResistances = [];
    const allSecondResistances = [];
    const allThirdResistances = [];
    const allFirstSupports = [];
    const allSecondSupports = [];
    const allThirdSupports = [];

    // Проходимо по всьому масиву history
    data.history.forEach(item => {
        // createHorizontalLine повертає масив точок (як правило, це [{time, value}, {time, value}] для відрізка)
        // Використовуємо spread оператор (...), щоб "розпакувати" відрізок у загальний масив
        
        allPivotPoints.push(...createHorizontalLine(item.openTime, item.pivotPoint, data.lenLine));
        
        allFirstResistances.push(...createHorizontalLine(item.openTime, item.firstResistance, data.lenLine));
        allSecondResistances.push(...createHorizontalLine(item.openTime, item.secondResistance, data.lenLine));
        allThirdResistances.push(...createHorizontalLine(item.openTime, item.thirdResistance, data.lenLine));
        
        allFirstSupports.push(...createHorizontalLine(item.openTime, item.firstSupport, data.lenLine));
        allSecondSupports.push(...createHorizontalLine(item.openTime, item.secondSupport, data.lenLine));
        allThirdSupports.push(...createHorizontalLine(item.openTime, item.thirdSupport, data.lenLine));
    });

    // Встановлюємо накопичені масиви точок для кожної лінії на графіку
    line.pivotPoint.setData(allPivotPoints);
    line.firstResistance.setData(allFirstResistances);
    line.secondResistance.setData(allSecondResistances);
    line.thirdResistance.setData(allThirdResistances);
    line.firstSupport.setData(allFirstSupports);
    line.secondSupport.setData(allSecondSupports);
    line.thirdSupport.setData(allThirdSupports);
}

export function renderPivotPointLines(line, data) {
    if (!data.pivotPoint) {
        // Обнулення ліній
        line.pivotPoint.setData([]);
        line.firstResistance.setData([]);
        line.secondResistance.setData([]);
        line.thirdResistance.setData([]);
        line.firstSupport.setData([]);
        line.secondSupport.setData([]);
        line.thirdSupport.setData([]);
    } else {
        line.pivotPoint.setData(createHorizontalLine(data.openTime, data.pivotPoint, data.lenLine)); 
        line.firstResistance.setData(createHorizontalLine(data.openTime, data.firstResistance, data.lenLine)); 
        line.secondResistance.setData(createHorizontalLine(data.openTime, data.secondResistance, data.lenLine));
        line.thirdResistance.setData(createHorizontalLine(data.openTime, data.thirdResistance, data.lenLine)); 
        line.firstSupport.setData(createHorizontalLine(data.openTime, data.firstSupport, data.lenLine)); 
        line.secondSupport.setData(createHorizontalLine(data.openTime, data.secondSupport, data.lenLine));
        line.thirdSupport.setData(createHorizontalLine(data.openTime, data.thirdSupport, data.lenLine));  
    }
}