export function initPointsPanel({
  chart,
  points,        // Сюди передаємо вже відфільтровані точки!
  candles,       // Весь масив свічок для пошуку індексу
  totalCountEl,
  sectionEl,
  visibleBars = 40,
}) {
  // Якщо точок немає - обнуляємо лічильник і виходимо
  if (!points || points.length === 0) {
     totalCountEl.textContent = `0 / 0`;
     return { goTo: () => {} };
  }

  // Стан
  let index = 0;
  
  // Оновлення UI
  const updateUI = () => {
     totalCountEl.textContent = `${index + 1} / ${points.length}`;
  };

  // Функція переходу
  function goTo(stepOrIndex, isStep = false) {
    if (!points.length) return;

    if (isStep) {
        // Якщо це крок (+1, -10 тощо)
        index = (index + stepOrIndex + points.length) % points.length; 
        // Додаткова перевірка на % points.length двічі потрібна для коректної роботи з від'ємними числами в JS
        index = (index + points.length) % points.length;
    } else {
        // Якщо конкретний індекс
        index = stepOrIndex;
    }

    const targetPoint = points[index];
    const time = targetPoint.time;

    // Шукаємо свічку на графіку
    // (Можна оптимізувати через binary search, якщо candles дуже багато, але findIndex ок для <10k)
    const candleIndex = candles.findIndex(c => c.time === time);
    
    if (candleIndex !== -1) {
       chart.timeScale().setVisibleLogicalRange({
        from: candleIndex - visibleBars,
        to: candleIndex + visibleBars,
      });
    }

    updateUI();
  }

  // Слухач подій (використовуємо делегування, як у тебе було)
  sectionEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-step]");
    if (!btn) return;
    
    const step = Number(btn.dataset.step);
    goTo(step, true); // true означає, що ми передаємо крок, а не індекс
  });

  // Ініціалізація
  updateUI();

  return { goTo };
}