import { getLatestAndPreviousScenarios } from "../calcFunction/various/mathematical-func.js";
import { isBodyCrossedDown } from "./analyze-ma.js";
import { isBodyCrossedUp } from "./analyze-ma.js";
import { isRetestDownToUp } from "./analyze-ma.js";
import { isRetestUpToDown } from "./analyze-ma.js";
import { isRetestBounce } from "./analyze-ma.js";

export function analyzeTrigger(analyzeData, rsiZone, dataKlines) {
    const startLevel30 = rsiZone.oversoldZone.start;
    const startLevel70 = rsiZone.overboughtZone.start;
    const startDots = startLevel30 < startLevel70 ? startLevel30 : startLevel70;

    const LEVELS = { L30: dataKlines[startLevel30].low, L70: dataKlines[startLevel70].high };

    let previousID = "U2000";
    let currentID = "U2000";
    let scenariosID = [];

    let markerApproachAndRebound30 = [];
    let markerApproachAndRebound70 = [];
    let markerRetest30 = [];
    let markerRetest70 = [];

    for (let i = startDots + 1; i < dataKlines.length; i++) {
        const prev = dataKlines[i - 1];
        const cur = dataKlines[i];
        const next = i + 1 < dataKlines.length ? dataKlines[i + 1] : null;

        if (i >= startLevel30) {
            if (next && isBodyCrossedUp(prev, cur, next, LEVELS.L30, LEVELS.L30, LEVELS.L30)) {
                previousID = currentID;
                currentID = "U7001";
                scenariosID.push({time: dataKlines[i].time, id: "U7001"}); 
                markerApproachAndRebound30 = [];
                markerApproachAndRebound70 = [];
                markerRetest30 = [];
                markerRetest70 = [];
            }

            if (next && isBodyCrossedDown(prev, cur, next, LEVELS.L30, LEVELS.L30, LEVELS.L30)) {
                previousID = currentID;
                currentID = "U7003";
                scenariosID.push({time: dataKlines[i].time, id: "U7003"}); 
                markerApproachAndRebound30 = [];
                markerApproachAndRebound70 = [];
                markerRetest30 = [];
                markerRetest70 = [];
            }

            if (next && isRetestDownToUp(prev, cur, next, LEVELS.L30, LEVELS.L30, LEVELS.L30)) {
                previousID = currentID;
                currentID = "U7002";
                scenariosID.push({time: dataKlines[i].time, id: "U7002"}); 
                markerRetest30.push({ time: cur.time, position: "belowBar", color: "#00ff00", shape: "arrowUp", text: "TR30", size: 2});
            }

            if (next && cur.low > LEVELS.L30 && isRetestBounce(prev, cur, next, LEVELS.L30, LEVELS.L30, LEVELS.L30)) { 
                previousID = currentID;
                currentID = "U7007";
                scenariosID.push({time: dataKlines[i].time, id: "U7007"}); 
                markerApproachAndRebound30.push({ time: cur.time, position: "belowBar", color: "#00ff00", shape: "arrowUp", text: "TFR30", size: 2});
            } 
            
        } 
        
        if (i >= startLevel70) {
            if (next && isBodyCrossedUp(prev, cur, next, LEVELS.L70, LEVELS.L70, LEVELS.L70)) {
                previousID = currentID;
                currentID = "U7006";
                scenariosID.push({time: dataKlines[i].time, id: "U7006"}); 
                markerApproachAndRebound30 = [];
                markerApproachAndRebound70 = [];
                markerRetest30 = [];
                markerRetest70 = [];
            }

            if (next && isBodyCrossedDown(prev, cur, next, LEVELS.L70, LEVELS.L70, LEVELS.L70)) {
                previousID = currentID;
                currentID = "U7004";
                scenariosID.push({time: dataKlines[i].time, id: "U7004"}); 
                markerApproachAndRebound30 = [];
                markerApproachAndRebound70 = [];
                markerRetest30 = [];
                markerRetest70 = [];
            }

            if (next && isRetestUpToDown(prev, cur, next, LEVELS.L70, LEVELS.L70, LEVELS.L70)) {
                previousID = currentID;
                currentID = "U7005";
                scenariosID.push({time: dataKlines[i].time, id: "U7005"}); 
                markerRetest70.push({ time: cur.time, position: "aboveBar", color: "#ff0000", shape: "arrowDown", text: "TR70", size: 2});
            }

            if (next && cur.high < LEVELS.L70 && isRetestBounce(prev, cur, next, LEVELS.L70, LEVELS.L70, LEVELS.L70)) { 
                previousID = currentID;
                currentID = "U7008";
                scenariosID.push({time: dataKlines[i].time, id: "U7008"}); 
                markerApproachAndRebound70.push({ time: cur.time, position: "aboveBar", color: "#ff0000", shape: "arrowDown", text: "TFR70", size: 2});
            } 
        }
    }

    // ——— НОВА ЛОГІКА ТОРКАННЯ (аналіз останніх свічок) ———
    const lastPrev = dataKlines[dataKlines.length - 2];
    const lastCur = dataKlines[dataKlines.length - 1];
    
    let touchingInfo = "";

    // Перевірка для рівня L30
    const prevStrictlyAbove30 = lastPrev.low > LEVELS.L30;
    const prevStrictlyBelow30 = lastPrev.high < LEVELS.L30;
    const isTouching30 = lastCur.low <= LEVELS.L30 && lastCur.high >= LEVELS.L30;

    if (isTouching30) {
        if (prevStrictlyAbove30) touchingInfo = "Торкання рівня 30 зверху";
        else if (prevStrictlyBelow30) touchingInfo = "Торкання рівня 30 знизу";
    }

    // Перевірка для рівня L70 (якщо торкання 30 не знайдено)
    if (!touchingInfo) {
        const prevStrictlyAbove70 = lastPrev.low > LEVELS.L70;
        const prevStrictlyBelow70 = lastPrev.high < LEVELS.L70;
        const isTouching70 = lastCur.low <= LEVELS.L70 && lastCur.high >= LEVELS.L70;

        if (isTouching70) {
            if (prevStrictlyAbove70) touchingInfo = "Торкання рівня 70 зверху";
            else if (prevStrictlyBelow70) touchingInfo = "Торкання рівня 70 знизу";
        }
    }

    // ——— Вивід у DOM ———
    analyzeData.main.previousID = previousID;
    analyzeData.main.currentID = currentID;
    analyzeData.main.scenariosID = scenariosID;

    const { latest, previous } = getLatestAndPreviousScenarios(scenariosID);

    analyzeData.main.previousIDs = previous;
    analyzeData.main.currentIDs = latest;

    // Оновлюємо новий статус торкання

    if(touchingInfo === "Торкання рівня 30 зверху") {
        analyzeData.additional.touching.currentID = "B2001";
    }

    if(touchingInfo === "Торкання рівня 30 знизу") {
        analyzeData.additional.touching.currentID = "B2002";
    }

    if(touchingInfo === "Торкання рівня 70 зверху") {
        analyzeData.additional.touching.currentID = "B2003";
    }

    if(touchingInfo === "Торкання рівня 70 знизу") {
        analyzeData.additional.touching.currentID = "B2004";
    }

    return [...markerRetest30, ...markerRetest70, ...markerApproachAndRebound30, ...markerApproachAndRebound70];
}