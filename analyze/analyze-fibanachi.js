import { getLatestAndPreviousScenarios } from "../calcFunction/various/mathematical-func.js";
import { isBodyCrossedDown } from "./analyze-ma.js";
import { isBodyCrossedUp } from "./analyze-ma.js";
import { isRetestDownToUp } from "./analyze-ma.js";
import { isRetestUpToDown } from "./analyze-ma.js";
import { isRetestBounce } from "./analyze-ma.js";

export function analyzeFibanachi(analyzeData, data, start, end, line, markerColor, regim) {

    if (line.fibanachi_0 === 0) {
        analyzeData.main.previousID = "U2000";
        analyzeData.main.currentID = "U2000";
        analyzeData.additional.touching.currentID = "B1000";
        analyzeData.main.previousIDs = [];
        analyzeData.main.currentIDs = [];

        return [];
    } 

    let markerApproachAndRebound = [];
    let markerRetest = [];

    let previousID = "U2000";
    let currentID = "U2000";
    let scenariosID = [];

    for (let i = start; i < end; i++) {
        const prev = data[i - 1];
        const cur = data[i];
        const next = data[i + 1];

        const closestFibo = getClosestHorizontalLevel(cur, line);
        // сценарії лонг
        if (line.fibanachi_0 < line.fibanachi_100) {
            // сценарії для лінії 0  
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_0, line.fibanachi_0, line.fibanachi_0)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5001" : "L10001";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_0, line.fibanachi_0, line.fibanachi_0)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5002" : "L10002";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 0", size: 2});
            }

            if (closestFibo === "fibanachi_0" && isRetestBounce(prev, cur, next, line.fibanachi_0, line.fibanachi_0, line.fibanachi_0)) {
                if (cur.low > line.fibanachi_0) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "L5003" : "L10003";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 0", size: 2});
                } 
            }

            // сценарії для лінії 23
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_23, line.fibanachi_23, line.fibanachi_23)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5004" : "L10004";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_23, line.fibanachi_23, line.fibanachi_23)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5007" : "L10007";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_23, line.fibanachi_23, line.fibanachi_23)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5008" : "L10008";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 23", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_23, line.fibanachi_23, line.fibanachi_23)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5005" : "L10005";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 23", size: 2});
            }

            if (closestFibo === "fibanachi_23" && isRetestBounce(prev, cur, next, line.fibanachi_23, line.fibanachi_23, line.fibanachi_23)) {
                if (cur.low > line.fibanachi_23) { 
                    previousID = currentID;
                    currentID = currentID = regim === 2 ? "L5006" : "L10006";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 23", size: 2});
                } 
                else if (cur.high < line.fibanachi_23) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "L5009" : "L10009";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 23", size: 2});
                }
            }

            // сценарії для лінії 38
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_38, line.fibanachi_38, line.fibanachi_38)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5010" : "L10010";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_38, line.fibanachi_38, line.fibanachi_38)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5013" : "L10013";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_38, line.fibanachi_38, line.fibanachi_38)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5014" : "L10014";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 38", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_38, line.fibanachi_38, line.fibanachi_38)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5011" : "L10011";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 38", size: 2});
            }

            if (closestFibo === "fibanachi_38" && isRetestBounce(prev, cur, next, line.fibanachi_38, line.fibanachi_38, line.fibanachi_38)) {
                if (cur.low > line.fibanachi_38) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "L5012" : "L10012";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 38", size: 2});
                } 
                else if (cur.high < line.fibanachi_38) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "L5015" : "L10015";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 38", size: 2});
                }
            }

            // сценарії для лінії 50
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_50, line.fibanachi_50, line.fibanachi_50)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5016" : "L10016";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_50, line.fibanachi_50, line.fibanachi_50)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5019" : "L10019";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_50, line.fibanachi_50, line.fibanachi_50)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5020" : "L10020";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 50", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_50, line.fibanachi_50, line.fibanachi_50)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5017" : "L10017";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 50", size: 2});
            }

            if (closestFibo === "fibanachi_50" && isRetestBounce(prev, cur, next, line.fibanachi_50, line.fibanachi_50, line.fibanachi_50)) {
                if (cur.low > line.fibanachi_50) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "L5018" : "L10018";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 50", size: 2});
                } 
                else if (cur.high < line.fibanachi_50) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "L5021" : "L10021";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 50", size: 2});
                }
            }
            
            // сценарії для лінії 61
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_61, line.fibanachi_61, line.fibanachi_61)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5022" : "L10022";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_61, line.fibanachi_61, line.fibanachi_61)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5025" : "L10025";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_61, line.fibanachi_61, line.fibanachi_61)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5026" : "L10026";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 61", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_61, line.fibanachi_61, line.fibanachi_61)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5023" : "L10023";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 61", size: 2});
            }

            if (closestFibo === "fibanachi_61" && isRetestBounce(prev, cur, next, line.fibanachi_61, line.fibanachi_61, line.fibanachi_61)) {
                if (cur.low > line.fibanachi_61) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "L5024" : "L10024";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 61", size: 2});
                } 
                else if (cur.high < line.fibanachi_61) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "L5027" : "L10027";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 61", size: 2});
                }
            }

            // сценарії для лінії 78
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_78, line.fibanachi_78, line.fibanachi_78)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5028" : "L10028";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_78, line.fibanachi_78, line.fibanachi_78)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5031" : "L10031";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_78, line.fibanachi_78, line.fibanachi_78)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5032" : "L10032";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 78", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_78, line.fibanachi_78, line.fibanachi_78)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5029" : "L10029";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 78", size: 2});
            }

            if (closestFibo === "fibanachi_78" && isRetestBounce(prev, cur, next, line.fibanachi_78, line.fibanachi_78, line.fibanachi_78)) {
                if (cur.low > line.fibanachi_78) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "L5030" : "L10030";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 78", size: 2});
                } 
                else if (cur.high < line.fibanachi_78) {
                    previousID = currentID;
                    currentID = regim === 2 ? "L5033" : "L10033"; 
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 78", size: 2});
                }
            }

            // сценарії для лінії 100
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5034" : "L10034"; 
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                previousID = currentID;
                currentID = regim === 2 ? "L5035" : "L10035"; 
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 100", size: 2});
            }

            if (closestFibo === "fibanachi_100" && isRetestBounce(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                if (cur.high < line.fibanachi_100) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "L5036" : "L10036"; 
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 100", size: 2});
                }
            }

            if (regim === 2) continue;

            // додаткові сценарії для ручного фібаначі
            // сценарії для рівня 100
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                previousID = currentID;
                currentID = "L10037";              
                scenariosID.push({time: cur.time, id: currentID});  
                markerApproachAndRebound = [];
                markerRetest = [];
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                previousID = currentID;
                currentID = "L10035";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 100", size: 2});
            }

            if (closestFibo === "fibanachi_100" && isRetestBounce(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                if (cur.low > line.fibanachi_100) { 
                    previousID = currentID;
                    currentID = "L10036";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 100", size: 2});
                } 
            }

            // сценарії для лінії 161
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_161, line.fibanachi_161, line.fibanachi_161)) {
                previousID = currentID;
                currentID = "L10040"; 
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_161, line.fibanachi_161, line.fibanachi_161)) {
                previousID = currentID;
                currentID = "L10043";    
                scenariosID.push({time: cur.time, id: currentID});           
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_161, line.fibanachi_161, line.fibanachi_161)) {
                previousID = currentID;
                currentID = "L10044";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 161", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_161, line.fibanachi_161, line.fibanachi_161)) {
                previousID = currentID;
                currentID = "L10041"; 
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 161", size: 2});
            }

            if (closestFibo === "fibanachi_161" && isRetestBounce(prev, cur, next, line.fibanachi_161, line.fibanachi_161, line.fibanachi_161)) {
                if (cur.low > line.fibanachi_161) { 
                    previousID = currentID;
                    currentID = "L10042"; 
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 161", size: 2});
                } 
                else if (cur.high < line.fibanachi_161) { 
                    previousID = currentID;
                    currentID = "L10045";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 161", size: 2});
                }
            }  
            
            // сценарії для лінії 261
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_261, line.fibanachi_261, line.fibanachi_261)) {
                previousID = currentID;
                currentID = "L10046"; 
                scenariosID.push({time: cur.time, id: currentID});                
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_261, line.fibanachi_261, line.fibanachi_261)) {
                previousID = currentID;
                currentID = "L10049";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_261, line.fibanachi_261, line.fibanachi_261)) {
                previousID = currentID;
                currentID = "L10050";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 261", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_261, line.fibanachi_261, line.fibanachi_261)) {
                previousID = currentID;
                currentID = "L10047";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 261", size: 2});
            }

            if (closestFibo === "fibanachi_261" && isRetestBounce(prev, cur, next, line.fibanachi_261, line.fibanachi_261, line.fibanachi_261)) {
                if (cur.low > line.fibanachi_261) { 
                    previousID = currentID;
                    currentID = "L10048";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 261", size: 2});
                } 
                else if (cur.high < line.fibanachi_261) { 
                    previousID = currentID;
                    currentID = "L10051";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 261", size: 2});
                }
            } 

        }
        // сценарії шорт
        if (line.fibanachi_0 > line.fibanachi_100) {
            // сценарії для лінії 0
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_0, line.fibanachi_0, line.fibanachi_0)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5001" : "S10001";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_0, line.fibanachi_0, line.fibanachi_0)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5002" : "S10002";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 0", size: 2});
            }

            if (closestFibo === "fibanachi_0" && isRetestBounce(prev, cur, next, line.fibanachi_0, line.fibanachi_0, line.fibanachi_0)) {
                if (cur.high < line.fibanachi_0) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5003" : "S10003";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 0", size: 2});
                }
            }

            // сценарії для лінії 23
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_23, line.fibanachi_23, line.fibanachi_23)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5007" : "S10007";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_23, line.fibanachi_23, line.fibanachi_23)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5004" : "S10004";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_23, line.fibanachi_23, line.fibanachi_23)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5008" : "S10008";      
                scenariosID.push({time: cur.time, id: currentID});        
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 23", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_23, line.fibanachi_23, line.fibanachi_23)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5005" : "S10005";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 23", size: 2});
            }

            if (closestFibo === "fibanachi_23" && isRetestBounce(prev, cur, next, line.fibanachi_23, line.fibanachi_23, line.fibanachi_23)) {
                if (cur.low > line.fibanachi_23) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5006" : "S10006";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 23", size: 2});
                } 
                else if (cur.high < line.fibanachi_23) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5009" : "S10009"; 
                    scenariosID.push({time: cur.time, id: currentID});                
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 23", size: 2});
                }
            }

            // сценарії для лінії 38
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_38, line.fibanachi_38, line.fibanachi_38)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5013" : "S10013"; 
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_38, line.fibanachi_38, line.fibanachi_38)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5010" : "S10010";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_38, line.fibanachi_38, line.fibanachi_38)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5014" : "S10014"; 
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 38", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_38, line.fibanachi_38, line.fibanachi_38)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5011" : "S10011";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 38", size: 2});
            }

            if (closestFibo === "fibanachi_38" && isRetestBounce(prev, cur, next, line.fibanachi_38, line.fibanachi_38, line.fibanachi_38)) {
                if (cur.low > line.fibanachi_38) {
                    previousID = currentID;
                    currentID = regim === 2 ? "S5012" : "S10012"; 
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 38", size: 2});
                } 
                else if (cur.high < line.fibanachi_38) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5015" : "S10015"; 
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 38", size: 2});
                }
            }

            // сценарії для лінії 50
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_50, line.fibanachi_50, line.fibanachi_50)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5019" : "S10019"; 
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_50, line.fibanachi_50, line.fibanachi_50)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5016" : "S10016";
                scenariosID.push({time: cur.time, id: currentID}); 
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_50, line.fibanachi_50, line.fibanachi_50)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5020" : "S10020";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 50", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_50, line.fibanachi_50, line.fibanachi_50)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5017" : "S10017"; 
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 50", size: 2});
            }

            if (closestFibo === "fibanachi_50" && isRetestBounce(prev, cur, next, line.fibanachi_50, line.fibanachi_50, line.fibanachi_50)) {
                if (cur.low > line.fibanachi_50) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5018" : "S10018"; 
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 50", size: 2});
                } 
                else if (cur.high < line.fibanachi_50) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5021" : "S10021";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 50", size: 2});
                }
            }
            
            // сценарії для лінії 61
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_61, line.fibanachi_61, line.fibanachi_61)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5025" : "S10025";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_61, line.fibanachi_61, line.fibanachi_61)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5022" : "S10022"; 
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_61, line.fibanachi_61, line.fibanachi_61)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5026" : "S10026"; 
                scenariosID.push({time: cur.time, id: currentID});            
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 61", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_61, line.fibanachi_61, line.fibanachi_61)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5023" : "S10023";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 61", size: 2});
            }

            if (closestFibo === "fibanachi_61" && isRetestBounce(prev, cur, next, line.fibanachi_61, line.fibanachi_61, line.fibanachi_61)) {
                if (cur.low > line.fibanachi_61) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5024" : "S10024";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 61", size: 2});
                } 
                else if (cur.high < line.fibanachi_61) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5027" : "S10027";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 61", size: 2});
                }
            }

            // сценарії для лінії 78
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_78, line.fibanachi_78, line.fibanachi_78)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5031" : "S10031";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_78, line.fibanachi_78, line.fibanachi_78)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5028" : "S10028";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_78, line.fibanachi_78, line.fibanachi_78)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5032" : "S10032";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 78", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_78, line.fibanachi_78, line.fibanachi_78)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5029" : "S10029";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 78", size: 2});
            }

            if (closestFibo === "fibanachi_78" && isRetestBounce(prev, cur, next, line.fibanachi_78, line.fibanachi_78, line.fibanachi_78)) {
                if (cur.low > line.fibanachi_78) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5030" : "S10030";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 78", size: 2});
                } 
                else if (cur.high < line.fibanachi_78) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5033" : "S10033";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 78", size: 2});
                }
            }

            // сценарії для лінії 100 
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5034" : "S10034";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                previousID = currentID;
                currentID = regim === 2 ? "S5035" : "S10035";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 100", size: 2});
            }

            if (closestFibo === "fibanachi_100" && isRetestBounce(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                if (cur.low > line.fibanachi_100) { 
                    previousID = currentID;
                    currentID = regim === 2 ? "S5036" : "S10036";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 100", size: 2});
                } 
            }

            if (regim === 2) continue;

            // додаткові сценарії для ручного режими
            // сценарії для лінії 100
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                previousID = currentID;
                currentID = "S10037";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                previousID = currentID;
                currentID = "S10038";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 100", size: 2});
            }
            

            if (closestFibo === "fibanachi_100" && isRetestBounce(prev, cur, next, line.fibanachi_100, line.fibanachi_100, line.fibanachi_100)) {
                if (cur.high < line.fibanachi_100) { 
                    previousID = currentID;
                    currentID = "S10039";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 100", size: 2});
                }
            }

            // сценарії для лінії 161
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_161, line.fibanachi_161, line.fibanachi_161)) {
                previousID = currentID;
                currentID = "S10043";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_161, line.fibanachi_161, line.fibanachi_161)) {
                previousID = currentID;
                currentID = "S10040";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_161, line.fibanachi_161, line.fibanachi_161)) {
                previousID = currentID;
                currentID = "S10044";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 161", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_161, line.fibanachi_161, line.fibanachi_161)) {
                previousID = currentID;
                currentID = "S10041";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 161", size: 2});
            }

            if (closestFibo === "fibanachi_161" && isRetestBounce(prev, cur, next, line.fibanachi_161, line.fibanachi_161, line.fibanachi_161)) {
                if (cur.low > line.fibanachi_161) { 
                    previousID = currentID;
                    currentID = "S10042";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 161", size: 2});
                } 
                else if (cur.high < line.fibanachi_161) { 
                    previousID = currentID;
                    currentID = "S10045";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 161", size: 2});
                }
            }

            // сценарії для лінії 261
            if (isBodyCrossedUp(prev, cur, next, line.fibanachi_261, line.fibanachi_261, line.fibanachi_261)) {
                previousID = currentID;
                currentID = "S10049";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }   
            
            if (isBodyCrossedDown(prev, cur, next, line.fibanachi_261, line.fibanachi_261, line.fibanachi_261)) {
                previousID = currentID;
                currentID = "S10046";
                scenariosID.push({time: cur.time, id: currentID});
                markerApproachAndRebound = [];
                markerRetest = [];
            }

            if (isRetestDownToUp(prev, cur, next, line.fibanachi_261, line.fibanachi_261, line.fibanachi_261)) {
                previousID = currentID;
                currentID = "S10050";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FR 261", size: 2});
            }
            
            if (isRetestUpToDown(prev, cur, next, line.fibanachi_261, line.fibanachi_261, line.fibanachi_261)) {
                previousID = currentID;
                currentID = "S10047";
                scenariosID.push({time: cur.time, id: currentID});
                markerRetest.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FR 261", size: 2});
            }

            if (closestFibo === "fibanachi_261" && isRetestBounce(prev, cur, next, line.fibanachi_261, line.fibanachi_261, line.fibanachi_261)) {
                if (cur.low > line.fibanachi_261) { 
                    previousID = currentID;
                    currentID = "S10048";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "belowBar", color: markerColor, shape: "arrowUp", text: "FFR 261", size: 2});
                } 
                else if (cur.high < line.fibanachi_261) { 
                    previousID = currentID;
                    currentID = "S10051";
                    scenariosID.push({time: cur.time, id: currentID});
                    markerApproachAndRebound.push({ time: cur.time, position: "aboveBar", color: markerColor, shape: "arrowDown", text: "FFR 261", size: 2});
                }
            }
        }
    }

    const fiboTouch = checkCurrentFiboTouch(data, line);

    // ——— Вивід у DOM ——— 
    analyzeData.main.previousID = previousID;
    analyzeData.main.currentID = currentID;
    analyzeData.main.scenariosID = scenariosID;

    const { latest, previous } = getLatestAndPreviousScenarios(scenariosID);
    
    analyzeData.main.previousIDs = previous;
    analyzeData.main.currentIDs = latest;

    // Запис в analyzeData для фінального розрахунку ваги
    if (fiboTouch) {
        analyzeData.additional.touching.currentID = fiboTouch.id;
    } else {
        analyzeData.additional.touching.currentID = "B1000";
    }

    return [...markerRetest, ...markerApproachAndRebound];
}

export function getClosestHorizontalLevel(cur, fibanachi) {
    if (!fibanachi) return null;

    const candleCenter = (cur.high + cur.low) / 2;
    let minDiff = Infinity;
    let closestLevelName = null;
    let closestLevelValue = null;

    // Проходимо по всіх ключах об'єкта fibanachi
    for (const [key, value] of Object.entries(fibanachi)) {
        // Перевіряємо, чи значення рівня встановлено (не 0 і не null)
        // Якщо 0 — це валідний рівень (fibanachi_0), то перевірку можна спростити
        if (value !== null && value !== undefined) {
            const diff = Math.abs(candleCenter - value);

            if (diff < minDiff) {
                minDiff = diff;
                closestLevelName = key;   // Наприклад: "fibanachi_61"
                closestLevelValue = value; // Саме значення ціни на цьому рівні
            }
        }
    }

    return closestLevelName ? closestLevelName : null;
}

function checkCurrentFiboTouch(data, fibo) {
    const prev = data[data.length - 2];
    const cur = data[data.length - 1];

    // Масив рівнів з множниками та ID з таблиці (Блочки 3. Фібоначчі)
    const levels = [
        { idTop: "B3001", idBot: "B3002", name: "Fibo 0",     val: fibo.fibanachi_0,   mLongTop: 1.3, mShortTop: 0.7, mLongBot: 0.7, mShortBot: 1.3 }, // №24-25
        { idTop: "B3003", idBot: "B3004", name: "Fibo 23.6",  val: fibo.fibanachi_23,  mLongTop: 1.2, mShortTop: 0.8, mLongBot: 0.8, mShortBot: 1.2 }, // №26-27
        { idTop: "B3005", idBot: "B3006", name: "Fibo 38.2",  val: fibo.fibanachi_38,  mLongTop: 1.7, mShortTop: 0.5, mLongBot: 0.5, mShortBot: 1.7 }, // №28-29 (ВХІД)
        { idTop: "B3007", idBot: "B3008", name: "Fibo 50.0",  val: fibo.fibanachi_50,  mLongTop: 1.3, mShortTop: 0.7, mLongBot: 0.7, mShortBot: 1.3 }, // №30-31
        { idTop: "B3009", idBot: "B3010", name: "Fibo 61.8",  val: fibo.fibanachi_61,  mLongTop: 2.0, mShortTop: 0.3, mLongBot: 0.3, mShortBot: 2.0 }, // №32-33 (Золотий)
        { idTop: "B3011", idBot: "B3012", name: "Fibo 78.6",  val: fibo.fibanachi_78,  mLongTop: 1.2, mShortTop: 0.8, mLongBot: 0.8, mShortBot: 1.2 }, // №34-35
        { idTop: "B3013", idBot: "B3014", name: "Fibo 100",   val: fibo.fibanachi_100, mLongTop: 1.4, mShortTop: 0.6, mLongBot: 0.6, mShortBot: 1.4 }, // №36-37
        { idTop: "B3015", idBot: "B3016", name: "Fibo 161.8", val: fibo.fibanachi_161, mLongTop: 1.5, mShortTop: 0.5, mLongBot: 0.5, mShortBot: 1.5 }, // №38-39
        { idTop: "B3017", idBot: "B3018", name: "Fibo 261.8", val: fibo.fibanachi_261, mLongTop: 1.5, mShortTop: 0.5, mLongBot: 0.5, mShortBot: 1.5 }  // №40-41
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
                    name: level.name, 
                    text: `Торкання ${level.name} знизу`,
                    multiplierLong: level.mLongBot,
                    multiplierShort: level.mShortBot
                };
            } 
            if (prevWasAbove) {
                // Торкання зверху (from_top)
                return { 
                    id: level.idTop,
                    name: level.name, 
                    text: `Торкання ${level.name} зверху`,
                    multiplierLong: level.mLongTop,
                    multiplierShort: level.mShortTop
                };
            }
        }
    }
    return null;
}