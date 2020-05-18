import mood1 from "../../assets/emoji/mood/mood1.png";
import mood2 from "../../assets/emoji/mood/mood2.png";
import mood3 from "../../assets/emoji/mood/mood3.png";
import mood4 from "../../assets/emoji/mood/mood4.png";
import mood5 from "../../assets/emoji/mood/mood5.png";

import anxiety1 from "../../assets/emoji/anxiety/anxiety1.png";
import anxiety2 from "../../assets/emoji/anxiety/anxiety2.png";
import anxiety3 from "../../assets/emoji/anxiety/anxiety3.png";
import anxiety4 from "../../assets/emoji/anxiety/anxiety4.png";
import anxiety5 from "../../assets/emoji/anxiety/anxiety5.png";

import stress1 from "../../assets/emoji/stress/stress1.png";
import stress2 from "../../assets/emoji/stress/stress2.png";
import stress3 from "../../assets/emoji/stress/stress3.png";
import stress4 from "../../assets/emoji/stress/stress4.png";
import stress5 from "../../assets/emoji/stress/stress5.png";

const testPanelsData = [
    {
        name: "mood",
        question: "Какое у вас настроение?",
        buttons: [
            {text: "Ужасно", img: mood1},
            {text: "Так себе", img: mood2},
            {text: "Никак", img: mood3},
            {text: "Нормально", img: mood4},
            {text: "Великолепно", img: mood5}
        ],
    },
    {
        name: "anxiety",
        question: "Вы чувствовали тревожность?",
        buttons: [
            {text: "Я спокоен", img: anxiety1},
            {text: "Скорее нет", img: anxiety2},
            {text: "Немного", img: anxiety3},
            {text: "Скорее да", img: anxiety4},
            {text: "Я очень т-т-тревожен", img: anxiety5}
        ],
    },
    {
        name: "stress",
        question: "Вы испытывали стресс за день?",
        buttons: [
            {text: "Я спокоен", img: stress1},
            {text: "Скорее нет", img: stress2},
            {text: "Немного", img: stress3},
            {text: "Скорее да", img: stress4},
            {text: "Я ОЧЕНЬ ЗОЛ", img: stress5}
        ],
    },
];

export default testPanelsData;