export function findLastTrendSegment(data, minLength = 5) {
    if (!Array.isArray(data) || data.length < minLength) {
        return [];
    }

    let segment = [data[data.length - 1]]; // починаємо з останньої точки
    let trend = null; // 'up' або 'down'

    for (let i = data.length - 2; i >= 0; i--) {
        const prev = data[i];
        const last = segment[segment.length - 1];

        if (trend === null) {
            if (prev.value < last.value) {
                trend = "up";
                segment.push(prev);
            } else if (prev.value > last.value) {
                trend = "down";
                segment.push(prev);
            } else {
                continue; // однакові значення ігноруємо
            }
        } else {
            if (trend === "up" && prev.value <= last.value) {
                segment.push(prev);
            } else if (trend === "down" && prev.value >= last.value) {
                segment.push(prev);
            } else {
                break; // тренд зламався
            }
        }
    }

    if (segment.length < minLength) {
        return [];
    }

    return segment.reverse(); // розвертаємо у правильний порядок
}