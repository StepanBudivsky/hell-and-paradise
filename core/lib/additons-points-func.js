export function fillMissingPoints(data, step = 60) {
    if (data.length < 2) return data;

    let result = [];

    for (let i = 0; i < data.length - 1; i++) {
        const current = data[i];
        const next = data[i + 1];

        // Додаємо поточну точку
        result.push(current);

        const timeDiff = next.time - current.time;

        // Якщо розрив більше за наш крок (60 сек)
        if (timeDiff > step) {
            const stepsCount = Math.floor(timeDiff / step);
            const valueDiff = next.value - current.value;
            
            // Розраховуємо інкремент значення на кожну секунду (або крок)
            const valueStep = valueDiff / (timeDiff / step);

            // Створюємо проміжні точки (не включаючи останню, бо вона додасться на наступній ітерації циклу)
            for (let j = 1; j < stepsCount; j++) {
                result.push({
                    time: current.time + (j * step),
                    value: Number((current.value + (j * valueStep)).toFixed(2)) // Округлення для чистоти
                });
            }
        }
    }

    // Додаємо саму останню точку масиву
    result.push(data[data.length - 1]);

    return result;
}

export function getPointsFromLine(rawPoints) {
  // 1. Сортуємо по часу, щоб логіка послідовності працювала коректно
  const sorted = [...rawPoints].sort((a, b) => a.time - b.time);

  return sorted.filter((point, index, array) => {
    // Умова A: Якщо колір прозорий — пропускаємо
    if (!point.color || point.color === 'transparent') {
      return false;
    }

    // Умова B: Перевіряємо наступну точку
    const nextPoint = array[index + 1];

    // Якщо наступна точка існує І вона кольорова (не прозора) -> 
    // значить поточна точка НЕ остання в серії, пропускаємо її.
    const isNextColored = nextPoint && nextPoint.color && nextPoint.color !== 'transparent';

    if (isNextColored) {
      return false; // Це, наприклад, точка 981, а за нею йде 982
    }

    // Якщо ми тут -> це остання кольорова точка в групі (наприклад, 982)
    return true;
  });
}