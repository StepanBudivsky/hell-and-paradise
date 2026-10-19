export function getLastTwoTrendArrays(data) {
    if (data.length < 4) return "Недостатньо точок для аналізу";

    let trends = [];
    let currentTrendPoints = [data[0], data[1], data[2]];
    let currentTrendType = null;

    for (let i = 3; i < data.length; i++) {
        const p1 = data[i - 3].value; // Мінімум/Максимум 2 кроки назад
        const p2 = data[i - 2].value; // Попередній Максимум/Мінімум
        const p3 = data[i - 1].value; // Попередній мінімум/максимум
        const p4 = data[i].value;     // Поточна точка

        let detectedType = null;

        // Логіка Uptrend: HH (Higher High) та HL (Higher Low)
        const isUptrend = (data[i].value > data[i-2].value && data[i-1].value > data[i-3].value) || 
                          (data[i-1].value > data[i-3].value && data[i].value > data[i-2].value);
        
        // Логіка Downtrend: LH (Lower High) та LL (Lower Low)
        const isDowntrend = (data[i].value < data[i-2].value && data[i-1].value < data[i-3].value) || 
                            (data[i-1].value < data[i-3].value && data[i].value < data[i-2].value);

        if (isUptrend) detectedType = "Uptrend";
        else if (isDowntrend) detectedType = "Downtrend";

        if (detectedType) {
            if (currentTrendType === null) {
                currentTrendType = detectedType;
            }

            if (detectedType !== currentTrendType) {
                // Тренд змінився: зберігаємо старий масив і починаємо новий
                trends.push({
                    type: currentTrendType,
                    points: [...currentTrendPoints]
                });
                // Новий тренд починається з точок, що сформували розворот
                currentTrendPoints = [data[i-2], data[i-1], data[i]];
                currentTrendType = detectedType;
            } else {
                // Тренд триває: додаємо точку
                currentTrendPoints.push(data[i]);
            }
        } else {
            // Якщо чіткого сигналу немає, просто додаємо точку до поточного руху
            currentTrendPoints.push(data[i]);
        }
    }

    // Додаємо останній незавершений тренд
    trends.push({
        type: currentTrendType,
        points: currentTrendPoints
    });

    // Повертаємо тільки передостанній та останній
    const result = trends.slice(-2);
    
    return {
        preLastTrend: result[0] || null,
        lastTrend: result[1] || null
    };
}