export function calculateSlopeAngle(prevVal, curVal, step = 1) {
    const deltaY = curVal - prevVal;
    const deltaX = step;

    // Розрахунок арктангенса (результат у радіанах)
    const radians = Math.atan2(deltaY, deltaX);

    // Переведення в градуси
    const degrees = radians * (180 / Math.PI);

    // Повертаємо ціле число (округлене до найближчого)
    return Math.abs(Math.round(degrees));
}

export function getLatestAndPreviousScenarios(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return { latest: [], previous: [] };
  }

  // 1. Знаходимо всі унікальні точки часу і сортуємо за спаданням
  const uniqueTimes = [...new Set(data.map(item => item.time))].sort((a, b) => b - a);

  const maxTime = uniqueTimes[0];
  const prevTime = uniqueTimes[1];

  // 2. Фільтруємо елементи для найбільшої та попередньої точок часу
  const latest = data.filter(item => item.time === maxTime);
  const previous = prevTime !== undefined 
    ? data.filter(item => item.time === prevTime) 
    : [];

  return { latest, previous };
}