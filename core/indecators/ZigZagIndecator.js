export function calculateZigZagClassic(data, startIndex = 0, deviationPercent = 5) {
    if (data.length === 0 || startIndex >= data.length) return { line: [], points: [] };
  
    const deviation = deviationPercent / 100;
    const result = [];
    const points = [];
  
    let lastPointIndex = startIndex;
    let lastPointValue = data[startIndex].high; // починаємо з high
    let direction = null; // "up" або "down"
  
    // Додай першу точку (high)
    result.push({ time: data[startIndex].time, value: lastPointValue });
    points.push(startIndex);
  
    for (let i = startIndex + 1; i < data.length; i++) {
      const high = data[i].high;
      const low = data[i].low;
  
      if (direction === null) {
        if ((high - lastPointValue) / lastPointValue >= deviation) {
          // Рух вгору
          direction = "up";
          lastPointIndex = i;
          lastPointValue = high;
          result.push({ time: data[i].time, value: high });
          points.push(i);
        } else if ((lastPointValue - low) / lastPointValue >= deviation) {
          // Рух вниз
          direction = "down";
          lastPointIndex = i;
          lastPointValue = low;
          result.push({ time: data[i].time, value: low });
          points.push(i);
        }
      } else if (direction === "up") {
        if (high > lastPointValue) {
          // Новий максимум — оновити останню точку
          lastPointIndex = i;
          lastPointValue = high;
          result[result.length - 1] = { time: data[i].time, value: high };
          points[points.length - 1] = i;
        } else if ((lastPointValue - low) / lastPointValue >= deviation) {
          // Розворот донизу
          direction = "down";
          lastPointIndex = i;
          lastPointValue = low;
          result.push({ time: data[i].time, value: low });
          points.push(i);
        }
      } else if (direction === "down") {
        if (low < lastPointValue) {
          // Новий мінімум — оновити останню точку
          lastPointIndex = i;
          lastPointValue = low;
          result[result.length - 1] = { time: data[i].time, value: low };
          points[points.length - 1] = i;
        } else if ((high - lastPointValue) / lastPointValue >= deviation) {
          // Розворот вгору
          direction = "up";
          lastPointIndex = i;
          lastPointValue = high;
          result.push({ time: data[i].time, value: high });
          points.push(i);
        }
      }
    }
  
  return { line: result, points };
}

export function calculateZigZagAdvanced(data, startIndex = 0, deviationPercent = 5) {
  if (!data || data.length === 0 || startIndex >= data.length) {
    return { line: [], points: [] };
  }

  const deviation = deviationPercent / 100;
  const result = [];
  const points = [];

  // Початкові значення
  let lastHigh = data[startIndex].high;
  let lastLow = data[startIndex].low;
  let lastIndex = startIndex;
  
  // Визначаємо початковий напрямок (шукаємо перший рух)
  let direction = null; 
  let currentPoint = { time: data[startIndex].time, value: (lastHigh + lastLow) / 2 };

  for (let i = startIndex; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;

    if (direction === null) {
      // Пошук першого напрямку
      if (high > lastHigh * (1 + deviation)) {
        direction = "up";
        lastHigh = high;
        lastIndex = i;
        addPoint(i, high);
      } else if (low < lastLow * (1 - deviation)) {
        direction = "down";
        lastLow = low;
        lastIndex = i;
        addPoint(i, low);
      }
      continue;
    }

    if (direction === "up") {
      if (high > lastHigh) {
        // Оновлюємо поточний пік, бо знайшли вищий High
        lastHigh = high;
        lastIndex = i;
        updateLastPoint(i, high);
      } else if (low < lastHigh * (1 - deviation)) {
        // Розворот вниз: Low впав нижче піку на % відхилення
        direction = "down";
        lastLow = low;
        lastIndex = i;
        addPoint(i, low);
      }
    } else if (direction === "down") {
      if (low < lastLow) {
        // Оновлюємо поточне дно, бо знайшли нижчий Low
        lastLow = low;
        lastIndex = i;
        updateLastPoint(i, low);
      } else if (high > lastLow * (1 + deviation)) {
        // Розворот вгору: High піднявся вище дна на % відхилення
        direction = "up";
        lastHigh = high;
        lastIndex = i;
        addPoint(i, high);
      }
    }
  }

  // Допоміжні функції для чистоти коду
  function addPoint(idx, val) {
    const p = { time: data[idx].time, value: val };
    result.push(p);
    points.push(idx);
  }

  function updateLastPoint(idx, val) {
    result[result.length - 1] = { time: data[idx].time, value: val };
    points[points.length - 1] = idx;
  }

  return { line: result, points };
}