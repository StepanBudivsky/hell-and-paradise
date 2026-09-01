import { checkClass } from "../control.js";

const wawe1AutoLen = document.querySelector("#wawe1AutoLen");
const wawe2AutoLen = document.querySelector("#wawe2AutoLen");
const wawe3AutoLen = document.querySelector("#wawe3AutoLen");
const wawe4AutoLen = document.querySelector("#wawe4AutoLen");
const wawe5AutoLen = document.querySelector("#wawe5AutoLen");

const wawe1AutoVis = document.querySelector("#wawe1AutoVis");
const wawe2AutoVis = document.querySelector("#wawe2AutoVis");
const wawe3AutoVis = document.querySelector("#wawe3AutoVis");
const wawe4AutoVis = document.querySelector("#wawe4AutoVis");
const wawe5AutoVis = document.querySelector("#wawe5AutoVis");

export function autoPlacement(start, dots, data, zigzag){
    const dot1 = Number(dots[start].value);
    let nearest = null;
    let nearestIndex = -1;
    let minDiff = Infinity;

    for (let i = 0; i < zigzag.length; i++) {
        const val = Number(zigzag[i]);
        if (!isFinite(val)) continue; // пропускаємо нечислові значення

        const diff = Math.abs(val - dot1);
        if (diff < minDiff) {
            minDiff = diff;
            nearest = val;
            nearestIndex = i;
        }
    }

    const gaps = [
        Number(wawe1AutoLen?.value) || 0,
        Number(wawe2AutoLen?.value) || 0,
        Number(wawe3AutoLen?.value) || 0,
        Number(wawe4AutoLen?.value) || 0,
        Number(wawe5AutoLen?.value) || 0,
    ];

    if(checkClass(wawe1AutoVis) && nearestIndex + gaps[0] <= zigzag.length - 1) {
        dots[2].value = zigzag[nearestIndex + gaps[0]];
    }
    else {
        dots[2].value = data.length - 1;
    }

    if(checkClass(wawe2AutoVis) && nearestIndex + gaps[0] + gaps[1] <= zigzag.length - 1) {
        dots[3].value = zigzag[nearestIndex + gaps[0] + gaps[1]];
    }
    else {
        dots[3].value = data.length - 1;
    }

    if(checkClass(wawe3AutoVis) && nearestIndex + gaps[0] + gaps[1] + gaps[2] <= zigzag.length - 1) {
        dots[4].value = zigzag[nearestIndex + gaps[0] + gaps[1] + gaps[2]];
    }
    else {
        dots[4].value = data.length - 1;
    }

    if(checkClass(wawe4AutoVis) && nearestIndex + gaps[0] + gaps[1] + gaps[2] + gaps[3] <= zigzag.length - 1) {
        dots[5].value = zigzag[nearestIndex + gaps[0] + gaps[1] + gaps[2] + gaps[3]];
    }
    else {
        dots[5].value = data.length - 1;
    }

    if(checkClass(wawe5AutoVis) && nearestIndex + gaps[0] + gaps[1] + gaps[2] + gaps[3] + gaps[4] <= zigzag.length - 1) {
        dots[6].value = zigzag[nearestIndex + gaps[0] + gaps[1] + gaps[2] + gaps[3] + gaps[4]];
    }
    else {
        dots[6].value = data.length - 1;
    }
    console.log(dots);
}