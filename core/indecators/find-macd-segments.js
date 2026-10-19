export function findMacdSegments(histogram, PROM_FACTOR, MIN_SEG_LEN, MIN_DISTANCE) {
  if (!Array.isArray(histogram) || histogram.length < 3) {
    return Array.isArray(histogram) 
      ? histogram.map(p => ({ time: p.time, value: p.value > 0 ? p.value * 2 : (p.value < 0 ? p.value * 2 : 0), color: 'transparent' })) 
      : [];
  }

  const len = histogram.length;
  // Створюємо результат ОДИН раз. Одразу модифікуємо value, щоб не бігати масивом в кінці.
  const result = new Array(len);
  for (let i = 0; i < len; i++) {
    const p = histogram[i];
    let val = p.value;
    if (val > 0) val *= 2;
    else if (val < 0) val *= 2;
    
    result[i] = { 
      time: p.time, 
      value: val, 
      color: 'transparent' 
    };
  }

  let s = 0;
  // Використовуємо один масив для піків, щоб не створювати нові в кожному циклі (reusable array)
  const peaks = [];

  while (s < len) {
    const startVal = histogram[s].value;
    if (startVal === 0) { s++; continue; }
    
    const sign = startVal > 0 ? 1 : -1;
    let e = s;
    
    // Знаходимо межі сегмента
    while (e + 1 < len && histogram[e + 1].value * sign > 0) {
      e++;
    }

    const segLen = e - s + 1;
    if (segLen >= MIN_SEG_LEN) {
      // Пошук min/max в сегменті для порогу
      let segMax = -Infinity, segMin = Infinity;
      for (let k = s; k <= e; k++) {
        const v = histogram[k].value;
        if (v > segMax) segMax = v;
        if (v < segMin) segMin = v;
      }
      
      const promThreshold = Math.abs(segMax - segMin) * PROM_FACTOR;
      peaks.length = 0; // Очищуємо масив піків перед використанням

      // Шукаємо піки
      for (let k = s + 1; k <= e - 1; k++) {
        const prev = histogram[k - 1].value;
        const cur = histogram[k].value;
        const next = histogram[k + 1].value;

        if (sign > 0) {
          if (cur > prev && cur > next) {
            if (cur - Math.max(prev, next) >= promThreshold) {
              peaks.push({ idx: k, value: cur });
            }
          }
        } else {
          if (cur < prev && cur < next) {
            if (Math.min(prev, next) - cur >= promThreshold) {
              peaks.push({ idx: k, value: cur });
            }
          }
        }
      }

      // Фільтрація дистанції та зафарбовування
      if (peaks.length >= 2) {
        const filt = []; // Можна теж зробити reusable, але peaks — основне навантаження
        for (let i = 0; i < peaks.length; i++) {
          const p = peaks[i];
          if (filt.length === 0) {
            filt.push(p);
            continue;
          }
          
          const last = filt[filt.length - 1];
          if (p.idx - last.idx < MIN_DISTANCE) {
            if ((sign > 0 && p.value > last.value) || (sign < -0 && p.value < last.value)) {
              filt[filt.length - 1] = p;
            }
          } else {
            filt.push(p);
          }
        }

        if (filt.length >= 2) {
          for (let i = 0; i < filt.length - 1; i++) {
            const from = filt[i].idx + 1;
            const to = filt[i + 1].idx - 1;
            for (let k = from; k <= to; k++) {
              result[k].color = '#6009ecff';
            }
          }
        }
      }
    }
    s = e + 1;
  }

  return result;
}