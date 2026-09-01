/* Загальні (макро) зони для бічних блоків та контексту */
const MACRO_SESSIONS = [
    { name: "Тихий океан / Азія", start: "00:00", end: "09:00" },
    { name: "Європа", start: "09:00", end: "15:30" },
    { name: "Америка", start: "15:30", end: "00:00" }
];

/* Детальні (мікро) зони для центрального блоку[cite: 3] */
const MICRO_SESSIONS = [
    { start: "00:00", end: "01:00", status: "✅ Дивитися закриття свічки", note: "Важливо для аналізу денних рівнів. Але не входити в угоди." },
    { start: "01:00", end: "03:00", status: "❌ Категорично не торгувати", note: "Ринок належить алгоритмам, занадто тонкий ринок. Легко зловити ліквід-свіп. Високий ризик маніпуляцій перед відкриттям Токіо." },
    { start: "03:00", end: "06:00", status: "✅ Торгувати", note: "Формуються денні рівні. Рухи плавні, передбачувані. Добре відпрацьовують базові трендові індикатори (ADX, MACD) на дрібних таймфреймах." },
    { start: "06:00", end: "09:00", status: "⏸️ Супроводжувати позиції / Аналіз", note: "Азія закривається, Європа ще спить. Об'єми падають. Оптимальний час для звірки \"теплової карти\" сигналів на всіх таймфреймах (від 1 хв до 1 дн), щоб підготуватися до лондонської сесії." },
    { start: "09:00", end: "10:30", status: "✅ Торгувати", note: "Висока волатильність. Але будьте обережні — це час маніпуляцій (хибні пробої)." },
    { start: "10:30", end: "14:30", status: "⚠️ Чекати", note: "Зазвичай флет або повільний рух. Не варто входити без чіткого сигналу. Надійніше дочекатися підтвердження через чіткі прайс-екшен патерни (наприклад, \"Пінцети\" або \"Поглинання\")." },
    { start: "14:30", end: "15:30", status: "🛑 Без позицій", note: "Затишшя перед відкриттям США. Об 15:30 часто виходить важлива макростатистика (CPI, безробіття) — високий ризик \"вертольотів\" (диких свічок в обидва боки), що легко вибивають стопи." },
    { start: "15:30", end: "17:30", status: "✅ Торгувати імпульс", note: "Найбільші об'єми та максимальна волатильність. Найкращий час для ф'ючерсів. Якщо під час цього імпульсу RSI стрімко пробиває рівні вище 75 — це вказує на потужний моментум, а не на хибний пробій, тому угоди за трендом тут найефективніші." },
    { start: "17:30", end: "21:00", status: "❌ Не відкривати нові угоди", note: "Починається \"п'яний ринок\" (дикі свічки в обидві сторони)." },
    { start: "21:00", end: "00:00", status: "⚠️ Фіксація прибутку / Спостереження", note: "Волатильність поступово згасає. Американські та європейські інституціонали завершують день. Важливо фіксувати результати і стежити, щоб застарілі (\"архівні\") вечірні рухи не збивали вагу актуальних денних сигналів при аналізі наступного дня." }
];

export function updateTradingZoneUI() {
    const now = new Date();
    // Час за Києвом[cite: 3]
    const kievTime = new Intl.DateTimeFormat('uk-UA', {
        timeZone: 'Europe/Kiev', hour: '2-digit', minute: '2-digit', hour12: false
    }).format(now);

    const [h, m] = kievTime.split(':').map(Number);
    const currentMin = h * 60 + m;

    // Утиліта для переведення "ГГ:ХХ" у хвилини
    const timeToMins = (timeStr) => {
        const [hours, mins] = timeStr.split(':').map(Number);
        let total = hours * 60 + mins;
        return total === 0 ? 1440 : total; // 00:00 = кінець доби для end
    };

    // 1. Знаходимо поточну велику (макро) сесію 
    const macroIndex = MACRO_SESSIONS.findIndex(s => {
        const sMin = timeToMins(s.start) === 1440 ? 0 : timeToMins(s.start);
        const eMin = timeToMins(s.end);
        return currentMin >= sMin && currentMin < eMin;
    });

    const currMacro = MACRO_SESSIONS[macroIndex];
    const prevMacro = MACRO_SESSIONS[(macroIndex - 1 + MACRO_SESSIONS.length) % MACRO_SESSIONS.length];
    const nextMacro = MACRO_SESSIONS[(macroIndex + 1) % MACRO_SESSIONS.length];

    // 2. Знаходимо поточну детальну (мікро) сесію[cite: 3]
    const currMicro = MICRO_SESSIONS.find(s => {
        const sMin = timeToMins(s.start) === 1440 ? 0 : timeToMins(s.start);
        const eMin = timeToMins(s.end);
        return currentMin >= sMin && currentMin < eMin;
    }) || MICRO_SESSIONS[0];

    // 3. Оновлюємо лівий блок (Минула зона)
    const prevTitleEl = document.getElementById("prev-title");
    if (prevTitleEl) {
        prevTitleEl.innerText = `Минула зона: ${prevMacro.name}`;
        document.getElementById("prev-time").innerText = `${prevMacro.start} - ${prevMacro.end}`;
    }

    // 4. Оновлюємо центральний блок (Поточна + Детальна)
    const currHeaderEl = document.getElementById("curr-header");
    if (currHeaderEl) {
        currHeaderEl.innerText = `Зараз ${currMacro.name} ${currMacro.start} - ${currMacro.end}. Детально: ${currMicro.start} - ${currMicro.end} ${currMicro.status}`;
        // document.getElementById("curr-note").innerText = currMicro.note;
    }

    // 5. Оновлюємо правий блок (Наступна зона)
    const nextTitleEl = document.getElementById("next-title");
    if (nextTitleEl) {
        nextTitleEl.innerText = `Наступна зона: ${nextMacro.name}`;
        document.getElementById("next-time").innerText = `${nextMacro.start} - ${nextMacro.end}`;
    }
}