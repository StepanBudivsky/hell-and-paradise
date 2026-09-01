import { checkClass } from "../control.js";

let totalLong = document.getElementById("global-total-long");
let totalShort = document.getElementById("global-total-short"); 
let totalSumWeight = document.getElementById("global-total-sum");
let confidenceElement = document.getElementById("global-confidence-element");

let totalLong1m = document.getElementById("total-long-1m");
let totalShort1m = document.getElementById("total-short-1m"); 
let confidence1m = document.getElementById("confidence-1m");

let totalLong5m = document.getElementById("total-long-5m");
let totalShort5m = document.getElementById("total-short-5m"); 
let confidence5m = document.getElementById("confidence-5m");

let totalLong15m = document.getElementById("total-long-15m");
let totalShort15m = document.getElementById("total-short-15m"); 
let confidence15m = document.getElementById("confidence-15m");

let totalLong30m = document.getElementById("total-long-30m");
let totalShort30m = document.getElementById("total-short-30m"); 
let confidence30m = document.getElementById("confidence-30m");

let totalLong1h = document.getElementById("total-long-1h");
let totalShort1h = document.getElementById("total-short-1h"); 
let confidence1h = document.getElementById("confidence-1h");

const statusAnalazeBtn1m = document.querySelector("#statusAnalazeBtn1m");
const statusAnalazeBtn5m = document.querySelector("#statusAnalazeBtn5m");
const statusAnalazeBtn15m = document.querySelector("#statusAnalazeBtn15m");
const statusAnalazeBtn30m = document.querySelector("#statusAnalazeBtn30m");
const statusAnalazeBtn1h = document.querySelector("#statusAnalazeBtn1h");

export function getSummaryResult(data) {
    const totalLongResult = data["1m"].longSum * Number(!checkClass(statusAnalazeBtn1m)) 
    + data["5m"].longSum  * Number(!checkClass(statusAnalazeBtn5m)) 
    + data["15m"].longSum * Number(!checkClass(statusAnalazeBtn15m)) 
    + data["30m"].longSum * Number(!checkClass(statusAnalazeBtn30m)) 
    + data["1h"].longSum  * Number(!checkClass(statusAnalazeBtn1h));

    const totalShortResult = data["1m"].shortSum * Number(!checkClass(statusAnalazeBtn1m)) 
    + data["5m"].shortSum  * Number(!checkClass(statusAnalazeBtn5m))
    + data["15m"].shortSum * Number(!checkClass(statusAnalazeBtn15m)) 
    + data["30m"].shortSum * Number(!checkClass(statusAnalazeBtn30m)) 
    + data["1h"].shortSum  * Number(!checkClass(statusAnalazeBtn1h));

    // 3. Загальна вага по модулю
    let absoluteTotal = Math.abs(totalLongResult) + Math.abs(totalShortResult);

    // 4. Твоя логіка відсотків LONG/SHORT (частка від загального)
    let longPercent = 0;
    let shortPercent = 0;
    if (absoluteTotal > 0) {
        longPercent = (Math.abs(totalLongResult) / absoluteTotal) * 100;
        shortPercent = (Math.abs(totalShortResult) / absoluteTotal) * 100;
    }

    // 5. Розрахунок Впевненості (Confidence) [cite: 9, 19]
    let side = Math.abs(totalLongResult) >= Math.abs(totalShortResult) ? "LONG" : "SHORT";
    let confidence = 0;
    if (absoluteTotal > 0) {
        // Формула: |сила_лонг - сила_шорт| / (сума) [cite: 19]
        let difference = Math.abs(Math.abs(totalLongResult) - Math.abs(totalShortResult));
        confidence = (difference / absoluteTotal) * 100;
    }
    
    let totalSum = totalLongResult + totalShortResult;


    totalLong.innerHTML = `Сума ваг &nbsp;<b>LONG: ${totalLongResult.toFixed(2)} (${longPercent.toFixed(1)}%)</b>&nbsp`;
    totalLong.style.backgroundColor = "#72da85";

    totalShort.innerHTML = `Сума ваг  &nbsp;<b>SHORT: ${totalShortResult.toFixed(2)} (${shortPercent.toFixed(1)}%)</b>&nbsp;`;
    totalShort.style.backgroundColor = "#ec6b6b";

    totalSumWeight.innerHTML = `Загальна вага ринку: &nbsp;<b>${totalSum.toFixed(2)}</b>&nbsp;.`;
    
    confidenceElement.innerHTML = `Впевненість у &nbsp;<b> ${side}: ${confidence.toFixed(1)}%</b>&nbsp`;
    confidenceElement.style.backgroundColor = side === "LONG" ? "#72da85" : "#ec6b6b";



    totalLong1m.innerHTML = `LONG: ${data["1m"].longSum.toFixed(2)} (${data["1m"].longPercent.toFixed(1)}%)</b>&nbsp`;
    totalShort1m.innerHTML = `SHORT: ${data["1m"].shortSum.toFixed(2)} (${data["1m"].shortPercent.toFixed(1)}%)</b>&nbsp;`;
    confidence1m.innerHTML = `1m Впевненість у &nbsp;<b> ${data["1m"].side}: ${data["1m"].confidence.toFixed(1)}%</b>&nbsp`;
    confidence1m.style.backgroundColor = data["1m"].side === "LONG" ? "#72da85" : "#ec6b6b";

    totalLong5m.innerHTML = `LONG: ${data["5m"].longSum.toFixed(2)} (${data["5m"].longPercent.toFixed(1)}%)</b>&nbsp`;
    totalShort5m.innerHTML = `SHORT: ${data["5m"].shortSum.toFixed(2)} (${data["5m"].shortPercent.toFixed(1)}%)</b>&nbsp;`;
    confidence5m.innerHTML = `5m Впевненість у &nbsp;<b> ${data["5m"].side}: ${data["5m"].confidence.toFixed(1)}%</b>&nbsp`;
    confidence5m.style.backgroundColor = data["5m"].side === "LONG" ? "#72da85" : "#ec6b6b";

    totalLong15m.innerHTML = `LONG: ${data["15m"].longSum.toFixed(2)} (${data["15m"].longPercent.toFixed(1)}%)</b>&nbsp`;
    totalShort15m.innerHTML = `SHORT: ${data["15m"].shortSum.toFixed(2)} (${data["15m"].shortPercent.toFixed(1)}%)</b>&nbsp;`;
    confidence15m.innerHTML = `15m Впевненість у &nbsp;<b> ${data["15m"].side}: ${data["15m"].confidence.toFixed(1)}%</b>&nbsp`;
    confidence15m.style.backgroundColor = data["15m"].side === "LONG" ? "#72da85" : "#ec6b6b";

    totalLong30m.innerHTML = `LONG: ${data["30m"].longSum.toFixed(2)} (${data["30m"].longPercent.toFixed(1)}%)</b>&nbsp`;
    totalShort30m.innerHTML = `SHORT: ${data["30m"].shortSum.toFixed(2)} (${data["30m"].shortPercent.toFixed(1)}%)</b>&nbsp;`;
    confidence30m.innerHTML = `30m Впевненість у &nbsp;<b> ${data["30m"].side}: ${data["30m"].confidence.toFixed(1)}%</b>&nbsp`;
    confidence30m.style.backgroundColor = data["30m"].side === "LONG" ? "#72da85" : "#ec6b6b";

    totalLong1h.innerHTML = `LONG: ${data["1h"].longSum.toFixed(2)} (${data["1h"].longPercent.toFixed(1)}%)</b>&nbsp`;
    totalShort1h.innerHTML = `SHORT: ${data["1h"].shortSum.toFixed(2)} (${data["1h"].shortPercent.toFixed(1)}%)</b>&nbsp;`;
    confidence1h.innerHTML = `1h Впевненість у &nbsp;<b> ${data["1h"].side}: ${data["1h"].confidence.toFixed(1)}%</b>&nbsp`;
    confidence1h.style.backgroundColor = data["1h"].side === "LONG" ? "#72da85" : "#ec6b6b";
}