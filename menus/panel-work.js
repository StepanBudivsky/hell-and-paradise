import { checkClass } from "../control.js";

// --- Панелі меню (твій код без змін) ---
const panelStates = {
  controlPanel: false,
  localSettingPanel: false,
  settingPanel: false,
  patternsPanel: false,
  savesPanel: false,
  analyticsPanel: false,
  unifiedAnalyticsPanel: false, // додали сюди
  globalAnalyticsPanel: false,
};

const buttonToPanel = {
  controlPanelBtn: "control-panel",
  localSetingPanelBtn: "localSetting-panel",
  setingPanelBtn: "setting-panel",
  paternsPanelBtn: "patterns-panel",
  savesPanelBtn: "saves-panel",
  analyticsPanelBtn: "analytics-panel",
  unifiedAnalyticsPanelBtn: "unified-analytics-panel", // додали сюди
  globalAnalyticsPanelBtn: "global-analytics-panel",
};

Object.keys(buttonToPanel).forEach(buttonId => {
  const btn = document.getElementById(buttonId);
  const panelId = buttonToPanel[buttonId];

  btn.addEventListener("click", () => {
    const key = getPanelKeyFromBtnId(buttonId);

    if (panelStates[key]) {
      hideAllPanels();
      resizeCharts();
      return;
    }

    hideAllPanels();
    panelStates[key] = true;

    document.getElementById(panelId).style.display = "block";
    btn.classList.add("active");

    resizeCharts();
  });
});

function hideAllPanels() {
  Object.keys(panelStates).forEach(key => panelStates[key] = false);
  Object.values(buttonToPanel).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  Object.keys(buttonToPanel).forEach(id => {
    document.getElementById(id).classList.remove("active");
  });
}

function getPanelKeyFromBtnId(id) {
  if (id === "controlPanelBtn") return "controlPanel";
  if (id === "localSetingPanelBtn") return "localSettingPanel";
  if (id === "setingPanelBtn") return "settingPanel";
  if (id === "paternsPanelBtn") return "patternsPanel";
  if (id === "savesPanelBtn") return "savesPanel";
  if (id === "analyticsPanelBtn") return "analyticsPanel";
  if (id === "unifiedAnalyticsPanelBtn") return "unifiedAnalyticsPanel"; // додали сюди
  if (id === "globalAnalyticsPanelBtn") return "globalAnalyticsPanel";
  return "";
}

function resizeCharts() {
  const charts = document.getElementById("charts");
  const anyPanelVisible = Object.values(panelStates).some(v => v === true);
  
  if (!anyPanelVisible) {
    charts.style.width = "calc(100vw - 60px)";
  } else {
    // Якщо відкрита звичайна АБО об'єднана аналітика — ширина 1040px, інакше 430px
    const isBigPanelOpen = panelStates.analyticsPanel || panelStates.unifiedAnalyticsPanel;
    const sideWidth = isBigPanelOpen ? 1040 : 430;
    
    charts.style.width = `calc(100vw - 60px - ${sideWidth}px)`;
  }
  window.dispatchEvent(new Event("resize"));
}
const startBtn = document.querySelector("#startPanel");
const overlayToggle = document.querySelector("#overlayToggle");

startBtn.addEventListener("click", () => {
  overlayToggle.checked = true;
});


function toggleChartPanel(btn, panel) {
    btn.classList.toggle('active');
    
    if (!checkClass(btn)) {
        panel.style.display = 'none';
    } else {
        panel.style.display = 'block';
    }
    
    // Оновлюємо розміри всіх графіків
    window.dispatchEvent(new Event("resize"));
}

const btnRsi = document.querySelector("#btn-rsi");
const rsiPanel = document.querySelector("#rsi-panel");

const btnMacd = document.querySelector("#btn-macd");
const macdPanel = document.querySelector("#macd-panel");

const btnVolume = document.querySelector("#btn-volume");
const volumePanel = document.querySelector("#volume-panel");

const btnAdx = document.querySelector("#btn-adx");
const adxPanel = document.querySelector("#adx-panel");

// Індивідуальні обробники
btnRsi.addEventListener('click', () => {
    toggleChartPanel(btnRsi, rsiPanel);
});

btnMacd.addEventListener('click', () => {
    toggleChartPanel(btnMacd, macdPanel);
});

btnVolume.addEventListener('click', () => {
    toggleChartPanel(btnVolume, volumePanel);
});

btnAdx.addEventListener('click', () => {
    toggleChartPanel(btnAdx, adxPanel);
});