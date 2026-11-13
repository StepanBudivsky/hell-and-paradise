import { getChartSettings } from "./chartLogic/chart-get-settings.js";
import { chartProcessor } from "./chartLogic/chart-processor.js";
import { renderChartLine } from "./chartLogic/chart-render-line.js";
import { analyzeDataByInterval, analyzeResultByInterval } from "./settingsData/program-analyze-data.js";
import { updateAnalyze } from "./chartLogic/update-analyze.js";
import { updateUnifiedAnalyze } from "./chartLogic/update-unified-analyze.js";
import { updateEntries } from "./chartLogic/update-entries.js";
import { currentGlobalAnalazeInterval, currentInterval, klines } from "./chart-data.js";
import { updateUnifiedAnalyzeUI } from "./chartLogic/update-unified-analyze-ui.js";
import { getSummaryResult } from "./chartLogic/summary-results.js";
import { updateActions } from "./chartLogic/update-actions.js";
import { createScenariosMarker } from "./chartLogic/create-scenarios-marker.js";
import { backtestMarkers, backtestMarkersHoldBars, compareWithRandomEntry, getConfigFromUI, getRandomOptionsFromUI, renderResultsToUI } from "./chartLogic/test-deals/backtest-markers.js";

// const config = getConfigFromUI();
const holdMode = document.getElementById('holdModeInput');

// const report = holdMode
//   ? backtestMarkersHoldBars(candles, markers, config, interval)
//   : backtestMarkers(candles, markers, config, interval);

// renderResultsToUI(report);

// Порівняння з рандомним входом (працює у фоні, після того як звичайна таблиця вже намальована)
let randomRunId = 0;

async function runRandomComparison(report, markers, config, interval) {
  const runId = ++randomRunId; // новий запуск скасовує старий
  const random = getRandomOptionsFromUI();
  if (!random.enabled) return;

  const full = await compareWithRandomEntry(klines, markers, config, interval, report, {
    holdMode: holdMode.checked,
    iterations: random.iterations,
    shouldCancel: () => runId !== randomRunId,
  });

  if (full && runId === randomRunId) renderResultsToUI(full);
}

export function setChartInterval(interval) {

  const settings = getChartSettings(interval);

  const calculationData = chartProcessor(settings, analyzeDataByInterval[interval]);
  
  if (interval === currentInterval) {
    let markersScenarios = createScenariosMarker(analyzeDataByInterval[interval]);
    // console.log(markersScenarios);    

    const config = getConfigFromUI();

    const report = holdMode.checked
    ? backtestMarkersHoldBars(klines, markersScenarios, config, interval)
    : backtestMarkers(klines, markersScenarios, config, interval);

    // const report = backtestMarkers(klines, markersScenarios, config, interval);
    renderResultsToUI(report);
    // console.log(result.scenarioStats);

    runRandomComparison(report, markersScenarios, config, interval);

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

// Перерахунок при зміні нових параметрів тесту
// ['holdModeInput', 'simulateLiquidationInput', 'holdBarsInputParametr', 'randomCompareInput', 'randomIterationsInput'].forEach(id => {
//   document.getElementById(id)?.addEventListener('change', () => setChartInterval(currentInterval));
// });

// import { getChartSettings } from "./chartLogic/chart-get-settings.js";
// import { chartProcessor } from "./chartLogic/chart-processor.js";
// import { renderChartLine } from "./chartLogic/chart-render-line.js";
// import { analyzeDataByInterval, analyzeResultByInterval } from "./settingsData/program-analyze-data.js";
// import { updateAnalyze } from "./chartLogic/update-analyze.js";
// import { updateUnifiedAnalyze } from "./chartLogic/update-unified-analyze.js";
// import { updateEntries } from "./chartLogic/update-entries.js";
// import { currentGlobalAnalazeInterval, currentInterval, klines } from "./chart-data.js";
// import { updateUnifiedAnalyzeUI } from "./chartLogic/update-unified-analyze-ui.js";
// import { getSummaryResult } from "./chartLogic/summary-results.js";
// import { updateActions } from "./chartLogic/update-actions.js";
// import { createScenariosMarker } from "./chartLogic/create-scenarios-marker.js";
// import { backtestMarkers, backtestMarkersHoldBars, getConfigFromUI, renderResultsToUI } from "./chartLogic/test-deals/backtest-markers.js";

// // const config = getConfigFromUI();
// const holdMode = document.getElementById('holdModeInput');

// // const report = holdMode
// //   ? backtestMarkersHoldBars(candles, markers, config, interval)
// //   : backtestMarkers(candles, markers, config, interval);

// // renderResultsToUI(report);

// export function setChartInterval(interval) {

//   const settings = getChartSettings(interval);

//   const calculationData = chartProcessor(settings, analyzeDataByInterval[interval]);
  
//   if (interval === currentInterval) {
//     let markersScenarios = createScenariosMarker(analyzeDataByInterval[interval]);
//     // console.log(markersScenarios);    

//     const config = getConfigFromUI();

//     const report = holdMode.checked
//     ? backtestMarkersHoldBars(klines, markersScenarios, config, interval)
//     : backtestMarkers(klines, markersScenarios, config, interval);

//     // const report = backtestMarkers(klines, markersScenarios, config, interval);
//     renderResultsToUI(report);
//     // console.log(result.scenarioStats);

//     renderChartLine(calculationData, settings, markersScenarios);
//     updateAnalyze(analyzeDataByInterval[interval]);
//   }

//   // console.log(analyzeDataByInterval);

//   const unifiedAnalyzeData = updateUnifiedAnalyze(analyzeDataByInterval[interval], interval, analyzeResultByInterval[interval]);

//   if (interval === currentGlobalAnalazeInterval) {
//     updateUnifiedAnalyzeUI(analyzeDataByInterval[interval], unifiedAnalyzeData)
//   }

//   updateEntries();

//   getSummaryResult(analyzeResultByInterval);

//   updateActions(analyzeDataByInterval, analyzeResultByInterval);
// }