export function findClosestLowerBoundIndex(arr, targetTime) {
  if (targetTime > arr[arr.length - 1].time) {
    return -1;
  }

  let start = 0;
  let end = arr.length - 1;
  let closestIndex = -1; // Зберігаємо індекс найближчого відповідного елемента

  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    const middleTime = arr[middle].time;

    if (middleTime === targetTime) {
      return middle; // Точне співпадіння, ідеально
    } else if (middleTime < targetTime) {
      // Цей час менший за ціль, він може бути нашим результатом.
      // Зберігаємо його індекс і шукаємо далі правіше, щоб знайти ще ближчий час.
      closestIndex = middle;
      start = middle + 1;
    } else {
      // Цей час більший за ціль, потрібно шукати ліворуч.
      end = middle - 1;
    }
  }

  // Повертаємо індекс найближчого знайденого елемента, який не перевищує цільовий час.
  return closestIndex;
}