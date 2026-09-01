import { changeTextStatus, createHorizontalLine } from "../render.js";
import { 
    fibanachi_0Text, 
    fibanachi_23Text, 
    fibanachi_38Text, 
    fibanachi_50Text, 
    fibanachi_61Text, 
    fibanachi_78Text,
    fibanachi_100Text, 
    fibanachi_161Text,
    fibanachi_261Text,
    fibanachi_423Text,
} from "../main.js";


export function createFibanachiLines (status = true, haveText = true, lines, data, dataGraph = [], dotStart = 0, dotEnd = 0, lenFibo = 0, scaleTime = 1) {
    // fibanachiLineData.dotDate = 0;
    // fibanachiLineData.wawe1Data = 0;
    // fibanachiLineData.wawe2Data
    // console.log(data);
    if (!status) {
        // Обнулення ліній
        lines.fibanachi_0.setData([]);
        lines.fibanachi_23.setData([]);
        lines.fibanachi_38.setData([]);
        lines.fibanachi_50.setData([]);
        lines.fibanachi_61.setData([]);
        lines.fibanachi_78.setData([]);
        lines.fibanachi_100.setData([]);
        lines.fibanachi_161.setData([]);
        lines.fibanachi_261.setData([]);
        lines.fibanachi_423.setData([]);

        data.fibanachi_0 = 0;
        data.fibanachi_23 = 0;
        data.fibanachi_38 = 0;
        data.fibanachi_50 = 0;
        data.fibanachi_61 = 0;
        data.fibanachi_78 = 0;
        data.fibanachi_100 = 0;
        data.fibanachi_161 = 0;
        data.fibanachi_261 = 0;
        data.fibanachi_423 = 0;
        
        // Обнулення текстів
        if (haveText) {
            changeTextStatus(fibanachi_0Text, false);
            changeTextStatus(fibanachi_23Text, false);
            changeTextStatus(fibanachi_38Text, false);
            changeTextStatus(fibanachi_50Text, false);
            changeTextStatus(fibanachi_61Text, false);
            changeTextStatus(fibanachi_78Text, false);
            changeTextStatus(fibanachi_100Text, false);
            changeTextStatus(fibanachi_161Text, false);
            changeTextStatus(fibanachi_261Text, false);
            changeTextStatus(fibanachi_423Text, false);
        }
        return null;
    }
    
    // відрисовка ліній Фібаначчі
    let firstDot = dotStart > dotEnd ? dotEnd : dotStart;
    let secondDot = dotStart > dotEnd ? dotStart : dotEnd;

    let firstLineValue = dataGraph[dotStart].low;
    let secondLineValue = dataGraph[dotEnd].high;

    let diferentFibanachi = (secondLineValue - firstLineValue) / 100;

    if (dataGraph[dotStart].high > dataGraph[dotEnd].high) {
        firstLineValue = dataGraph[dotStart].high;
        secondLineValue = dataGraph[dotEnd].low;
        diferentFibanachi = (firstLineValue - secondLineValue) / 100 * -1;
    }
        
    let lenBetween = (secondDot - firstDot) * scaleTime + lenFibo * scaleTime;
    let lineTime = dataGraph[firstDot].time;

    data.fibanachi_0 = firstLineValue;
    data.fibanachi_23 = firstLineValue + diferentFibanachi * 23.6;
    data.fibanachi_38 = firstLineValue + diferentFibanachi * 38.2;
    data.fibanachi_50 = firstLineValue + diferentFibanachi * 50;
    data.fibanachi_61 = firstLineValue + diferentFibanachi * 61.8;
    data.fibanachi_78 = firstLineValue + diferentFibanachi * 78.6;
    data.fibanachi_100 = firstLineValue + diferentFibanachi * 100;
    data.fibanachi_161 = firstLineValue + diferentFibanachi * 161.8;
    data.fibanachi_261 = firstLineValue + diferentFibanachi * 261.8;
    data.fibanachi_423 = firstLineValue + diferentFibanachi * 423.6;

    lines.fibanachi_0.setData(createHorizontalLine(lineTime, data.fibanachi_0, lenBetween));
    lines.fibanachi_23.setData(createHorizontalLine(lineTime, data.fibanachi_23, lenBetween));
    lines.fibanachi_38.setData(createHorizontalLine(lineTime, data.fibanachi_38, lenBetween));
    lines.fibanachi_50.setData(createHorizontalLine(lineTime, data.fibanachi_50, lenBetween));
    lines.fibanachi_61.setData(createHorizontalLine(lineTime, data.fibanachi_61, lenBetween));
    lines.fibanachi_78.setData(createHorizontalLine(lineTime, data.fibanachi_78, lenBetween));
    lines.fibanachi_100.setData(createHorizontalLine(lineTime, data.fibanachi_100, lenBetween));
    lines.fibanachi_161.setData(createHorizontalLine(lineTime, data.fibanachi_161, lenBetween));
    lines.fibanachi_261.setData(createHorizontalLine(lineTime, data.fibanachi_261, lenBetween));
    lines.fibanachi_423.setData(createHorizontalLine(lineTime, data.fibanachi_423, lenBetween));
    
    if (haveText) {
        changeTextStatus(fibanachi_0Text, true, data.fibanachi_0);
        changeTextStatus(fibanachi_23Text, true, data.fibanachi_23);
        changeTextStatus(fibanachi_38Text, true, data.fibanachi_38);
        changeTextStatus(fibanachi_50Text, true, data.fibanachi_50);
        changeTextStatus(fibanachi_61Text, true, data.fibanachi_61);
        changeTextStatus(fibanachi_78Text, true, data.fibanachi_78);
        changeTextStatus(fibanachi_100Text, true, data.fibanachi_100);
        changeTextStatus(fibanachi_161Text, true, data.fibanachi_161);
        changeTextStatus(fibanachi_261Text, true, data.fibanachi_261);
        changeTextStatus(fibanachi_423Text, true, data.fibanachi_423);
    }
}