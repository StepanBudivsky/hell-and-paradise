import { allScenarios } from "../../settingsData/all-scenarios.js";

/**
 * Розрахунок рівнів Stop Loss та Take Profit на базі ROE до маржі
 */
function calculateTargets({ entryPrice, directionType, scenario, config }) {
  const leverage = config.leverage ?? 1;

  // Конвертуємо бажаний % ROE до маржі у % руху базової ціни активу
  const targetRoeSL = config.slRoePercent ?? 10; // Наприклад, 10% мінусу від маржі
  const targetRoeTP = config.tpRoePercent ?? 30; // Наприклад, 30% плюсу від маржі

  const priceSlPercent = targetRoeSL / leverage;
  const priceTpPercent = targetRoeTP / leverage;

  let takeProfit = 0;
  let stopLoss = 0;

  if (directionType === 'LONG') {
    takeProfit = entryPrice * (1 + priceTpPercent / 100);
    stopLoss = entryPrice * (1 - priceSlPercent / 100);
  } else {
    // SHORT
    takeProfit = entryPrice * (1 - priceTpPercent / 100);
    stopLoss = entryPrice * (1 + priceSlPercent / 100);
  }

  return { takeProfit, stopLoss };
}

/**
 * Бектестер маркерів по масиву свічок
 *
 * @param {Array} candles - Масив свічок [{ time, open, high, low, close }]
 * @param {Array} markers - Масив маркерів [{ time, text: "U2006", ... }]
 * @param {Object} config - Параметри тесту
 */
export function backtestMarkers(candles, markers, config = {}) {
  const margin = config.margin ?? 100;
  const leverage = config.leverage ?? 20;
  const feeRate = config.feeRate ?? 0.05;

  // Налаштування точки та часу входу:
  // entryBarOffset: 0 - на тій самій свічці, де маркер; 1 - на наступній свічці
  const entryBarOffset = config.entryBarOffset ?? 0;
  // entryPriceSource: 'open' | 'close' | 'high' | 'low'
  const entryPriceSource = config.entryPriceSource ?? 'close';

  // 1. Прив'язуємо маркери до індексів масиву свічок через Map
  const timeToIndex = new Map();
  for (let i = 0; i < candles.length; i++) {
    timeToIndex.set(candles[i].time, i);
  }

  // Черга відкладених входів: Map<candleIndex, Array<Marker>>
  const pendingEntriesByBarIndex = new Map();

  for (const m of markers) {
    const barIndex = timeToIndex.get(m.time);
    if (barIndex === undefined) continue;

    const targetEntryIndex = barIndex + entryBarOffset;
    if (targetEntryIndex >= candles.length) continue; // Вихід за межі історії

    if (!pendingEntriesByBarIndex.has(targetEntryIndex)) {
      pendingEntriesByBarIndex.set(targetEntryIndex, []);
    }
    pendingEntriesByBarIndex.get(targetEntryIndex).push(m);
  }

  const activeTrades = [];
  const closedTrades = [];

  // 2. Єдиний прохід по 100k свічок
  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    // --- ВХІД У ПОЗИЦІЇ НА ПОТОЧНІЙ СВІЧЦІ ---
    if (pendingEntriesByBarIndex.has(i)) {
      const markersToEnter = pendingEntriesByBarIndex.get(i);

      for (const marker of markersToEnter) {
        const scenarioCode = marker.text;
        const scenario = allScenarios[scenarioCode];

        if (!scenario || scenario.direction === 0) continue;

        const directionType = scenario.direction === 1 ? 'LONG' : 'SHORT';
        const entryPrice = candle[entryPriceSource];

        const { takeProfit, stopLoss } = calculateTargets({
          entryPrice,
          directionType,
          scenario,
          config,
        });

        const notionalSize = margin * leverage;
        const contractsCount = notionalSize / entryPrice;

        activeTrades.push({
          scenarioCode,
          type: directionType,
          entryPrice,
          takeProfit,
          stopLoss,
          entryTime: candle.time,
          entryBarIndex: i,
          margin,
          leverage,
          notionalSize,
          contractsCount,
          barsHeld: 0,
          maxPriceGainPercent: 0,
          maxPriceDropPercent: 0,
          maxRoePercent: 0,
          maxDrawdownRoe: 0,
          exitReason: null,
          exitPrice: null,
          exitTime: null,
          netProfitUSD: 0,
          finalRoePercent: 0,
        });
      }
    }

    if (activeTrades.length === 0) continue;

    // --- ОНОВЛЕННЯ ТА ЗАКРИТТЯ АКТИВНИХ ПОЗИЦІЙ ---
    for (let j = activeTrades.length - 1; j >= 0; j--) {
      const trade = activeTrades[j];
      trade.barsHeld += 1;

      let hitTP = false;
      let hitSL = false;

      if (trade.type === 'LONG') {
        const highPriceChange = ((candle.high - trade.entryPrice) / trade.entryPrice) * 100;
        const lowPriceChange = ((candle.low - trade.entryPrice) / trade.entryPrice) * 100;

        trade.maxPriceGainPercent = Math.max(trade.maxPriceGainPercent, highPriceChange);
        trade.maxPriceDropPercent = Math.min(trade.maxPriceDropPercent, lowPriceChange);
        trade.maxRoePercent = trade.maxPriceGainPercent * trade.leverage;
        trade.maxDrawdownRoe = trade.maxPriceDropPercent * trade.leverage;

        hitTP = candle.high >= trade.takeProfit;
        hitSL = candle.low <= trade.stopLoss;

        if (hitTP && hitSL) {
          trade.exitReason = 'SL';
          trade.exitPrice = trade.stopLoss;
        } else if (hitTP) {
          trade.exitReason = 'TP';
          trade.exitPrice = trade.takeProfit;
        } else if (hitSL) {
          trade.exitReason = 'SL';
          trade.exitPrice = trade.stopLoss;
        }
      } else {
        // SHORT
        const lowPriceChange = ((trade.entryPrice - candle.low) / trade.entryPrice) * 100;
        const highPriceChange = ((trade.entryPrice - candle.high) / trade.entryPrice) * 100;

        trade.maxPriceGainPercent = Math.max(trade.maxPriceGainPercent, lowPriceChange);
        trade.maxPriceDropPercent = Math.min(trade.maxPriceDropPercent, highPriceChange);
        trade.maxRoePercent = trade.maxPriceGainPercent * trade.leverage;
        trade.maxDrawdownRoe = trade.maxPriceDropPercent * trade.leverage;

        hitTP = candle.low <= trade.takeProfit;
        hitSL = candle.high >= trade.stopLoss;

        if (hitTP && hitSL) {
          trade.exitReason = 'SL';
          trade.exitPrice = trade.stopLoss;
        } else if (hitTP) {
          trade.exitReason = 'TP';
          trade.exitPrice = trade.takeProfit;
        } else if (hitSL) {
          trade.exitReason = 'SL';
          trade.exitPrice = trade.stopLoss;
        }
      }

      if (trade.exitReason) {
        trade.exitTime = candle.time;

        const priceDiff = trade.type === 'LONG'
          ? (trade.exitPrice - trade.entryPrice)
          : (trade.entryPrice - trade.exitPrice);

        const rawProfitUSD = priceDiff * trade.contractsCount;

        const entryFee = trade.notionalSize * (feeRate / 100);
        const exitFee = (trade.contractsCount * trade.exitPrice) * (feeRate / 100);

        trade.netProfitUSD = +(rawProfitUSD - (entryFee + exitFee)).toFixed(2);
        trade.finalRoePercent = +((trade.netProfitUSD / trade.margin) * 100).toFixed(2);

        closedTrades.push(trade);

        // O(1) видалення
        activeTrades[j] = activeTrades[activeTrades.length - 1];
        activeTrades.pop();
      }
    }
  }

  return summarize(closedTrades, activeTrades.length);
}

function summarize(closedTrades, stillOpenCount) {
  const byScenario = {};

  for (const t of closedTrades) {
    if (!byScenario[t.scenarioCode]) {
      byScenario[t.scenarioCode] = [];
    }
    byScenario[t.scenarioCode].push(t);
  }

  const scenarioStats = {};

  for (const [code, trades] of Object.entries(byScenario)) {
    const tpTrades = trades.filter(t => t.exitReason === 'TP');
    const slTrades = trades.filter(t => t.exitReason === 'SL');

    // Угоди, які перед вибиванням стопу показували ROE >= +10%
    const slAfterProfit = slTrades.filter(t => t.maxRoePercent >= 10);
    const totalProfitUSD = trades.reduce((sum, t) => sum + t.netProfitUSD, 0);

    scenarioStats[code] = {
      totalSignals: trades.length,
      tpCount: tpTrades.length,
      slCount: slTrades.length,
      winRate: ((tpTrades.length / trades.length) * 100).toFixed(2) + '%',
      totalNetUSD: +totalProfitUSD.toFixed(2),
      avgBarsToTP: (tpTrades.reduce((s, t) => s + t.barsHeld, 0) / (tpTrades.length || 1)).toFixed(1),
      avgBarsToSL: (slTrades.reduce((s, t) => s + t.barsHeld, 0) / (slTrades.length || 1)).toFixed(1),
      
      // Скільки разів майже дійшло до тейку / було в сильному плюсі перед стопом
      slAfterProfitCount: slAfterProfit.length,
      avgMaxRoeBeforeSL: slAfterProfit.length > 0
        ? (slAfterProfit.reduce((s, t) => s + t.maxRoePercent, 0) / slAfterProfit.length).toFixed(2) + '%'
        : '0%',
    };
  }

  return {
    totalClosed: closedTrades.length,
    stillOpen: stillOpenCount,
    scenarioStats,
    trades: closedTrades,
  };
}

/**
 * Зчитує актуальні значення з DOM-елементів та формує конфіг
 */
export function getConfigFromUI() {
  const margin = parseFloat(document.getElementById('cashInputParametr').value) || 100;
  const leverage = parseFloat(document.getElementById('shoulderInputParametr').value) || 20;
  const tpRoe = parseFloat(document.getElementById('takeProfitAmountInputParametr').value) || 30;
  
  // Якщо введено -10, Math.abs дасть додатне число для внутрішніх формул
  const rawSL = parseFloat(document.getElementById('stopLossAmountInputParametr').value) || 10;
  const slRoe = Math.abs(rawSL);

  const entryBarOffset = parseInt(document.getElementById('candleOffsetInput').value, 10) || 0;
  const entryPriceSource = document.getElementById('candleStartParameter').value || 'open';

  return {
    margin,
    leverage,
    tpRoePercent: tpRoe,
    slRoePercent: slRoe,
    entryBarOffset,
    entryPriceSource,
    feeRate: 0, // Базова taker-комісія
  };
}

/**
 * Відображає розраховані результати в DOM-елементах
 */
export function renderResultsToUI(report) {
  const overallEl = document.getElementById('overallStats');
  const listEl = document.getElementById('scenariosStatsList');

  if (!overallEl || !listEl) return;

  // 1. Загальний огляд
  overallEl.innerHTML = `
    <div>Закрито угод: <span>${report.totalClosed}</span> (Ще відкрито: ${report.stillOpen})</div>
  `;

  // 2. Деталізація по кожному патерну/сценарію
  let listHtml = '';
  const entries = Object.entries(report.scenarioStats);

  if (entries.length === 0) {
    listEl.innerHTML = '<p>Немає закритих угод для відображення.</p>';
    return;
  }

  for (const [code, stats] of entries) {
    const profitColor = stats.totalNetUSD >= 0 ? '#26a69a' : '#ef5350';

    listHtml += `
      <div style="background: rgba(255,255,255,0.05); padding: 8px; margin-bottom: 8px; border-radius: 4px; border-left: 3px solid ${profitColor};">
        <div style="display: flex; justify-content: space-between;">
          <strong>Патерн: ${code}</strong>
          <span style="color: ${profitColor}; font-weight: bold;">${stats.totalNetUSD > 0 ? '+' : ''}${stats.totalNetUSD} $</span>
        </div>
        <div style="font-size: 13px; margin-top: 4px; line-height: 1.4;">
          <div>Сигналів: <b>${stats.totalSignals}</b> | WinRate: <b>${stats.winRate}</b> (TP: ${stats.tpCount} / SL: ${stats.slCount})</div>
          <div>Сер. свічок: TP <b>${stats.avgBarsToTP}</b> / SL <b>${stats.avgBarsToSL}</b></div>
          <div style="color: #ffa726;">
            Вибито SL після профіту (≥10% ROE): <b>${stats.slAfterProfitCount}</b> разів (сер. пік ROE: <b>${stats.avgMaxRoeBeforeSL}</b>)
          </div>
        </div>
      </div>
    `;
  }

  listEl.innerHTML = listHtml;
}