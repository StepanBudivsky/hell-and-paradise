export function autoSort(dots, data, isAsc = true) {
    // 1. Жорстка прив'язка хвиль до їхніх початкових значень (як ти вказав)
    const waveBinding = {
        "wawe1Data": dots[2].value,
        "wawe2Data": dots[3].value,
        "wawe3Data": dots[4].value,
        "wawe4Data": dots[5].value,
        "wawe5Data": dots[6].value // у тебе в коді 273, в описі 275 - поставив як в об'єкті
    };

    const waveKeys = Object.keys(waveBinding);

    // 2. Сортуємо ключі хвиль залежно від того, де вони зараз знаходяться (в data.wawes)
    const sortedWaveKeys = waveKeys.sort((a, b) => {
        const valA = data.wawes[a] && data.wawes[a].length > 0 
                     ? data.wawes[a][1].value 
                     : Infinity;
        const valB = data.wawes[b] && data.wawes[b].length > 0 
                     ? data.wawes[b][1].value 
                     : Infinity;
        return !isAsc ? valA - valB : valB - valA;
    });

    // Зараз sortedWaveKeys виглядає так: ["wawe2Data", "wawe3Data", "wawe1Data", ...]
    // Бо wawe2Data реально найнижча (108269.4)

    // 3. Заповнюємо точки dot3 - dot7 значеннями ПРИВ'ЯЗАНИМИ до відсортованих хвиль
    // dot3 отримає значення найнижчої хвилі, dot4 - наступної і т.д.
    const targetIds = ["dot3", "dot4", "dot5", "dot6", "dot7"];

    targetIds.forEach((dotId, index) => {
        const dot = dots.find(d => d.id === dotId);
        if (dot) {
            const waveKey = sortedWaveKeys[index]; // беремо хвилю, яка стоїть на цьому місці в черзі
            dot.value = waveBinding[waveKey];      // ставимо її "рідне" значення
        }
    });

    console.log("Оновлені dots:", dots);
    return dots;
}

// export function autoSort(dots, data) {
//     // 1. Жорстка прив'язка хвиль до їхніх початкових значень (як ти вказав)
//     const waveBinding = {
//         "wawe1Data": dots[2].value,
//         "wawe2Data": dots[3].value,
//         "wawe3Data": dots[4].value,
//         "wawe4Data": dots[5].value,
//         "wawe5Data": dots[6].value // у тебе в коді 273, в описі 275 - поставив як в об'єкті
//     };

//     const waveKeys = Object.keys(waveBinding);

//     // 2. Сортуємо ключі хвиль залежно від того, де вони зараз знаходяться (в data.wawes)
//     const sortedWaveKeys = waveKeys.sort((a, b) => {
//         const valA = data.wawes[a] && data.wawes[a].length > 0 
//                      ? data.wawes[a][data.wawes[a].length - 1].value 
//                      : Infinity;
//         const valB = data.wawes[b] && data.wawes[b].length > 0 
//                      ? data.wawes[b][data.wawes[b].length - 1].value 
//                      : Infinity;
//         return valA - valB;
//     });

//     // Зараз sortedWaveKeys виглядає так: ["wawe2Data", "wawe3Data", "wawe1Data", ...]
//     // Бо wawe2Data реально найнижча (108269.4)

//     // 3. Заповнюємо точки dot3 - dot7 значеннями ПРИВ'ЯЗАНИМИ до відсортованих хвиль
//     // dot3 отримає значення найнижчої хвилі, dot4 - наступної і т.д.
//     const targetIds = ["dot3", "dot4", "dot5", "dot6", "dot7"];

//     targetIds.forEach((dotId, index) => {
//         const dot = dots.find(d => d.id === dotId);
//         if (dot) {
//             const waveKey = sortedWaveKeys[index]; // беремо хвилю, яка стоїть на цьому місці в черзі
//             dot.value = waveBinding[waveKey];      // ставимо її "рідне" значення
//         }
//     });

//     console.log("Оновлені dots:", dots);
//     return dots;
// }

// console.log("Оновлені dots (тільки хвилі):", dots);
// const dots = [
//     {
//         "id": "dot1",
//         "value": 128,
//         "lock": false
//     },
//     {
//         "id": "dot2",
//         "value": 165,
//         "lock": false
//     },
//     {
//         "id": "dot3",
//         "value": 136,
//         "lock": false
//     },
//     {
//         "id": "dot4",
//         "value": 171,
//         "lock": false
//     },
//     {
//         "id": "dot5",
//         "value": 175,
//         "lock": false
//     },
//     {
//         "id": "dot6",
//         "value": 205,
//         "lock": false
//     },
//     {
//         "id": "dot7",
//         "value": 273,
//         "lock": false
//     },
//     {
//         "id": "dot8",
//         "value": 999,
//         "lock": false
//     }
// ]

// const data = {
//     "wawes": {
//         "wawe1Data": [
//             {
//                 "time": 1734447480,
//                 "value": 108309.4
//             },
//             {
//                 "time": 1734447540,
//                 "value": 108277.47499999999
//             },

//         ],
//         "wawe2Data": [
//             {
//                 "time": 1734447480,
//                 "value": 108309.4
//             },
//             {
//                 "time": 1734447540,
//                 "value": 108269.40465116278
//             },
//         ],
//         "wawe3Data": [
//             {
//                 "time": 1734447480,
//                 "value": 108309.4
//             },
//             {
//                 "time": 1734447540,
//                 "value": 108272.70425531914
//             },
//         ],
//         "wawe4Data": [
//             {
//                 "time": 1734447480,
//                 "value": 108309.4
//             },
//             {
//                 "time": 1734447540,
//                 "value": 108292.98311688312
//             },

//         ],
//         "wawe5Data": [
//             {
//                 "time": 1734447480,
//                 "value": 108309.4
//             },
//             {
//                 "time": 1734447540,
//                 "value": 108303.33172413793
//             },

//         ]
//     },
// }