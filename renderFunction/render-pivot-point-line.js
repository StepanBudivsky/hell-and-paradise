import { findClosestLowerBoundIndex } from "../calcFunction/various/find-closest-lower-bound-index.js";
import { currentInterval, klinesData } from "../chart-data.js";
import { dotsByInterval, globalSettingByInterval } from "../program-settings.js";
import { changeTextStatus, createHorizontalLine } from "../render.js";

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