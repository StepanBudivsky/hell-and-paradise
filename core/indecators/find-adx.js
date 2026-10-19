export function calculateADX(data, period = 14) {
    const results = [];
    
    // Якщо даних замало, повертаємо порожній масив або заповнюємо null
    if (data.length < period) {
        return data.map(d => ({ time: d.time, value: null }));
    }

    const trs = [];
    const plusDMs = [];
    const minusDMs = [];

    // 1. Розрахунок базових показників TR, +DM, -DM
    // Перша свічка не має попередньої, тому TR/DM починаються з другої
    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            trs.push(0);
            plusDMs.push(0);
            minusDMs.push(0);
            continue;
        }

        const current = data[i];
        const prev = data[i - 1];

        const tr = Math.max(
            current.high - current.low,
            Math.abs(current.high - prev.close),
            Math.abs(current.low - prev.close)
        );

        const upMove = current.high - prev.high;
        const downMove = prev.low - current.low;

        const plusDM = (upMove > downMove && upMove > 0) ? upMove : 0;
        const minusDM = (downMove > upMove && downMove > 0) ? downMove : 0;

        trs.push(tr);
        plusDMs.push(plusDM);
        minusDMs.push(minusDM);
    }

    let smoothedTR = 0;
    let smoothedPlusDM = 0;
    let smoothedMinusDM = 0;
    const dxValues = [];

    // 2. Розрахунок DX та заповнення початкових null
    for (let i = 0; i < data.length; i++) {
        if (i < period) {
            // Додаємо null для перших свічок, поки накопичуємо суму для середнього
            results.push({ time: data[i].time, value: null });
            smoothedTR += trs[i];
            smoothedPlusDM += plusDMs[i];
            smoothedMinusDM += minusDMs[i];
            dxValues.push(null);
            continue;
        }

        // Згладжування Уайлдера
        smoothedTR = smoothedTR - (smoothedTR / period) + trs[i];
        smoothedPlusDM = smoothedPlusDM - (smoothedPlusDM / period) + plusDMs[i];
        smoothedMinusDM = smoothedMinusDM - (smoothedMinusDM / period) + minusDMs[i];

        const plusDI = (smoothedPlusDM / smoothedTR) * 100;
        const minusDI = (smoothedMinusDM / smoothedTR) * 100;
        const dx = (Math.abs(plusDI - minusDI) / (plusDI + minusDI)) * 100;
        dxValues.push(dx);

        // Розрахунок ADX (починається після накопичення DX значень за період)
        const adxStartIndex = (period * 2) - 1;

        if (i < adxStartIndex) {
            // Ще не вистачає даних для ADX
            if (i >= period) {
                results.push({ time: data[i].time, value: null });
            }
        } else if (i === adxStartIndex) {
            // Перше значення ADX - просте середнє за період DX
            let sumDX = 0;
            for (let j = period; j <= i; j++) {
                sumDX += dxValues[j];
            }
            results.push({ time: data[i].time, value: sumDX / period });
        } else {
            // Наступні значення ADX згладжуються
            const prevADX = results[i - 1].value;
            const currentADX = (prevADX * (period - 1) + dxValues[i]) / period;
            results.push({ time: data[i].time, value: currentADX });
        }
    }

    return results;
}