export function extractColoredMarkers(
  dataArray,
  mode = 1 // 1: byColorRuns | 2: bySignSectors | 3: bySignSectorsLastColor
) {
  const markers = [];

  if (!Array.isArray(dataArray) || dataArray.length === 0) return markers;

  // Допоміжна функція для взяття часу наступної точки (зміщення на 1 вперед)
  const getTimeNext = (currentIndex) => {
    // Якщо є наступна точка — беремо її час, якщо це остання точка — залишаємо її час
    const nextPoint = dataArray[currentIndex + 1];
    return nextPoint ? nextPoint.time : dataArray[currentIndex].time;
  };

  // --- РЕЖИМ 1: По кольорових проміжках ---
  if (mode === 1) {
    let lastPointIdx = -1;

    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i].color !== 'transparent') {
        lastPointIdx = i;
      } else if (lastPointIdx !== -1) {
        // Беремо дані останньої кольорової точки, але час від поточної (прозорої) точки i
        markers.push(makeMarkerFromPoint(dataArray[lastPointIdx], dataArray[i].time));
        lastPointIdx = -1;
      }
    }
    if (lastPointIdx !== -1) {
      markers.push(makeMarkerFromPoint(dataArray[lastPointIdx], dataArray[lastPointIdx].time));
    }
    return markers;
  }

  // --- РЕЖИМ 2 та 3: По секторах знаку ---
  if (mode === 2 || mode === 3) {
    let sectorSign = getSign(dataArray[0].value);
    let lastColoredIdx = dataArray[0].color !== 'transparent' ? 0 : -1;

    for (let i = 1; i < dataArray.length; i++) {
      const currSign = getSign(dataArray[i].value);
      const signChanged = hasSignChange(sectorSign, currSign);

      if (signChanged) {
        if (lastColoredIdx !== -1) {
          if (mode === 2) {
            // Ставимо на кінець сектора (i-1), але зміщуємо час на точку i
            markers.push(makeMarkerFromPoint(dataArray[i - 1], dataArray[i].time));
          } else {
            // Режим 3: Остання кольорова точка, час зміщуємо на 1 вперед
            markers.push(makeMarkerFromPoint(dataArray[lastColoredIdx], getTimeNext(lastColoredIdx)));
          }
        }
        sectorSign = currSign;
        lastColoredIdx = dataArray[i].color !== 'transparent' ? i : -1;
      } else {
        if (dataArray[i].color !== 'transparent') {
          lastColoredIdx = i;
        }
      }
    }

    // Останній сектор
    if (lastColoredIdx !== -1) {
      if (mode === 2) {
        const lastIdx = dataArray.length - 1;
        markers.push(makeMarkerFromPoint(dataArray[lastIdx], dataArray[lastIdx].time));
      } else {
        markers.push(makeMarkerFromPoint(dataArray[lastColoredIdx], dataArray[lastColoredIdx].time));
      }
    }

    return markers;
  }

  return markers;
}

// Оновлена функція: тепер приймає окремо точку з даними та окремо час (time)
function makeMarkerFromPoint(point, customTime) {
  const isAbove = Number(point.value) >= 0;
  return {
    time: customTime || point.time, // Використовуємо зміщений час
    position: isAbove ? 'aboveBar' : 'belowBar',
    color: point.color === 'transparent' ? '#6a0aa1ff' : point.color,
    shape: isAbove ? 'arrowDown' : 'arrowUp',
    text: isAbove ? 'Max' : 'Min',
    size: 2,
  };
}

// Інші функції без змін
function getSign(value) {
  const v = Number(value);
  if (v > 0) return 'pos';
  if (v < 0) return 'neg';
  return 'zero';
}

function hasSignChange(prevSign, currSign) {
  const normalize = (s, p) => (s === 'zero' ? p : s);
  return normalize(prevSign, prevSign) !== normalize(currSign, prevSign);
}