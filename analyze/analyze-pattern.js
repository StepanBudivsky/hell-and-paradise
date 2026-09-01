const patternPreviousSituationText = document.getElementById("pattern-previous-situation");
const patternCurrentSituationText = document.getElementById("pattern-current-situation");
const patternPossibleSituationUpText = document.getElementById("pattern-possible-situation-up");
const patternPossibleSituationDownText = document.getElementById("pattern-possible-situation-down");

export function analyzePattern(analyzeData, tweezers, engulfings, limit) {
    const safetyThreshold = limit - 5;

    const allPatterns = [...tweezers, ...engulfings].sort((a, b) => a.index - b.index);
    if (allPatterns.length === 0) return;

    const grouped = allPatterns.reduce((acc, curr) => {
        if (!acc[curr.index]) {
            acc[curr.index] = { index: curr.index, types: [curr.type] };
        } else {
            acc[curr.index].types.push(curr.type);
        }
        return acc;
    }, {});

    const situations = Object.values(grouped).sort((a, b) => a.index - b.index);

    let previousSituation = "";
    let currentSituation = "";

    const lastSit = situations[situations.length - 1];
    const penultSit = situations[situations.length - 2] || null;

    if (lastSit.index < safetyThreshold) {
        previousSituation = lastSit;
        currentSituation = "";
    } else {
        currentSituation = lastSit;
        previousSituation = penultSit;
    }

    // 4. Функція тільки для тексту
    const processData = (sit) => {
        if (!sit) return { up: "", down: "", fullText: "" };
        const distance = limit - sit.index;
        const typesText = sit.types.join(" + ");
        const lastType = sit.types[sit.types.length - 1];
        const isOld = distance > 5;

        let up = "50%", down = "50%";
        if (lastType.endsWith("зверху")) {
            up = "Лонг 20%"; down = "Шорт 80%";
        } else if (lastType.endsWith("знизу")) {
            up = "Лонг 80%"; down = "Шорт 20%";
        }

        return { 
            up, 
            down, 
            fullText: `${typesText} (${distance} св. тому)${isOld ? " [Архів]" : ""}` 
        };
    };

    const currentResults = processData(currentSituation);
    const prevResults = processData(previousSituation);

    // 5. РОЗРАХУНОК ВАГИ (Тільки якщо currentSituation існує і він свіжий)
    let weights = { "1m": 0, "5m": 0, "15m": 0, "30m": 0, "1h": 0 };

    if (currentSituation) {
        const distance = limit - currentSituation.index;
        
        // Вага рахується тільки якщо патерн не далі 5 свічок
        if (distance <= 5) {
            const lastType = currentSituation.types[currentSituation.types.length - 1];
            const multiplier = currentSituation.types.length > 1 ? 2 : 1;
            const side = lastType.endsWith("знизу") ? 1 : -1;

            weights["1m"] = 25 * multiplier * side;
            weights["5m"] = 35 * multiplier * side;
            weights["15m"] = 49 * multiplier * side;
            weights["30m"] = 60 * multiplier * side;
            weights["1h"] = 70 * multiplier * side;
        }
    }

    // 6. Запис результатів
    analyzeData.main.previousSituationText = prevResults.fullText;
    analyzeData.main.currentSituationText = currentResults.fullText;
    analyzeData.main.possibleSituationUpText = currentResults.up;
    analyzeData.main.possibleSituationDownText = currentResults.down;

    analyzeData.main.weight["1m"] = weights["1m"];
    analyzeData.main.weight["5m"] = weights["5m"];
    analyzeData.main.weight["15m"] = weights["15m"];
    analyzeData.main.weight["30m"] = weights["30m"];
    analyzeData.main.weight["1h"] = weights["1h"];

    // 7. Об'єкт для інформації про патерн
    let currentPatternInfo = {
        hasTweezers: false,
        hasEngulfing: false,
        sideUp: false,   // true якщо "знизу" (лонг)
        sideDown: false  // true якщо "зверху" (шорт)
    };

    if (currentResults.fullText) {
        const text = currentResults.fullText;

        currentPatternInfo.hasTweezers = text.includes("Пінцет");
        currentPatternInfo.hasEngulfing = text.includes("Поглинання");

        if (text.includes("знизу")) {
            currentPatternInfo.sideUp = true;
        }
        if (text.includes("зверху")) {
            currentPatternInfo.sideDown = true;
        }
    }

    if (currentPatternInfo.hasTweezers){
        analyzeData.main.tweezersID = currentPatternInfo.sideDown ? "U8001" : "U8002";
    }
    else {
        analyzeData.main.tweezersID = "U2000";
    }

    if (currentPatternInfo.hasEngulfing){
        analyzeData.main.engulfingsID = currentPatternInfo.sideDown ? "U8003" : "U8004";
    }
    else {
        analyzeData.main.engulfingsID = "U2000";
    }
}