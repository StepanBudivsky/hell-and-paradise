import { klinesData, currentInterval } from '../chart-data.js';
import { checkClass } from '../control.js';
import { calculateDeal } from '../deal-calculator.js';

// Імпортуємо лінії та функцію налаштування з файлу графіка
import { 
  entryPriceLine, 
  stopLossPriceLine, 
  takeProfitPriceLine, 
  setTradeLineConfig 
} from '../main.js';

// Кнопки увімкнення та вимкнення кожної лінії
const toggleEntryBtn = document.getElementById('toggleEntryBtn');
const toggleStopBtn = document.getElementById('toggleStopBtn');
const toggleTpBtn = document.getElementById('toggleTpBtn');

function setupDealCalculator() {
    const longBtn = document.getElementById('cashLongDealBtn');
    const shortBtn = document.getElementById('cashShortDealBtn');
    const calculateBtn = document.getElementById('calculate-deal');
    
    const cashInput = document.getElementById('cashInput');
    const shoulderInput = document.getElementById('shoulderInput');
    const riskAmountInput = document.getElementById('stopPriceInput');
    const takeProfitAmountInput = document.getElementById('takeProfitAmountInput');

    const dealAmountResultEl = document.getElementById('deal-amount-result');
    const stopAmountResultEl = document.getElementById('stop-amount-result');
    const stopPriceResultEl = document.getElementById('stop-price-result');
    const takeProfitAmountResultEl = document.getElementById('take-profit-amount-result');
    const takeProfitPriceResultEl = document.getElementById('take-profit-price-result');
    const errorResultEl = document.getElementById('deal-error-result');

    let dealType = 'long';

    // Зберігаємо поточні розраховані значення
    let currentData = {
        entryPrice: 0,
        stopPrice: 0,
        takeProfitPrice: 0,
        hasResults: false
    };

    // Функція оновлення ліній на графіку (БЕЗ перерозрахунку формул)
    function updateChartLines() {
        if (!currentData.hasResults) {
            // Вимикаємо всі лінії, якщо немає збереженого розрахунку
            setTradeLineConfig(entryPriceLine, { price: 0, color: '#2196F3', visible: false });
            setTradeLineConfig(stopLossPriceLine, { price: 0, color: '#f23645', visible: false });
            setTradeLineConfig(takeProfitPriceLine, { price: 0, color: '#008984', visible: false });
            return;
        }

        // Перевіряємо активність кнопок
        const isEntryEnabled = toggleEntryBtn ? checkClass(toggleEntryBtn) : true;
        const isStopEnabled = toggleStopBtn ? checkClass(toggleStopBtn) : true;
        const isTpEnabled = toggleTpBtn ? checkClass(toggleTpBtn) : true;

        // Переключаємо видимість ліній, використовуємо вже пораховані ціни
        setTradeLineConfig(entryPriceLine, {
            price: currentData.entryPrice,
            color: '#2196F3',
            visible: isEntryEnabled
        });

        setTradeLineConfig(stopLossPriceLine, {
            price: currentData.stopPrice,
            color: '#f23645',
            visible: isStopEnabled
        });

        setTradeLineConfig(takeProfitPriceLine, {
            price: currentData.takeProfitPrice,
            color: '#008984',
            visible: isTpEnabled
        });
    }

    // Прив'язуємо клік по кнопках: перемикаємо клас 'active' ТА відразу оновлюємо лінії
    [toggleEntryBtn, toggleStopBtn, toggleTpBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                updateChartLines(); // Оновлюємо відображення без перерозрахунку угоди
            });
        }
    });

    longBtn.addEventListener('click', () => {
        dealType = 'long';
        longBtn.classList.add('active');
        shortBtn.classList.remove('active');
    });

    shortBtn.addEventListener('click', () => {
        dealType = 'short';
        shortBtn.classList.add('active');
        longBtn.classList.remove('active');
    });

    calculateBtn.addEventListener('click', () => {
        const deposit = parseFloat(cashInput.value);
        const leverage = parseFloat(shoulderInput.value);
        const riskAmount = Math.abs(parseFloat(riskAmountInput.value));
        const takeProfitAmount = parseFloat(takeProfitAmountInput.value);

        const currentKlines = klinesData[currentInterval];
        if (!currentKlines || currentKlines.length === 0) {
            errorResultEl.textContent = 'Немає даних про ціну.';
            dealAmountResultEl.textContent = '0.00';
            stopAmountResultEl.textContent = '0.00';
            stopPriceResultEl.textContent = '0.00';
            takeProfitAmountResultEl.textContent = '0.00';
            takeProfitPriceResultEl.textContent = '0.00';

            currentData.hasResults = false;
            updateChartLines();
            return;
        }

        const currentPrice = currentKlines[currentKlines.length - 1].close;

        const result = calculateDeal({
            dealType,
            deposit,
            leverage,
            riskAmount,
            takeProfitAmount: isNaN(takeProfitAmount) ? 0 : takeProfitAmount,
            currentPrice
        });

        errorResultEl.textContent = '';

        if (result.error) {
            errorResultEl.textContent = result.error;
            dealAmountResultEl.textContent = '0.00';
            stopAmountResultEl.textContent = '0.00';
            stopPriceResultEl.textContent = '0.00';

            currentData.hasResults = false;
            updateChartLines();
        } else {
            dealAmountResultEl.textContent = result.dealAmount.toFixed(2);
            
            stopPriceResultEl.style.color = result.stopAmount >= 0 ? '#26a69a' : '#ef5350';
            stopPriceResultEl.textContent = result.stopPrice.toFixed(2);
            
            takeProfitPriceResultEl.style.color = result.takeProfitAmount > 0 ? '#26a69a' : '#ef5350';
            takeProfitPriceResultEl.textContent = result.takeProfitPrice.toFixed(2);

            // Записуємо нові ціни в кеш
            currentData = {
                entryPrice: currentPrice,
                stopPrice: result.stopPrice,
                takeProfitPrice: result.takeProfitPrice,
                hasResults: true
            };

            // Відображаємо лінії
            updateChartLines();
        }
    });
}

// Run the setup
setupDealCalculator();

// import { klinesData, currentInterval } from '../chart-data.js';
// import { calculateDeal } from '../deal-calculator.js';

// function setupDealCalculator() {
//     const longBtn = document.getElementById('cashLongDealBtn');
//     const shortBtn = document.getElementById('cashShortDealBtn');
//     const calculateBtn = document.getElementById('calculate-deal');
    
//     const cashInput = document.getElementById('cashInput');
//     const shoulderInput = document.getElementById('shoulderInput'); // Leverage
//     const riskAmountInput = document.getElementById('stopPriceInput'); // Input for RISK AMOUNT
//     const takeProfitAmountInput = document.getElementById('takeProfitAmountInput'); // NEW: Take Profit Amount Input

//     const dealAmountResultEl = document.getElementById('deal-amount-result');
//     const stopAmountResultEl = document.getElementById('stop-amount-result');
//     const stopPriceResultEl = document.getElementById('stop-price-result');
//     const takeProfitAmountResultEl = document.getElementById('take-profit-amount-result'); // NEW: Take Profit Amount Result
//     const takeProfitPriceResultEl = document.getElementById('take-profit-price-result'); // NEW: Take Profit Price Result
//     const errorResultEl = document.getElementById('deal-error-result');


//     let dealType = 'long'; // default

//     longBtn.addEventListener('click', () => {
//         dealType = 'long';
//         longBtn.classList.add('active');
//         shortBtn.classList.remove('active');
//     });

//     shortBtn.addEventListener('click', () => {
//         dealType = 'short';
//         shortBtn.classList.add('active');
//         longBtn.classList.remove('active');
//     });

//     calculateBtn.addEventListener('click', () => {
//         const deposit = parseFloat(cashInput.value);
//         const leverage = parseFloat(shoulderInput.value);
//         const riskAmount = Math.abs(parseFloat(riskAmountInput.value)); // Get risk amount and take its absolute value
//         const takeProfitAmount = parseFloat(takeProfitAmountInput.value); // NEW: Get Take Profit Amount

//         const currentKlines = klinesData[currentInterval];
//         if (!currentKlines || currentKlines.length === 0) {
//             errorResultEl.textContent = 'Немає даних про ціну.';
//             dealAmountResultEl.textContent = '0.00';
//             stopAmountResultEl.textContent = '0.00';
//             stopPriceResultEl.textContent = '0.00'; // Clear stop price
//             takeProfitAmountResultEl.textContent = '0.00'; // Clear take profit amount
//             takeProfitPriceResultEl.textContent = '0.00'; // Clear take profit price
//             return;
//         }

//         const currentPrice = currentKlines[currentKlines.length - 1].close;

//         const result = calculateDeal({
//             dealType,
//             deposit,
//             leverage,
//             riskAmount,
//             takeProfitAmount: isNaN(takeProfitAmount) ? 0 : takeProfitAmount, // Pass takeProfitAmount, default to 0 if NaN
//             currentPrice
//         });

//         errorResultEl.textContent = ''; // Clear previous errors

//         if (result.error) {
//             errorResultEl.textContent = result.error;
//             dealAmountResultEl.textContent = '0.00';
//             stopAmountResultEl.textContent = '0.00';
//             stopPriceResultEl.textContent = '0.00';
//         } else {
//             dealAmountResultEl.textContent = result.dealAmount.toFixed(2);
//             // stopAmountResultEl.textContent = result.stopAmount.toFixed(2);
//             // Додаємо колір: зелений якщо в плюсі, червоний якщо в мінусі
//             stopPriceResultEl.style.color = result.stopAmount >= 0 ? '#26a69a' : '#ef5350';
//             stopPriceResultEl.textContent = result.stopPrice.toFixed(2);
            
//             // NEW: Display Take Profit results
//             // takeProfitAmountResultEl.textContent = result.takeProfitAmount.toFixed(2);
//             takeProfitPriceResultEl.style.color = result.takeProfitAmount > 0 ? '#26a69a' : '#ef5350'; // Green for profit
//             takeProfitPriceResultEl.textContent = result.takeProfitPrice.toFixed(2);
//         }
//     });
// }

// // Run the setup
// setupDealCalculator();