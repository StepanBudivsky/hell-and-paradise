import { calculateSlopeAngle, getLatestAndPreviousScenarios } from "../calcFunction/various/mathematical-func.js";

export function analyzeMACD(analyzeData, macd, signal, histogramData, divergenceData, dataKlines) {
  if (!histogramData || histogramData.length === 0) return;

  let previousID = "U2000";
  let currentID = "U2000";
  let scenariosID = [];

  let markerSaucer = [];

  // Допоміжна функція для перевірки дивергенції
  // Повертає індекс останньої свічки дивергенції, якщо вона знайдена
  const getDivergenceEndIndex = (startIndex) => {
    if (divergenceData[startIndex].color === "transparent") return null;
    
    let lastIndex = startIndex;
    for (let j = startIndex; j < divergenceData.length; j++) {
      if (divergenceData[j].color !== "transparent") {
        lastIndex = j;
      } else {
        break; // Колір зник — дивергенція закінчилася
      }
    }
    return lastIndex;
  };

  let totalHistogram = 0;

  for (let i = 0; i < histogramData.length; i++) {
    totalHistogram += Math.abs(histogramData[i].value);
  }

  const averageHistogram = totalHistogram / (histogramData.length - 1);

  for (let i = 1; i < histogramData.length; i++) {
    const prev = histogramData[i - 1].value;
    const cur = histogramData[i].value;
    const nextDate = i + 1 < histogramData.length ? histogramData[i + 1].time : null;;
    const next = i + 1 < histogramData.length ? histogramData[i + 1].value : null;

    const prevMacd = macd[i - 1].value;
    const curMacd = macd[i].value;
    const nextMacd = i + 1 < macd.length ? macd[i + 1].value : null;

    const prevSignal = signal[i - 1].value;
    const curSignal = signal[i].value;
    const nextSignal = i + 1 < signal.length ? signal[i + 1].value : null;

    const isFlat = checkFlat(histogramData, histogramData.length - 1, averageHistogram);
    // 11
    if (isFlat) {
      if (currentID !== "U2011") {
        previousID = currentID;
        currentID = "U2011";
        scenariosID.push({time: dataKlines[i].time, id: "U2011"});
      }
    }

    // 1. ПЕРЕВІРКА НА ДИВЕРГЕНЦІЮ ТА СКІП
    const divergenceEnd = getDivergenceEndIndex(i);
    if (divergenceEnd !== null) {
      const isBullish = divergenceData[i].value < 0;
      
      // 5
      if (isBullish && dataKlines[i].low > dataKlines[divergenceEnd].low && histogramData[i].value < histogramData[divergenceEnd].value) {
        previousID = currentID;
        currentID = "U2005";
        i = divergenceEnd + 1; // Пропускаємо свічки до кінця дивергенції
        scenariosID.push({time: dataKlines[i].time, id: "U2005"});
        continue; 
      } 
      // 6
      if (!isBullish && dataKlines[i].high < dataKlines[divergenceEnd].high && histogramData[i].value > histogramData[divergenceEnd].value) {
        previousID = currentID;
        currentID = "U2006";
        i = divergenceEnd + 1; // Пропускаємо свічки до кінця дивергенції
        scenariosID.push({time: dataKlines[i].time, id: "U2006"});
        continue; 
      }
      
      i = divergenceEnd + 1; // Пропускаємо свічки до кінця дивергенції
      // 7 i 8
      if (isBullish) {
        previousID = currentID;
        currentID = "U2007";
        scenariosID.push({time: dataKlines[i].time, id: "U2007"});
      } else {
        previousID = currentID;
        currentID = "U2008";
        scenariosID.push({time: dataKlines[i].time, id: "U2008"});
      }
      
      continue; 
    }

    // Перевіряємо на рикошет саме в момент перетину нуля
    const bounce = checkZeroBounce(histogramData, i, 2); // 2 — це кількість свічок "під/над" нулем

    if (bounce) {
        // 1
        if (bounce.type === "BULLISH_BOUNCE") {
            previousID = currentID;
            currentID = "U2012";
            scenariosID.push({time: dataKlines[i].time, id: "U2012"});
        } else { // 2
            previousID = currentID;
            currentID = "U2013";
            scenariosID.push({time: dataKlines[i].time, id: "U2013"});
        }

        i += bounce.skip; // Пропускаємо ці свічки, щоб не дублювати аналіз
        continue;
    }

    // 1
    if (prev < 0 && cur > 0) {
      previousID = currentID;
      currentID = "U2001";
      scenariosID.push({time: dataKlines[i].time, id: "U2001"});
    }
    // 2
    if (prev > 0 && cur < 0) {
      previousID = currentID;
      currentID = "U2002";
      scenariosID.push({time: dataKlines[i].time, id: "U2002"});
    }
    // 3
    if (next && prev < cur && cur > next && prev > 0 && cur > 0 && next > 0) {
      previousID = currentID;
      currentID = "U2003";
      scenariosID.push({time: dataKlines[i].time, id: "U2003"});
    }
    // 4)
    if (next && prev > cur && cur < next && prev < 0 && cur < 0 && next < 0) {
      previousID = currentID;
      currentID = "U2004";
      scenariosID.push({time: dataKlines[i].time, id: "U2004"});
    }
    // 9
    if (next && prev > cur && cur < next && prev > 0 && cur > 0 && next > 0) {
      previousID = currentID;
      currentID = "U2009";
      scenariosID.push({time: dataKlines[i].time, id: "U2009"});
      markerSaucer = [{ time: nextDate, position: 'belowBar', color: '#000000', shape: 'square', size: 1, }];
    }
    // 10
    if (next && prev < cur && cur > next && prev < 0 && cur < 0 && next < 0) {
      previousID = currentID;
      currentID = "U2010";
      scenariosID.push({time: dataKlines[i].time, id: "U2010"});
      markerSaucer = [{ time: nextDate, position: 'aboveBar', color: '#000000', shape: 'square', size: 1, }];
    }

    // 1
    if (prevMacd <= prevSignal && curMacd >= curSignal && curMacd < 0 && curSignal < 0) {
      previousID = currentID;
      currentID = "U2014";
      scenariosID.push({time: dataKlines[i].time, id: "U2014"});
    } 

    // 2
    if (prevMacd >= prevSignal && curMacd <= curSignal && curMacd > 0 && curSignal > 0) {
      previousID = currentID;
      currentID = "U2015";
      scenariosID.push({time: dataKlines[i].time, id: "U2015"});
    }

    // 3
    if (prevMacd <= prevSignal && curMacd >= curSignal && curMacd > 0 && curSignal > 0) {
      previousID = currentID;
      currentID = "U2016";
      scenariosID.push({time: dataKlines[i].time, id: "U2016"});
    }

    // 4
    if (prevMacd >= prevSignal && curMacd <= curSignal && curMacd < 0 && curSignal < 0) {
      previousID = currentID;
      currentID = "U2017";
      scenariosID.push({time: dataKlines[i].time, id: "U2017"});
    }

    if (nextMacd && nextSignal && Math.abs(prevMacd - prevSignal) > Math.abs(curMacd - curSignal) && Math.abs(curMacd - curSignal) < Math.abs(nextMacd - nextSignal)) {
      // 5
      if (nextSignal > curSignal) {
        previousID = currentID;
        currentID = "U2018";  
        scenariosID.push({time: dataKlines[i].time, id: "U2018"});
      }
      // 6
      if (nextSignal < curSignal) {
        previousID = currentID;
        currentID = "U2019"; 
        scenariosID.push({time: dataKlines[i].time, id: "U2019"}); 
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

  if (histogramData.length > 1 && histogramData[histogramData.length - 1].value > histogramData[histogramData.length - 2].value) {
    analyzeData.additional.histogramTrend.currentID = "B6001";
    analyzeData.additional.histogramTrend.valueX = calculateSlopeAngle(histogramData[histogramData.length - 2].value, histogramData[histogramData.length - 1].value);
  } else {
    analyzeData.additional.histogramTrend.currentID = "B6002";
    analyzeData.additional.histogramTrend.valueX = calculateSlopeAngle(histogramData[histogramData.length - 2].value, histogramData[histogramData.length - 1].value)
  }

  if (macd.length > 1 && macd[macd.length - 1].value > macd[macd.length - 2].value) {
    analyzeData.additional.macdTrend.currentID = "B6003";
    analyzeData.additional.macdTrend.valueX = calculateSlopeAngle(macd[macd.length - 2].value, macd[macd.length - 1].value);
  } else {
    analyzeData.additional.macdTrend.currentID = "B6004";
    analyzeData.additional.macdTrend.valueX = calculateSlopeAngle(macd[macd.length - 2].value, macd[macd.length - 1].value);
  }

  if (signal.length > 1 && signal[signal.length - 1].value > signal[signal.length - 2].value) {
    analyzeData.additional.signalTrend.currentID = "B6005";
    analyzeData.additional.signalTrend.valueX = calculateSlopeAngle(signal[signal.length - 2].value, signal[signal.length - 1].value);
  } else {
    analyzeData.additional.signalTrend.currentID = "B6006";
    analyzeData.additional.signalTrend.valueX = calculateSlopeAngle(signal[signal.length - 2].value, signal[signal.length - 1].value);
  }
  
  const lastIdx = macd.length - 1;
  const prevIdx = macd.length - 2;

  if (lastIdx > 0) {
    const macdVal = macd[lastIdx].value;
    const prevMacdVal = macd[prevIdx].value;
    const signalVal = signal[lastIdx].value;
    const prevSignalVal = signal[prevIdx].value;

    // Рахуємо кути нахилу для обох ліній
    const macdAngle = calculateSlopeAngle(prevMacdVal, macdVal);
    const signalAngle = calculateSlopeAngle(prevSignalVal, signalVal);

    // Відстань між лініями зараз і на попередній свічці
    const currentDiff = Math.abs(macdVal - signalVal);
    const prevDiff = Math.abs(prevMacdVal - prevSignalVal);

    let specialStatus = "";

    // 1. Parallel Break (Рівнобіжний вихід)
    // Умови: лінії розходяться (currentDiff > prevDiff) і обидві мають крутий нахил в один бік
    if (currentDiff > prevDiff && ((macdAngle > 20 && signalAngle > 20) || (macdAngle < -20 && signalAngle < -20))) {
      analyzeData.additional.approachAndRemoval.currentID = "B6007";
      specialStatus = "Сильний імпульс";
    } 
    
    // 2. Конвергенція ліній (Втрата інтересу)
    // Умови: лінії зближуються (currentDiff < prevDiff) і їх нахил стає слабким (близько до 0)
    else if (currentDiff < prevDiff && Math.abs(macdAngle) < 15 && Math.abs(signalAngle) < 15) {
      analyzeData.additional.approachAndRemoval.currentID = "B6008";
      specialStatus = "Розворот або флет";
    }

    // Оновлюємо текст (додаємо статус до існуючого "Зближення/Розширення")
    const basicTrend = currentDiff > prevDiff ? "Розширення" : "Зближення";
    
    if (!specialStatus) {
      analyzeData.additional.approachAndRemoval.currentID = currentDiff > prevDiff ? "B6009" : "B6010";
    }
  }

  return markerSaucer;
}


function checkFlat(data, i, avgHeight) {
    const lookback = 5;
    // Перевіряємо, чи достатньо даних для аналізу 5 свічок
    if (i < lookback - 1) return false;

    const threshold = avgHeight * 0.5; // Половина середньої висоти

    for (let j = 0; j < lookback; j++) {
        // Перевіряємо модуль значення (відстань від 0)
        if (Math.abs(data[i - j].value) > threshold) {
            return false; // Якщо хоча б одна свічка вища за поріг — це не флет
        }
    }

    return true; // Всі 5 свічок малі — це "ниточка"
}

function checkZeroBounce(data, i, scanRange = 2) {
    if (i < 1 || i + scanRange >= data.length) return null;

    const v0 = data[i - 1].value; // Свічка ДО пробою
    const v1 = data[i].value;     // Свічка пробою 0

    // 1. БИЧАЧИЙ РІКОШЕТ (Ціна була вгорі > 0, нирнула під 0 і відскочила назад)
    if (v0 > 0 && v1 < 0) {
        for (let j = 1; j <= scanRange; j++) {
            const vNext = data[i + j].value;
            // Якщо протягом наступних N свічок ми знову пробили 0 вгору
            if (vNext > 0) {
                return { type: "BULLISH_BOUNCE", skip: j };
            }
        }
    }
    // 2. ВЕДМЕЖИЙ РІКОШЕТ (Ціна була внизу < 0, вискочила над 0 і відскочила назад)
    if (v0 < 0 && v1 > 0) {
        for (let j = 1; j <= scanRange; j++) {
            const vNext = data[i + j].value;
            // Якщо протягом наступних N свічок ми знову пробили 0 вниз
            if (vNext < 0) {
                return { type: "BEARISH_BOUNCE", skip: j };
            }
        }
    }
    return null;
}