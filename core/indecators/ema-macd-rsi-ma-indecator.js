// EMA
function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  const emaArray = [];
  let ema = data[0];
  emaArray.push(ema);
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    emaArray.push(ema);
  }
  return emaArray;
}

// MACD
export function calculateMACD(data) {
  const closes = data.map(d => d.close);
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  const macd = ema12.map((v, i) => v - ema26[i]);
  const signal = calculateEMA(macd, 9);
  const histogram = macd.map((v, i) => v - signal[i]);
  const time = data.map(d => d.time);

  return {
    macd: macd.map((v, i) => ({ time: time[i], value: v })),
    signal: signal.map((v, i) => ({ time: time[i], value: v })),
    histogram: histogram.map((v, i) => ({
      time: time[i],
      value: v,
      color: v >= 0 ? "#26a69a" : "#ef5350"
    })),
  };
}

// RSI
export function calculateRSI(data, period = 14) {
  const result = [];
  const closes = data.map(d => d.close);

  for (let i = 0; i < period; i++) {
    result.push({ time: data[i].time, value: null });
  }

  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) gain += change;
    else loss += -change;
  }
  gain /= period;
  loss /= period;

  let rs = loss === 0 ? 100 : gain / loss;
  result.push({ time: data[period].time, value: 100 - 100 / (1 + rs) });

  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    const currentGain = Math.max(change, 0);
    const currentLoss = Math.max(-change, 0);

    gain = (gain * (period - 1) + currentGain) / period;
    loss = (loss * (period - 1) + currentLoss) / period;

    rs = loss === 0 ? 100 : gain / loss;
    result.push({ time: data[i].time, value: 100 - 100 / (1 + rs) });
  }

  return result;
}

// MA
export function calculateMA(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) continue;
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, val) => acc + val.close, 0);
    const avg = sum / period;
    result.push({ time: data[i].time, value: avg });
  }
  return result;
}