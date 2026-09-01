import { checkClass } from "../control.js";
import { allScenarios, tradingRulesDB, tradingRulesDB_15m_5m_1h } from "../settingsData/all-scenarios.js";

const scenariosLongEntryText = document.getElementById('scenariosLongEntryText');
const scenariosShortEntryText = document.getElementById('scenariosShortEntryText');
const scenariosLongWatchText = document.getElementById('scenariosLongWatchText');
const scenariosShortWatchText = document.getElementById('scenariosShortWatchText');
const scenariosIgnorText = document.getElementById('scenariosIgnorText');
const scenariosWatchText = document.getElementById('scenariosWatchText');

const statusActionBtn1m = document.querySelector("#statusActionBtn1m");
const statusActionBtn5m = document.querySelector("#statusActionBtn5m");
const statusActionBtn15m = document.querySelector("#statusActionBtn15m");
const statusActionBtn30m = document.querySelector("#statusActionBtn30m");
const statusActionBtn1h = document.querySelector("#statusActionBtn1h");

let globalAction = document.getElementById("global-action");

// кнопки для переключення режимів входу чи на довго чи на коротко
const shortTermAgreementsBtn = document.querySelector("#shortTermAgreementsBtn");
const longTermAgreementsBtn = document.querySelector("#longTermAgreementsBtn");

const timeframeButtons = [
  { btn: statusActionBtn1m, key: '1m' },
  { btn: statusActionBtn5m, key: '5m' },
  { btn: statusActionBtn15m, key: '15m' },
  { btn: statusActionBtn30m, key: '30m' },
  { btn: statusActionBtn1h, key: '1h' },
];

// Повертаємо масив об'єктів { id, tf } для кожного знайденого сценарію
// function getScenariosForTimeframe(dataTF, tfLabel) {
//   if (!dataTF) return [];

//   const rawIDs = [
//     dataTF.macd?.main?.currentID,
//     dataTF.ma?.main?.currentID,
//     dataTF.rsi?.main?.currentID,
//     dataTF.wawe?.main?.currentID,
//     dataTF.standartFibanachi?.main?.currentID,
//     dataTF.autoFibanachi?.main?.currentID,
//     dataTF.pattern?.main?.tweezersID,
//     dataTF.pattern?.main?.engulfingsID,
//     dataTF.pivotPoint_1m?.main?.currentID,
//     dataTF.pivotPoint_5m?.main?.currentID,
//     dataTF.pivotPoint_15m?.main?.currentID,
//     dataTF.pivotPoint_30m?.main?.currentID,
//     dataTF.pivotPoint_1h?.main?.currentID,
//     dataTF.pivotPoint_4h?.main?.currentID,
//     dataTF.pivotPoint_1d?.main?.currentID,
//   ].filter(Boolean);

//   // Прив'язуємо назву таймфрейму до кожного ID
//   return rawIDs.map(id => ({ id, tf: tfLabel }));
// }

function getScenariosForTimeframe(dataTF, tfLabel) {
  if (!dataTF) return [];

  // Допоміжна функція: дістає id з елемента (рядок або об'єкт { id: "..." })
  const extractId = item => (typeof item === 'object' && item !== null ? item.id : item);

  // Збираємо поля (підтримуємо як масиви currentIDs, так і поодинокі currentID)
  const sources = [
    dataTF.macd?.main?.currentIDs ?? dataTF.macd?.main?.currentID,
    dataTF.ma?.main?.currentIDs ?? dataTF.ma?.main?.currentID,
    dataTF.rsi?.main?.currentIDs ?? dataTF.rsi?.main?.currentID,
    dataTF.wawe?.main?.currentIDs ?? dataTF.wawe?.main?.currentID,
    dataTF.standartFibanachi?.main?.currentIDs ?? dataTF.standartFibanachi?.main?.currentID,
    dataTF.autoFibanachi?.main?.currentIDs ?? dataTF.autoFibanachi?.main?.currentID,
    dataTF.pattern?.main?.tweezersIDs ?? dataTF.pattern?.main?.tweezersID,
    dataTF.pattern?.main?.engulfingsIDs ?? dataTF.pattern?.main?.engulfingsID,
    dataTF.pivotPoint_1m?.main?.currentIDs ?? dataTF.pivotPoint_1m?.main?.currentID,
    dataTF.pivotPoint_5m?.main?.currentIDs ?? dataTF.pivotPoint_5m?.main?.currentID,
    dataTF.pivotPoint_15m?.main?.currentIDs ?? dataTF.pivotPoint_15m?.main?.currentID,
    dataTF.pivotPoint_30m?.main?.currentIDs ?? dataTF.pivotPoint_30m?.main?.currentID,
    dataTF.pivotPoint_1h?.main?.currentIDs ?? dataTF.pivotPoint_1h?.main?.currentID,
    dataTF.pivotPoint_4h?.main?.currentIDs ?? dataTF.pivotPoint_4h?.main?.currentID,
    dataTF.pivotPoint_1d?.main?.currentIDs ?? dataTF.pivotPoint_1d?.main?.currentID,
  ];

  // Розгортаємо вкладені масиви (flat), витягуємо чисті ID та фільтруємо порожні
  const rawIDs = sources
    .flat()
    .filter(Boolean)
    .map(extractId)
    .filter(Boolean);

  // Прив'язуємо назву таймфрейму до кожного знайденого сценарію
  return rawIDs.map(id => ({ id, tf: tfLabel }));
}

export function updateActions(data, analyzeData) {
  let scenarios = [];

  timeframeButtons.forEach(({ btn, key }) => {
    if (btn && !checkClass(btn)) {
      const tfScenarios = getScenariosForTimeframe(data[key], key);
      scenarios.push(...tfScenarios);
    }
  });

  // Фільтруємо об'єкти за допомогою item.id
  const scenariosLongEntry = scenarios.filter(({ id }) => allScenarios[id]?.action === "ВХІД_LONG");
  const scenariosShortEntry = scenarios.filter(({ id }) => allScenarios[id]?.action === "ВХІД_SHORT");
  const scenariosLongWatch = scenarios.filter(({ id }) => allScenarios[id]?.action === "СТЕЖИТИ_LONG");
  const scenariosShortWatch = scenarios.filter(({ id }) => allScenarios[id]?.action === "СТЕЖИТИ_SHORT");
  const scenariosIgnore = scenarios.filter(({ id }) => allScenarios[id]?.action === "ІГНОРУВАТИ");
  const scenariosWatch = scenarios.filter(({ id }) => allScenarios[id]?.action === "СТЕЖИТИ");

  // Рендеринг з виводом [TF]
  scenariosLongEntryText.innerHTML = scenariosLongEntry.map(({ id, tf }) => `
    <div class="orange-block long-color">[${tf}] ${id} ${allScenarios[id].action} ${allScenarios[id].explanation}</div>
  `).join('');

  scenariosShortEntryText.innerHTML = scenariosShortEntry.map(({ id, tf }) => `
    <div class="orange-block short-color">[${tf}] ${id} ${allScenarios[id].action} ${allScenarios[id].explanation}</div>
  `).join('');

  scenariosLongWatchText.innerHTML = scenariosLongWatch.map(({ id, tf }) => `
    <div class="orange-block long-color-watch">[${tf}] ${id} ${allScenarios[id].action} ${allScenarios[id].explanation}</div>
  `).join('');

  scenariosShortWatchText.innerHTML = scenariosShortWatch.map(({ id, tf }) => `
    <div class="orange-block short-color-watch">[${tf}] ${id} ${allScenarios[id].action} ${allScenarios[id].explanation}</div>
  `).join('');

  scenariosIgnorText.innerHTML = scenariosIgnore.map(({ id, tf }) => `
    <div class="orange-block ignor-color">[${tf}] ${id} ${allScenarios[id].action} ${allScenarios[id].explanation}</div>
  `).join('');

  scenariosWatchText.innerHTML = scenariosWatch.map(({ id, tf }) => `
    <div class="orange-block watch-color">[${tf}] ${id} ${allScenarios[id].action} ${allScenarios[id].explanation}</div>
  `).join('');

  // 1. Отримуємо напрямки для кожного таймфрейму (з урахуванням порогу 60%)
  const tf1h = getTfSignal(analyzeData['1h']);
  const tf30m = getTfSignal(analyzeData['30m']);
  const tf15m = getTfSignal(analyzeData['15m']);
  const tf5m = getTfSignal(analyzeData['5m']);
  const tf1m = getTfSignal(analyzeData['1m']);

  // 2. Передаємо отримані значення у логіку з таблиці
  // console.log(analyzeTradingSignal(tf1h, tf30m, tf15m, tf5m));
//   globalAction.innerText = analyzeTradingSignal(tf1h, tf30m, tf15m, tf5m).message;

    // 1. Отримуємо тільки ID
    const comboId = getCombinationId(tf1h, tf30m, tf15m, tf5m);

    const comboId15m = getCombinationId_15m(tf15m, tf5m, tf1m);
    
    // 2. Повертаємо готовий об'єкт зі списку
    // return tradingRulesDB[comboId];
    if (!checkClass(longTermAgreementsBtn)) {
      globalAction.innerText = `${comboId} | ${tradingRulesDB[comboId].rule} | ${tradingRulesDB[comboId].action} | ${tradingRulesDB[comboId].message}`;
    } else {
      globalAction.innerText = `${comboId15m} | ${tradingRulesDB_15m_5m_1h[comboId15m].rule} | ${tradingRulesDB_15m_5m_1h[comboId15m].action} | ${tradingRulesDB_15m_5m_1h[comboId15m].message}`;
    }
    
}

function getTfSignal(tfResult, threshold = 60) {
    if (!tfResult || typeof tfResult.confidence !== 'number') {
        return null;
    }

    const sideUpper = (tfResult.side || '').toUpperCase();
    const confidence = tfResult.confidence;

    // Сигнал є лише тоді, коли впевненість >= 60%
    if (confidence >= threshold) {
        if (sideUpper === 'LONG') return 'Лонг';
        if (sideUpper === 'SHORT') return 'Шорт';
    }

    // Якщо впевненість між 40% і 60% (або менше threshold) — це шум / Немає
    return null;
}

export function getCombinationId_15m(tf15m, tf5m, tf1m) {
    // Якщо 15хв не має напрямку (Флет) — ряди з 19 по 27
    if (!tf15m) return "s0019"; // Усі комбінації флету на 15хв зводяться до s0019-s0027 (або розписуються окремо)

    // --- 15ХВ = ЛОНГ ---
    if (tf15m === 'Лонг') {
        if (tf5m === 'Лонг') {
            if (tf1m === 'Лонг') return "s0001";
            if (tf1m === 'Шорт') return "s0002";
            if (!tf1m) return "s0003";
        }
        if (tf5m === 'Шорт') {
            if (tf1m === 'Лонг') return "s0004";
            if (tf1m === 'Шорт') return "s0005";
            if (!tf1m) return "s0006";
        }
        if (!tf5m) {
            if (tf1m === 'Лонг') return "s0007";
            if (tf1m === 'Шорт') return "s0008";
            if (!tf1m) return "s0009";
        }
    }

    // --- 15ХВ = ШОРТ ---
    if (tf15m === 'Шорт') {
        if (tf5m === 'Лонг') {
            if (tf1m === 'Лонг') return "s0010";
            if (tf1m === 'Шорт') return "s0011";
            if (!tf1m) return "s0012";
        }
        if (tf5m === 'Шорт') {
            if (tf1m === 'Лонг') return "s0013";
            if (tf1m === 'Шорт') return "s0014";
            if (!tf1m) return "s0015";
        }
        if (!tf5m) {
            if (tf1m === 'Лонг') return "s0016";
            if (tf1m === 'Шорт') return "s0017";
            if (!tf1m) return "s0018";
        }
    }

    return "s0019";
}

export function getCombinationId(tf1h, tf30m, tf15m, tf5m) {
    if (!tf1h) return "k0055";

    // --- 1ГОД = ЛОНГ ---
    if (tf1h === 'Лонг') {
        if (tf30m === 'Лонг') {
            if (tf15m === 'Лонг' && tf5m === 'Лонг') return "k0001";
            if (tf15m === 'Лонг' && tf5m === 'Шорт') return "k0002";
            if (tf15m === 'Лонг' && !tf5m) return "k0003";
            if (tf15m === 'Шорт' && tf5m === 'Лонг') return "k0004";
            if (tf15m === 'Шорт' && tf5m === 'Шорт') return "k0005";
            if (tf15m === 'Шорт' && !tf5m) return "k0006";
            if (!tf15m && tf5m === 'Лонг') return "k0007";
            if (!tf15m && tf5m === 'Шорт') return "k0008";
            if (!tf15m && !tf5m) return "k0009";
        }

        if (tf30m === 'Шорт') {
            if (tf15m === 'Лонг' && tf5m === 'Лонг') return "k0010";
            if (tf15m === 'Лонг' && tf5m === 'Шорт') return "k0011";
            if (tf15m === 'Лонг' && !tf5m) return "k0012";
            if (tf15m === 'Шорт' && tf5m === 'Лонг') return "k0013";
            if (tf15m === 'Шорт' && tf5m === 'Шорт') return "k0014";
            if (tf15m === 'Шорт' && !tf5m) return "k0015";
            if (!tf15m && tf5m === 'Лонг') return "k0016";
            if (!tf15m && tf5m === 'Шорт') return "k0017";
            if (!tf15m && !tf5m) return "k0018";
        }

        if (!tf30m) {
            if (tf15m === 'Лонг' && tf5m === 'Лонг') return "k0019";
            if (tf15m === 'Лонг' && tf5m === 'Шорт') return "k0020";
            if (tf15m === 'Лонг' && !tf5m) return "k0021";
            if (tf15m === 'Шорт' && tf5m === 'Лонг') return "k0022";
            if (tf15m === 'Шорт' && tf5m === 'Шорт') return "k0023";
            if (tf15m === 'Шорт' && !tf5m) return "k0024";
            if (!tf15m && tf5m === 'Лонг') return "k0025";
            if (!tf15m && tf5m === 'Шорт') return "k0026";
            if (!tf15m && !tf5m) return "k0027";
        }
    }

    // --- 1ГОД = ШОРТ ---
    if (tf1h === 'Шорт') {
        if (tf30m === 'Лонг') {
            if (tf15m === 'Лонг' && tf5m === 'Лонг') return "k0028";
            if (tf15m === 'Лонг' && tf5m === 'Шорт') return "k0029";
            if (tf15m === 'Лонг' && !tf5m) return "k0030";
            if (tf15m === 'Шорт' && tf5m === 'Лонг') return "k0031";
            if (tf15m === 'Шорт' && tf5m === 'Шорт') return "k0032";
            if (tf15m === 'Шорт' && !tf5m) return "k0033";
            if (!tf15m && tf5m === 'Лонг') return "k0034";
            if (!tf15m && tf5m === 'Шорт') return "k0035";
            if (!tf15m && !tf5m) return "k0036";
        }

        if (tf30m === 'Шорт') {
            if (tf15m === 'Лонг' && tf5m === 'Лонг') return "k0037";
            if (tf15m === 'Лонг' && tf5m === 'Шорт') return "k0038";
            if (tf15m === 'Лонг' && !tf5m) return "k0039";
            if (tf15m === 'Шорт' && tf5m === 'Лонг') return "k0040";
            if (tf15m === 'Шорт' && tf5m === 'Шорт') return "k0041";
            if (tf15m === 'Шорт' && !tf5m) return "k0042";
            if (!tf15m && tf5m === 'Лонг') return "k0043";
            if (!tf15m && tf5m === 'Шорт') return "k0044";
            if (!tf15m && !tf5m) return "k0045";
        }

        if (!tf30m) {
            if (tf15m === 'Лонг' && tf5m === 'Лонг') return "k0046";
            if (tf15m === 'Лонг' && tf5m === 'Шорт') return "k0047";
            if (tf15m === 'Лонг' && !tf5m) return "k0048";
            if (tf15m === 'Шорт' && tf5m === 'Лонг') return "k0049";
            if (tf15m === 'Шорт' && tf5m === 'Шорт') return "k0050";
            if (tf15m === 'Шорт' && !tf5m) return "k0051";
            if (!tf15m && tf5m === 'Лонг') return "k0052";
            if (!tf15m && tf5m === 'Шорт') return "k0053";
            if (!tf15m && !tf5m) return "k0054";
        }
    }

    return "k0055";
}