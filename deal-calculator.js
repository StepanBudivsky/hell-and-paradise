
export function calculateDeal({ dealType, deposit, leverage, riskAmount, takeProfitAmount, currentPrice }) {
  if (!currentPrice || currentPrice <= 0 || deposit <= 0 || leverage <= 0 || riskAmount <= 0) {
    return { error: "Некоректні вхідні дані: поточна ціна, депозит, плече або сума ризику мають бути більше нуля." };
  }

  // 1. Сума угоди (загальний обсяг позиції в USDT)
  const dealAmount = deposit * leverage;

  // 2. Розмір позиції в криптовалюті
  const positionSize = dealAmount / currentPrice;
  
  // 3. Розрахунок ціни стоп-лосу на основі суми ризику
  let stopPrice;
  const lossPerUnitFromRisk = riskAmount / positionSize;

  if (dealType === 'long') {
    stopPrice = currentPrice - lossPerUnitFromRisk;
    if (stopPrice <= 0) {
      return { error: "Розрахована ціна стоп-лосу для Long угоди менша або дорівнює нулю. Зменшіть ризик або збільшіть депозит/плече." };
    }
    if (stopPrice >= currentPrice) {
        return { error: "Для Long угоди розрахована ціна стоп-лосу має бути нижче поточної ціни. Зменшіть ризик." };
    }
  } else { // short
    stopPrice = currentPrice + lossPerUnitFromRisk;
    if (stopPrice <= 0) { // Though unlikely for short, good to have a check
      return { error: "Розрахована ціна стоп-лосу для Short угоди менша або дорівнює нулю. Зменшіть ризик або збільшіть депозит/плече." };
    }
    if (stopPrice <= currentPrice) {
        return { error: "Для Short угоди розрахована ціна стоп-лосу має бути вище поточної ціни. Зменшіть ризик." };
    }
  }
  // stopAmount is directly the riskAmount provided by the user, but it's a loss, so negative.
  const stopAmount = -riskAmount; // Сума ризику завжди від'ємна

  // --- NEW: Take Profit Calculation ---
  let calculatedTakeProfitPrice = 0;
  let actualTakeProfitAmount = 0;

  if (takeProfitAmount && takeProfitAmount > 0) {
    const profitPerUnit = takeProfitAmount / positionSize;
    if (dealType === 'long') {
      calculatedTakeProfitPrice = currentPrice + profitPerUnit;
    } else { // short
      calculatedTakeProfitPrice = currentPrice - profitPerUnit;
      if (calculatedTakeProfitPrice <= 0) {
        return { error: "Розрахована ціна тейк-профіту для Short угоди менша або дорівнює нулю. Зменшіть суму тейк-профіту або збільшіть депозит/плече." };
      }
    }
    actualTakeProfitAmount = takeProfitAmount; // User-defined profit
  }

  return {
    dealAmount,
    stopAmount,
    positionSize,
    stopPrice,
    takeProfitAmount: actualTakeProfitAmount,
    takeProfitPrice: calculatedTakeProfitPrice,
  };
}