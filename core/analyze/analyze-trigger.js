import { getLatestAndPreviousScenarios } from "../lib/mathematical-func.js";
import { isBodyCrossedDown } from "./analyze-ma.js";
import { isBodyCrossedUp } from "./analyze-ma.js";
import { isRetestDownToUp } from "./analyze-ma.js";
import { isRetestUpToDown } from "./analyze-ma.js";
import { isRetestBounce } from "./analyze-ma.js";

// zoneGroups = [...g30, ...g70] (createZoneLine(...).group)
export function analyzeTrigger(analyzeData, zoneGroups, dataKlines) {
    let scenariosID = [];

    let markerApproachAndRebound30 = [];
    let markerApproachAndRebound70 = [];
    let markerRetest30 = [];
    let markerRetest70 = [];

    // ——— Кожну зону перевіряємо окремо ———
    for (const zone of zoneGroups) {
        const LEVEL = zone.value;

        // сценарії та маркери тільки цієї зони
        let zoneScenarios = [];
        let zoneRetest = [];
        let zoneRebound = [];

        // +1 щоб захопити першу свічку наступної зони (шов), не виходячи за масив
        const lastI = Math.min(zone.end + 1, dataKlines.length - 1);

        for (let i = zone.start + 1; i <= lastI; i++) {
            const prev = dataKlines[i - 1];
            const cur = dataKlines[i];
            const next = i + 1 < dataKlines.length ? dataKlines[i + 1] : null;

            if (zone.type === "oversold") {
                if (next && isBodyCrossedUp(prev, cur, next, LEVEL, LEVEL, LEVEL)) {
                    zoneScenarios.push({ index: i, time: cur.time, id: "U7001" });
                    zoneRebound = [];
                    zoneRetest = [];
                }

                if (next && isBodyCrossedDown(prev, cur, next, LEVEL, LEVEL, LEVEL)) {
                    zoneScenarios.push({ index: i, time: cur.time, id: "U7003" });
                    zoneRebound = [];
                    zoneRetest = [];
                }

                if (next && isRetestDownToUp(prev, cur, next, LEVEL, LEVEL, LEVEL)) {
                    zoneScenarios.push({ index: i, time: cur.time, id: "U7002" });
                    zoneRetest.push({ time: cur.time, position: "belowBar", color: "#00ff00", shape: "arrowUp", text: "TR30", size: 2 });
                }

                if (next && cur.low > LEVEL && isRetestBounce(prev, cur, next, LEVEL, LEVEL, LEVEL)) {
                    zoneScenarios.push({ index: i, time: cur.time, id: "U7007" });
                    zoneRebound.push({ time: cur.time, position: "belowBar", color: "#00ff00", shape: "arrowUp", text: "TFR30", size: 2 });
                }
            }

            if (zone.type === "overbought") {
                if (next && isBodyCrossedUp(prev, cur, next, LEVEL, LEVEL, LEVEL)) {
                    zoneScenarios.push({ index: i, time: cur.time, id: "U7006" });
                    zoneRebound = [];
                    zoneRetest = [];
                }

                if (next && isBodyCrossedDown(prev, cur, next, LEVEL, LEVEL, LEVEL)) {
                    zoneScenarios.push({ index: i, time: cur.time, id: "U7004" });
                    zoneRebound = [];
                    zoneRetest = [];
                }

                if (next && isRetestUpToDown(prev, cur, next, LEVEL, LEVEL, LEVEL)) {
                    zoneScenarios.push({ index: i, time: cur.time, id: "U7005" });
                    zoneRetest.push({ time: cur.time, position: "aboveBar", color: "#ff0000", shape: "arrowDown", text: "TR70", size: 2 });
                }

                if (next && cur.high < LEVEL && isRetestBounce(prev, cur, next, LEVEL, LEVEL, LEVEL)) {
                    zoneScenarios.push({ index: i, time: cur.time, id: "U7008" });
                    zoneRebound.push({ time: cur.time, position: "aboveBar", color: "#ff0000", shape: "arrowDown", text: "TFR70", size: 2 });
                }
            }
        }

        // зводимо результат зони в загальний
        scenariosID.push(...zoneScenarios);

        if (zone.type === "oversold") {
            markerRetest30.push(...zoneRetest);
            markerApproachAndRebound30.push(...zoneRebound);
        } else {
            markerRetest70.push(...zoneRetest);
            markerApproachAndRebound70.push(...zoneRebound);
        }
    }

    // ——— Усе разом у хронологічному порядку ———
    scenariosID.sort((a, b) => a.index - b.index);
    scenariosID = scenariosID.map(({ time, id }) => ({ time, id }));

    const currentID = scenariosID.length > 0 ? scenariosID[scenariosID.length - 1].id : "U2000";
    const previousID = scenariosID.length > 1 ? scenariosID[scenariosID.length - 2].id : "U2000";

    // ——— ТОРКАННЯ (останні рівні 30 і 70) ———
    let touchingInfo = "";

    if (dataKlines.length >= 2) {
        const last30 = zoneGroups.filter(z => z.type === "oversold").at(-1);
        const last70 = zoneGroups.filter(z => z.type === "overbought").at(-1);

        const lastPrev = dataKlines[dataKlines.length - 2];
        const lastCur = dataKlines[dataKlines.length - 1];

        if (last30) {
            const L30 = last30.value;
            const prevStrictlyAbove30 = lastPrev.low > L30;
            const prevStrictlyBelow30 = lastPrev.high < L30;
            const isTouching30 = lastCur.low <= L30 && lastCur.high >= L30;

            if (isTouching30) {
                if (prevStrictlyAbove30) touchingInfo = "Торкання рівня 30 зверху";
                else if (prevStrictlyBelow30) touchingInfo = "Торкання рівня 30 знизу";
            }
        }

        if (!touchingInfo && last70) {
            const L70 = last70.value;
            const prevStrictlyAbove70 = lastPrev.low > L70;
            const prevStrictlyBelow70 = lastPrev.high < L70;
            const isTouching70 = lastCur.low <= L70 && lastCur.high >= L70;

            if (isTouching70) {
                if (prevStrictlyAbove70) touchingInfo = "Торкання рівня 70 зверху";
                else if (prevStrictlyBelow70) touchingInfo = "Торкання рівня 70 знизу";
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

    if (touchingInfo === "Торкання рівня 30 зверху") {
        analyzeData.additional.touching.currentID = "B2001";
    }

    if (touchingInfo === "Торкання рівня 30 знизу") {
        analyzeData.additional.touching.currentID = "B2002";
    }

    if (touchingInfo === "Торкання рівня 70 зверху") {
        analyzeData.additional.touching.currentID = "B2003";
    }

    if (touchingInfo === "Торкання рівня 70 знизу") {
        analyzeData.additional.touching.currentID = "B2004";
    }

    return [...markerRetest30, ...markerRetest70, ...markerApproachAndRebound30, ...markerApproachAndRebound70];
}