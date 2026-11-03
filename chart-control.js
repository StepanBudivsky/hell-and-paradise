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
import { backtestMarkers, getConfigFromUI, renderResultsToUI } from "./chartLogic/test-deals/backtest-markers.js";

export function setChartInterval(interval) {

  const settings = getChartSettings(interval);

  const calculationData = chartProcessor(settings, analyzeDataByInterval[interval]);
  
  if (interval === currentInterval) {
    let markersScenarios = createScenariosMarker(analyzeDataByInterval[interval]);
    // console.log(markersScenarios);    

    const config = getConfigFromUI();
    const result = backtestMarkers(klines, markersScenarios, config, interval);
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