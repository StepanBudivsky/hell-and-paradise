// === Основний графік ===
export const chart = LightweightCharts.createChart(document.getElementById("chart-panel"), {
  autoSize: true,
  layout: { background: { type: "solid", color: "#ffffff" }, textColor: "black" },
  rightPriceScale: { scaleMargins: { top: 0.05, bottom: 0.05 }, borderVisible: false },
  timeScale: {
    borderVisible: false,
    visible: false
  },
  grid: { vertLines: { color: "#edf0ee" }, horzLines: { color: "#edf0ee" } },
});

export const candlestickSeries = chart.addCandlestickSeries({
  upColor: "#008984",
  downColor: "#f23645",
  borderVisible: false,
  wickUpColor: "#008984",
  wickDownColor: "#f23645",
});

// === Створення 3-х постійних Price Lines ===

export const entryPriceLine = candlestickSeries.createPriceLine({
  price: 0,
  color: 'transparent', // Початково прихована
  lineWidth: 2,
  lineStyle: LightweightCharts.LineStyle.Solid,
  axisLabelVisible: false,
  title: 'ENTRY',
});

export const stopLossPriceLine = candlestickSeries.createPriceLine({
  price: 0,
  color: 'transparent', // Початково прихована
  lineWidth: 2,
  lineStyle: LightweightCharts.LineStyle.Dashed,
  axisLabelVisible: false,
  title: 'STOP LOSS',
});

export const takeProfitPriceLine = candlestickSeries.createPriceLine({
  price: 0,
  color: 'transparent', // Початково прихована
  lineWidth: 2,
  lineStyle: LightweightCharts.LineStyle.Dashed,
  axisLabelVisible: false,
  title: 'TAKE PROFIT',
});

/**
 * Функція для оновлення параметрів ліній (ціна та видимість)
 */
export function setTradeLineConfig(line, { price, color, visible }) {
  line.applyOptions({
    price: price !== undefined ? price : line.options().price,
    color: visible ? color : 'transparent',
    axisLabelVisible: visible,
  });
}

// MA10
export const ma10Line = chart.addLineSeries({ color: "#2196F3", lineWidth: 2, priceLineVisible: false, lastValueVisible: false, });
export const ma10LineTrend = chart.addLineSeries({ color: "#2196F3", lineWidth: 5, priceLineVisible: false, lastValueVisible: false, });

// MA30
export const ma30Line = chart.addLineSeries({ color: "#FF9800", lineWidth: 2, priceLineVisible: false, lastValueVisible: false, });
export const ma30LineTrend = chart.addLineSeries({ color: "#FF9800", lineWidth: 5, priceLineVisible: false, lastValueVisible: false, });

// Пінцет
export const tweezersLine = chart.addLineSeries({lineWidth: 6, priceLineVisible: false, lastValueVisible: false, });

// Молот
export const hammersLine = chart.addLineSeries({lineWidth: 6, priceLineVisible: false, lastValueVisible: false, });

// Поглинання 
export const engulfingsLine = chart.addLineSeries({lineWidth: 6, priceLineVisible: false, lastValueVisible: false, });

// дле тригера
// Зона перепроданості rsi
export const rsiOversoldZoneLine = chart.addLineSeries({ color: "#000000", lineWidth: 2, priceLineVisible: false, lastValueVisible: false});
export const rsiOversoldZoneMinLine = chart.addLineSeries({ color: "#000000", lineWidth: 2, priceLineVisible: false, lastValueVisible: false, lineStyle: 2,});

// Зона перекупленості rsi 
export const rsiOverboughtZoneLine = chart.addLineSeries({ color: "#000000", lineWidth: 2, priceLineVisible: false, lastValueVisible: false,});
export const rsiOverboughtZoneMaxLine = chart.addLineSeries({ color: "#000000", lineWidth: 2, priceLineVisible: false, lastValueVisible: false, lineStyle: 2,});

const standartLineOption = {
  lineWidth: 2,
  priceLineVisible: false,
  lastValueVisible: false,
};

// лінії для АвтоФібаначі по точці початку зони
export const autoFibanachiStart = {
  fibanachi_0: chart.addLineSeries({ color: "#8a8484", ...standartLineOption}), 
  fibanachi_23: chart.addLineSeries({ color: "#e44e4e", ...standartLineOption}),
  fibanachi_38: chart.addLineSeries({ color: "#8a8484", ...standartLineOption}),
  fibanachi_50: chart.addLineSeries({ color: "#8a8484", ...standartLineOption}),
  fibanachi_61: chart.addLineSeries({ color: "#8a8484", ...standartLineOption}),
  fibanachi_78: chart.addLineSeries({ color: "#8a8484", ...standartLineOption}),
  fibanachi_100: chart.addLineSeries({ color: "#8a8484", ...standartLineOption}),
};

export const autoFibanachiExtrem = {
  fibanachi_0: chart.addLineSeries({ color: "#8a8484", ...standartLineOption, lineStyle: 2,}), 
  fibanachi_23: chart.addLineSeries({ color: "#e44e4e", ...standartLineOption, lineStyle: 2,}),
  fibanachi_38: chart.addLineSeries({ color: "#8a8484", ...standartLineOption, lineStyle: 2,}),
  fibanachi_50: chart.addLineSeries({ color: "#8a8484", ...standartLineOption, lineStyle: 2,}),
  fibanachi_61: chart.addLineSeries({ color: "#8a8484", ...standartLineOption, lineStyle: 2,}),
  fibanachi_78: chart.addLineSeries({ color: "#8a8484", ...standartLineOption, lineStyle: 2,}),
  fibanachi_100: chart.addLineSeries({ color: "#8a8484", ...standartLineOption, lineStyle: 2,}),
};

export const autoFibanachiEnd = {
  fibanachi_0: chart.addLineSeries({ color: "#1100ff", ...standartLineOption, lineStyle: 2,}), 
  fibanachi_23: chart.addLineSeries({ color: "#ebbe2b", ...standartLineOption, lineStyle: 2,}),
  fibanachi_38: chart.addLineSeries({ color: "#1100ff", ...standartLineOption, lineStyle: 2,}),
  fibanachi_50: chart.addLineSeries({ color: "#1100ff", ...standartLineOption, lineStyle: 2,}),
  fibanachi_61: chart.addLineSeries({ color: "#1100ff", ...standartLineOption, lineStyle: 2,}),
  fibanachi_78: chart.addLineSeries({ color: "#1100ff", ...standartLineOption, lineStyle: 2,}),
  fibanachi_100: chart.addLineSeries({ color: "#1100ff", ...standartLineOption, lineStyle: 2,}),
};

const fibanachiTextLineOption = {
  price: 1,
  color: '#8b32a8', 
  lineWidth: 1,
  lineVisible: false,
  axisLabelVisible: false,
  axisLabelColor: 'rgba(255, 255, 255, 1)', 
  axisLabelTextColor: '#000000',
}

export const fibanachi_0Text = candlestickSeries.createPriceLine({ ...fibanachiTextLineOption, title: '0.0', });
export const fibanachi_23Text = candlestickSeries.createPriceLine({ ...fibanachiTextLineOption, title: '23.6', });
export const fibanachi_38Text = candlestickSeries.createPriceLine({ ...fibanachiTextLineOption, title: '38.2', });
export const fibanachi_50Text = candlestickSeries.createPriceLine({ ...fibanachiTextLineOption, title: '50.0', });
export const fibanachi_61Text = candlestickSeries.createPriceLine({ ...fibanachiTextLineOption, title: '61.8', });
export const fibanachi_78Text = candlestickSeries.createPriceLine({ ...fibanachiTextLineOption, title: '78.6', });
export const fibanachi_100Text = candlestickSeries.createPriceLine({ ...fibanachiTextLineOption, title: '100.0', });
export const fibanachi_161Text = candlestickSeries.createPriceLine({ ...fibanachiTextLineOption, title: '161.8', });
export const fibanachi_261Text = candlestickSeries.createPriceLine({ ...fibanachiTextLineOption, title: '261.8', });
export const fibanachi_423Text = candlestickSeries.createPriceLine({ ...fibanachiTextLineOption, title: '423.6', });

const pivotPointLineOption = {
    lineWidth: 3,
    priceLineVisible: false,
    lastValueVisible: false,
};
// Pivot Point

const pivotPointLines_1m = {
  pivotPoint: chart.addLineSeries({ color: "#f18e1d", ...pivotPointLineOption }),
  firstResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  secondResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  firstSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }), 
  secondSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
};

const pivotPointLines_5m = {
  pivotPoint: chart.addLineSeries({ color: "#f18e1d", ...pivotPointLineOption }),
  firstResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  secondResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  firstSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }), 
  secondSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
};

const pivotPointLines_15m = {
  pivotPoint: chart.addLineSeries({ color: "#f18e1d", ...pivotPointLineOption }),
  firstResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  secondResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  firstSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }), 
  secondSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
};

const pivotPointLines_30m = {
  pivotPoint: chart.addLineSeries({ color: "#f18e1d", ...pivotPointLineOption }),
  firstResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  secondResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  firstSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }), 
  secondSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
};

const pivotPointLines_1h = {
  pivotPoint: chart.addLineSeries({ color: "#f18e1d", ...pivotPointLineOption }),
  firstResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  secondResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  firstSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }), 
  secondSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
};

const pivotPointLines_4h = {
  pivotPoint: chart.addLineSeries({ color: "#f18e1d", ...pivotPointLineOption }),
  firstResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  secondResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  firstSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }), 
  secondSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
};

const pivotPointLines_1d = {
  pivotPoint: chart.addLineSeries({ color: "#f18e1d", ...pivotPointLineOption }),
  firstResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  secondResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdResistance: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  firstSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }), 
  secondSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
  thirdSupport: chart.addLineSeries({ color: "#2056c9", ...pivotPointLineOption }),
};

export const pivotPiontLinesByInterval = {
  "1m": pivotPointLines_1m,
  "5m": pivotPointLines_5m,
  "15m": pivotPointLines_15m,
  "30m": pivotPointLines_30m,
  "1h": pivotPointLines_1h,
  "4h": pivotPointLines_4h,
  "1d": pivotPointLines_1d,
};

const pivotPointTextLineOption = {
  price: 1,
  color: '#2056c9', 
  lineWidth: 1,
  lineVisible: false,
  axisLabelVisible: false,
  axisLabelColor: 'rgba(255, 255, 255, 1)', 
  axisLabelTextColor: '#000000', 
}

export const pivotPointText = candlestickSeries.createPriceLine({ ...pivotPointTextLineOption, title: 'PP', });
export const firstResistanceText = candlestickSeries.createPriceLine({ ...pivotPointTextLineOption, title: 'R1', });
export const secondResistanceText = candlestickSeries.createPriceLine({ ...pivotPointTextLineOption, title: 'R2', });
export const thirdResistanceText = candlestickSeries.createPriceLine({ ...pivotPointTextLineOption, title: 'R3', });
export const firstSupportText = candlestickSeries.createPriceLine({ ...pivotPointTextLineOption, title: 'S1', });
export const secondSupportText = candlestickSeries.createPriceLine({ ...pivotPointTextLineOption, title: 'S2', });
export const thirdSupportText = candlestickSeries.createPriceLine({ ...pivotPointTextLineOption, title: 'S3', });

// лінія zigzag
export const zigzagLineClassic = chart.addLineSeries({ color: "#000000", ...standartLineOption });

export const zigzagLineUpTrend = chart.addLineSeries({ color: "#01ff01", lineWidth: 3, priceLineVisible: false,lastValueVisible: false,});

export const zigzagLineDownTrend = chart.addLineSeries({ color: "#FF0000" , lineWidth: 3, priceLineVisible: false,lastValueVisible: false,});

export const zigzagLineFletTrend = chart.addLineSeries({ color: "#e5ff00" , lineWidth: 2, priceLineVisible: false,lastValueVisible: false,});


const linesGroup1m = {
    wawe1: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe2: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe3: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe4: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe5: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    level1: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    fibanachi_0: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}), 
    fibanachi_23: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_38: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_50: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_61: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_78: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_100: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_161: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_261: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_423: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
};

const linesGroup5m = {
    wawe1: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe2: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe3: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe4: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe5: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    level1: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    fibanachi_0: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}), 
    fibanachi_23: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_38: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_50: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_61: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_78: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_100: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_161: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_261: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_423: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
};

const linesGroup15m = {
    wawe1: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe2: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe3: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe4: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe5: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    level1: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    fibanachi_0: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}), 
    fibanachi_23: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_38: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_50: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_61: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_78: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_100: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_161: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_261: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_423: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
};

const linesGroup30m = {
    wawe1: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe2: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe3: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe4: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe5: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    level1: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    fibanachi_0: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}), 
    fibanachi_23: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_38: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_50: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_61: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_78: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_100: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_161: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_261: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_423: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
};

const linesGroup1h = {
    wawe1: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe2: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe3: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe4: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    wawe5: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    level1: chart.addLineSeries({ color: "#FF0000", ...standartLineOption}),
    fibanachi_0: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}), 
    fibanachi_23: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_38: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_50: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_61: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_78: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_100: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_161: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_261: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
    fibanachi_423: chart.addLineSeries({ color: "#8b32a8", ...standartLineOption}),
};

export const linesGroupByInterval = {
  "1m": linesGroup1m,
  "5m": linesGroup5m,
  "15m": linesGroup15m,
  "30m": linesGroup30m,
  "1h": linesGroup1h,
};

// === Volume ===
export const volumeChart = LightweightCharts.createChart(
  document.getElementById("volume-panel"),
  {
    autoSize: true,
    layout: { background: { type: "solid", color: "#ffffff" }, textColor: "black" },
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
      visible: false, // якщо хочеш, можеш увімкнути
    },
    grid: {
      vertLines: { color: "#edf0ee" },
      horzLines: { color: "#edf0ee" },
    },
  }
);

export const volumeSeries = volumeChart.addHistogramSeries({
  priceFormat: { type: "volume" },
  priceScaleId: 'right',
  base: 0,
  priceLineVisible: false,
});

// === RSI ===
export const rsiChart = LightweightCharts.createChart(document.getElementById("rsi-panel"), {
  autoSize: true,
  layout: { background: { type: "solid", color: "#ffffff" }, textColor: "black" },
  rightPriceScale: { scaleMargins: { top: 0.2, bottom: 0.2 }, borderVisible: false },
  timeScale: { borderVisible: false, visible: false },
  grid: { vertLines: { color: "#edf0ee" }, horzLines: { color: "#edf0ee" } },
});

export const rsiLine = rsiChart.addLineSeries({ color: "#9c27b0", lineWidth: 2 });
export const divergenceLineRSI = rsiChart.addLineSeries({ color: "#6009ecff", lineWidth: 4, priceLineVisible: false, lastValueVisible: false,  });

rsiLine.createPriceLine({   
  price: 30,
  color: '#b62e2eff', 
  lineWidth: 1.5,
  lineVisible: true,
  axisLabelVisible: true,
  lineStyle: LightweightCharts.LineStyle.Solid,
  axisLabelColor: 'rgba(255, 255, 255, 1)', 
  axisLabelTextColor: '#000000',
  title: '30', 
});

rsiLine.createPriceLine({   
  price: 50,
  color: '#b62e2eff', 
  lineWidth: 1.5,
  lineVisible: true,
  axisLabelVisible: true,
  lineStyle: LightweightCharts.LineStyle.Solid,
  axisLabelColor: 'rgba(255, 255, 255, 1)', 
  axisLabelTextColor: '#000000',
  title: '50', 
});

rsiLine.createPriceLine({   
  price: 70,
  color: '#b62e2eff', 
  lineWidth: 1.5,
  lineVisible: true,
  axisLabelVisible: true,
  lineStyle: LightweightCharts.LineStyle.Solid,
  axisLabelColor: 'rgba(255, 255, 255, 1)', 
  axisLabelTextColor: '#000000',
  title: '70', 
});

// === MACD ===
export const macdChart = LightweightCharts.createChart(document.getElementById("macd-panel"), {
  autoSize: true,
  layout: { background: { type: "solid", color: "#ffffff" }, textColor: "black" },
  rightPriceScale: { scaleMargins: { top: 0.1, bottom: 0.1 }, borderVisible: false },
  timeScale: {
    borderVisible: true,
    visible: true,
    timeVisible: true,
    tickMarkFormatter: time => {
      const date = new Date(time * 1000);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
  },
  grid: { vertLines: { color: "#edf0ee" }, horzLines: { color: "#edf0ee" } },
});

export const macdLine = macdChart.addLineSeries({ color: "#2962FF", lineWidth: 2, priceLineVisible: false, lastValueVisible: false,  });
export const signalLine = macdChart.addLineSeries({ color: "#FF6D00", lineWidth: 2, priceLineVisible: false, lastValueVisible: false,  });
export const divergenceLine = macdChart.addLineSeries({ color: "#6009ecff", lineWidth: 4, priceLineVisible: false, lastValueVisible: false,  });

export const macdHistogram = macdChart.addHistogramSeries({
  color: "#26a69a",
  base: 0,
  lineWidth: 1,
  priceLineVisible: false,
});

// === ADX ===
export const adxChart = LightweightCharts.createChart(document.getElementById("adx-panel"), {
  autoSize: true,
  layout: { background: { type: "solid", color: "#ffffff" }, textColor: "black" },
  rightPriceScale: { scaleMargins: { top: 0.2, bottom: 0.2 }, borderVisible: false },
  timeScale: { borderVisible: false, visible: false },
  grid: { vertLines: { color: "#edf0ee" }, horzLines: { color: "#edf0ee" } },
});

export const adxLine = adxChart.addLineSeries({ color: "#0011ff", lineWidth: 2 });

adxLine.createPriceLine({   
  price: 25,
  color: '#b62e2eff', 
  lineWidth: 1.5,
  lineVisible: true,
  axisLabelVisible: true,
  lineStyle: LightweightCharts.LineStyle.Solid,
  axisLabelColor: 'rgba(255, 255, 255, 1)', 
  axisLabelTextColor: '#000000',
  title: '25', 
});

// === Синхронізація графіків ===
let syncing = false;
function syncCharts(source, target) {
  source.timeScale().subscribeVisibleLogicalRangeChange(range => {
    if (syncing || !range) return;
    syncing = true;
    target.timeScale().setVisibleLogicalRange(range);
    syncing = false;
  });
}
[chart, rsiChart, macdChart, volumeChart, adxChart].forEach((source, _, arr) => {
  arr.forEach(target => {
    if (target !== source) syncCharts(source, target);
  });
});