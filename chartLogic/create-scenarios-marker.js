import { checkClass } from "../control.js";
import { allScenarios } from "../settingsData/all-scenarios.js";

function dataToMarkers(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }

    let markersData = [];

    for (let i = 0; i < data.length; i++) {
        const cur = data[i];

        if (!cur || cur.time === undefined || cur.time === null) {
            continue;
        }

        // Визначаємо сторону угоди: short / sell чи long / buy
        const isShort = allScenarios[cur.id]?.direction < 0;

        if (isShort) {
            // --- ЛОГІКА ШОРТ (Рітест опору) ---
            markersData.push({
                time: Number(cur.time),
                position: "aboveBar",
                color: "#ef5350",
                shape: "arrowDown",
                text: `${cur.id}`,
                size: 2
            });
        } else {
            // --- ЛОГІКА ЛОНГ (Рітест підтримки) ---
            markersData.push({
                time: Number(cur.time),
                position: "belowBar",
                color: "#26a69a",
                shape: "arrowUp",
                text: `${cur.id}`,
                size: 2
            });
        }
    }

    return markersData;
}

// MACD режими відображення маркерів сценаріїв
const regim1ScenariosMACD = document.querySelector("#regim1ScenariosMACD"); // 1 реж: нічого
const regim2ScenariosMACD = document.querySelector("#regim2ScenariosMACD"); // 2 реж: всі
const regim3ScenariosMACD = document.querySelector("#regim3ScenariosMACD"); // 3 реж: останній

// MA режими відображення маркерів сценаріїв
const regim1ScenariosMA = document.querySelector("#regim1ScenariosMA");
const regim2ScenariosMA = document.querySelector("#regim2ScenariosMA");
const regim3ScenariosMA = document.querySelector("#regim3ScenariosMA");

// RSI режими відображення маркерів сценаріїв
const regim1ScenariosRSI = document.querySelector("#regim1ScenariosRSI");
const regim2ScenariosRSI = document.querySelector("#regim2ScenariosRSI");
const regim3ScenariosRSI = document.querySelector("#regim3ScenariosRSI");

// Wawe режими відображенння маркерів сценаріїв
const regim1ScenariosWawe = document.querySelector("#regim1ScenariosWawe");
const regim2ScenariosWawe = document.querySelector("#regim2ScenariosWawe");
const regim3ScenariosWawe = document.querySelector("#regim3ScenariosWawe");

// Fibonachi режими відображенння маркерів сценаріїв
const regim1ScenariosFibonachi = document.querySelector("#regim1ScenariosFibonachi");
const regim2ScenariosFibonachi = document.querySelector("#regim2ScenariosFibonachi");
const regim3ScenariosFibonachi = document.querySelector("#regim3ScenariosFibonachi");

// AutoFibanachi режими відображенння маркерів сценаріїв
const regim1ScenariosAutoFibanachi = document.querySelector("#regim1ScenariosAutoFibanachi");
const regim2ScenariosAutoFibanachi = document.querySelector("#regim2ScenariosAutoFibanachi");
const regim3ScenariosAutoFibanachi = document.querySelector("#regim3ScenariosAutoFibanachi");

// Trigger режими відображенння маркерів сценаріїв
const regim1ScenariosTrigger = document.querySelector("#regim1ScenariosTrigger");
const regim2ScenariosTrigger = document.querySelector("#regim2ScenariosTrigger");
const regim3ScenariosTrigger = document.querySelector("#regim3ScenariosTrigger");

// Pivot Point 5m режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_5m = document.querySelector("#regim1ScenariosPivotPoint_5m");
const regim2ScenariosPivotPoint_5m = document.querySelector("#regim2ScenariosPivotPoint_5m");
const regim3ScenariosPivotPoint_5m = document.querySelector("#regim3ScenariosPivotPoint_5m");

// Pivot Point 15m режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_15m = document.querySelector("#regim1ScenariosPivotPoint_15m");
const regim2ScenariosPivotPoint_15m = document.querySelector("#regim2ScenariosPivotPoint_15m");
const regim3ScenariosPivotPoint_15m = document.querySelector("#regim3ScenariosPivotPoint_15m");

// Pivot Point 30m режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_30m = document.querySelector("#regim1ScenariosPivotPoint_30m");
const regim2ScenariosPivotPoint_30m = document.querySelector("#regim2ScenariosPivotPoint_30m");
const regim3ScenariosPivotPoint_30m = document.querySelector("#regim3ScenariosPivotPoint_30m");

// Pivot Point 1h режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_1h = document.querySelector("#regim1ScenariosPivotPoint_1h");
const regim2ScenariosPivotPoint_1h = document.querySelector("#regim2ScenariosPivotPoint_1h");
const regim3ScenariosPivotPoint_1h = document.querySelector("#regim3ScenariosPivotPoint_1h");

// Pivot Point 4h режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_4h = document.querySelector("#regim1ScenariosPivotPoint_4h");
const regim2ScenariosPivotPoint_4h = document.querySelector("#regim2ScenariosPivotPoint_4h");
const regim3ScenariosPivotPoint_4h = document.querySelector("#regim3ScenariosPivotPoint_4h");

// Pivot Point 1d режими відображенння маркерів сценаріїв
const regim1ScenariosPivotPoint_1d = document.querySelector("#regim1ScenariosPivotPoint_1d");
const regim2ScenariosPivotPoint_1d = document.querySelector("#regim2ScenariosPivotPoint_1d");
const regim3ScenariosPivotPoint_1d = document.querySelector("#regim3ScenariosPivotPoint_1d");

// Селектор загального інпута для фільтрації по ID сценарію (наприклад, "U4021")
const scenarioFilterInput = document.querySelector("#scenarioFilterInput");

// Допоміжна функція: визначає потрібні дані та генерує маркери
function getMarkersByMode(mainData, btnNone, btnAll, btnLast) {
    if (!mainData) return [];

    // 1 реж: нічого — не викликаємо dataToMarkers взагалі
    if (!checkClass(btnNone)) {
        return [];
    }

    // 3 реж: тільки останні — конвертуємо лише currentIDs
    if (!checkClass(btnLast)) {
        const lastData = mainData.currentIDs;
        if (!lastData || (Array.isArray(lastData) && lastData.length === 0)) return [];
        return dataToMarkers(Array.isArray(lastData) ? lastData : [lastData]);
    }

    // 2 реж: всі — конвертуємо повний scenariosID
    if (!checkClass(btnAll)) {
        const allData = mainData.scenariosID;
        if (!allData || (Array.isArray(allData) && allData.length === 0)) return [];
        return dataToMarkers(allData);
    }

    // За замовчуванням
    return [];
}

export function createScenariosMarker(analyzeData) {
    let allMarkers = [];

    // Передаємо вузол .main кожного індикатора, де є і scenariosID, і currentIDs
    const configs = [
        { main: analyzeData?.macd?.main, btns: [regim1ScenariosMACD, regim2ScenariosMACD, regim3ScenariosMACD] },
        { main: analyzeData?.ma?.main, btns: [regim1ScenariosMA, regim2ScenariosMA, regim3ScenariosMA] },
        { main: analyzeData?.rsi?.main, btns: [regim1ScenariosRSI, regim2ScenariosRSI, regim3ScenariosRSI] },
        { main: analyzeData?.wawe?.main, btns: [regim1ScenariosWawe, regim2ScenariosWawe, regim3ScenariosWawe] },
        { main: analyzeData?.standartFibanachi?.main, btns: [regim1ScenariosFibonachi, regim2ScenariosFibonachi, regim3ScenariosFibonachi] },
        { main: analyzeData?.autoFibanachi?.main, btns: [regim1ScenariosAutoFibanachi, regim2ScenariosAutoFibanachi, regim3ScenariosAutoFibanachi] },
        { main: analyzeData?.trigger?.main, btns: [regim1ScenariosTrigger, regim2ScenariosTrigger, regim3ScenariosTrigger] },
        { main: analyzeData?.pivotPoint_5m?.main, btns: [regim1ScenariosPivotPoint_5m, regim2ScenariosPivotPoint_5m, regim3ScenariosPivotPoint_5m] },
        { main: analyzeData?.pivotPoint_15m?.main, btns: [regim1ScenariosPivotPoint_15m, regim2ScenariosPivotPoint_15m, regim3ScenariosPivotPoint_15m] },
        { main: analyzeData?.pivotPoint_30m?.main, btns: [regim1ScenariosPivotPoint_30m, regim2ScenariosPivotPoint_30m, regim3ScenariosPivotPoint_30m] },
        { main: analyzeData?.pivotPoint_1h?.main, btns: [regim1ScenariosPivotPoint_1h, regim2ScenariosPivotPoint_1h, regim3ScenariosPivotPoint_1h] },
        { main: analyzeData?.pivotPoint_4h?.main, btns: [regim1ScenariosPivotPoint_4h, regim2ScenariosPivotPoint_4h, regim3ScenariosPivotPoint_4h] },
        { main: analyzeData?.pivotPoint_1d?.main, btns: [regim1ScenariosPivotPoint_1d, regim2ScenariosPivotPoint_1d, regim3ScenariosPivotPoint_1d] }
    ];

    // Формуємо маркери тільки для активних режимів
    configs.forEach(({ main, btns }) => {
        if (main) {
            const markers = getMarkersByMode(main, ...btns);
            allMarkers.push(...markers);
        }
    });

    // ==========================================
    // ЗАГАЛЬНИЙ ФІЛЬТР ПО INPUT
    // ==========================================
    const filterQuery = scenarioFilterInput?.value?.trim().toUpperCase();

    if (filterQuery) {
        allMarkers = allMarkers.filter(marker => marker.text.toUpperCase() === filterQuery);
    }

    // Фінальне сортування за часом
    return allMarkers.sort((a, b) => a.time - b.time);
}

// analyzeData = [
//     {
//         "time": 1783414800,
//         "id": "U4015"
//     },
//     {
//         "time": 1783436400,
//         "id": "U4001"
//     },
//     {
//         "time": 1783447200,
//         "id": "U4005"
//     },
//     {
//         "time": 1783454400,
//         "id": "U4002"
//     },
//     {
//         "time": 1783468800,
//         "id": "U4004"
//     },
//     {
//         "time": 1783497600,
//         "id": "U4018"
//     },
//     {
//         "time": 1783522800,
//         "id": "U4018"
//     },
//     {
//         "time": 1783540800,
//         "id": "U4021"
//     },
//     {
//         "time": 1783562400,
//         "id": "U4021"
//     },
//     {
//         "time": 1783569600,
//         "id": "U4001"
//     },
//     {
//         "time": 1783584000,
//         "id": "U4021"
//     },
//     {
//         "time": 1783598400,
//         "id": "U4021"
//     },
//     {
//         "time": 1783598400,
//         "id": "U4003"
//     },
//     {
//         "time": 1783612800,
//         "id": "U4021"
//     },
//     {
//         "time": 1783612800,
//         "id": "U4003"
//     },
//     {
//         "time": 1783634400,
//         "id": "U4021"
//     },
//     {
//         "time": 1783641600,
//         "id": "U4021"
//     },
//     {
//         "time": 1783648800,
//         "id": "U4007"
//     },
//     {
//         "time": 1783652400,
//         "id": "U4011"
//     },
//     {
//         "time": 1783663200,
//         "id": "U4008"
//     },
//     {
//         "time": 1783674000,
//         "id": "U4007"
//     },
//     {
//         "time": 1783684800,
//         "id": "U4013"
//     },
//     {
//         "time": 1783692000,
//         "id": "U4008"
//     },
//     {
//         "time": 1783699200,
//         "id": "U4022"
//     },
//     {
//         "time": 1783710000,
//         "id": "U4022"
//     },
//     {
//         "time": 1783713600,
//         "id": "U4003"
//     },
//     {
//         "time": 1783724400,
//         "id": "U4022"
//     },
//     {
//         "time": 1783735200,
//         "id": "U4022"
//     },
//     {
//         "time": 1783749600,
//         "id": "U4022"
//     },
//     {
//         "time": 1783756800,
//         "id": "U4022"
//     },
//     {
//         "time": 1783767600,
//         "id": "U4022"
//     },
//     {
//         "time": 1783778400,
//         "id": "U4022"
//     },
//     {
//         "time": 1783792800,
//         "id": "U4022"
//     },
//     {
//         "time": 1783800000,
//         "id": "U4022"
//     },
//     {
//         "time": 1783810800,
//         "id": "U4002"
//     },
//     {
//         "time": 1783818000,
//         "id": "U4022"
//     },
//     {
//         "time": 1783818000,
//         "id": "U4006"
//     },
//     {
//         "time": 1783825200,
//         "id": "U4022"
//     },
//     {
//         "time": 1783825200,
//         "id": "U4001"
//     },
//     {
//         "time": 1783828800,
//         "id": "U4002"
//     },
//     {
//         "time": 1783843200,
//         "id": "U4022"
//     },
//     {
//         "time": 1783857600,
//         "id": "U4022"
//     },
// ]