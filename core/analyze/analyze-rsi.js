import { calculateSlopeAngle, getLatestAndPreviousScenarios } from "../calcFunction/various/mathematical-func.js";

export function analyzeRSI(analyzeData, rsiData, divergence) {
  // analyzeData.additional.zoneTightness.color = "#ffffff";

  if (!rsiData || rsiData.length < 2) return;

  // ——— Сектори та пороги ———
  const LEVELS = { L30: 30, L50: 50, L70: 70 };
  const TOUCH_TOL = 3;   // наскільки близько вважати "наближення/торкання"3
  const FAKE_LOOKAHEAD = 2; // скільки свічок дивимось вперед для фейкового пробою
  let skipUntil = -1;

  const oversoldZone = { start: 1, end: 1, min: 1};
  const overboughtZone = { start: 1, end: 1, max: 1};

  const crossedUp = (prev, cur, lvl) => prev < lvl && cur >= lvl;
  const crossedDown = (prev, cur, lvl) => prev > lvl && cur <= lvl;
  const nearLevel = (cur, lvl) => Math.abs(cur - lvl) <= TOUCH_TOL;

  // --- НОВА ЛОГІКА ВІДСКОКУ (RETEST BOUNCE) ---
  const isRSIRetestBounce = (prev, cur, next, level, tolerance) => {
    if (next === null) return false;
    const distPrev = Math.abs(prev - level);
    const distCur = Math.abs(cur - level);
    const distNext = Math.abs(next - level);

    const side = cur > level; // true якщо над рівнем, false якщо під
    const noCross = (prev > level === side) && (next > level === side);
    if (!noCross) return false;

    const isVShape = (distPrev + distNext) / 2 > distCur;
    const isClose = distCur <= tolerance;
    const isSignificant = distCur < (distPrev * 0.7); // підхід має бути чітким
    const strongBounce = distNext > distCur; // підтвердження відскоку наступною свічкою

    return isVShape && isClose && isSignificant && strongBounce;
  };

  // ——— Результати ———
  let previousID = "U2000";
  let currentID = "U2000";
  let scenariosID = [];

  let markerRetest = [];

  // ——— Проходимо весь масив і фіксуємо останню релевантну подію ———
  for (let i = 1; i < rsiData.length; i++) {

    if (i <= skipUntil) {
      continue; // Пропускаємо цю ітерацію, бо вона частина фейкового пробою
    }

    // Шукаємо, чи є для поточного індексу запис у масиві дивергенцій
    const currentDiv = divergence.find(d => d.index === i);
    if (currentDiv) {
        if (currentDiv.type === "bearish") {
            previousID = currentID;
            currentID = "U4022";
            scenariosID.push({time: rsiData[i].time, id: "U4022"});
        } else if (currentDiv.type === "bullish") {
            previousID = currentID;
            currentID = "U4021";
            scenariosID.push({time: rsiData[i].time, id: "U4021"});
        }
    }

    const prev = rsiData[i - 1].value;
    const cur = rsiData[i].value;
    const next = i + 1 < rsiData.length ? rsiData[i + 1].value : null;

    const lookLimit = Math.min(i + FAKE_LOOKAHEAD, rsiData.length - 1);

    // --- ФУНКЦІЯ ПЕРЕВІРКИ ПОВЕРНЕННЯ (ФЕЙКУ) ---
    const checkFake = (targetLevel, directionUp) => {
      // 1. Якщо поточна свічка вже вилетіла за межі допуску — це НЕ фейк
      if (directionUp && cur > targetLevel + TOUCH_TOL) return -1;
      if (!directionUp && cur < targetLevel - TOUCH_TOL) return -1;

      let revertedIndex = -1;
      for (let j = i + 1; j <= lookLimit; j++) {
        const val = rsiData[j].value;
        // 2. Якщо в процесі "очікування" ціна вилетіла за допуск — це НЕ фейк
        if (directionUp) {
          if (val > targetLevel + TOUCH_TOL) return -1; 
          if (val < targetLevel) return j;
        } else {
          if (val < targetLevel - TOUCH_TOL) return -1;
          if (val > targetLevel) return j;
        }
      }
      return -1;
    };

    // Зценарії фейк пробою
    // 1)
    if (crossedUp(prev, cur, LEVELS.L70)) {
      const fIndex = checkFake(LEVELS.L70, true);
      if (fIndex !== -1) {
        previousID = currentID;
        currentID = "U4012"; 
        scenariosID.push({time: rsiData[i].time, id: "U4012"});
        skipUntil = fIndex; continue;
      }
    }

    // 9)
    if (crossedDown(prev, cur, LEVELS.L70)) {
      const fIndex = checkFake(LEVELS.L70, false);
      if (fIndex !== -1) {
        previousID = currentID;
        currentID = "U4013"; 
        scenariosID.push({time: rsiData[i].time, id: "U4013"});
        skipUntil = fIndex; continue;
      }
    }

    // 10)
    if (crossedUp(prev, cur, LEVELS.L30)) {
      const fIndex = checkFake(LEVELS.L30, true);
      if (fIndex !== -1) {
        previousID = currentID;
        currentID = "U4019";
        scenariosID.push({time: rsiData[i].time, id: "U4019"});
        skipUntil = fIndex; continue;
      }
    }

    // 2)
    if (crossedDown(prev, cur, LEVELS.L30)) {
      const fIndex = checkFake(LEVELS.L30, false);
      if (fIndex !== -1) {
        previousID = currentID;
        currentID = "U4020";
        scenariosID.push({time: rsiData[i].time, id: "U4020"});
        skipUntil = fIndex; continue;
      }
    }
    // 4)
    if (crossedUp(prev, cur, LEVELS.L50)) {
      const fIndex = checkFake(LEVELS.L50, true);
      if (fIndex !== -1) {
        previousID = currentID;
        currentID = "U4006";
        scenariosID.push({time: rsiData[i].time, id: "U4006"});
        skipUntil = fIndex; continue;
      }
    }
    // 3)
    if (crossedDown(prev, cur, LEVELS.L50)) {
      const fIndex = checkFake(LEVELS.L50, false);
      if (fIndex !== -1) {
        previousID = currentID;
        currentID = "U4005"; 
        scenariosID.push({time: rsiData[i].time, id: "U4005"});
        skipUntil = fIndex; continue;
      }
    }


    // 1) Пробої рівнів 
    // 30
    if (crossedUp(prev, cur, LEVELS.L30)) {
      previousID = currentID;
      currentID = "U4015"; 
      scenariosID.push({time: rsiData[i].time, id: "U4015"});
      oversoldZone.end = i;
    }
    if (crossedDown(prev, cur, LEVELS.L30)) {
      previousID = currentID;
      currentID = "U4014"; 
      scenariosID.push({time: rsiData[i].time, id: "U4014"});
      oversoldZone.start = i;
      oversoldZone.end = rsiData.length - 1;   
    }

    // 50
    if (crossedUp(prev, cur, LEVELS.L50)) {
      previousID = currentID;
      currentID = "U4001";  
      scenariosID.push({time: rsiData[i].time, id: "U4001"});
    }
    if (crossedDown(prev, cur, LEVELS.L50)) {
      previousID = currentID;
      currentID = "U4002";
      scenariosID.push({time: rsiData[i].time, id: "U4002"});  
    }

    // 70
    if (crossedUp(prev, cur, LEVELS.L70)) {
      previousID = currentID;
      currentID = "U4007"; 
      scenariosID.push({time: rsiData[i].time, id: "U4007"});  
      overboughtZone.start = i;
      overboughtZone.end = rsiData.length - 1; 
    }
    if (crossedDown(prev, cur, LEVELS.L70)) {
      previousID = currentID;
      currentID = "U4008"; 
      scenariosID.push({time: rsiData[i].time, id: "U4008"});  
      overboughtZone.end = i;
    }

    // сценарії екстримальних ситуацій
    if (crossedUp(prev, cur, 85)) {
      previousID = currentID;
      currentID = "U4009"; 
      scenariosID.push({time: rsiData[i].time, id: "U4009"});  
    }

    if (crossedDown(prev, cur, 15)) {
      previousID = currentID;
      currentID = "U4016";
      scenariosID.push({time: rsiData[i].time, id: "U4016"});  
    }

    // 2) Недоходження до рівнів
    // --- 2) ШІСТЬ СЦЕНАРІЇВ НЕДОХОДУ/РІТЕСТУ (Нова логіка) ---
    
    // Рівень 70
    if (isRSIRetestBounce(prev, cur, next, LEVELS.L70, TOUCH_TOL)) {
      markerRetest.push ({ time: rsiData[i].time, position: 'inBar', color: '#000000', shape: 'circle', size: 1, });
      if (cur < 70) {
        previousID = currentID;
        currentID = "U4010"; 
        scenariosID.push({time: rsiData[i].time, id: "U4010"});  
      } else {
        previousID = currentID;
        currentID = "U4011"; 
        scenariosID.push({time: rsiData[i].time, id: "U4011"}); 
      }
    }

    // Рівень 50
    if (isRSIRetestBounce(prev, cur, next, LEVELS.L50, 2)) { // для 50 менший допуск
      markerRetest.push ({ time: rsiData[i].time, position: 'inBar', color: '#000000', shape: 'circle', size: 1, });
      if (cur > 50) {
        previousID = currentID;
        currentID = "U4003"; 
        scenariosID.push({time: rsiData[i].time, id: "U4003"}); 
      } else {
        previousID = currentID;
        currentID = "U4004"; 
        scenariosID.push({time: rsiData[i].time, id: "U4004"}); 
      }
    }

    // Рівень 30
    if (isRSIRetestBounce(prev, cur, next, LEVELS.L30, TOUCH_TOL)) {
      markerRetest.push ({ time: rsiData[i].time, position: 'inBar', color: '#000000', shape: 'circle', size: 1, });
      if (cur > 30) {
        previousID = currentID;
        currentID = "U4018";
        scenariosID.push({time: rsiData[i].time, id: "U4018"}); 
      } else {
        previousID = currentID;
        currentID = "U4017";
        scenariosID.push({time: rsiData[i].time, id: "U4017"}); 
      }
    }

  }

  // ——— Вивід у DOM ———
  analyzeData.main.previousID = previousID;
  analyzeData.main.currentID = currentID;
  analyzeData.main.scenariosID = scenariosID;

  const { latest, previous } = getLatestAndPreviousScenarios(scenariosID);

  analyzeData.main.previousIDs = previous;
  analyzeData.main.currentIDs = latest;
  
  const lastIndex = rsiData.length - 1;
  const zoneInfo = getRSIZoneInfo(rsiData, lastIndex);
  const isRising = rsiData[lastIndex].value > rsiData[lastIndex - 1].value;

  // --- 1.1. Зона та тривалість (Tightness) — Блочки 1-8 [cite: 4] ---
  if (zoneInfo.count > 2) {
    let mLong = 1.0, mShort = 1.0;

    // Визначення множників за зоною та напрямком [cite: 4]
    if (zoneInfo.zone === "0-30") {
      analyzeData.additional.zoneTightness.currentID = isRising ? "B1001" : "B1002";
    } else if (zoneInfo.zone === "30-50") {
      analyzeData.additional.zoneTightness.currentID = isRising ? "B1003" : "B1004";
    } else if (zoneInfo.zone === "50-70") {
      analyzeData.additional.zoneTightness.currentID = isRising ? "B1005" : "B1006";
    } else if (zoneInfo.zone === "70-100") {
      analyzeData.additional.zoneTightness.currentID = isRising ? "B1007" : "B1008";
    }

    analyzeData.additional.zoneTightness.valueX = zoneInfo.count;
  } else {
    analyzeData.additional.zoneTightness.currentID = "B1000";
    analyzeData.additional.zoneTightness.valueX = 0;
  }

  // --- 1.2. Залипання на рівнях (Noisy) — Блочки 9-14 [cite: 6] ---
  const LOOKBACK_PERIOD = 7;
  const noise30 = countLevelCrosses(rsiData, 30, LOOKBACK_PERIOD);
  const noise50 = countLevelCrosses(rsiData, 50, LOOKBACK_PERIOD);
  const noise70 = countLevelCrosses(rsiData, 70, LOOKBACK_PERIOD);

  const activeNoise = [noise30, noise50, noise70].find(n => n.isNoisy);

  if (activeNoise) {
    const dirUp = activeNoise.lastDirection === "вверх";

    if (activeNoise.level === 30) {
      analyzeData.additional.noisy.currentID = dirUp ? "B1009" : "B1010";
    } else if (activeNoise.level === 50) {
      analyzeData.additional.noisy.currentID = dirUp ? "B1011" : "B1012";
    } else if (activeNoise.level === 70) {
      analyzeData.additional.noisy.currentID = dirUp ? "B1013" : "B1014";
    }

  } else {
    analyzeData.additional.noisy.currentID = "B1000";
  }

  // --- 1.3. Амплітуда руху — Блочок 15 [cite: 8] ---
  const ampInfo = getRSIAmplitude(rsiData, 5, 7);
  if (ampInfo.isFlat) {
    analyzeData.additional.amplitude.currentID = "B1017";
  } else {
    analyzeData.additional.amplitude.currentID = "B1000";
  }

  // --- 1.4. Рітести в пустоті — Блочки 16-17 [cite: 10] ---
  let retestFound = false;
  const lookbackRetest = 5;
  const startIdx = Math.max(1, rsiData.length - lookbackRetest - 1);

  for (let j = rsiData.length - 2; j >= startIdx; j--) {
    const p = rsiData[j - 1].value;
    const c = rsiData[j].value;
    const n = rsiData[j + 1].value;
    const candlesAgo = (rsiData.length - 1) - j;

    // №16 Рітест 30 зверху без торкання [cite: 10] 
    if (isRSIRetestBounce(p, c, n, 30, 3) && c > 30) {
      analyzeData.additional.ritest.currentID = "B1018";
      analyzeData.additional.ritest.valueX = candlesAgo;
      retestFound = true; break;
    }

    // №17 Рітест 70 знизу без торкання [cite: 10]
    if (isRSIRetestBounce(p, c, n, 70, 3) && c < 70) {
      analyzeData.additional.ritest.currentID = "B1019";
      analyzeData.additional.ritest.valueX = candlesAgo;
      retestFound = true; break;
    }
  }

  if (!retestFound) {
    analyzeData.additional.ritest.valueX = 0;
    analyzeData.additional.ritest.currentID = "B1000";
  }

  // --- ТРЕНД RSI (№112-113) [cite: 52] ---
  const rsiAngle = calculateSlopeAngle(rsiData[lastIndex - 1].value, rsiData[lastIndex].value);
  if (isRising) {
    analyzeData.additional.trend.currentID = "B1015"; 
    analyzeData.additional.trend.valueX = rsiAngle;
  } else {
    analyzeData.additional.trend.currentID = "B1016";
    analyzeData.additional.trend.valueX = rsiAngle;
  }

  oversoldZone.min = oversoldZone.start
  for (let i = oversoldZone.start + 1; i < oversoldZone.end; i++) {
    if(rsiData[oversoldZone.min].value > rsiData[i].value) {
      oversoldZone.min = i;
    } 
  }
  oversoldZone.end = rsiData.length - 1;

  overboughtZone.max = overboughtZone.start
  for (let i = overboughtZone.start + 1; i < overboughtZone.end; i++) {
    if(rsiData[overboughtZone.max].value < rsiData[i].value) {
      overboughtZone.max = i;
    } 
  }
  overboughtZone.end = rsiData.length - 1;

  return {oversoldZone, overboughtZone, markerRetest};
}

function getRSIZoneInfo(rsiData, currentIndex) {
    const val = rsiData[currentIndex].value;
    let zone = "";
    let min = 0;
    let max = 100;

    // 1. Визначаємо поточну зону
    if (val >= 0 && val < 30) {
        zone = "0-30"; min = 0; max = 30;
    } else if (val >= 30 && val < 50) {
        zone = "30-50"; min = 30; max = 50;
    } else if (val >= 50 && val < 70) {
        zone = "50-70"; min = 50; max = 70;
    } else if (val >= 70 && val <= 100) {
        zone = "70-100"; min = 70; max = 100;
    }

    // 2. Рахуємо скільки точок RSI вже знаходиться в цій зоні (йти назад по історії)
    let pointsInZone = 0;
    for (let i = currentIndex; i >= 0; i--) {
        const prevVal = rsiData[i].value;
        if (prevVal >= min && prevVal <= max) {
            pointsInZone++;
        } else {
            break; // Вийшли за межі зони — зупиняємо підрахунок
        }
    }

    return {
        zone: zone,
        count: pointsInZone,
        value: val
    };
}

function countLevelCrosses(rsiData, level, lookback = 7) {
    let crosses = 0;
    const startIndex = Math.max(1, rsiData.length - lookback);

    for (let i = startIndex; i < rsiData.length; i++) {
        const prev = rsiData[i - 1].value;
        const cur = rsiData[i].value;
        // Перевірка на перетин рівня
        if ((prev - level) * (cur - level) < 0) {
            crosses++;
        }
    }

    const lastVal = rsiData[rsiData.length - 1].value;
    const lastDirection = lastVal >= level ? "вверх" : "вниз";

    return {
        count: crosses,
        isNoisy: crosses >= 3,
        level: level,
        lastDirection: lastDirection
    };
}

function getRSIAmplitude(rsiData, period = 5, threshold = 6) {
    if (rsiData.length < period) return { amplitude: 0, isFlat: true };

    const lastSlice = rsiData.slice(-period);
    const values = lastSlice.map(d => d.value);

    const max = Math.max(...values);
    const min = Math.min(...values);
    const amplitude = max - min;

    return {
        amplitude: parseFloat(amplitude.toFixed(2)), // чисте значення розмаху
        isFlat: amplitude < threshold,              // чи йде графік плоско
        direction: values[period - 1] > values[0] ? "UP" : "DOWN", // загальний напрямок за ці 5 свічок
        max: max,
        min: min
    };
}