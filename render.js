import { klines, klinesData, currentInterval} from "./chart-data.js";
import { onIntervalChange } from "./control.js";
import * as main from "./main.js";
import { globalSettingByInterval, localSettingByInterval, localRenderDataByInterval} from "./program-settings.js";
import { autoPlacement } from "./renderFunction/auto-placment.js";
import { autoSort } from "./renderFunction/auto-sort.js";
import { zigzag } from "./chartLogic/chart-render-line.js";
import { initStateFromDots, updateAllMarkers, updateAllUI } from "./menus/dots-panel.js";
import { createFibanachiLines } from "./renderFunction/create-fibanachi-lines.js";

const calculateButton = document.querySelector("#calculate-button");
const reloadButton = document.querySelector("#reload-button");
const clearButton = document.querySelector("#clear-button");

// кнопки збереження графіків вищого рівння на нищому рівні
const graph5mVis = document.querySelector("#graph5mVis");
const graph15mVis = document.querySelector("#graph15mVis");
const graph30mVis = document.querySelector("#graph30mVis");
const graph1hVis = document.querySelector("#graph1hVis");

const autoPlac = document.querySelector("#autoPlacement");
const autoSorting = document.querySelector("#autoSorting");

export let renderSettings = globalSettingByInterval["1m"];

export function setActiveSettings(interval) {
    renderSettings = globalSettingByInterval[interval];
}

export function changeTextStatus(textLine, status, priceLevel = 0) {
    textLine.applyOptions({ price: priceLevel, lineVisible: status, axisLabelVisible: status, });
}

function createWawe(dataGraph, dotStart, dotEnd, lenLine, statusStart, scaleTime){
    let wawe = [];
    let lenBetween = (dotEnd - dotStart) * scaleTime + lenLine * scaleTime;   
    let diferent = (dotEnd - dotStart) * scaleTime;

    let dotStartValue = dataGraph[dotStart].high;
    let dotEndValue = dataGraph[dotEnd].high;

    if (statusStart){
        dotStartValue = dataGraph[dotStart].low;
        dotEndValue = dataGraph[dotEnd].low;
    }

    let difvalue =  (dotStartValue - dotEndValue) / diferent;

    for (let index = 0; index < lenBetween; index++) {
        if (klines[0].time <= dataGraph[dotStart].time + renderSettings.stepBetweenChart * index) {
            wawe.push({ time: dataGraph[dotStart].time + renderSettings.stepBetweenChart * index, value: dotStartValue - difvalue * index});
        }
    }
    return wawe;
}

export function createHorizontalLine (timeDot, valuaDot, lenLine) {
    let lineNew = [];
    for (let index = 0; index < lenLine; index++) {
        if (klines[0].time <= timeDot + renderSettings.stepBetweenChart * index) {
            lineNew.push({ time: timeDot + renderSettings.stepBetweenChart * index, value: valuaDot});
        }
    }
    return lineNew;
}
  
function renderLinesGroup (dataGraph, lineSetting, lineData, linesGroup, isActive, scale) {

    if (lineSetting.wawe1Settings.wawe1Visibility) {
        lineData.wawes.wawe1Data = createWawe(dataGraph, lineSetting.dots[lineSetting.startDot].value, lineSetting.dots[2].value, lineSetting.wawe1Settings.wawe1Length, lineSetting.startDot, scale);
        linesGroup.wawe1.setData(lineData.wawes.wawe1Data);
    } else {
        lineData.wawes.wawe1Data = [];
        linesGroup.wawe1.setData([]);
    }
    
    if (lineSetting.wawe2Settings.wawe2Visibility) {
        lineData.wawes.wawe2Data = createWawe(dataGraph, lineSetting.dots[lineSetting.startDot].value, lineSetting.dots[3].value, lineSetting.wawe2Settings.wawe2Length, lineSetting.startDot, scale);
        linesGroup.wawe2.setData(lineData.wawes.wawe2Data);
    } else {
        lineData.wawes.wawe2Data = [];
        linesGroup.wawe2.setData([]);
    }

    if (lineSetting.wawe3Settings.wawe3Visibility) {
        lineData.wawes.wawe3Data = createWawe(dataGraph, lineSetting.dots[lineSetting.startDot].value, lineSetting.dots[4].value, lineSetting.wawe3Settings.wawe3Length, lineSetting.startDot, scale);
        linesGroup.wawe3.setData(lineData.wawes.wawe3Data);
    } else {
        lineData.wawes.wawe3Data = [];
        linesGroup.wawe3.setData([]);
    }

    if (lineSetting.wawe4Settings.wawe4Visibility) {
        lineData.wawes.wawe4Data = createWawe(dataGraph, lineSetting.dots[lineSetting.startDot].value, lineSetting.dots[5].value, lineSetting.wawe4Settings.wawe4Length, lineSetting.startDot, scale);
        linesGroup.wawe4.setData(lineData.wawes.wawe4Data);
    } else {
        lineData.wawes.wawe4Data = [];
        linesGroup.wawe4.setData([]);
    }

    if (lineSetting.wawe5Settings.wawe5Visibility) {
        lineData.wawes.wawe5Data = createWawe(dataGraph, lineSetting.dots[lineSetting.startDot].value, lineSetting.dots[6].value, lineSetting.wawe5Settings.wawe5Length, lineSetting.startDot, scale);
        linesGroup.wawe5.setData(lineData.wawes.wawe5Data);
    } else {
        lineData.wawes.wawe5Data = [];
        linesGroup.wawe5.setData([]);
    }

    if (lineSetting.level1Settings.level1Visibility) {
        if (lineSetting.level1Settings.level1DirectionUp){
            linesGroup.level1.setData(createHorizontalLine(dataGraph[lineSetting.dots[lineSetting.level1Settings.level1Dot].value].time, dataGraph[lineSetting.dots[lineSetting.level1Settings.level1Dot].value].close, lineSetting.level1Settings.level1Length * scale));
        }
        else {
            linesGroup.level1.setData(createHorizontalLine(dataGraph[lineSetting.dots[lineSetting.level1Settings.level1Dot].value].time, dataGraph[lineSetting.dots[lineSetting.level1Settings.level1Dot].value].open, lineSetting.level1Settings.level1Length * scale));
        }
    } else {
        linesGroup.level1.setData([]);
    }

    
    const fibanachiVis = lineSetting.fibanachiSettings.fibanachiVisibility;
    const fibanachiStart = lineSetting.dots[lineSetting.fibanachiSettings.fibanachiStart].value;
    const fibanachiEnd = lineSetting.dots[lineSetting.fibanachiSettings.fibanachiEnd].value;
    const fibanachiLen = lineSetting.fibanachiSettings.fibanachiLength;

    // createFibanachiLines(lineSetting.fibanachiSettings.fibanachiVisibility, true, linesGroup, dataGraph, lineSetting.dots[lineSetting.fibanachiSettings.fibanachiStart].value, lineSetting.dots[lineSetting.fibanachiSettings.fibanachiEnd].value, lineSetting.fibanachiSettings.fibanachiLength, scale);
    console.log(lineData);
    createFibanachiLines(fibanachiVis, true, linesGroup, lineData.fibanachi, dataGraph, fibanachiStart, fibanachiEnd, fibanachiLen, scale);
}


calculateButton.addEventListener("click", () => {
    onIntervalChange(currentInterval);
    
    if (autoPlac.checked) {
        autoPlacement(localSettingByInterval[currentInterval].startDot, localSettingByInterval[currentInterval].dots, klinesData[currentInterval], zigzag.points);
    }

    initStateFromDots();
    updateAllUI();
    updateAllMarkers();
    
    if (currentInterval === "1m") {
        if (!graph5mVis.classList.contains('active')){
            renderLinesGroup(klinesData["5m"], localSettingByInterval["5m"], localRenderDataByInterval["5m"], main.linesGroupByInterval["5m"], false, 5);
        } else {
            clearlinesGroup(main.linesGroupByInterval["5m"], localRenderDataByInterval["5m"]);
        }
            
        if (!graph15mVis.classList.contains('active')){
            renderLinesGroup(klinesData["15m"], localSettingByInterval["15m"], localRenderDataByInterval["15m"], main.linesGroupByInterval["15m"], false, 15);
        } else {
            clearlinesGroup(main.linesGroupByInterval["15m"], localRenderDataByInterval["15m"]);
        }

        if (!graph30mVis.classList.contains('active')){
            renderLinesGroup(klinesData["30m"], localSettingByInterval["30m"], localRenderDataByInterval["30m"], main.linesGroupByInterval["30m"], false, 30);
        } else {
            clearlinesGroup(main.linesGroupByInterval["30m"], localRenderDataByInterval["30m"]);
        }

        if (!graph1hVis.classList.contains('active')){
            renderLinesGroup(klinesData["1h"], localSettingByInterval["1h"], localRenderDataByInterval["1h"], main.linesGroupByInterval["1h"], false, 60);
        } else {
            clearlinesGroup(main.linesGroupByInterval["1h"], localRenderDataByInterval["1h"]);
        }
    }
    console.log(localRenderDataByInterval[currentInterval]);
    renderLinesGroup(klinesData[currentInterval], localSettingByInterval[currentInterval], localRenderDataByInterval[currentInterval], main.linesGroupByInterval[currentInterval], true, 1);

    if (autoSorting.checked) {
        const sortedDot = autoSort(localSettingByInterval[currentInterval].dots, localRenderDataByInterval[currentInterval], localSettingByInterval[currentInterval].startDot);
        initStateFromDots();
        updateAllUI();
        updateAllMarkers();

        renderLinesGroup(klinesData[currentInterval], localSettingByInterval[currentInterval], localRenderDataByInterval[currentInterval], main.linesGroupByInterval[currentInterval], true, 1);
    }
    
    console.log(localRenderDataByInterval[currentInterval]);

    // createPivotPointLines(PivotPointStatus, renderSettings.pivotPointLength, PivotPointRegim); 
});

// обнулення всіх ліній і хвиль
clearButton.addEventListener("click", () => {
    clearLine();
});

// обнулення всіх ліній і хвиль
reloadButton.addEventListener("click", () => {
    onIntervalChange(currentInterval);
});

function clearlinesGroup (line, data) {
    // line.zigzagLine.setData([]);

    line.wawe1.setData([]);
    line.wawe2.setData([]);
    line.wawe3.setData([]);
    line.wawe4.setData([]);
    line.wawe5.setData([]);

    line.level1.setData([]);

    createFibanachiLines(false, true, line, data);

}

export function clearLine () {
    main.zigzagLineClassic.setData([]);
    main.zigzagLineDownTrend.setData([]);
    main.zigzagLineUpTrend.setData([]);

    clearlinesGroup(main.linesGroupByInterval["1m"], localRenderDataByInterval["1m"].fibanachi);
    clearlinesGroup(main.linesGroupByInterval["5m"], localRenderDataByInterval["5m"].fibanachi);
    clearlinesGroup(main.linesGroupByInterval["15m"], localRenderDataByInterval["15m"].fibanachi);
    clearlinesGroup(main.linesGroupByInterval["30m"], localRenderDataByInterval["30m"].fibanachi);
    clearlinesGroup(main.linesGroupByInterval["1h"], localRenderDataByInterval["1h"].fibanachi);
}