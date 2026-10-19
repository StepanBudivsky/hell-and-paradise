import { isBodyCrossedDown, isBodyCrossedUp, isRetestDownToUp, isRetestUpToDown, isRetestBounce } from "./analyze-ma.js";
import { getClosestHorizontalLevel } from "./analyze-fibanachi.js";
import { getLatestAndPreviousScenarios } from "../lib/mathematical-func.js";
import { findClosestLowerBoundIndex } from "../lib/find-closest-lower-bound-index.js";

// Допоміжна функція: шукає актуальні рівні півота для конкретного часу
function getActivePivotLevels(history, targetTime) {
    if (!history || history.length === 0) return null;
    
    // Шукаємо індекс півота, час якого менший або дорівнює часу свічки
    // Можна використати вашу findClosestLowerBoundIndex, якщо вона шукає по полю openTime
    let closestIndex = -1;
    for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].openTime <= targetTime) {
            closestIndex = i;
            break;
        }
    }
    
    if (closestIndex !== -1) {
        return history[closestIndex];
    }
    return null; // Якщо історія починається пізніше за цю свічку
}

export function analyzePivotPoint(analyzeData, data, line, regim) {
    if (!line.history || line.history.length === 0) {
        analyzeData.main.previousID = "U2000";
        analyzeData.main.currentID = "U2000";
        analyzeData.main.scenariosID = [];
        analyzeData.main.previousIDs = [];
        analyzeData.main.currentIDs = [];
        analyzeData.additional.zone.currentID = "B1000";
        analyzeData.additional.zone.valueX = 0;
        analyzeData.statusVis = 'none';
        analyzeData.additional.magnetism.currentID = "B1000";
        analyzeData.additional.touching.currentID = "B1000";
        return [];
    }

    const levelConfigs = [
        { key: "thirdResistance", upID: "U3043", downID: "U3056", name: "R3", up: "MAX", down: "R2", mag: "Низька ( Шорт )", type: "R" },
        { key: "secondResistance", upID: "U3044", downID: "U3055", name: "R2", up: "R3", down: "R1", mag: "Середня ( Шорт )", type: "R" },
        { key: "firstResistance", upID: "U3045", downID: "U3054", name: "R1", up: "R2", down: "Pivot", mag: "Висока ( Шорт )", type: "R" },
        { key: "pivotPoint", upID: "U3046", downID: "U3053", name: "P", up: "R1", down: "S1", mag: "Максимальна", type: "P" },
        { key: "firstSupport", upID: "U3047", downID: "U3052", name: "S1", up: "Pivot", down: "S2", mag: "Висока ( Лонг )", type: "S" },
        { key: "secondSupport", upID: "U3048", downID: "U3051", name: "S2", up: "S1", down: "S3", mag: "Середня ( Лонг )", type: "S" },
        { key: "thirdSupport", upID: "U3049", downID: "U3050", name: "S3", up: "S2", down: "MIN", mag: "Низька ( Лонг )", type: "S" }
    ];

    let markerApproachAndRebound = [];
    let markerRetest = [];

    let previousID = "U2000";
    let currentID = "U2000";
    let scenariosID = [];
    let magnetism = "";

    // Починаємо аналіз не з line.start (бо тепер ліній багато), а з індексу, де доступні prev, cur, next
    // Обираємо розумний початок на основі видимої області графіка (або першого елемента з історії)
    let startIndex = Math.max(1, line.history[0]?.start || 1);

    for (let i = startIndex; i < data.length - 1; i++) {
        const prev = data[i - 1];
        const cur = data[i];
        const next = data[i + 1];

        // Отримуємо АКТУАЛЬНІ рівні півота для поточної свічки
        const activeLevels = getActivePivotLevels(line.history, cur.time);
        
        // Якщо для цього часу ще немає півота (наприклад, графік пішов глибше в історію, ніж ми прорахували)
        if (!activeLevels) continue;

        // --- ПЕРЕВІРКА НА ЛИПКИЙ ПРОБІЙ ---
        let stickyFound = false;
        for (const config of levelConfigs) {
            const levelVal = activeLevels[config.key];
            
            // Якщо ваша функція checkPivotSticky приймає об'єкт з рівнями, передайте activeLevels замість line
            const sticky = checkPivotSticky(i, data, levelVal);

            if (sticky.isSticky) {      
                magnetism = config.mag;

                if (sticky.entrySide === "ABOVE") {
                    previousID = currentID;
                    currentID = config.upID;
                    scenariosID.push({time: cur.time, id: config.upID});
                } else {
                    previousID = currentID;
                    currentID = config.downID;
                    scenariosID.push({time: cur.time, id: config.downID});
                }
                
                stickyFound = true;
                break;
            }
        }

        if (stickyFound) continue;

        // Зверніть увагу: якщо getClosestHorizontalLevel очікує об'єкт з усіма рівнями (firstResistance і т.д.), 
        // передаємо йому activeLevels замість line.
        const closestLine = getClosestHorizontalLevel(cur, activeLevels);

        // --- СЦЕНАРІЇ ДЛЯ ЛІНІЇ PP ---
        const pp = activeLevels.pivotPoint;
        if (isBodyCrossedUp(prev, cur, next, pp, pp, pp)) {
            previousID = currentID;
            currentID = "U3011";
            scenariosID.push({time: cur.time, id: "U3011"});
            magnetism = "Максимальна ( Шорт )";
        }   
            
        if (isBodyCrossedDown(prev, cur, next, pp, pp, pp)) {
            previousID = currentID;
            currentID = "U3004";
            scenariosID.push({time: cur.time, id: "U3004"});
            magnetism = "Максимальна ( Лонг )";
        }

        if (isRetestDownToUp(prev, cur, next, pp, pp, pp)) {
            previousID = currentID;
            currentID = "U3018";
            scenariosID.push({time: cur.time, id: "U3018"});
            magnetism = "Максимальна ( Лонг )";
            markerRetest.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PR PP", size: 2});
        }
            
        if (isRetestUpToDown(prev, cur, next, pp, pp, pp)) {
            previousID = currentID;
            currentID = "U3032";
            scenariosID.push({time: cur.time, id: "U3032"});
            magnetism = "Максимальна ( Шорт )";
            markerRetest.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PR PP", size: 2});
        }

        if (closestLine === "pivotPoint" && isRetestBounce(prev, cur, next, pp, pp, pp)) {
            if (cur.low > pp) { 
                previousID = currentID;
                currentID = "U3039";
                scenariosID.push({time: cur.time, id: "U3039"});
                magnetism = "Максимальна ( Шорт )";
                markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PFR PP", size: 2});
            } else if (cur.high < pp) { 
                previousID = currentID;
                currentID = "U3025";
                scenariosID.push({time: cur.time, id: "U3025"});
                magnetism = "Максимальна ( Лонг )";
                markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PFR PP", size: 2});
            }
        }

        // --- СЦЕНАРІЇ ДЛЯ ЛІНІЇ R1 ---
        const r1 = activeLevels.firstResistance;
        if (isBodyCrossedUp(prev, cur, next, r1, r1, r1)) {
            previousID = currentID;
            currentID = "U3012";
            scenariosID.push({time: cur.time, id: "U3012"});
            magnetism = "Висока ( Шорт )";
        }   
            
        if (isBodyCrossedDown(prev, cur, next, r1, r1, r1)) {
            previousID = currentID;
            currentID = "U3003";
            scenariosID.push({time: cur.time, id: "U3003"});
            magnetism = "Висока ( Шорт )";
        }

        if (isRetestDownToUp(prev, cur, next, r1, r1, r1)) {
            previousID = currentID;
            currentID = "U3019";
            scenariosID.push({time: cur.time, id: "U3019"});
            magnetism = "Висока ( Шорт )";
            markerRetest.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PR R1", size: 2});
        }
            
        if (isRetestUpToDown(prev, cur, next, r1, r1, r1)) {
            previousID = currentID;
            currentID = "U3033";
            scenariosID.push({time: cur.time, id: "U3033"});
            magnetism = "Висока ( Шорт )";
            markerRetest.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PR R1", size: 2});
        }

        if (closestLine === "firstResistance" && isRetestBounce(prev, cur, next, r1, r1, r1)) {
            if (cur.low > r1) { 
                previousID = currentID;
                currentID = "U3040";
                scenariosID.push({time: cur.time, id: "U3040"});
                magnetism = "Висока ( Шорт )";
                markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PFR R1", size: 2});
            } else if (cur.high < r1) { 
                previousID = currentID;
                currentID = "U3026";
                scenariosID.push({time: cur.time, id: "U3026"});
                magnetism = "Висока ( Шорт )";
                markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PFR R1", size: 2});
            }
        }

        // --- СЦЕНАРІЇ ДЛЯ ЛІНІЇ R2 ---
        const r2 = activeLevels.secondResistance;
        if (isBodyCrossedUp(prev, cur, next, r2, r2, r2)) {
            previousID = currentID;
            currentID = "U3013";
            scenariosID.push({time: cur.time, id: "U3013"});
            magnetism = "Середня ( Шорт )";
        }   
            
        if (isBodyCrossedDown(prev, cur, next, r2, r2, r2)) {
            previousID = currentID;
            currentID = "U3002";
            scenariosID.push({time: cur.time, id: "U3002"});
            magnetism = "Середня ( Шорт )";
        }

        if (isRetestDownToUp(prev, cur, next, r2, r2, r2)) {
            previousID = currentID;
            currentID = "U3020";
            scenariosID.push({time: cur.time, id: "U3020"});
            magnetism = "Середня ( Шорт )";
            markerRetest.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PR R2", size: 2});
        }
            
        if (isRetestUpToDown(prev, cur, next, r2, r2, r2)) {
            previousID = currentID;
            currentID = "U3034";
            scenariosID.push({time: cur.time, id: "U3034"});
            magnetism = "Середня ( Шорт )";
            markerRetest.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PR R2", size: 2});
        }

        if (closestLine === "secondResistance" && isRetestBounce(prev, cur, next, r2, r2, r2)) {
            if (cur.low > r2) { 
                previousID = currentID;
                currentID = "U3041";
                scenariosID.push({time: cur.time, id: "U3041"});
                magnetism = "Середня ( Шорт )";
                markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PFR R2", size: 2});
            } else if (cur.high < r2) { 
                previousID = currentID;
                currentID = "U3027";
                scenariosID.push({time: cur.time, id: "U3027"});
                magnetism = "Середня ( Шорт )";
                markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PFR R2", size: 2});
            }
        }

        // --- СЦЕНАРІЇ ДЛЯ ЛІНІЇ R3 ---
        const r3 = activeLevels.thirdResistance;
        if (isBodyCrossedUp(prev, cur, next, r3, r3, r3)) {
            previousID = currentID;
            currentID = "U3014";
            scenariosID.push({time: cur.time, id: "U3014"});
            magnetism = "Низька ( Шорт )";
        }   
            
        if (isBodyCrossedDown(prev, cur, next, r3, r3, r3)) {
            previousID = currentID;
            currentID = "U3001";
            scenariosID.push({time: cur.time, id: "U3001"});
            magnetism = "Низька ( Шорт )";
        }

        if (isRetestDownToUp(prev, cur, next, r3, r3, r3)) {
            previousID = currentID;
            currentID = "U3021";
            scenariosID.push({time: cur.time, id: "U3021"});
            magnetism = "Низька ( Шорт )";
            markerRetest.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PR R3", size: 2});
        }
            
        if (isRetestUpToDown(prev, cur, next, r3, r3, r3)) {
            previousID = currentID;
            currentID = "U3035";
            scenariosID.push({time: cur.time, id: "U3035"});
            magnetism = "Низька ( Шорт )";
            markerRetest.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PR R3", size: 2});
        }

        if (closestLine === "thirdResistance" && isRetestBounce(prev, cur, next, r3, r3, r3)) {
            if (cur.low > r3) { 
                previousID = currentID;
                currentID = "U3042";
                scenariosID.push({time: cur.time, id: "U3042"});
                magnetism = "Низька ( Шорт )";
                markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PFR R3", size: 2});
            } else if (cur.high < r3) { 
                previousID = currentID;
                currentID = "U3028";
                scenariosID.push({time: cur.time, id: "U3028"});
                magnetism = "Низька ( Шорт )";
                markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PFR R3", size: 2});
            }
        }

        // --- СЦЕНАРІЇ ДЛЯ ЛІНІЇ S1 ---
        const s1 = activeLevels.firstSupport;
        if (isBodyCrossedUp(prev, cur, next, s1, s1, s1)) {
            previousID = currentID;
            currentID = "U3010";
            scenariosID.push({time: cur.time, id: "U3010"});
            magnetism = "Висока ( Лонг )";
        }   
            
        if (isBodyCrossedDown(prev, cur, next, s1, s1, s1)) {
            previousID = currentID;
            currentID = "U3005";
            scenariosID.push({time: cur.time, id: "U3005"});
            magnetism = "Висока ( Лонг )";
        }

        if (isRetestDownToUp(prev, cur, next, s1, s1, s1)) {
            previousID = currentID;
            currentID = "U3017";
            scenariosID.push({time: cur.time, id: "U3017"});
            magnetism = "Висока ( Лонг )";
            markerRetest.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PR S1", size: 2});
        }
            
        if (isRetestUpToDown(prev, cur, next, s1, s1, s1)) {
            previousID = currentID;
            currentID = "U3031";
            scenariosID.push({time: cur.time, id: "U3031"});
            magnetism = "Висока ( Лонг )";
            markerRetest.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PR S1", size: 2});
        }

        if (closestLine === "firstSupport" && isRetestBounce(prev, cur, next, s1, s1, s1)) {
            if (cur.low > s1) { 
                previousID = currentID;
                currentID = "U3038";
                scenariosID.push({time: cur.time, id: "U3038"});
                magnetism = "Висока ( Лонг )";
                markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PFR S1", size: 2});
            } else if (cur.high < s1) { 
                previousID = currentID;
                currentID = "U3024";
                scenariosID.push({time: cur.time, id: "U3024"});
                magnetism = "Висока ( Лонг )";
                markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PFR S1", size: 2});
            }
        }

        // --- СЦЕНАРІЇ ДЛЯ ЛІНІЇ S2 ---
        const s2 = activeLevels.secondSupport;
        if (isBodyCrossedUp(prev, cur, next, s2, s2, s2)) {
            previousID = currentID;
            currentID = "U3009";
            scenariosID.push({time: cur.time, id: "U3009"});
            magnetism = "Середня ( Лонг )";
        }   
            
        if (isBodyCrossedDown(prev, cur, next, s2, s2, s2)) {
            previousID = currentID;
            currentID = "U3006";
            scenariosID.push({time: cur.time, id: "U3006"});
            magnetism = "Середня ( Лонг )";
        }

        if (isRetestDownToUp(prev, cur, next, s2, s2, s2)) {
            previousID = currentID;
            currentID = "U3016";
            scenariosID.push({time: cur.time, id: "U3016"});
            magnetism = "Середня ( Лонг )";
            markerRetest.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PR S2", size: 2});
        }
            
        if (isRetestUpToDown(prev, cur, next, s2, s2, s2)) {
            previousID = currentID;
            currentID = "U3030";
            scenariosID.push({time: cur.time, id: "U3030"});
            magnetism = "Середня ( Лонг )";
            markerRetest.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PR S2", size: 2});
        }

        if (closestLine === "secondSupport" && isRetestBounce(prev, cur, next, s2, s2, s2)) {
            if (cur.low > s2) { 
                previousID = currentID;
                currentID = "U3037";
                scenariosID.push({time: cur.time, id: "U3037"});
                magnetism = "Середня ( Лонг )";
                markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PFR S2", size: 2});
            } else if (cur.high < s2) { 
                previousID = currentID;
                currentID = "U3023";
                scenariosID.push({time: cur.time, id: "U3023"});
                magnetism = "Середня ( Лонг )";
                markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PFR S2", size: 2});
            }
        }

        // --- СЦЕНАРІЇ ДЛЯ ЛІНІЇ S3 ---
        const s3 = activeLevels.thirdSupport;
        if (isBodyCrossedUp(prev, cur, next, s3, s3, s3)) {
            previousID = currentID;
            currentID = "U3008";
            scenariosID.push({time: cur.time, id: "U3008"});
            magnetism = "Низька ( Лонг )";
        }   
            
        if (isBodyCrossedDown(prev, cur, next, s3, s3, s3)) {
            previousID = currentID;
            currentID = "U3007";
            scenariosID.push({time: cur.time, id: "U3007"});
            magnetism = "Низька ( Лонг )";
        }

        if (isRetestDownToUp(prev, cur, next, s3, s3, s3)) {
            previousID = currentID;
            currentID = "U3015";
            scenariosID.push({time: cur.time, id: "U3015"});
            magnetism = "Низька ( Лонг )";
            markerRetest.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PR S3", size: 2});
        }
            
        if (isRetestUpToDown(prev, cur, next, s3, s3, s3)) {
            previousID = currentID;
            currentID = "U3029";
            scenariosID.push({time: cur.time, id: "U3029"});
            magnetism = "Низька ( Лонг )";
            markerRetest.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PR S3", size: 2});
        }

        if (closestLine === "thirdSupport" && isRetestBounce(prev, cur, next, s3, s3, s3)) {
            if (cur.low > s3) { 
                previousID = currentID;
                currentID = "U3036";
                scenariosID.push({time: cur.time, id: "U3036"});
                magnetism = "Низька ( Лонг )";
                markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#1f07ff", shape: "arrowUp", text: "PFR S3", size: 2});
            } else if (cur.high < s3) { 
                previousID = currentID;
                currentID = "U3022";
                scenariosID.push({time: cur.time, id: "U3022"});
                magnetism = "Низька ( Лонг )";
                markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#1f07ff", shape: "arrowDown", text: "PFR S3", size: 2});
            }
        }
    }

    // Запис зібраних даних
    analyzeData.main.previousID = previousID;
    analyzeData.main.currentID = currentID;
    analyzeData.main.scenariosID = scenariosID;

    const { latest, previous } = getLatestAndPreviousScenarios(scenariosID);

    analyzeData.main.previousIDs = previous;
    analyzeData.main.currentIDs = latest;
    analyzeData.statusVis = 'block';
    
    // Аналіз поточної цінової зони для найсвіжішої закритої свічки
    const lastClosedCandle = data[data.length - 2];
    const activeLevelsLast = getActivePivotLevels(line.history, lastClosedCandle.time);
    
    if (activeLevelsLast) {
        // Передаємо activeLevelsLast у ваші допоміжні функції
        const zoneInfo = getPriceZoneWithPercentPP(lastClosedCandle, activeLevelsLast);
        const touchInfo = checkCurrentTouch(data, activeLevelsLast);

        analyzeData.additional.zone.valueX = zoneInfo.percent;

        if (zoneInfo.zone === "Між P і R1" ) analyzeData.additional.zone.currentID = "B7001";
        if (zoneInfo.zone === "Між S1 і P" ) analyzeData.additional.zone.currentID = "B7002";
        if (zoneInfo.zone === "Вище R3" ) analyzeData.additional.zone.currentID = "B7003";
        if (zoneInfo.zone === "Нижче S3" ) analyzeData.additional.zone.currentID = "B7004";
        if (zoneInfo.zone === "Між R1 і R2" ) analyzeData.additional.zone.currentID = "B7005";
        if (zoneInfo.zone === "Між R2 і R3" ) analyzeData.additional.zone.currentID = "B7006";
        if (zoneInfo.zone === "Між S2 і S1" ) analyzeData.additional.zone.currentID = "B7007";
        if (zoneInfo.zone === "Між S3 і S2" ) analyzeData.additional.zone.currentID = "B7008";

        if (touchInfo) {
            analyzeData.additional.touching.currentID = touchInfo.id;
        } else {
            analyzeData.additional.touching.currentID = "B1000";
        }
    }

    if (magnetism === "Низька ( Лонг )") analyzeData.additional.magnetism.currentID = "B7009";
    if (magnetism === "Середня ( Лонг )") analyzeData.additional.magnetism.currentID = "B7010";
    if (magnetism === "Висока ( Лонг )") analyzeData.additional.magnetism.currentID = "B7011";
    if (magnetism === "Максимальна") analyzeData.additional.magnetism.currentID = "B7012";
    if (magnetism === "Висока ( Шорт )") analyzeData.additional.magnetism.currentID = "B7013"; 
    if (magnetism === "Середня ( Шорт )") analyzeData.additional.magnetism.currentID = "B7014"; 
    if (magnetism === "Низька ( Шорт )") analyzeData.additional.magnetism.currentID = "B7015"; 

    return [...markerRetest, ...markerApproachAndRebound];
}

export function getPriceZoneWithPercentPP(cur, activeLevels) {
    const candleCenter = (cur.high + cur.low) / 2;

    // Створюємо впорядкований список рівнів для легкого пошуку
    const levels = [
        { name: "R3", val: activeLevels.thirdResistance },
        { name: "R2", val: activeLevels.secondResistance },
        { name: "R1", val: activeLevels.firstResistance },
        { name: "P",  val: activeLevels.pivotPoint },
        { name: "S1", val: activeLevels.firstSupport },
        { name: "S2", val: activeLevels.secondSupport },
        { name: "S3", val: activeLevels.thirdSupport }
    ].filter(l => l.val > 0); // Виключаємо рівні, які не розраховані (0)

    if (levels.length < 2) return { zone: "No Data", percent: 0 };

    // 1. Ціна вище найвищого рівня
    if (candleCenter > levels[0].val) {
        return { zone: `Вище ${levels[0].name}`, percent: 100 };
    }

    // 2. Ціна нижче найнижчого рівня
    if (candleCenter < levels[levels.length - 1].val) {
        return { zone: `Нижче ${levels[levels.length - 1].name}`, percent: 0 };
    }

    // 3. Пошук інтервалу
    for (let i = 0; i < levels.length - 1; i++) {
        const upper = levels[i];
        const lower = levels[i + 1];

        if (candleCenter <= upper.val && candleCenter >= lower.val) {
            const range = upper.val - lower.val;
            const position = candleCenter - lower.val;
            
            // 100% біля верхнього рівня, 0% біля нижнього
            const percent = range !== 0 ? (position / range) * 100 : 50;

            return {
                zone: `Між ${lower.name} і ${upper.name}`,
                percent: Math.round(percent),
                upperLevel: upper.name,
                lowerLevel: lower.name
            };
        }
    }

    return { zone: "Unknown", percent: 0 };
}

export const checkPivotSticky = (startIndex, dataKlines, levelValue, range = 6, threshold = 4) => {
    if (!levelValue || levelValue === 0 || startIndex < range) return { isSticky: false };

    let touches = 0;
    for (let k = 0; k < range; k++) {
        // Відновлено знак мінуса
        const candle = dataKlines[startIndex - k];
        if (levelValue >= candle.low && levelValue <= candle.high) touches++;
    }

    if (touches < threshold) return { isSticky: false };

    // Визначаємо сторону входу (контекст перед залипанням)
    const contextCandle = dataKlines[startIndex - range]; // Відновлено знак мінуса
    const contextPrice = (contextCandle.open + contextCandle.close) / 2;
    const entrySide = contextPrice > levelValue ? "ABOVE" : "BELOW";

    return { isSticky: true, entrySide };
};

export function checkCurrentTouch(data, activeLevels) {
    // Відновлено знаки мінуса
    const prev = data[data.length - 2]; // Попередня свічка
    const cur = data[data.length - 1];  // Поточна свічка (остання)

    // Масив рівнів з доданими ID з таблиці (Блочки 7.3 Торкання Pivot)
    const levels = [
        { 
            idTop: "B7016", idBot: "B7017",
            name: "R3", val: activeLevels.thirdResistance, 
            topL: 0.4, topS: 1.6, botL: 1.6, botS: 0.4 
        },
        { 
            idTop: "B7018", idBot: "B7019",
            name: "R2", val: activeLevels.secondResistance, 
            topL: 0.6, topS: 1.4, botL: 1.4, botS: 0.6 
        },
        { 
            idTop: "B7020", idBot: "B7021",
            name: "R1", val: activeLevels.firstResistance, 
            topL: 0.7, topS: 1.3, botL: 1.3, botS: 0.7 
        },
        { 
            idTop: "B7022", idBot: "B7023",
            name: "P",  val: activeLevels.pivotPoint, 
            topL: 0.8, topS: 1.2, botL: 1.2, botS: 0.8 
        },
        { 
            idTop: "B7024", idBot: "B7025",
            name: "S1", val: activeLevels.firstSupport, 
            topL: 1.3, topS: 0.7, botL: 0.7, botS: 1.3 
        },
        { 
            idTop: "B7026", idBot: "B7027",
            name: "S2", val: activeLevels.secondSupport, 
            topL: 1.4, topS: 0.6, botL: 0.6, botS: 1.4 
        },
        { 
            idTop: "B7028", idBot: "B7029",
            name: "S3", val: activeLevels.thirdSupport, 
            topL: 1.6, topS: 0.4, botL: 0.4, botS: 1.6 
        }
    ];

    for (const level of levels) {
        if (level.val === 0 || level.val === undefined) continue;

        const prevWasBelow = prev.high < level.val;
        const prevWasAbove = prev.low > level.val;
        const isTouchingNow = cur.low <= level.val && cur.high >= level.val;

        if (isTouchingNow) {
            if (prevWasBelow) {
                // Торкання знизу (from_bottom)
                return { 
                    id: level.idBot,
                    line: level.name, 
                    side: "from_bottom", 
                    text: `Торкання ${level.name} знизу`,
                    multiplierLong: level.botL,
                    multiplierShort: level.botS
                };
            } 
            if (prevWasAbove) {
                // Торкання зверху (from_top)
                return { 
                    id: level.idTop,
                    line: level.name, 
                    side: "from_top", 
                    text: `Торкання ${level.name} зверху`,
                    multiplierLong: level.topL,
                    multiplierShort: level.topS
                };
            }
        }
    }

    return null; // Торкання не виявлено
}