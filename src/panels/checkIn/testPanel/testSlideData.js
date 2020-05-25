import mood1 from "../../../assets/emoji/mood/mood1.png";
import mood2 from "../../../assets/emoji/mood/mood2.png";
import mood3 from "../../../assets/emoji/mood/mood3.png";
import mood4 from "../../../assets/emoji/mood/mood4.png";
import mood5 from "../../../assets/emoji/mood/mood5.png";

import anxiety1 from "../../../assets/emoji/anxiety/anxiety1.png";
import anxiety2 from "../../../assets/emoji/anxiety/anxiety2.png";
import anxiety3 from "../../../assets/emoji/anxiety/anxiety3.png";
import anxiety4 from "../../../assets/emoji/anxiety/anxiety4.png";
import anxiety5 from "../../../assets/emoji/anxiety/anxiety5.png";

import stress1 from "../../../assets/emoji/stress/stress1.png";
import stress2 from "../../../assets/emoji/stress/stress2.png";
import stress3 from "../../../assets/emoji/stress/stress3.png";
import stress4 from "../../../assets/emoji/stress/stress4.png";
import stress5 from "../../../assets/emoji/stress/stress5.png";

const testSlideData = [
    {
        name: "mood",
        question: "Как у вас настроение?",
        buttons: [
            {text: "Великолепно", value: 5, img: mood5},
            {text: "Нормально", value: 4, img: mood4},
            {text: "Никак", value: 3, img: mood3},
            {text: "Так себе", value: 2, img: mood2},
            {text: "Ужасно", value: 1, img: mood1}
        ],
    },
    {
        name: "anxiety",
        question: "Вы чувствовали тревожность?",
        buttons: [
            {text: "Я спокоен", value: 1, img: anxiety1},
            {text: "Скорее нет", value: 2, img: anxiety2},
            {text: "Немного", value: 3, img: anxiety3},
            {text: "Скорее да", value: 4, img: anxiety4},
            {text: "Я очень т-т-тревожен", value: 5, img: anxiety5}
        ],
    },
    {
        name: "stress",
        question: "Вы испытывали стресс за день?",
        buttons: [
            {text: "Я спокоен", value: 1, img: stress1},
            {text: "Скорее нет", value: 2, img: stress2},
            {text: "Немного", value: 3, img: stress3},
            {text: "Скорее да", value: 4, img: stress4},
            {text: "Я ОЧЕНЬ ЗОЛ", value: 5, img: stress5}
        ],
    },
];

export default testSlideData;