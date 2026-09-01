import { getLatestAndPreviousScenarios } from "../calcFunction/various/mathematical-func.js";
import { isBodyCrossedDown } from "./analyze-ma.js";
import { isBodyCrossedUp } from "./analyze-ma.js";
import { isRetestDownToUp } from "./analyze-ma.js";
import { isRetestUpToDown } from "./analyze-ma.js";
import { isRetestBounce } from "./analyze-ma.js";

export function analyzeWaves(analyzeData, data, startDot, wawe, dots, zigzag) {

    analyzeData.additional.waweZone.currentID = "B1000";
    analyzeData.additional.waweCountInCandle.currentID = "B1000";
    analyzeData.additional.waweTightness.currentID = "B1000";
    analyzeData.additional.waweZigzag.currentID = "B1000";
    analyzeData.additional.touching.currentID = "B1000";

    if (!wawe.wawe1Data.length && !wawe.wawe2Data.length && !wawe.wawe3Data.length && !wawe.wawe4Data.length && !wawe.wawe5Data.length) {
        analyzeData.main.previousID = "U2000";
        analyzeData.main.currentID = "U2000";
        analyzeData.main.scenariosID = [];

        analyzeData.main.previousIDs = [];
        analyzeData.main.currentIDs = [];
        return [];
    } 

    let markerApproachAndRebound = [];
    let markerRetest = [];

    let tightness = "";

    let previousID = "U2000";
    let currentID = "U2000";
    let scenariosID = [];

    // let currentZone = "";
    // console.log(dots[startDot].value);
    for (let i = dots[startDot].value + 1; i < data.length - 1; i++) {
        const prev = data[i - 1];
        const cur = data[i];
        const next = data[i + 1];
        const wIndex = i - dots[startDot].value + 1;

        tightness += Number(checkIsBetweenWaves(cur, wawe, wIndex, false));       

        const closest = getClosestWave(cur, wawe, wIndex);

        // сценарії для лонг
        if (startDot === 0) {

            if (wawe.wawe1Data.length && wawe.wawe1Data.length > wIndex + 1) {
                const flatStatus = checkLineFlatRange(i, data, wawe.wawe1Data, wIndex, 5, 3);
        
                if (flatStatus.isFlat) {
                    i = flatStatus.skipToIndex; // Пропускаємо 5 свічок

                    if (currentID !== "L6031") {
                        previousID = currentID;
                        currentID = "L6031";
                        scenariosID.push({time: data[i].time, id: "L6031"}); 
                    }                    

                    markerRetest = [];
                    markerApproachAndRebound = [];
                    continue; 
                }

                if (isBodyCrossedUp(prev, cur, next, wawe.wawe1Data[wIndex - 1].value, wawe.wawe1Data[wIndex].value, wawe.wawe1Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6006";
                    scenariosID.push({time: data[i].time, id: "L6006"}); 
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }   

                if (isBodyCrossedDown(prev, cur, next, wawe.wawe1Data[wIndex - 1].value, wawe.wawe1Data[wIndex].value, wawe.wawe1Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6005";
                    scenariosID.push({time: data[i].time, id: "L6005"}); 
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }

                if (isRetestDownToUp(prev, cur, next, wawe.wawe1Data[wIndex - 1].value, wawe.wawe1Data[wIndex].value, wawe.wawe1Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6011";
                    scenariosID.push({time: data[i].time, id: "L6011"}); 
                    markerRetest.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WR 1", size: 2});
                }

                if (isRetestUpToDown(prev, cur, next, wawe.wawe1Data[wIndex - 1].value, wawe.wawe1Data[wIndex].value, wawe.wawe1Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6021";
                    scenariosID.push({time: data[i].time, id: "L6021"}); 
                    markerRetest.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WR 1", size: 2});
                }

                if (closest === 1 && isRetestBounce(prev, cur, next, wawe.wawe1Data[wIndex - 1].value, wawe.wawe1Data[wIndex].value, wawe.wawe1Data[wIndex + 1].value)) {
                    if (cur.low > wawe.wawe1Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "L6026";
                        scenariosID.push({time: data[i].time, id: "L6026"}); 
                        markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WFR 1", size: 2});
                    } 
                    else if (cur.high < wawe.wawe1Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "L6016";
                        scenariosID.push({time: data[i].time, id: "L6016"});
                        markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WFR 1", size: 2});
                    }
                }
            }

            if (wawe.wawe2Data.length && wawe.wawe2Data.length > wIndex + 1) {
                const flatStatus = checkLineFlatRange(i, data, wawe.wawe2Data, wIndex, 5, 3);
        
                if (flatStatus.isFlat) {
                    i = flatStatus.skipToIndex; // Пропускаємо 5 свічок

                    if (currentID !== "L6032") {
                        previousID = currentID;
                        currentID = "L6032";
                        scenariosID.push({time: data[i].time, id: "L6032"});
                    }

                    markerRetest = [];
                    markerApproachAndRebound = [];
                    continue; 
                }

                if (isBodyCrossedUp(prev, cur, next, wawe.wawe2Data[wIndex - 1].value, wawe.wawe2Data[wIndex].value, wawe.wawe2Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6007";
                    scenariosID.push({time: data[i].time, id: "L6007"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }   

                if (isBodyCrossedDown(prev, cur, next, wawe.wawe2Data[wIndex - 1].value, wawe.wawe2Data[wIndex].value, wawe.wawe2Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6004";
                    scenariosID.push({time: data[i].time, id: "L6004"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }

                if (isRetestDownToUp(prev, cur, next, wawe.wawe2Data[wIndex - 1].value, wawe.wawe2Data[wIndex].value, wawe.wawe2Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6012";
                    scenariosID.push({time: data[i].time, id: "L6012"});
                    markerRetest.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WR 2", size: 2});
                }

                if (isRetestUpToDown(prev, cur, next, wawe.wawe2Data[wIndex - 1].value, wawe.wawe2Data[wIndex].value, wawe.wawe2Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6022";
                    scenariosID.push({time: data[i].time, id: "L6022"});
                    markerRetest.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WR 2", size: 2});
                }

                if (closest === 2 &&  isRetestBounce(prev, cur, next, wawe.wawe2Data[wIndex - 1].value, wawe.wawe2Data[wIndex].value, wawe.wawe2Data[wIndex + 1].value)) {
                    if (cur.low > wawe.wawe2Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "L6027";
                        scenariosID.push({time: data[i].time, id: "L6027"});
                        markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WFR 2", size: 2});
                    } 
                    else if (cur.high < wawe.wawe2Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "L6017";
                        scenariosID.push({time: data[i].time, id: "L6017"});
                        markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WFR 2", size: 2});
                    }
                }
            }

            if (wawe.wawe3Data.length && wawe.wawe3Data.length > wIndex + 1) {
                const flatStatus = checkLineFlatRange(i, data, wawe.wawe3Data, wIndex, 5, 3);
        
                if (flatStatus.isFlat) {
                    i = flatStatus.skipToIndex; // Пропускаємо 5 свічок
                    
                    if (currentID !== "L6033") {
                        previousID = currentID;
                        currentID = "L6033";
                        scenariosID.push({time: data[i].time, id: "L6033"});
                    }

                    markerRetest = [];
                    markerApproachAndRebound = [];
                    continue; 
                }                

                if (isBodyCrossedUp(prev, cur, next, wawe.wawe3Data[wIndex - 1].value, wawe.wawe3Data[wIndex].value, wawe.wawe3Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6008";
                    scenariosID.push({time: data[i].time, id: "L6008"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }   

                if (isBodyCrossedDown(prev, cur, next, wawe.wawe3Data[wIndex - 1].value, wawe.wawe3Data[wIndex].value, wawe.wawe3Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6003";
                    scenariosID.push({time: data[i].time, id: "L6003"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }

                if (isRetestDownToUp(prev, cur, next, wawe.wawe3Data[wIndex - 1].value, wawe.wawe3Data[wIndex].value, wawe.wawe3Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6013";
                    scenariosID.push({time: data[i].time, id: "L6013"});
                    markerRetest.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WR 3", size: 2});
                }

                if (isRetestUpToDown(prev, cur, next, wawe.wawe3Data[wIndex - 1].value, wawe.wawe3Data[wIndex].value, wawe.wawe3Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6023";
                    scenariosID.push({time: data[i].time, id: "L6023"});
                    markerRetest.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WR 3", size: 2});
                }

                if (closest === 3 &&  isRetestBounce(prev, cur, next, wawe.wawe3Data[wIndex - 1].value, wawe.wawe3Data[wIndex].value, wawe.wawe3Data[wIndex + 1].value)) {
                    if (cur.low > wawe.wawe3Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "L6028";
                        scenariosID.push({time: data[i].time, id: "L6028"});
                        markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WFR 3", size: 2});
                    } 
                    else if (cur.high < wawe.wawe3Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "L6018";
                        scenariosID.push({time: data[i].time, id: "L6018"});
                        markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WFR 3", size: 2});
                    }
                }
            }

            if (wawe.wawe4Data.length && wawe.wawe4Data.length > wIndex + 1) {
                const flatStatus = checkLineFlatRange(i, data, wawe.wawe4Data, wIndex, 5, 3);
        
                if (flatStatus.isFlat) {
                    i = flatStatus.skipToIndex; // Пропускаємо 5 свічок

                    if (currentID !== "L6034") {
                        previousID = currentID;
                        currentID = "L6034";
                        scenariosID.push({time: data[i].time, id: "L6034"});
                    }

                    markerRetest = [];
                    markerApproachAndRebound = [];
                    continue; 
                }  

                if (isBodyCrossedUp(prev, cur, next, wawe.wawe4Data[wIndex - 1].value, wawe.wawe4Data[wIndex].value, wawe.wawe4Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6009";
                    scenariosID.push({time: data[i].time, id: "L6009"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }   

                if (isBodyCrossedDown(prev, cur, next, wawe.wawe4Data[wIndex - 1].value, wawe.wawe4Data[wIndex].value, wawe.wawe4Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6002";
                    scenariosID.push({time: data[i].time, id: "L6002"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }

                if (isRetestDownToUp(prev, cur, next, wawe.wawe4Data[wIndex - 1].value, wawe.wawe4Data[wIndex].value, wawe.wawe4Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6014";
                    scenariosID.push({time: data[i].time, id: "L6014"});
                    markerRetest.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WR 4", size: 2});
                }

                if (isRetestUpToDown(prev, cur, next, wawe.wawe4Data[wIndex - 1].value, wawe.wawe4Data[wIndex].value, wawe.wawe4Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6024";
                    scenariosID.push({time: data[i].time, id: "L6024"});
                    markerRetest.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WR 4", size: 2});
                }

                if (closest === 4 && isRetestBounce(prev, cur, next, wawe.wawe4Data[wIndex - 1].value, wawe.wawe4Data[wIndex].value, wawe.wawe4Data[wIndex + 1].value)) {
                    if (cur.low > wawe.wawe4Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "L6029";
                        scenariosID.push({time: data[i].time, id: "L6029"});
                        markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WFR 4", size: 2});
                    } 
                    else if (cur.high < wawe.wawe4Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "L6019";
                        scenariosID.push({time: data[i].time, id: "L6019"});
                        markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WFR 4", size: 2});
                    }
                }
            }

            if (wawe.wawe5Data.length && wawe.wawe5Data.length > wIndex + 1) {
                const flatStatus = checkLineFlatRange(i, data, wawe.wawe5Data, wIndex, 5, 3);
        
                if (flatStatus.isFlat) {
                    i = flatStatus.skipToIndex; // Пропускаємо 5 свічок

                    if (currentID !== "L6035") {
                        previousID = currentID;
                        currentID = "L6035";
                        scenariosID.push({time: data[i].time, id: "L6035"});
                    }

                    markerRetest = [];
                    markerApproachAndRebound = [];
                    continue; 
                }  

                if (isBodyCrossedUp(prev, cur, next, wawe.wawe5Data[wIndex - 1].value, wawe.wawe5Data[wIndex].value, wawe.wawe5Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6010";
                    scenariosID.push({time: data[i].time, id: "L6010"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }   

                if (isBodyCrossedDown(prev, cur, next, wawe.wawe5Data[wIndex - 1].value, wawe.wawe5Data[wIndex].value, wawe.wawe5Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6001";
                    scenariosID.push({time: data[i].time, id: "L6001"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }

                if (isRetestDownToUp(prev, cur, next, wawe.wawe5Data[wIndex - 1].value, wawe.wawe5Data[wIndex].value, wawe.wawe5Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6015";
                    scenariosID.push({time: data[i].time, id: "L6015"});
                    markerRetest.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WR 5", size: 2});
                }

                if (isRetestUpToDown(prev, cur, next, wawe.wawe5Data[wIndex - 1].value, wawe.wawe5Data[wIndex].value, wawe.wawe5Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "L6025";
                    scenariosID.push({time: data[i].time, id: "L6025"});
                    markerRetest.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WR 5", size: 2});
                }

                if (closest === 5 &&  isRetestBounce(prev, cur, next, wawe.wawe5Data[wIndex - 1].value, wawe.wawe5Data[wIndex].value, wawe.wawe5Data[wIndex + 1].value)) {
                    if (cur.low > wawe.wawe5Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "L6030";
                        scenariosID.push({time: data[i].time, id: "L6030"});
                        markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WFR 5", size: 2});
                    } 
                    else if (cur.high < wawe.wawe5Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "L6020";
                        scenariosID.push({time: data[i].time, id: "L6020"});
                        markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WFR 5", size: 2});
                    }
                }
            }
        }
        // сценарії для шорт
        if (startDot === 1) {

            if (wawe.wawe1Data.length && wawe.wawe1Data.length > wIndex + 1) {
                const flatStatus = checkLineFlatRange(i, data, wawe.wawe1Data, wIndex, 5, 3);
        
                if (flatStatus.isFlat) {
                    i = flatStatus.skipToIndex; // Пропускаємо 5 свічок

                    if (currentID !== "S6031") {
                        previousID = currentID;
                        currentID = "S6031";
                        scenariosID.push({time: data[i].time, id: "S6031"});
                    }

                    markerRetest = [];
                    markerApproachAndRebound = [];
                    continue; 
                }

                if (isBodyCrossedUp(prev, cur, next, wawe.wawe1Data[wIndex - 1].value, wawe.wawe1Data[wIndex].value, wawe.wawe1Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6010";
                    scenariosID.push({time: data[i].time, id: "S6010"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }   

                if (isBodyCrossedDown(prev, cur, next, wawe.wawe1Data[wIndex - 1].value, wawe.wawe1Data[wIndex].value, wawe.wawe1Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6001";
                    scenariosID.push({time: data[i].time, id: "S6001"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }

                if (isRetestDownToUp(prev, cur, next, wawe.wawe1Data[wIndex - 1].value, wawe.wawe1Data[wIndex].value, wawe.wawe1Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6021";
                    scenariosID.push({time: data[i].time, id: "S6021"});
                    markerRetest.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WR 1", size: 2});
                }

                if (isRetestUpToDown(prev, cur, next, wawe.wawe1Data[wIndex - 1].value, wawe.wawe1Data[wIndex].value, wawe.wawe1Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6015";
                    scenariosID.push({time: data[i].time, id: "S6015"});
                    markerRetest.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WR 1", size: 2});
                }

                if (closest === 1 && isRetestBounce(prev, cur, next, wawe.wawe1Data[wIndex - 1].value, wawe.wawe1Data[wIndex].value, wawe.wawe1Data[wIndex + 1].value)) {
                    if (cur.low > wawe.wawe1Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "S6020";
                        scenariosID.push({time: data[i].time, id: "S6020"});
                        markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WFR 1", size: 2});
                    } 
                    else if (cur.high < wawe.wawe1Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "S6026";
                        scenariosID.push({time: data[i].time, id: "S6026"});
                        markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WFR 1", size: 2});
                    }
                }
            }

            if (wawe.wawe2Data.length && wawe.wawe2Data.length > wIndex + 1) {
                const flatStatus = checkLineFlatRange(i, data, wawe.wawe2Data, wIndex, 5, 3);
        
                if (flatStatus.isFlat) {
                    i = flatStatus.skipToIndex; // Пропускаємо 5 свічок

                    if (currentID !== "S6032") {
                        previousID = currentID;
                        currentID = "S6032";
                        scenariosID.push({time: data[i].time, id: "S6032"});
                    }

                    markerRetest = [];
                    markerApproachAndRebound = [];
                    continue; 
                }

                if (isBodyCrossedUp(prev, cur, next, wawe.wawe2Data[wIndex - 1].value, wawe.wawe2Data[wIndex].value, wawe.wawe2Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6009";
                    scenariosID.push({time: data[i].time, id: "S6009"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }   

                if (isBodyCrossedDown(prev, cur, next, wawe.wawe2Data[wIndex - 1].value, wawe.wawe2Data[wIndex].value, wawe.wawe2Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6002";
                    scenariosID.push({time: data[i].time, id: "S6002"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }

                if (isRetestDownToUp(prev, cur, next, wawe.wawe2Data[wIndex - 1].value, wawe.wawe2Data[wIndex].value, wawe.wawe2Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6022";
                    scenariosID.push({time: data[i].time, id: "S6022"});
                    markerRetest.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WR 2", size: 2});
                }

                if (isRetestUpToDown(prev, cur, next, wawe.wawe2Data[wIndex - 1].value, wawe.wawe2Data[wIndex].value, wawe.wawe2Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6014";
                    scenariosID.push({time: data[i].time, id: "S6014"});
                    markerRetest.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WR 2", size: 2});
                }

                if (closest === 2 &&  isRetestBounce(prev, cur, next, wawe.wawe2Data[wIndex - 1].value, wawe.wawe2Data[wIndex].value, wawe.wawe2Data[wIndex + 1].value)) {
                    if (cur.low > wawe.wawe2Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "S6019";
                        scenariosID.push({time: data[i].time, id: "S6019"});
                        markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WFR 2", size: 2});
                    } 
                    else if (cur.high < wawe.wawe2Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "S6027";
                        scenariosID.push({time: data[i].time, id: "S6027"});
                        markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WFR 2", size: 2});
                    }
                }
            }

            if (wawe.wawe3Data.length && wawe.wawe3Data.length > wIndex + 1) {
                const flatStatus = checkLineFlatRange(i, data, wawe.wawe3Data, wIndex, 5, 3);
        
                if (flatStatus.isFlat) {
                    i = flatStatus.skipToIndex; // Пропускаємо 5 свічок

                    if (currentID !== "S6033") {
                        previousID = currentID;
                        currentID = "S6033";
                        scenariosID.push({time: data[i].time, id: "S6033"});
                    }

                    markerRetest = [];
                    markerApproachAndRebound = [];
                    continue; 
                }                

                if (isBodyCrossedUp(prev, cur, next, wawe.wawe3Data[wIndex - 1].value, wawe.wawe3Data[wIndex].value, wawe.wawe3Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6008";
                    scenariosID.push({time: data[i].time, id: "S6008"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }   

                if (isBodyCrossedDown(prev, cur, next, wawe.wawe3Data[wIndex - 1].value, wawe.wawe3Data[wIndex].value, wawe.wawe3Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6003";
                    scenariosID.push({time: data[i].time, id: "S6003"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }

                if (isRetestDownToUp(prev, cur, next, wawe.wawe3Data[wIndex - 1].value, wawe.wawe3Data[wIndex].value, wawe.wawe3Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6023";
                    scenariosID.push({time: data[i].time, id: "S6023"});
                    markerRetest.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WR 3", size: 2});
                }

                if (isRetestUpToDown(prev, cur, next, wawe.wawe3Data[wIndex - 1].value, wawe.wawe3Data[wIndex].value, wawe.wawe3Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6013";
                    scenariosID.push({time: data[i].time, id: "S6013"});
                    markerRetest.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WR 3", size: 2});
                }

                if (closest === 3 &&  isRetestBounce(prev, cur, next, wawe.wawe3Data[wIndex - 1].value, wawe.wawe3Data[wIndex].value, wawe.wawe3Data[wIndex + 1].value)) {
                    if (cur.low > wawe.wawe3Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "S6018";
                        scenariosID.push({time: data[i].time, id: "S6018"});
                        markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WFR 3", size: 2});
                    } 
                    else if (cur.high < wawe.wawe3Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "S6028";
                        scenariosID.push({time: data[i].time, id: "S6028"});
                        markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WFR 3", size: 2});
                    }
                }
            }

            if (wawe.wawe4Data.length && wawe.wawe4Data.length > wIndex + 1) {
                const flatStatus = checkLineFlatRange(i, data, wawe.wawe4Data, wIndex, 5, 3);
        
                if (flatStatus.isFlat) {
                    i = flatStatus.skipToIndex; // Пропускаємо 5 свічок

                    if (currentID !== "S6034") {
                        previousID = currentID;
                        currentID = "S6034";
                        scenariosID.push({time: data[i].time, id: "S6034"});
                    }

                    markerRetest = [];
                    markerApproachAndRebound = [];
                    continue; 
                }  

                if (isBodyCrossedUp(prev, cur, next, wawe.wawe4Data[wIndex - 1].value, wawe.wawe4Data[wIndex].value, wawe.wawe4Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6007";
                    scenariosID.push({time: data[i].time, id: "S6007"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }   

                if (isBodyCrossedDown(prev, cur, next, wawe.wawe4Data[wIndex - 1].value, wawe.wawe4Data[wIndex].value, wawe.wawe4Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6004";
                    scenariosID.push({time: data[i].time, id: "S6004"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }

                if (isRetestDownToUp(prev, cur, next, wawe.wawe4Data[wIndex - 1].value, wawe.wawe4Data[wIndex].value, wawe.wawe4Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6024";
                    scenariosID.push({time: data[i].time, id: "S6024"});
                    markerRetest.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WR 4", size: 2});
                }

                if (isRetestUpToDown(prev, cur, next, wawe.wawe4Data[wIndex - 1].value, wawe.wawe4Data[wIndex].value, wawe.wawe4Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6012";
                    scenariosID.push({time: data[i].time, id: "S6012"});
                    markerRetest.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WR 4", size: 2});
                }

                if (closest === 4 && isRetestBounce(prev, cur, next, wawe.wawe4Data[wIndex - 1].value, wawe.wawe4Data[wIndex].value, wawe.wawe4Data[wIndex + 1].value)) {
                    if (cur.low > wawe.wawe4Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "S6017";
                        scenariosID.push({time: data[i].time, id: "S6017"});
                        markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WFR 4", size: 2});
                    } 
                    else if (cur.high < wawe.wawe4Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "S6029";
                        scenariosID.push({time: data[i].time, id: "S6029"});
                        markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WFR 4", size: 2});
                    }
                }
            }

            if (wawe.wawe5Data.length && wawe.wawe5Data.length > wIndex + 1) {
                const flatStatus = checkLineFlatRange(i, data, wawe.wawe5Data, wIndex, 5, 3);
        
                if (flatStatus.isFlat) {
                    i = flatStatus.skipToIndex; // Пропускаємо 5 свічок

                    if (currentID !== "S6035") {
                        previousID = currentID;
                        currentID = "S6035";
                        scenariosID.push({time: data[i].time, id: "S6035"});
                    }

                    markerRetest = [];
                    markerApproachAndRebound = [];
                    continue; 
                }  

                if (isBodyCrossedUp(prev, cur, next, wawe.wawe5Data[wIndex - 1].value, wawe.wawe5Data[wIndex].value, wawe.wawe5Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6006";
                    scenariosID.push({time: data[i].time, id: "S6006"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }   

                if (isBodyCrossedDown(prev, cur, next, wawe.wawe5Data[wIndex - 1].value, wawe.wawe5Data[wIndex].value, wawe.wawe5Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6005";
                    scenariosID.push({time: data[i].time, id: "S6005"});
                    markerApproachAndRebound = [];
                    markerRetest = [];
                    tightness = 0;
                }

                if (isRetestDownToUp(prev, cur, next, wawe.wawe5Data[wIndex - 1].value, wawe.wawe5Data[wIndex].value, wawe.wawe5Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6025";
                    scenariosID.push({time: data[i].time, id: "S6025"});
                    markerRetest.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WR 5", size: 2});
                }

                if (isRetestUpToDown(prev, cur, next, wawe.wawe5Data[wIndex - 1].value, wawe.wawe5Data[wIndex].value, wawe.wawe5Data[wIndex + 1].value)) {
                    previousID = currentID;
                    currentID = "S6011";
                    scenariosID.push({time: data[i].time, id: "S6011"});
                    markerRetest.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WR 5", size: 2});
                }

                if (closest === 5 &&  isRetestBounce(prev, cur, next, wawe.wawe5Data[wIndex - 1].value, wawe.wawe5Data[wIndex].value, wawe.wawe5Data[wIndex + 1].value)) {
                    if (cur.low > wawe.wawe5Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "S6016";
                        scenariosID.push({time: data[i].time, id: "S6016"});
                        markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: "#17d6b6", shape: "arrowUp", text: "WFR 5", size: 2});
                    } 
                    else if (cur.high < wawe.wawe5Data[wIndex].value) { 
                        previousID = currentID;
                        currentID = "S6030";
                        scenariosID.push({time: data[i].time, id: "S6030"});
                        markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: "#17d6b6", shape: "arrowDown", text: "WFR 5", size: 2});
                    }
                }
            }
        }
    }

    // ——— Вивід у DOM ———
    analyzeData.main.previousID = previousID;
    analyzeData.main.currentID = currentID;
    analyzeData.main.scenariosID = scenariosID;

    const { latest, previous } = getLatestAndPreviousScenarios(scenariosID);

    analyzeData.main.previousIDs = previous;
    analyzeData.main.currentIDs = latest;

    let regim = startDot === 0 ? "Long" : "Short";
    
    const currentZone = getPriceZoneWithPercent(data[data.length - 1], wawe, data.length - 1 - dots[startDot].value + 1, regim);
    const waveSearch = countWavesInCandle(data[data.length - 1], wawe, data.length - 1 - dots[startDot].value + 1, startDot ? "down" : "up");

    analyzeData.additional.waweZone.currentID = currentZone.id;
    analyzeData.additional.waweZone.valueX = currentZone.percent;

    analyzeData.additional.waweZone.valueX = tightness;

    analyzeData.additional.waweCountInCandle.valueX = waveSearch.count > 1 ? waveSearch.count : "";

    if (data[data.length - 1].close > data[data.length - 1].open) {
        if (tightness) {
            analyzeData.additional.waweTightness.currentID = "B4013";
        }
        
        if (waveSearch.count > 1) {
            analyzeData.additional.waweCountInCandle.currentID = "B4015";
        }
    } else {
        if (tightness) {
            analyzeData.additional.waweTightness.currentID = "B4014";
        }

        if (waveSearch.count > 1) {
            analyzeData.additional.waweCountInCandle.currentID = "B4016";
        }
    } 

    if (currentZone.zone !== "Нище W1" && currentZone.zone !== "Вище W1") { 
        if (data[zigzag.points[zigzag.points.length - 2]].high === zigzag.line[zigzag.line.length - 2].value) {
            analyzeData.additional.waweZigzag.currentID = "B4017";
            analyzeData.additional.waweZigzag.valueX = data.length - 1 - zigzag.points[zigzag.points.length - 2];
        } else {
            analyzeData.additional.waweZigzag.currentID = "B4018";
            analyzeData.additional.waweZigzag.valueX = data.length - 1 - zigzag.points[zigzag.points.length - 2];
        }
    }

    const waveTouch = checkCurrentWaveTouch(data, wawe, dots[startDot].value, regim);

    if (waveTouch) {
        analyzeData.additional.touching.currentID = waveTouch.id;
    } else {
        analyzeData.additional.touching.currentID = "B1000";
    }

    return [...markerRetest, ...markerApproachAndRebound];
}

function getClosestWave(cur, wawe, wIndex) {
    const candleCenter = (cur.high + cur.low) / 2;
    let minDiff = Infinity;
    let closestWaveNum = null;

    // Список ключів хвиль для ітерації
    const waveKeys = ['wawe1Data', 'wawe2Data', 'wawe3Data', 'wawe4Data', 'wawe5Data'];

    waveKeys.forEach((key, index) => {
        const waveArray = wawe[key];
        // Перевіряємо чи існує масив і чи є в ньому дані для поточного індексу
        if (waveArray && waveArray.length > wIndex) {
            const waveValue = waveArray[wIndex].value;
            const diff = Math.abs(candleCenter - waveValue);

            if (diff < minDiff) {
                minDiff = diff;
                closestWaveNum = index + 1; // 1, 2, 3, 4 або 5
            }
        }
    });

    return closestWaveNum ? closestWaveNum : null;
}

const checkLineFlatRange = (startIndex, dataKlines, lineData, startLine, range = 5, threshold = 3) => {
    let touches = 0;

    for (let k = 0; k < range; k++) {
        const checkIdx = startIndex + k;       // Індекс свічки
        const lineIdx = startLine + k;        // Індекс лінії (відносно її старту)

        // Перевірка на вихід за межі масивів
        if (checkIdx >= dataKlines.length || !lineData[lineIdx]) break;

        const candle = dataKlines[checkIdx];
        const lineValue = lineData[lineIdx].value;

        if (lineValue === undefined || lineValue === null) continue;

        // Перевірка, чи лінія в межах тіла або тіней свічки
        if (lineValue >= candle.low && lineValue <= candle.high) {
            touches++;
        }
    }

    // Якщо кількість торкань досягла або перевищила поріг
    if (touches >= threshold) {
        return {
            isFlat: true,
            skipToIndex: startIndex + (range - 1), // Пропонуємо пропустити перевірений діапазон
            touches: touches
        };
    }

    return { isFlat: false };
};

function checkIsBetweenWaves(cur, wawe, wIndex, strict = false) {
    // 1. Збираємо всі існуючі значення хвиль для цього моменту
    const levels = [];
    const waveKeys = ['wawe1Data', 'wawe2Data', 'wawe3Data', 'wawe4Data', 'wawe5Data'];

    waveKeys.forEach((key, index) => {
        if (wawe[key] && wawe[key][wIndex]) {
            levels.push({ num: index + 1, val: wawe[key][wIndex].value });
        }
    });

    // Якщо менше двох хвиль, ми не можемо бути "між" ними
    if (levels.length < 2) return false;

    // 2. Сортуємо хвилі від найвищої до найнижчої ціни
    levels.sort((a, b) => b.val - a.val);

    const candleTop = cur.high;
    const candleBottom = cur.low;
    const candleCenter = (candleTop + candleBottom) / 2;

    // 3. Шукаємо пару хвиль, між якими знаходиться ціна
    for (let i = 0; i < levels.length - 1; i++) {
        const upperWave = levels[i];
        const lowerWave = levels[i + 1];

        let isInside = false;

        if (strict) {
            // Свічка повністю всередині каналу (не торкається хвиль)
            isInside = candleTop < upperWave.val && candleBottom > lowerWave.val;
        } else {
            // Тільки центр свічки знаходиться між хвилями
            isInside = candleCenter < upperWave.val && candleCenter > lowerWave.val;
        }

        if (isInside) {
            const range = upperWave.val - lowerWave.val;
            const position = candleCenter - lowerWave.val;
            const percent = range !== 0 ? (position / range) * 100 : 50;

            return true;
        }
    }

    // Якщо ціна вище найвищої або нижче найнижчої
    return false;
}

function getPriceZoneWithPercent(cur, wawe, wIndex, regim = 'Long') {
    const candleCenter = (cur.high + cur.low) / 2;

    // Збираємо активні хвилі
    const levels = [];
    if (wawe.wawe1Data[wIndex]) levels.push({ num: 1, val: wawe.wawe1Data[wIndex].value });
    if (wawe.wawe2Data[wIndex]) levels.push({ num: 2, val: wawe.wawe2Data[wIndex].value });
    if (wawe.wawe3Data[wIndex]) levels.push({ num: 3, val: wawe.wawe3Data[wIndex].value });
    if (wawe.wawe4Data[wIndex]) levels.push({ num: 4, val: wawe.wawe4Data[wIndex].value });
    if (wawe.wawe5Data[wIndex]) levels.push({ num: 5, val: wawe.wawe5Data[wIndex].value });

    if (levels.length === 0) return { id: null, zone: "No Data", text: "No Data", percent: 0, mLong: 1.0, mShort: 1.0 };

    // Сортуємо: верхні рівні на початку (вища ціна)
    levels.sort((a, b) => b.val - a.val);

    const isLong = regim === 'Long';

    // 1. Ціна вище всіх хвиль (B4009 для Лонг, B4010 для Шорт)
    if (candleCenter > levels[0].val) {
        const id = isLong ? "B4009" : "B4010";
        const text = isLong ? `Вище WX` : `Вище W1`;
        return { 
            id: id,
            zone: `Вище W${levels[0].num}`, 
            text: text,
            percent: 100,
            mLong: isLong ? 0.5 : 1.5, 
            mShort: isLong ? 1.5 : 0.5 
        };
    }

    // 2. Ціна нижче всіх хвиль (B4011 для Лонг, B4012 для Шорт)
    if (candleCenter < levels[levels.length - 1].val) {
        const id = isLong ? "B4011" : "B4012";
        const text = isLong ? `Нище W1` : `Нище WX`;
        return { 
            id: id,
            zone: `Нижче W${levels[levels.length - 1].num}`, 
            text: text,
            percent: 0,
            mLong: isLong ? 1.5 : 0.5, 
            mShort: isLong ? 0.5 : 1.5 
        };
    }

    // 3. Ціна всередині каналу між хвилями (B4001 - B4008)
    for (let j = 0; j < levels.length - 1; j++) {
        const upper = levels[j];
        const lower = levels[j + 1];

        if (candleCenter <= upper.val && candleCenter >= lower.val) {
            const range = upper.val - lower.val;
            const position = candleCenter - lower.val;
            let percent = range !== 0 ? (position / range) * 100 : 50;

            const wPair = [upper.num, lower.num].sort(); 
            const pairKey = `${wPair[0]}-${wPair[1]}`;

            let id = null;
            let mLong = 1.0;
            let mShort = 1.0;

            switch (pairKey) {
                case '1-2':
                    id = isLong ? "B4001" : "B4002";
                    mLong = isLong ? 1.1 : 0.9;
                    mShort = isLong ? 0.9 : 1.1;
                    break;
                case '2-3':
                    id = isLong ? "B4003" : "B4004";
                    mLong = isLong ? 1.2 : 0.8;
                    mShort = isLong ? 0.8 : 1.2;
                    break;
                case '3-4':
                    id = isLong ? "B4005" : "B4006";
                    mLong = isLong ? 1.3 : 0.7;
                    mShort = isLong ? 0.7 : 1.3;
                    break;
                case '4-5':
                    id = isLong ? "B4007" : "B4008";
                    mLong = isLong ? 1.2 : 0.8;
                    mShort = isLong ? 0.8 : 1.2;
                    break;
            }

            const roundedPercent = Math.round(percent);

            return {
                id: id,
                zone: `Між W${lower.num} і W${upper.num}`,
                text: `Між W${lower.num} i W${upper.num} ${roundedPercent}%`,
                percent: roundedPercent,
                upperWave: upper.num,
                lowerWave: lower.num,
                mLong: mLong,
                mShort: mShort
            };
        }
    }

    return { id: null, zone: "Unknown", text: "Unknown", percent: 0, mLong: 1.0, mShort: 1.0 };
}

// function getPriceZoneWithPercent(cur, wawe, wIndex, mode = 'up') {
//     const candleCenter = (cur.high + cur.low) / 2;

//     // Збираємо активні хвилі
//     const levels = [];
//     if (wawe.wawe1Data[wIndex]) levels.push({ num: 1, val: wawe.wawe1Data[wIndex].value });
//     if (wawe.wawe2Data[wIndex]) levels.push({ num: 2, val: wawe.wawe2Data[wIndex].value });
//     if (wawe.wawe3Data[wIndex]) levels.push({ num: 3, val: wawe.wawe3Data[wIndex].value });
//     if (wawe.wawe4Data[wIndex]) levels.push({ num: 4, val: wawe.wawe4Data[wIndex].value });
//     if (wawe.wawe5Data[wIndex]) levels.push({ num: 5, val: wawe.wawe5Data[wIndex].value });

//     if (levels.length === 0) return { zone: "No Data", percent: 0, mLong: 1.0, mShort: 1.0 };

//     // Сортуємо: верхні рівні на початку (вища ціна)
//     levels.sort((a, b) => b.val - a.val);

//     // Множники за замовчуванням
//     let mLong = 1.0;
//     let mShort = 1.0;

//     // 1. Ціна вище всіх хвиль (Блочок №44)
//     if (candleCenter > levels[0].val) {
//         return { 
//             zone: `Вище W${levels[0].num}`, 
//             percent: 100,
//             mLong: 0.5, // №44 
//             mShort: 1.5 // №44 
//         };
//     }

//     // 2. Ціна нижче всіх хвиль (Блочок №45)
//     if (candleCenter < levels[levels.length - 1].val) {
//         return { 
//             zone: `Нижче W${levels[levels.length - 1].num}`, 
//             percent: 0,
//             mLong: 1.5, // №45 
//             mShort: 0.5 // №45 
//         };
//     }

//     // 3. Ціна всередині каналу між хвилями (Блочки №40-43)
//     for (let j = 0; j < levels.length - 1; j++) {
//         const upper = levels[j];
//         const lower = levels[j + 1];

//         if (candleCenter <= upper.val && candleCenter >= lower.val) {
//             const range = upper.val - lower.val;
//             const position = candleCenter - lower.val;
//             let percent = range !== 0 ? (position / range) * 100 : 50;

//             // Визначаємо пару хвиль для множників (наприклад, 1 і 2, або 2 і 3)
//             const wPair = [upper.num, lower.num].sort(); 
//             const pairKey = `${wPair[0]}-${wPair[1]}`;

//             switch (pairKey) {
//                 case '1-2': // Блочок №40 
//                     mLong = 1.1; mShort = 0.9;
//                     break;
//                 case '2-3': // Блочок №41 
//                     mLong = 1.2; mShort = 0.8;
//                     break;
//                 case '3-4': // Блочок №42 
//                     mLong = 1.3; mShort = 0.7;
//                     break;
//                 case '4-5': // Блочок №43 
//                     mLong = 1.2; mShort = 0.8;
//                     break;
//             }

//             return {
//                 zone: `Між W${lower.num} і W${upper.num}`,
//                 percent: Math.round(percent),
//                 upperWave: upper.num,
//                 lowerWave: lower.num,
//                 mLong: mLong,
//                 mShort: mShort
//             };
//         }
//     }

//     return { zone: "Unknown", percent: 0, mLong: 1.0, mShort: 1.0 };
// }

function countWavesInCandle(cur, wawe, wIndex) {
    const candleHigh = cur.high;
    const candleLow = cur.low;
    
    let count = 0;
    let insideWaves = []; // Номери хвиль, що всередині

    const waveKeys = ['wawe1Data', 'wawe2Data', 'wawe3Data', 'wawe4Data', 'wawe5Data'];

    waveKeys.forEach((key, index) => {
        const waveArray = wawe[key];
        
        // Перевіряємо наявність даних для цієї хвилі на поточному кроці
        if (waveArray && waveArray[wIndex] && waveArray[wIndex].value !== null) {
            const waveVal = waveArray[wIndex].value;

            // Перевірка: чи значення хвилі знаходиться в межах свічки
            if (waveVal >= candleLow && waveVal <= candleHigh) {
                count++;
                insideWaves.push(index + 1); // Додаємо номер хвилі (1-5)
            }
        }
    });

    return {
        count: count,             // Загальна кількість хвиль у свічці
        waves: insideWaves,       // Масив номерів (наприклад, [1, 2, 4])
        isClustered: count >= 3   // Прапор, якщо 3 або більше хвиль зійшлися (кластер)
    };
}

function checkCurrentWaveTouch(data, wawe, startDotIndex, regim) {
    const lastCur = data[data.length - 1];
    const lastPrev = data[data.length - 2];
    
    // Розраховуємо індекси хвиль для поточної та попередньої свічки
    const curWIndex = (data.length - 1) - startDotIndex + 1;
    const prevWIndex = (data.length - 2) - startDotIndex + 1;

    // Перелік хвиль для перевірки
    const waveKeys = [
        { id: 1, data: wawe.wawe1Data, name: "W1" },
        { id: 2, data: wawe.wawe2Data, name: "W2" },
        { id: 3, data: wawe.wawe3Data, name: "W3" },
        { id: 4, data: wawe.wawe4Data, name: "W4" },
        { id: 5, data: wawe.wawe5Data, name: "W5" }
    ];

    // Мапа ID відносно режиму, торкання (top/bottom) та id хвилі (1-5)
    const idMap = {
        Long: {
            top: { 1: "B4019", 2: "B4020", 3: "B4021", 4: "B4022", 5: "B4023" },
            bottom: { 1: "B4029", 2: "B4030", 3: "B4031", 4: "B4032", 5: "B4033" }
        },
        Short: {
            top: { 1: "B4024", 2: "B4025", 3: "B4026", 4: "B4027", 5: "B4028" },
            bottom: { 1: "B4034", 2: "B4035", 3: "B4036", 4: "B4037", 5: "B4038" }
        }
    };

    for (const w of waveKeys) {
        // 1. Перевірка чи хвиля існує і чи є дані для обох індексів
        if (w.data && w.data.length > curWIndex && w.data[curWIndex] && w.data[prevWIndex]) {
            
            const curWaveVal = w.data[curWIndex].value;
            const prevWaveVal = w.data[prevWIndex].value;

            // 2. Перевірка чи попередня свічка була СТРОГО поза лінією
            const prevWasStrictlyAbove = lastPrev.low > prevWaveVal;
            const prevWasStrictlyBelow = lastPrev.high < prevWaveVal;

            // 3. Перевірка чи поточна свічка торкається лінії зараз
            const isTouchingNow = lastCur.low <= curWaveVal && lastCur.high >= curWaveVal;

            if (isTouchingNow && (prevWasStrictlyAbove || prevWasStrictlyBelow)) {
                const side = prevWasStrictlyAbove ? "top" : "bottom";
                const blockId = idMap[regim]?.[side]?.[w.id] || null;

                // Визначення множників залежно від комбінації
                const isLongBoost = (regim === "Long" && side === "top") || (regim === "Short" && side === "bottom");

                return {
                    id: blockId,
                    name: w.name,
                    side: side,
                    text: prevWasStrictlyAbove 
                        ? `Торкання ${w.name} зверху` 
                        : `Торкання ${w.name} знизу`,
                    multiplierLong: isLongBoost ? 1.3 : 0.7,
                    multiplierShort: isLongBoost ? 0.7 : 1.3,
                };
            }
        }
    }

    return null; // Торкання не виявлено
}

// function checkCurrentWaveTouch(data, wawe, startDotIndex, regim) {
//     const lastCur = data[data.length - 1];
//     const lastPrev = data[data.length - 2];
    
//     // Розраховуємо індекси хвиль для поточної та попередньої свічки
//     const curWIndex = (data.length - 1) - startDotIndex + 1;
//     const prevWIndex = (data.length - 2) - startDotIndex + 1;

//     // Перелік хвиль для перевірки
//     const waveKeys = [
//         { id: 1, data: wawe.wawe1Data, name: "W1" },
//         { id: 2, data: wawe.wawe2Data, name: "W2" },
//         { id: 3, data: wawe.wawe3Data, name: "W3" },
//         { id: 4, data: wawe.wawe4Data, name: "W4" },
//         { id: 5, data: wawe.wawe5Data, name: "W5" }
//     ];

//     for (const w of waveKeys) {
//         // 1. Перевірка чи хвиля існує і чи є дані для обох індексів
//         if (w.data && w.data.length > curWIndex && w.data[curWIndex] && w.data[prevWIndex]) {
            
//             const curWaveVal = w.data[curWIndex].value;
//             const prevWaveVal = w.data[prevWIndex].value;

//             // 2. Перевірка чи попередня свічка була СТРОГО поза лінією
//             const prevWasStrictlyAbove = lastPrev.low > prevWaveVal;
//             const prevWasStrictlyBelow = lastPrev.high < prevWaveVal;

//             // 3. Перевірка чи поточна свічка торкається лінії зараз
//             const isTouchingNow = lastCur.low <= curWaveVal && lastCur.high >= curWaveVal;

//             if (isTouchingNow && (prevWasStrictlyAbove || prevWasStrictlyBelow)) {
//                 return {
//                     name: w.name,
//                     side: prevWasStrictlyAbove ? "top" : "bottom",
//                     text: prevWasStrictlyAbove 
//                         ? `Торкання ${w.name} зверху` 
//                         : `Торкання ${w.name} знизу`,
//                     multiplierLong: prevWasStrictlyAbove ? 1.3 : 0.7,
//                     multiplierShort: prevWasStrictlyAbove ? 0.7 : 1.3,
//                 };
//             }
//         }
//     }

//     return null; // Торкання не виявлено
// }