export function getAllRSIZones(rsiData) {
  const zones = [];
  const LEVELS = { L30: 30, L70: 70 };
  
  let currentZone = null;

  for (let i = 0; i < rsiData.length; i++) {
    const val = rsiData[i].value;

    // 1. ПЕРЕВІРКА НА ВХІД/ЗНАХОДЖЕННЯ В ЗОНІ
    if (val >= LEVELS.L70 || val <= LEVELS.L30) {
      const zoneType = val >= LEVELS.L70 ? 'overbought' : 'oversold';

      // Якщо ми щойно зайшли в зону
      if (!currentZone) {
        currentZone = {
          type: zoneType,
          startIndex: i,
          endIndex: null,
          extremeIndex: i,
          extremeValue: val,
        };
      } else {
        // Якщо ми вже в зоні, перевіряємо на новий екстремум
        if (currentZone.type === 'overbought' && val > currentZone.extremeValue) {
          currentZone.extremeValue = val;
          currentZone.extremeIndex = i;
        } else if (currentZone.type === 'oversold' && val < currentZone.extremeValue) {
          currentZone.extremeValue = val;
          currentZone.extremeIndex = i;
        }
      }
    } 
    
    // 2. ПЕРЕВІРКА НА ВИХІД ІЗ ЗОНИ
    else if (currentZone) {
      // Якщо поточне значення RSI вийшло за межі (стало між 30 та 70)
      currentZone.endIndex = i;
      zones.push(currentZone);
      currentZone = null;
    }
  }

  // Якщо масив закінчився, а зона ще не закрита (RSI зараз у зоні)
  if (currentZone) {
    currentZone.endIndex = rsiData.length - 1;
    zones.push(currentZone);
  }

  return zones;
}

export function categorizeZones(allZones) {
  const result = {
    overbought: [], // Зони вище 70
    oversold: []    // Зони нижче 30
  };

  allZones.forEach(zone => {
    if (zone.type === 'overbought') {
      result.overbought.push(zone);
    } else if (zone.type === 'oversold') {
      result.oversold.push(zone);
    }
  });

  return result;
}

export function createZoneLine(zones, data, regim) {
  const lineData = [];
  const groupData = []; 

  for (let i = 0; i < zones.length; i++) {
    let startZone = 0; 
    let nextStartZone = 0;
    if (regim === 1) {
      startZone = zones[i].startIndex;
      nextStartZone = i + 1 < zones.length ? zones[i + 1].startIndex - 1 : data.length - 1;
    }
    if (regim === 2) {
      startZone = zones[i].extremeIndex;
      nextStartZone = i + 1 < zones.length ? zones[i + 1].extremeIndex - 1 : data.length - 1;
    }
    if (regim === 3) {
      startZone = zones[i].endIndex;
      nextStartZone = i + 1 < zones.length ? zones[i + 1].endIndex - 1 : data.length - 1;
    }

    const price = zones[i].type === 'overbought' ? data[startZone].high : data[startZone].low;

    lineData.push({ 
      time: data[startZone].time, 
      value: price 
    });

    lineData.push({ 
      time: data[nextStartZone].time, 
      value: price 
    });

    groupData.push({
      type: zones[i].type,
      start: startZone,
      value: price,
      end: nextStartZone,
    })
  }
    
  return {line: lineData, group: groupData};
}

export function createAutoFibo(status, group1, group2, data) { // status, 
  // console.log("group1");
  // console.log(group1);
  // console.log("group2");
  // console.log(group2);
  // console.log("data");
  // console.log(data);

  let lineData = {
    autoFib0: [],
    autoFib23: [],
    autoFib38: [],
    autoFib50: [],
    autoFib61: [],
    autoFib78: [],
    autoFib100: [],
  };

  let lastFibo = {
    start: 0,
    end: 0,
    line: {
      fibanachi_0: 0,
      fibanachi_23: 0,
      fibanachi_38: 0,
      fibanachi_50: 0,
      fibanachi_61: 0,
      fibanachi_78: 0,
      fibanachi_100: 0,
    }
  };

  if (!status) {
    return {line: lineData, lastGroup: lastFibo};
  }

  const allZone = [...group1, ...group2].sort((a, b) => a.start - b.start);

  let cur70 = null;
  let cur30 = null;
  
  for (let i = 0; i <= allZone.length - 1; i++) {
    if (allZone[i].type === "overbought") {
      cur70 = allZone[i];
    } else {
      cur30 = allZone[i];
    }

    if (cur70 !== null && cur30 !== null) {

      // відрисовка ліній Фібаначчі
      let firstDot = cur70.start > cur30.start ? cur30 : cur70;
      let secondDot = cur70.start > cur30.start ? cur70 : cur30;

      let firstLineValue = firstDot.value;
      let secondLineValue = secondDot.value;

      let dif = (firstLineValue - secondLineValue) / 100;

      if (firstLineValue < secondLineValue) {
        dif = (secondLineValue - firstLineValue) / 100 * -1;
      }
      
      lastFibo.start = secondDot.start;
      lastFibo.line.fibanachi_0 = secondLineValue;
      lastFibo.line.fibanachi_23 = secondLineValue + dif * 23.6;
      lastFibo.line.fibanachi_38 = secondLineValue + dif * 38.2;
      lastFibo.line.fibanachi_50 = secondLineValue + dif * 50;
      lastFibo.line.fibanachi_61 = secondLineValue + dif * 61.8;
      lastFibo.line.fibanachi_78 = secondLineValue + dif * 78.6;
      lastFibo.line.fibanachi_100 = secondLineValue + dif * 100;

      if(secondDot.end < firstDot.end) {
        lastFibo.end = secondDot.end;
      } else {
        lastFibo.end = firstDot.end;
      }

      lineData.autoFib0.push({ time: data[lastFibo.start].time, value: lastFibo.line.fibanachi_0 });
      lineData.autoFib23.push({ time: data[lastFibo.start].time, value: lastFibo.line.fibanachi_23 });
      lineData.autoFib38.push({ time: data[lastFibo.start].time, value: lastFibo.line.fibanachi_38 });
      lineData.autoFib50.push({ time: data[lastFibo.start].time, value: lastFibo.line.fibanachi_50 });
      lineData.autoFib61.push({ time: data[lastFibo.start].time, value: lastFibo.line.fibanachi_61 });
      lineData.autoFib78.push({ time: data[lastFibo.start].time, value: lastFibo.line.fibanachi_78 });
      lineData.autoFib100.push({ time: data[lastFibo.start].time, value: lastFibo.line.fibanachi_100 });

      lineData.autoFib0.push({ time: data[lastFibo.end].time, value: lastFibo.line.fibanachi_0 });
      lineData.autoFib23.push({ time: data[lastFibo.end].time, value: lastFibo.line.fibanachi_23 });
      lineData.autoFib38.push({ time: data[lastFibo.end].time, value: lastFibo.line.fibanachi_38 });
      lineData.autoFib50.push({ time: data[lastFibo.end].time, value: lastFibo.line.fibanachi_50 });
      lineData.autoFib61.push({ time: data[lastFibo.end].time, value: lastFibo.line.fibanachi_61 });
      lineData.autoFib78.push({ time: data[lastFibo.end].time, value: lastFibo.line.fibanachi_78 });
      lineData.autoFib100.push({ time: data[lastFibo.end].time, value: lastFibo.line.fibanachi_100 });
    }
  }

  return {line: lineData, lastGroup: lastFibo};
}