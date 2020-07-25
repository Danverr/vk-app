import emoji from "../../utils/getEmoji";

export const getValueIndex = (param, value) => {
    const buttons = questionPanelsData.find((panel) => {
        return panel.param === param;
    }).buttons;

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].value === value) return i;
    }
};

const questionPanelsData = [
    {
        param: "mood",
        question: "Как настроение?",
        buttons: [
            {text: "Великолепно", value: 5, icon: emoji.mood[4]},
            {text: "Нормально", value: 4, icon: emoji.mood[3]},
            {text: "Никак", value: 3, icon: emoji.mood[2]},
            {text: "Так себе", value: 2, icon: emoji.mood[1]},
            {text: "Ужасно", value: 1, icon: emoji.mood[0]}
        ],
    },
    {
        param: "anxiety",
        question: "Вы были тревожны?",
        buttons: [
            {text: "Я спокоен", value: 1, icon: emoji.anxiety[0]},
            {text: "Скорее нет", value: 2, icon: emoji.anxiety[1]},
            {text: "Немного", value: 3, icon: emoji.anxiety[2]},
            {text: "Скорее да", value: 4, icon: emoji.anxiety[3]},
            {text: "Я очень т-т-тревожен", value: 5, icon: emoji.anxiety[4]}
        ],
    },
    {
        param: "stress",
        question: "Вы испытывали стресс?",
        buttons: [
            {text: "Я спокоен", value: 1, icon: emoji.stress[0]},
            {text: "Скорее нет", value: 2, icon: emoji.stress[1]},
            {text: "Немного", value: 3, icon: emoji.stress[2]},
            {text: "Скорее да", value: 4, icon: emoji.stress[3]},
            {text: "Я ОЧЕНЬ ЗОЛ", value: 5, icon: emoji.stress[4]}
        ],
    }
];

export default questionPanelsData;