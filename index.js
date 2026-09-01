// index.js (main)
const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const fs = require("fs/promises");

app.commandLine.appendSwitch('no-proxy-server');
function klinesBaseDir() {
  // Папка збережень програми: 
  // Win: C:\Users\<you>\AppData\Roaming\<AppName>\
  // macOS: ~/Library/Application Support/<AppName>/
  // Linux: ~/.config/<AppName>/
  return path.join(app.getPath("userData"), "klines");
}
function filePathFor(sym, interval) {
  return path.join(klinesBaseDir(), sym, `${interval}.json`);
}

async function ensureDirFor(sym) {
  await fs.mkdir(path.join(klinesBaseDir(), sym), { recursive: true });
}

async function saveCandles(sym, interval, candles) {
  await ensureDirFor(sym);
  const f = filePathFor(sym, interval);
  await fs.writeFile(f, JSON.stringify({ symbol: sym, interval, candles }, null, 0), "utf8");
  return { ok: true, path: f, count: candles.length };
}
async function loadCandles(sym, interval) {
  const f = filePathFor(sym, interval);
  try {
    const raw = await fs.readFile(f, "utf8");
    const json = JSON.parse(raw);
    return { ok: true, ...json, path: f };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
async function listSymbol(sym) {
  const dir = path.join(klinesBaseDir(), sym);
  try {
    const files = await fs.readdir(dir);
    const items = [];
    for (const name of files) {
      if (!name.endsWith(".json")) continue;
      const interval = path.basename(name, ".json");
      const stat = await fs.stat(path.join(dir, name));
      items.push({ interval, bytes: stat.size, mtime: stat.mtimeMs });
    }
    return { ok: true, items, dir };
  } catch (e) {
    return { ok: false, error: String(e), dir };
  }
}
async function clearOne(sym, interval) {
  const f = filePathFor(sym, interval);
  try { await fs.unlink(f); } catch {}
  return { ok: true };
}
async function clearAll(sym) {
  const dir = path.join(klinesBaseDir(), sym);
  try {
    const files = await fs.readdir(dir);
    await Promise.all(files.map(n => fs.unlink(path.join(dir, n)).catch(()=>{})));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.setMenuBarVisibility(false);
  win.setTitle("Калькулятор");
  win.loadFile("src/index.html");
};

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['wss://*.binance.com/*', 'https://*.binance.com/*'] },
    (details, callback) => {
      // Підміняємо Origin на офіційний сайт Binance
      details.requestHeaders['Origin'] = 'https://www.binance.com';
      callback({ requestHeaders: details.requestHeaders });
    }
  );

  // IPC API
  ipcMain.handle("klines:save", (_e, sym, interval, candles) => saveCandles(sym, interval, candles));
  ipcMain.handle("klines:load", (_e, sym, interval) => loadCandles(sym, interval));
  ipcMain.handle("klines:list", (_e, sym) => listSymbol(sym));
  ipcMain.handle("klines:clearOne", (_e, sym, interval) => clearOne(sym, interval));
  ipcMain.handle("klines:clearAll", (_e, sym) => clearAll(sym));

  createWindow();
});
app.on("window-all-closed", () => app.quit());
