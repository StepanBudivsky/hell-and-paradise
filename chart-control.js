import { getChartSettings } from "./chartLogic/chart-get-settings.js";
import { chartProcessor } from "./chartLogic/chart-processor.js";
import { renderChartLine } from "./chartLogic/chart-render-line.js";
import { analyzeDataByInterval, analyzeResultByInterval } from "./program-analyze-data.js";
import { updateAnalyze } from "./chartLogic/update-analyze.js";
import { updateUnifiedAnalyze } from "./chartLogic/update-unified-analyze.js";
import { updateEntries } from "./chartLogic/update-entries.js";
import { currentGlobalAnalazeInterval, currentInterval, klines } from "./chart-data.js";
import { updateUnifiedAnalyzeUI } from "./chartLogic/update-unified-analyze-ui.js";
import { getSummaryResult } from "./chartLogic/summary-results.js";
import { updateActions } from "./chartLogic/update-actions.js";
import { createScenariosMarker } from "./chartLogic/create-scenarios-marker.js";
import { backtestMarkers, getConfigFromUI, renderResultsToUI } from "./chartLogic/test-deals/backtest-markers.js";

// const config = {
//   margin: 100,           // 100$ на угоду
//   leverage: 20,          // 20x плече (об'єм $2,000)
//   slRoePercent: 10,      // Стоп: -10% ROE (-$10 від маржі, або 0.5% ціни)
//   tpRoePercent: 30,      // Тейк: +30% ROE (+$30 до маржі, або 1.5% ціни)
//   feeRate: 0.05,         // 0.05% комісія

//   // Параметри точки входу:
//   entryBarOffset: 1,     // 0 = ця ж свічка, 1 = наступна свічка (для ретестів/підтверджень)
//   entryPriceSource: 'open' // 'open' | 'close' | 'high' | 'low'
// };

export function setChartInterval(interval) {

  const settings = getChartSettings(interval);

  const calculationData = chartProcessor(settings, analyzeDataByInterval[interval]);
  
  if (interval === currentInterval) {
    let markersScenarios = createScenariosMarker(analyzeDataByInterval[interval]);
    // console.log(markersScenarios);    

    const config = getConfigFromUI();
    const result = backtestMarkers(klines, markersScenarios, config);
    renderResultsToUI(result);
    // console.log(result.scenarioStats);

    renderChartLine(calculationData, settings, markersScenarios);
    updateAnalyze(analyzeDataByInterval[interval]);
  }

  // console.log(analyzeDataByInterval);

  const unifiedAnalyzeData = updateUnifiedAnalyze(analyzeDataByInterval[interval], interval, analyzeResultByInterval[interval]);

  if (interval === currentGlobalAnalazeInterval) {
    updateUnifiedAnalyzeUI(analyzeDataByInterval[interval], unifiedAnalyzeData)
  }

  updateEntries();

  getSummaryResult(analyzeResultByInterval);

  updateActions(analyzeDataByInterval, analyzeResultByInterval);
}

// приклад даних на вхід 
// [
//     {
//         "time": 1788917520,
//         "position": "aboveBar",
//         "color": "#ef5350",
//         "shape": "arrowDown",
//         "text": "U2006",
//         "size": 2
//     },
//     {
//         "time": 1788921120,
//         "position": "aboveBar",
//         "color": "#ef5350",
//         "shape": "arrowDown",
//         "text": "U2006",
//         "size": 2
//     },
//     {
//         "time": 1788934980,
//         "position": "aboveBar",
//         "color": "#ef5350",
//         "shape": "arrowDown",
//         "text": "U2006",
//         "size": 2
//     },
//     {
//         "time": 1788940740,
//         "position": "aboveBar",
//         "color": "#ef5350",
//         "shape": "arrowDown",
//         "text": "U2006",
//         "size": 2
//     },
//     {
//         "time": 1788941400,
//         "position": "aboveBar",
//         "color": "#ef5350",
//         "shape": "arrowDown",
//         "text": "U2006",
//         "size": 2
//     },
//     {
//         "time": 1788950340,
//         "position": "aboveBar",
//         "color": "#ef5350",
//         "shape": "arrowDown",
//         "text": "U2006",
//         "size": 2
//     },
//     {
//         "time": 1788953640,
//         "position": "aboveBar",
//         "color": "#ef5350",
//         "shape": "arrowDown",
//         "text": "U2006",
//         "size": 2
//     },
//     {
//         "time": 1788955200,
//         "position": "aboveBar",
//         "color": "#ef5350",
//         "shape": "arrowDown",
//         "text": "U2006",
//         "size": 2
//     },
//     {
//         "time": 1788957720,
//         "position": "aboveBar",
//         "color": "#ef5350",
//         "shape": "arrowDown",
//         "text": "U2006",
//         "size": 2
//     },
//     {
//         "time": 1788964380,
//         "position": "aboveBar",
//         "color": "#ef5350",
//         "shape": "arrowDown",
//         "text": "U2006",
//         "size": 2
//     }
// ]