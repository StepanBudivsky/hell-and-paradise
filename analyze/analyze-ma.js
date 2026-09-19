import { calculateSlopeAngle, getLatestAndPreviousScenarios } from "../calcFunction/various/mathematical-func.js";

const ma30Offset = 30; 
const ma10Offset = 10;

export function analyzeMA(analyzeData, dataMA10, dataMA30, dataBucketMA10, dataBucketMA30, dataKlines) {
    let previousID = "U2000";
    let currentID = "U2000";
    let scenariosID = [];

    let markerAllInOnePoint = [];
    let markerApproachAndReboundMA10 = [];
    let markerApproachAndReboundMA30 = [];
    let markerRetestMA10 = [];
    let markerRetestMA30 = [];

    // let countFakeRetestText = "";
    let countFakeRetestMA10 = 0;
    let countFakeRetestMA30 = 0;

    let totalDifference = 0;
    let count = 0;

    for (let j = 0; j < dataMA30.length; j++) {
        const indexMA10 = j + (ma30Offset - ma10Offset); 

        if (dataMA10[indexMA10]) {
            const diff = Math.abs(dataMA10[indexMA10].value - dataMA30[j].value);
            totalDifference += diff;
            count++;
        }
    }

    const averageDiff = count > 0 ? (totalDifference / count) : 0;


    for (let i = 31; i < dataKlines.length; i++) {

        // Перевірка на "Косічку" (переплетення ліній) 10 точок перевірка
        const pigtail = checkPigtailPattern(i, dataKlines, dataMA10, dataMA30, { ma10Offset, ma30Offset });

        if (pigtail && pigtail.isPigtail) {
            // if (!currentSituation.startsWith("Косічка")) {
            //     previousSituation = currentSituation;
            // }
            i = pigtail.skipToIndex;

            if (pigtail.lastCross === "Golden Cross") {
                previousID = currentID;
                currentID = "U9009";
                scenariosID.push({time: dataKlines[i].time, id: "U9009"});
            } else {
                previousID = currentID;
                currentID = "U9010";
                scenariosID.push({time: dataKlines[i].time, id: "U9010"});
            }

            countFakeRetestMA10 = 0;
            countFakeRetestMA30 = 0;

            markerRetestMA10 = [];
            markerApproachAndReboundMA10 = [];
            markerRetestMA30 = [];
            markerApproachAndReboundMA30 = [];

            continue;
        }

        // Перевіряємо на ФЛЕТ (поріг 3 торкання з 5 свічок)
        const flatStatus = checkFlatRange(i, dataKlines, dataMA10, dataMA30, { ma10Offset, ma30Offset }, 3);
        
        if (flatStatus.isFlat) {
            previousID = currentID;
            currentID = "U9014";

            i = flatStatus.skipToIndex; // Пропускаємо 5 свічок

            scenariosID.push({time: dataKlines[i].time, id: "U9014"});

            countFakeRetestMA10 = 0;
            countFakeRetestMA30 = 0;

            markerRetestMA10 = [];
            markerApproachAndReboundMA10 = [];
            markerRetestMA30 = [];
            markerApproachAndReboundMA30 = [];

            continue; 
        }

        // Якщо НЕ флет, перевіряємо ПОДВІЙНИЙ ПРОБІЙ
        const double = checkDoubleBreakout(i, dataKlines, dataMA10, dataMA30, { ma10Offset, ma30Offset });

        if (double) {
            if (!double.candlesDelayed) {
                markerAllInOnePoint = [{ time: double.time, position: 'inBar', color: '#000000', shape: 'circle', size: 1, }];
            }

            // Якщо пробій на тій самій свічці (k=0), то skipToIndex === i, 
            // ми нічого не пропускаємо, просто фіксуємо потужний сигнал.
            // Якщо k > 0, ми "перестрибуємо" проміжні свічки.
            i = double.skipToIndex; 

            if (double.direction === "знизу верх") { 
                previousID = currentID;
                currentID = "U9017";
                scenariosID.push({time: dataKlines[i].time, id: "U9017"});
            } else { 
                previousID = currentID;
                currentID = "U9018";
                scenariosID.push({time: dataKlines[i].time, id: "U9018"});
            }

            countFakeRetestMA10 = 0;
            countFakeRetestMA30 = 0;

            markerRetestMA10 = [];
            markerApproachAndReboundMA10 = [];
            markerRetestMA30 = [];
            markerApproachAndReboundMA30 = [];

            continue;
        }

        const prev = dataKlines[i - 2];
        const cur = dataKlines[i - 1];
        const next = i < dataKlines.length ? dataKlines[i] : null;

        const curr10 = dataMA10[i - ma10Offset]?.value;
        const curr30 = dataMA30[i - ma30Offset]?.value;

        const prev10 = dataMA10[i - ma10Offset - 1]?.value;
        const prev30 = dataMA30[i - ma30Offset - 1]?.value;

        const next10 = i - ma10Offset + 1 < dataMA10.length ? dataMA10[i - ma10Offset + 1]?.value : null;
        const next30 = i - ma30Offset + 1 < dataMA30.length ? dataMA30[i - ma30Offset + 1].value : null;

        if (!prev10 || !prev30) continue;

        if (isRetestBounce(prev, cur, next, prev10, curr10, next10)) {
            countFakeRetestMA10++;
            if (cur.low > curr10) { 
                previousID = currentID;
                currentID = "U9024";
                scenariosID.push({time: dataKlines[i].time, id: "U9024"});
                // --- ЛОГІКА ЛОНГ (Рітест підтримки) ---
                markerApproachAndReboundMA10.push({ time: cur.time, position: "belowBar", color: "#aaaaaa", shape: "arrowUp", text: "FR10", size: 2});
            } else if (cur.high < curr10) { 
                previousID = currentID;
                currentID = "U9023";
                scenariosID.push({time: dataKlines[i].time, id: "U9023"});
                // --- ЛОГІКА ШОРТ (Рітест опору) ---
                markerApproachAndReboundMA10.push({ time: cur.time, position: "aboveBar", color: "#aaaaaa", shape: "arrowDown", text: "FR10", size: 2});
            }
        }

        if (isRetestBounce(prev, cur, next, prev30, curr30, next30)) {
            countFakeRetestMA30++;
            if (cur.low > curr30) { 
                previousID = currentID;
                currentID = "U9026";
                scenariosID.push({time: dataKlines[i].time, id: "U9026"});
                // --- ЛОГІКА ЛОНГ (Рітест підтримки) ---
                markerApproachAndReboundMA30.push({ time: cur.time, position: "belowBar", color: "#aaaaaa", shape: "arrowUp", text: "FR30", size: 2});
            } else if (cur.high < curr30) { 
                previousID = currentID;
                currentID = "U9025";
                scenariosID.push({time: dataKlines[i].time, id: "U9025"});
                // --- ЛОГІКА ШОРТ (Рітест опору) ---
                markerApproachAndReboundMA30.push({ time: cur.time, position: "aboveBar", color: "#aaaaaa", shape: "arrowDown", text: "FR30", size: 2});
            }
        }

        // Визначаємо умови для великої відстані заздалегідь для зручності
        const isBigGap = Math.abs(curr10 - curr30) >= averageDiff;

        // 2 i 4
        if (cur.high < curr10 && cur.high < curr30) {
            let newSituation = "";
            
            // if (isBigGap) {
            //     newSituation = "U9004";
            //     scenariosID.push({time: dataKlines[i].time, id: "U9004"});
            // } else {
            //     newSituation = "U9002";
            //     scenariosID.push({time: dataKlines[i].time, id: "U9002"});
            // }

            // Оновлюємо стани тільки якщо назва ситуації дійсно змінилася
            if (currentID !== newSituation) {
                if (isBigGap) { // 4
                    previousID = currentID;
                    currentID = "U9004";
                    scenariosID.push({time: dataKlines[i].time, id: "U9004"});
                } else { // 2
                    previousID = currentID;
                    currentID = "U9002";
                    scenariosID.push({time: dataKlines[i].time, id: "U9002"});
                }
            }
        } 
        // 1 i 3
        else if (cur.low > curr10 && cur.low > curr30) {
            let newSituation = "";
            
            // if (isBigGap) {
            //     newSituation = "U9003";
            //     scenariosID.push({time: dataKlines[i].time, id: "U9003"});
            // } else {
            //     newSituation = "U9001";
            //     scenariosID.push({time: dataKlines[i].time, id: "U9001"});
            // }

            if (currentID !== newSituation) {
                if (isBigGap) { // 3
                    previousID = currentID;
                    currentID = "U9003";
                    scenariosID.push({time: dataKlines[i].time, id: "U9003"});
                } else { // 1
                    previousID = currentID;
                    currentID = "U9001";
                    scenariosID.push({time: dataKlines[i].time, id: "U9001"});
                }
            }
        }

        // 7
        if (prev10 <= prev30 && curr10 >= curr30) {
            previousID = currentID;
            currentID = "U9007";
            scenariosID.push({time: dataKlines[i].time, id: "U9007"});
            countFakeRetestMA10 = 0;
            countFakeRetestMA30 = 0;
            
            markerRetestMA10 = [];
            markerApproachAndReboundMA10 = [];
            markerRetestMA30 = [];
            markerApproachAndReboundMA30 = [];
            
            continue;
        } 

        // 8
        if (prev10 >= prev30 && curr10 <= curr30) {
            previousID = currentID;
            currentID = "U9008";
            scenariosID.push({time: dataKlines[i].time, id: "U9008"});
            countFakeRetestMA10 = 0;
            countFakeRetestMA30 = 0;
            
            markerRetestMA10 = [];
            markerApproachAndReboundMA10 = [];
            markerRetestMA30 = [];
            markerApproachAndReboundMA30 = [];

            continue;
        }
        // 5
        if (cur.low > curr30 && cur.high < curr10 && currentID !== "U9005") {
            previousID = currentID;
            currentID = "U9005";
            scenariosID.push({time: dataKlines[i].time, id: "U9005"});
        }
        // 6
        if (cur.low > curr10 && cur.high < curr30 && currentID !== "U9006") {
            previousID = currentID;
            currentID = "U9006";    
            scenariosID.push({time: dataKlines[i].time, id: "U9006"});    
        }
        // пружина
        if (cur.low <= curr10 && cur.high >= curr10 && cur.low <= curr30 && cur.high >= curr30) {
            previousID = currentID;
            currentID = "U9013";
            scenariosID.push({time: dataKlines[i].time, id: "U9013"}); 
            markerAllInOnePoint = [{ time: cur.time, position: 'inBar', color: '#000000', shape: 'circle', size: 1, }];
        }
        // пружина лонг c.close >= c.open ? "#26a69a" : "#f23645"
        if (prev.low <= prev10 && prev.high >= prev10 && prev.low <= prev30 && prev.high >= prev30 && cur.close >= cur.open) {
            previousID = currentID;
            currentID = "U9027";
            scenariosID.push({time: dataKlines[i].time, id: "U9027"}); 
            markerAllInOnePoint = [{ time: cur.time, position: 'inBar', color: '#000000', shape: 'circle', size: 1, }];
        }   
        // пружина шорт 
        if (prev.low <= prev10 && prev.high >= prev10 && prev.low <= prev30 && prev.high >= prev30 && cur.close <= cur.open) {
            previousID = currentID;
            currentID = "U9028";
            scenariosID.push({time: dataKlines[i].time, id: "U9028"}); 
            markerAllInOnePoint = [{ time: cur.time, position: 'inBar', color: '#000000', shape: 'circle', size: 1, }];
        }   

        if (prev.low <= prev10 && prev.high >= prev10 && cur.low <= curr10 && cur.high >= curr10 && (prev.low > prev30 || prev.high < prev30) && (cur.low > curr30 || cur.high < curr30)) {
            if (cur.low > curr30) {
                previousID = currentID;
                currentID = "U9011";
                scenariosID.push({time: dataKlines[i].time, id: "U9011"}); 
            }
            if (cur.high < curr30) {
                previousID = currentID;
                currentID = "U9012";
                scenariosID.push({time: dataKlines[i].time, id: "U9012"}); 
            }
        }

        if ((isBodyCrossedUp(prev, cur, next, prev10, curr10, next10) || isBodyCrossedDown(prev, cur, next, prev10, curr10, next10)) && cur.low > curr30) {
            previousID = currentID;
            currentID = "U9015";
            scenariosID.push({time: dataKlines[i].time, id: "U9015"}); 
            countFakeRetestMA10 = 0;
            markerRetestMA10 = [];
            markerApproachAndReboundMA10 = [];
        } 

        if ((isBodyCrossedUp(prev, cur, next, prev10, curr10, next10) || isBodyCrossedDown(prev, cur, next, prev10, curr10, next10)) && cur.high < curr30) {
            previousID = currentID;
            currentID = "U9016";
            scenariosID.push({time: dataKlines[i].time, id: "U9016"}); 
            countFakeRetestMA10 = 0;
            markerRetestMA10 = [];
            markerApproachAndReboundMA10 = [];
        } 

        // --- Перевірка для MA10 ---

        // 1. Рітест підтримки MA10 (Відскок ВГОРУ)
        if (isRetestDownToUp(prev, cur, next, prev10, curr10, next10)) {
            previousID = currentID;
            currentID = "U9019";
            scenariosID.push({time: dataKlines[i].time, id: "U9019"}); 
            // countFakeRetestMA10 = 0;
            markerRetestMA10.push({ time: cur.time, position: "belowBar", color: "#aaaaaa", shape: "arrowUp", text: "R10", size: 2});
        }

        // 2. Рітест опору MA10 (Відскок ВНИЗ)
        if (isRetestUpToDown(prev, cur, next, prev10, curr10, next10)) {
            previousID = currentID;
            currentID = "U9020";
            scenariosID.push({time: dataKlines[i].time, id: "U9020"}); 
            // countFakeRetestMA10 = 0;
            markerRetestMA10.push({ time: cur.time, position: "aboveBar", color: "#aaaaaa", shape: "arrowDown", text: "R10", size: 2});
        }

        // --- Перевірка для MA30 ---

        // 1. Рітест підтримки MA30 (Відскок ВГОРУ)
        if (isRetestDownToUp(prev, cur, next, prev30, curr30, next30)) {
            previousID = currentID;
            currentID = "U9021";
            scenariosID.push({time: dataKlines[i].time, id: "U9021"}); 
            // countFakeRetestMA30 = 0;
            markerRetestMA30.push({ time: cur.time, position: "belowBar", color: "#aaaaaa", shape: "arrowUp", text: "R30", size: 2});
        }

        // 2. Рітест опору MA30 (Відскок ВНИЗ)
        if (isRetestUpToDown(prev, cur, next, prev30, curr30, next30)) {
            previousID = currentID;
            currentID = "U9022";
            scenariosID.push({time: dataKlines[i].time, id: "U9022"});
            // countFakeRetestMA30 = 0;
            markerRetestMA30.push({ time: cur.time, position: "aboveBar", color: "#aaaaaa", shape: "arrowDown", text: "R30", size: 2});
        }

        const gapPrev = Math.abs(prev10 - prev30);
        const gapCurr = Math.abs(curr10 - curr30);
        const gapNext = (next10 !== null && next30 !== null) ? Math.abs(next10 - next30) : null;

        // 31. U9031: Відскок зверху (MA10 над MA30, у точці curr геп був найменшим і на next пішов у розширення)
        if (gapNext !== null && curr10 > curr30 && prev10 > prev30 && next10 > next30 && gapCurr < gapPrev && gapCurr < gapNext) {
            previousID = currentID;
            currentID = "U9031";
            scenariosID.push({ time: dataKlines[i].time, id: "U9031" });
        } 
        // 32. U9032: Відскок знизу (MA10 під MA30, у точці curr геп був найменшим і на next пішов у розширення)
        else if (gapNext !== null && curr10 < curr30 && prev10 < prev30 && next10 < next30 && gapCurr < gapPrev && gapCurr < gapNext) {
            previousID = currentID;
            currentID = "U9032";
            scenariosID.push({ time: dataKlines[i].time, id: "U9032" });
        } 
        // 29. U9029: Зближення зверху (MA10 над MA30, відстань між ними зменшується)
        else if (curr10 > curr30 && prev10 > prev30 && gapCurr < gapPrev) {
            previousID = currentID;
            currentID = "U9029";
            scenariosID.push({ time: dataKlines[i].time, id: "U9029" });
        } 
        // 30. U9030: Зближення знизу (MA10 під MA30, відстань між ними зменшується)
        else if (curr10 < curr30 && prev10 < prev30 && gapCurr < gapPrev) {
            previousID = currentID;
            currentID = "U9030";
            scenariosID.push({ time: dataKlines[i].time, id: "U9030" });
        }

    }

    if (countFakeRetestMA10 && countFakeRetestMA30) {
        analyzeData.additional.countFakeRetest.situationText = `Рітест M10-${countFakeRetestMA10} M30-${countFakeRetestMA30}`;
    } else if (countFakeRetestMA10) {
        analyzeData.additional.countFakeRetest.situationText = `Рітест M10 - ${countFakeRetestMA10}`;
    } else if (countFakeRetestMA30) {
        analyzeData.additional.countFakeRetest.situationText = `Рітест M30 - ${countFakeRetestMA30}`;
    } else {
        analyzeData.additional.countFakeRetest.situationText = "";
    }

    analyzeData.main.previousID = previousID;
    analyzeData.main.currentID = currentID;
    analyzeData.main.scenariosID = scenariosID;

    const { latest, previous } = getLatestAndPreviousScenarios(scenariosID);

    analyzeData.main.previousIDs = previous;
    analyzeData.main.currentIDs = latest;

    const curr10 = dataMA10[dataMA10.length - 1].value;
    const curr30 = dataMA30[dataMA30.length - 1].value;

    const prev10 = dataMA10[dataMA10.length - 2].value;
    const prev30 = dataMA30[dataMA30.length - 2].value;

    if (Math.abs(prev10 - prev30) < Math.abs(curr10 - curr30)) {
        
        if(dataMA10[dataMA10.length - 1].value > dataMA10[dataMA10.length - 2].value) {
            analyzeData.additional.approachAndRemoval.currentID = "B5001";
        } else {
            analyzeData.additional.approachAndRemoval.currentID = "B5002";
        }
    }

    if (Math.abs(prev10 - prev30) > Math.abs(curr10 - curr30)) {
        
        const isMA10Rising = dataMA10[dataMA10.length - 1].value > dataMA10[dataMA10.length - 2].value;
        const isMA10AboveMA30 = curr10 > curr30;

        if (!isMA10AboveMA30 && isMA10Rising) {
            analyzeData.additional.approachAndRemoval.currentID = "B5003";
            // B5003: Зближення знизу, росте (МА10 під МА30, МА10 росте)
        } else if (isMA10AboveMA30 && isMA10Rising) {
            analyzeData.additional.approachAndRemoval.currentID = "B5004";
            // B5004: Зближення зверху, росте (МА10 над МА30, МА10 росте)
        } else if (isMA10AboveMA30 && !isMA10Rising) {
            analyzeData.additional.approachAndRemoval.currentID = "B5005";
            // B5005: Зближення зверху, падає (МА10 над МА30, МА10 падає)
        } else if (!isMA10AboveMA30 && !isMA10Rising) {
            analyzeData.additional.approachAndRemoval.currentID = "B5006";
            // B5006: Зближення знизу, падає (МА10 під МА30, МА10 падає)
        }
    }

    if (dataMA10[dataMA10.length - 1].value > dataMA10[dataMA10.length - 2].value) {
        analyzeData.additional.m10Trend.currentID = "B5007";
        analyzeData.additional.m10Trend.valueX = calculateSlopeAngle(dataMA10[dataMA10.length - 2].value, dataMA10[dataMA10.length - 1].value);
    } else {
        analyzeData.additional.m10Trend.currentID = "B5008";
        analyzeData.additional.m10Trend.valueX = calculateSlopeAngle(dataMA10[dataMA10.length - 2].value, dataMA10[dataMA10.length - 1].value);
    }

    if (dataMA30[dataMA30.length - 1].value > dataMA30[dataMA30.length - 2].value) {
        analyzeData.additional.m30Trend.currentID = "B5009";
        analyzeData.additional.m30Trend.valueX = calculateSlopeAngle(dataMA30[dataMA30.length - 2].value, dataMA30[dataMA30.length - 1].value);
    } else {
        analyzeData.additional.m30Trend.currentID = "B5010";
        analyzeData.additional.m30Trend.valueX = calculateSlopeAngle(dataMA30[dataMA30.length - 2].value, dataMA30[dataMA30.length - 1].value);
    }

    if (dataBucketMA10.length < 2) {
        analyzeData.additional.m10TrendBacket.currentID = "B5015";
    } else if (dataBucketMA10[dataBucketMA10.length - 1].value > dataBucketMA10[dataBucketMA10.length - 2].value) {
        analyzeData.additional.m10TrendBacket.currentID = "B5011";
    } else {
        analyzeData.additional.m10TrendBacket.currentID = "B5012";
    }

    if (dataBucketMA30.length < 2) {
        analyzeData.additional.m30TrendBacket.currentID = "B5016";
    } else if (dataBucketMA30[dataBucketMA30.length - 1].value > dataBucketMA30[dataBucketMA30.length - 2].value) {
        analyzeData.additional.m30TrendBacket.currentID = "B5013";
    } else {
        analyzeData.additional.m30TrendBacket.currentID = "B5014";
    } 

    const lastPrev = dataKlines[dataKlines.length - 2];
    const lastCur = dataKlines[dataKlines.length - 1];
    const lastMA30 = dataMA30[dataMA30.length - 1].value;
    const prevMA30 = dataMA30[dataMA30.length - 2].value;

    // 1. Перевіряємо, що минула свічка НЕ торкалася лінії (була строго вище або строго нижче)
    const prevWasStrictlyAbove = lastPrev.low > prevMA30;
    const prevWasStrictlyBelow = lastPrev.high < prevMA30;

    // 2. Перевіряємо, чи поточна свічка торкається лінії зараз
    const isTouchingNow = lastCur.low <= lastMA30 && lastCur.high >= lastMA30;

    if (isTouchingNow && (prevWasStrictlyAbove || prevWasStrictlyBelow)) {
        // Оновлюємо тільки текст ситуації, не чіпаючи сценарії очікуваного руху, якщо вони не потрібні
        analyzeData.additional.touching.currentID = prevWasStrictlyAbove ? "B5017" : "B5018"; 
    } else {
        analyzeData.additional.touching.currentID = "B1000"; 
    }
    
    return [...markerAllInOnePoint, ...markerRetestMA10, ...markerRetestMA30, ...markerApproachAndReboundMA10, ...markerApproachAndReboundMA30];
}

// Пробій тіла знизу вгору з підтвердженням висхідного тренду
export const isBodyCrossedUp = (prev, cur, next, mPrev, mCurr, mNext) => {
    if (!next || !mNext) return false;

    const bodyMin = Math.min(cur.open, cur.close);
    const bodyMax = Math.max(cur.open, cur.close);

    return (
        mCurr >= bodyMin && mCurr <= bodyMax && 
        // 2. Умова послідовного зростання (Трендова фільтрація)
        (cur.low > prev.low && next.low > cur.low || cur.high > prev.high && next.high > cur.high)
    );
};

//Пробій тіла зверху вниз з підтвердженням низхідного тренду
export const isBodyCrossedDown = (prev, cur, next, mPrev, mCurr, mNext) => {
    if (!next || !mNext) return false;

    const bodyMin = Math.min(cur.open, cur.close);
    const bodyMax = Math.max(cur.open, cur.close);

    return (
        mCurr >= bodyMin && mCurr <= bodyMax && 
        // 2. Умова послідовного падіння (Трендова фільтрація)
        (cur.low < prev.low && next.low < cur.low || cur.high < prev.high && next.high < cur.high)
    );
};

const checkDoubleBreakout = (currentIndex, dataKlines, dataMA10, dataMA30, offsets) => {
    const { ma10Offset, ma30Offset } = offsets;
    
    // 1. Дані для поточної свічки (пробій MA10)
    const prev = dataKlines[currentIndex - 2];
    const cur = dataKlines[currentIndex - 1];
    const next = dataKlines[currentIndex];

    const p10 = dataMA10[currentIndex - ma10Offset - 1]?.value;
    const c10 = dataMA10[currentIndex - ma10Offset]?.value;
    const n10 = dataMA10[currentIndex - ma10Offset + 1]?.value;

    if (!prev || !cur || !next || !p10 || !c10 || !n10) return null;

    // Визначаємо напрямок пробою MA10
    let direction = null;
    if (isBodyCrossedUp(prev, cur, next, p10, c10, n10)) direction = "знизу верх";
    if (isBodyCrossedDown(prev, cur, next, p10, c10, n10)) direction = "зверху вниз";

    if (!direction) return null;

    // 2. Шукаємо пробій MA30 починаючи з ЦІЄЇ Ж свічки (k = 0)
    for (let k = 0; k <= 4; k++) {
        const checkIdx = currentIndex + k;
        if (checkIdx >= dataKlines.length - 1) break;

        const bPrev = dataKlines[checkIdx - 2]; // Попередній для поточної перевірки
        const bCur = dataKlines[checkIdx - 1];  // Поточна свічка в циклі пошуку
        const bNext = dataKlines[checkIdx];      // Наступна свічка

        const p30 = dataMA30[checkIdx - ma30Offset - 1]?.value;
        const c30 = dataMA30[checkIdx - ma30Offset]?.value;
        const n30 = dataMA30[checkIdx - ma30Offset + 1]?.value;

        if (!bPrev || !bCur || !bNext || !p30 || !c30 || !n30) continue;

        const isDouble = direction === "знизу верх" 
            ? isBodyCrossedUp(bPrev, bCur, bNext, p30, c30, n30)
            : isBodyCrossedDown(bPrev, bCur, bNext, p30, c30, n30);

        if (isDouble) {
            return {
                skipToIndex: checkIdx,
                time: bCur.time,
                direction: direction,
                candlesDelayed: k // скільки свічок пройшло (0 - на тій самій)
            };
        }
    }

    return null;
};

/**
 * Рітест підтримки (Відскок вгору)
 * prev був вище лінії, cur торкнувся фітилем, next має low вище лінії
 */
export const isRetestDownToUp = (prev, cur, next, mPrev, mCurr, mNext) => {
    if (!prev || !next) return false;
    const bodyMin = Math.min(cur.open, cur.close);

    return (
        prev.low > mPrev &&              // Минула свічка була чисто над лінією
        mCurr < bodyMin && mCurr >= cur.low && // Поточний нижній фітиль торкається MA
        next.low > mNext                 // Наступна свічка відштовхнулася (low вище лінії)
    );
};

/**
 * Рітест опору (Відскок вниз)
 * prev був нижче лінії, cur торкнувся фітилем, next має high нижче лінії
 */
export const isRetestUpToDown = (prev, cur, next, mPrev, mCurr, mNext) => {
    if (!prev || !next) return false;
    const bodyMax = Math.max(cur.open, cur.close);

    return (
        prev.high < mPrev &&             // Минула свічка була чисто під лінією
        mCurr > bodyMax && mCurr <= cur.high && // Поточний верхній фітиль торкається MA
        next.high < mNext                // Наступна свічка відштовхнулася (high нижче лінії)
    );
};

export const isRetestBounce = (prev, cur, next, mPrev, mCurr, mNext) => {
    if (!next || !mNext) return false;

    // Рахуємо абсолютну відстань (дистанцію) від кожної свічки до її MA
    // Використовуємо Math.min(abs(high-ma), abs(low-ma)) або close, 
    // але для точності візьмемо відстань від найближчої точки свічки до лінії.
  
    const getDist = (candle, ma) => {
        if (candle.low > ma) return candle.low - ma; // Над лінією
        if (candle.high < ma) return ma - candle.high; // Під лінією
        return 0; // Лінія всередині свічки
    };

    const distPrev = getDist(prev, mPrev);
    const distCur = getDist(cur, mCurr);
    const distNext = getDist(next, mNext);

    // Твоя формула: якщо середня відстань сусідів більша за поточну, 
    // значить поточна свічка — це "пік" наближення (мінімальна дистанція)
    const isApproximation = (distPrev + distNext) / 2 > distCur;

    // Додаткова умова: поточна свічка не має пробивати лінію тілом (це ж рітест)
    const curBodyMin = Math.min(cur.open, cur.close);
    const curBodyMax = Math.max(cur.open, cur.close);
    const curBodySafe = mCurr < curBodyMin || mCurr > curBodyMax;

    // Додаткова умова: поточна свічка не має пробивати лінію тілом (це ж рітест)
    const nextBodyMin = Math.min(next.open, next.close);
    const nextBodyMax = Math.max(next.open, next.close);
    const nextBodySafe = mNext < nextBodyMin || mNext > nextBodyMax;

    const middleOfCur = (cur.high + cur.low) / 2;
    let isBrokenByImpulse = null;

    if (cur.low > mCurr) { 
        // --- ЛОГІКА ЛОНГ (Рітест підтримки) ---
        isBrokenByImpulse = next.high < middleOfCur;
    } 
    else if (cur.high < mCurr) { 
        // --- ЛОГІКА ШОРТ (Рітест опору) ---
        isBrokenByImpulse = next.low > middleOfCur;
    }

    return isApproximation && curBodySafe && nextBodySafe && distCur < (distPrev * 0.8) && !isBrokenByImpulse && isBrokenByImpulse !== null; // 0.8 
    // (Додав distCur < distPrev * 0.8 щоб відсікти паралельний рух)
};

const checkFlatRange = (startIndex, dataKlines, dataMA10, dataMA30, offsets, threshold = 3) => {
    const { ma10Offset, ma30Offset } = offsets;
    let ma10Touches = 0;
    let ma30Touches = 0;

    // Перевіряємо 5 свічок, починаючи з переданої (i, i+1, i+2, i+3, i+4)
    for (let k = 0; k < 5; k++) {
        const checkIdx = startIndex + k;
        if (checkIdx >= dataKlines.length) break;

        const candle = dataKlines[checkIdx];
        const m10 = dataMA10[checkIdx - ma10Offset]?.value;
        const m30 = dataMA30[checkIdx - ma30Offset]?.value;

        if (!m10 || !m30) continue;

        // Перевірка, чи лінія MA10 в межах свічки (від low до high)
        if (m10 >= candle.low && m10 <= candle.high) {
            ma10Touches++;
        }

        // Перевірка для MA30
        if (m30 >= candle.low && m30 <= candle.high) {
            ma30Touches++;
        }
    }

    // Якщо хоча б одна з ліній "прошила" свічки більше ніж 'threshold' разів
    if (ma10Touches >= threshold && ma30Touches >= threshold) {
        return {
            isFlat: true,
            skipToIndex: startIndex + 4, // Пропускаємо цей діапазон
            ma10Touches,
            ma30Touches
        };
    }

    return { isFlat: false };
};

const checkPigtailPattern = (startIndex, dataKlines, dataMA10, dataMA30, offsets) => {
    const { ma10Offset, ma30Offset } = offsets;
    let crossCount = 0;
    let lastCrossType = null; // Зберігатиме "GOLDEN" або "DEATH"
    const lookAhead = 10;

    // Перевірка довжини масивів
    if (
        startIndex + lookAhead >= dataMA10.length || 
        startIndex + lookAhead >= dataMA30.length ||
        startIndex + lookAhead >= dataKlines.length
    ) {
        return null;
    }

    for (let k = 0; k < lookAhead; k++) {
        const idx = startIndex + k;

        const curr10 = dataMA10[idx - ma10Offset]?.value;
        const prev10 = dataMA10[idx - ma10Offset - 1]?.value;
        const curr30 = dataMA30[idx - ma30Offset]?.value;
        const prev30 = dataMA30[idx - ma30Offset - 1]?.value;

        if (curr10 === undefined || prev10 === undefined || curr30 === undefined || prev30 === undefined) {
            continue;
        }

        // Логіка визначення перетинів
        const isGolden = prev10 <= prev30 && curr10 > curr30;
        const isDeath = prev10 >= prev30 && curr10 < curr30;

        if (isGolden) {
            crossCount++;
            lastCrossType = "Golden Cross";
        } else if (isDeath) {
            crossCount++;
            lastCrossType = "Death Cross";
        }

        // Якщо назбирали 3 перетини
        if (crossCount >= 3) {
            return {
                isPigtail: true,
                skipToIndex: idx,
                crosses: crossCount,
                time: dataKlines[idx].time,
                lastCross: lastCrossType // Повертаємо останній зафіксований тип
            };
        }
    }

    return null; 
};
