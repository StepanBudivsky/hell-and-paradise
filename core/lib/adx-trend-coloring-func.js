export function analyzeADXTrends(data) {
    const FLAT_THRESHOLD = 25;
    
    const COLORS = {
        UP: '#26a69a',    // Тренд посилюється (зелений)
        DOWN: '#ef5350',  // Тренд слабшає (червоний)
        FLAT: '#b96f19'   // Флет (сірий)
    };

    return data.map((point, index) => {
        // 1. Якщо значення null — повертаємо об'єкт як є, без кольору
        if (point.value === null) {
            return { 
                time: point.time, 
                value: point.value 
            };
        }

        // 2. Логіка визначення кольору для існуючих значень
        let currentColor = COLORS.FLAT;

        // Шукаємо попереднє значення (не null) для порівняння
        let prevPoint = null;
        for (let i = index - 1; i >= 0; i--) {
            if (data[i].value !== null) {
                prevPoint = data[i];
                break;
            }
        }

        if (point.value < FLAT_THRESHOLD) {
            currentColor = COLORS.FLAT;
        } else if (prevPoint) {
            if (point.value > prevPoint.value) {
                currentColor = COLORS.UP;
            } else if (point.value < prevPoint.value) {
                currentColor = COLORS.DOWN;
            } else {
                currentColor = COLORS.UP; 
            }
        } else {
            // Якщо це найперше числове значення після списку null
            currentColor = point.value >= FLAT_THRESHOLD ? COLORS.UP : COLORS.FLAT;
        }

        // Повертаємо об'єкт з кольором
        return {
            ...point,
            color: currentColor
        };
    });
}

export function syncZigzagColors(adxData, zigzagData) {
    // 1. Створюємо Map для швидкого пошуку кольору за часом
    // Це набагато швидше, ніж робити .find() всередині циклу
    const adxColorMap = new Map();
    
    adxData.forEach(point => {
        // Додаємо в карту тільки ті точки, де є колір
        if (point.time && point.color) {
            adxColorMap.set(point.time, point.color);
        }
    });

    // 2. Проходимо по масиву зіг-зага та "підтягуємо" кольори
    return zigzagData.map(zigPoint => {
        const matchingColor = adxColorMap.get(zigPoint.time);

        // Якщо знайшли колір для цього часу — додаємо його
        // Якщо ні (наприклад, точка потрапила на початкові null) — залишаємо без кольору
        if (matchingColor) {
            return {
                ...zigPoint,
                color: matchingColor
            };
        }

        return zigPoint;
    });
}