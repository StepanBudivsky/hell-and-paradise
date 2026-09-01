import { updateTradingZoneUI } from "./calcFunction/various/get-time-zone.js";
import { setChartInterval } from "./chart-control.js";

const currentInstrument = document.getElementById("currentInstrument");

const temerByInterval = {
  "1m": document.getElementById("candle-timer-1m"),
  "5m": document.getElementById("candle-timer-5m"),
  "15m": document.getElementById("candle-timer-15m"),
  "30m": document.getElementById("candle-timer-30m"),
  "1h": document.getElementById("candle-timer-1h"),
}

// Глобальний стан
export let klines = [];
export let klinesData = { 
    '1m': [], '5m': [], '15m': [], '30m': [], '1h': [], 
    '4h': [], '1d': [] 
};
export let currentInterval = '1m';
export let currentGlobalAnalazeInterval = '1m';
export let symbol = "BTCUSDT";
export let mode = "short"; 
let testOption = "test-use-existing";

export function setCurrentInterval(interval) {
    currentInterval = interval;
}

export function setCurrentGlobalAnalazeInterval(interval) {
    currentGlobalAnalazeInterval = interval;
}

export function setKlines(data) {
    klines = data;
}

const baseUrl = "https://fapi.binance.com/fapi/v1/klines";
const requestLimit = 1000;
const intervals = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
const sockets = {}; 
const reconnectTimeouts = {}; // Для керування реконнектами

const TEST_TOTALS = {
  '1m': 100000, // Зменшено для стабільності Electron
  '5m': 50000,
  '15m': 30000,
  '30m': 20000,
  '1h': 10000,
  '4h': 5000, 
  '1d': 2000,   
};

const EXACT_USE_EXISTING = true;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function mergeByTime(oldArr, newArr) {
  const map = new Map();
  for (const c of oldArr) map.set(c.time, c);
  for (const c of newArr) map.set(c.time, c);
  return Array.from(map.values()).sort((a, b) => a.time - b.time);
}

function formatTimeLeft(ms) {
    if (ms < 0) return "00:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function fetchAllKlines(sym, interval, totalCandles) {
  const totalRequests = Math.ceil(totalCandles / requestLimit);
  let allData = [];
  let endTime = Date.now();

  for (let i = 0; i < totalRequests; i++) {
    const url = `${baseUrl}?symbol=${sym.toUpperCase()}&interval=${interval}&limit=${requestLimit}&endTime=${endTime}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!Array.isArray(data)) {
        await sleep(1000);
        i--;
        continue;
      }

      const candles = data.map(d => ({
        time: Number(d[0]) / 1000,
        open: +d[1],
        high: +d[2],
        low: +d[3],
        close: +d[4],
        volume: +d[5],
      }));

      allData = [...candles, ...allData];
      if (candles.length === 0) break;
      endTime = Number(candles[0].time) * 1000 - 1;
      await sleep(150); 
    } catch (err) {
      await sleep(1000);
      i--;
    }
  }

  if (allData.length > totalCandles) {
    allData = allData.slice(allData.length - totalCandles);
  }
  return allData;
}

async function loadHistoricalDataLive(sym) {
  // ВАЖЛИВО: Спочатку вантажимо все, потім запускаємо сокети
  for (const interval of intervals) {
    const url = `${baseUrl}?symbol=${sym.toUpperCase()}&interval=${interval}&limit=${requestLimit}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        klinesData[interval] = Array.isArray(data) ? data.map(d => ({
          time: Number(d[0]) / 1000,
          open: +d[1],
          high: +d[2],
          low: +d[3],
          close: +d[4],
          volume: +d[5],  
        })) : [];
    } catch(e) {
        console.error("History fetch failed", e);
    }
  }
  
  // Запускаємо сокети тільки ПІСЛЯ завантаження історії
  for (const interval of intervals) {
    startWebSocket(interval);
    await sleep(50);
  }
  setChartInterval(currentInterval);
}

async function loadHistoricalDataTest(sym, option) {
  for (const interval of intervals) {
    const need = TEST_TOTALS[interval];
    if (option === "test-use-existing") {
      try {
        const res = await window.klinesCache?.load(sym, interval);
        if (res?.ok && Array.isArray(res.candles) && res.candles.length) {
          let arr = res.candles;
          if (arr.length > need) arr = arr.slice(-need);
          klinesData[interval] = arr;
          continue;
        }
      } catch (e) {}
    }
    const all = await fetchAllKlines(sym, interval, need);
    klinesData[interval] = all;
    try { await window.klinesCache?.save(sym, interval, all); } catch {}
  }
}

// WebSocket керування з урахуванням New Binance Policy
function startWebSocket(interval) {
  stopSocket(interval);

  if (mode === "test") return;

  // Використовуємо новий ендпоінт /market/stream
  const url = `wss://fstream.binance.com/market/stream?streams=${symbol.toLowerCase()}@kline_${interval}`;
  const ws = new WebSocket(url);

  ws._interval = interval;
  ws._shouldReconnect = true;
  sockets[interval] = ws;

  ws.onmessage = e => {
    const res = JSON.parse(e.data);
    
    // Нова структура: дані лежать в res.data.k
    const msg = res.data ? res.data.k : res.k;
    if (!msg) return;

    // Оновлення таймера тільки для активного вікна
    if (interval !== "4h" && interval !== "1d") {
      const timeLeftMs = msg.T - Date.now();
      temerByInterval[interval].innerText = formatTimeLeft(timeLeftMs);

      updateTradingZoneUI();
    }

    
    const newCandle = {
      time: Math.floor(msg.t / 1000),
      open: +msg.o,
      high: +msg.h,
      low: +msg.l,
      close: +msg.c,
      volume: +msg.v,
    };

    const arr = klinesData[interval];
    if (!arr) return;
    
    const last = arr[arr.length - 1];

    if (!last || newCandle.time > last.time) {
      arr.push(newCandle);
      // if (arr.length > 2000) arr.shift(); // запобігаємо витоку пам'яті
    } else {
      arr[arr.length - 1] = newCandle;
    }

    // Оновлюємо графік тільки якщо цей масив зараз активний
    // if (klines === arr) {
      // Викликаємо оновлення графіка
      if(interval !== "4h" && interval !== "1d") {
        setChartInterval(interval); 
      }
    // }
  };

  ws.onopen = () => console.log(`✅ ${interval} connected via Market Stream`);
  ws.onerror = err => console.error(`WS Error (${interval})`, err);
  
  ws.onclose = () => {
    if (ws._shouldReconnect && mode !== "test") {
      reconnectTimeouts[interval] = setTimeout(() => startWebSocket(interval), 5000);
    }
  };
}

function stopSocket(interval) {
  if (reconnectTimeouts[interval]) {
    clearTimeout(reconnectTimeouts[interval]);
    delete reconnectTimeouts[interval];
  }
  const ws = sockets[interval];
  if (ws) {
    ws._shouldReconnect = false;
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
    }
  }
  sockets[interval] = null;
}

function stopAllSockets() {
  for (const interval of intervals) stopSocket(interval);
}

async function applySelection({ newSymbol, newMode, newTestOption }) {
  stopAllSockets();

  symbol = newSymbol || symbol;
  mode = newMode || mode;
  testOption = newTestOption || testOption;

  if (mode === "test" && testOption === "test-refresh") {
    for (const itv of intervals) klinesData[itv] = [];
  }

  if (mode === "test") {
    await loadHistoricalDataTest(symbol, testOption);
    setChartInterval(currentInterval); // В тестовому ставимо графік відразу
  } else {
    await loadHistoricalDataLive(symbol);
  }
}

function wireStartupMenu() {
  const startBtn = document.querySelector(".start-btn");
  const overlayToggle = document.querySelector("#overlayToggle");

  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      const selectedCrypto = document.querySelector('input[name="crypto"]:checked')?.value || "BTCUSDT";
      currentInstrument.textContent = selectedCrypto;
      const selectedMode = document.querySelector('input[name="mode"]:checked')?.id === "mode-test" ? "test" : "short";
      const selectedTestOption = document.querySelector('input[name="testOption"]:checked')?.id || "test-use-existing";

      await applySelection({
        newSymbol: selectedCrypto,
        newMode: selectedMode,
        newTestOption: selectedTestOption,
      });

      if (overlayToggle) overlayToggle.checked = false;
    });
  }
}

(function init() {
  wireStartupMenu();
})();