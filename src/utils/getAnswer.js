import {getValueIndex} from "../panels/checkIn/questionPanelsData";
import moment from "moment";

const getAnswer = (data = null) => {
    let answer = {
        entryId: {val: null},
        mood: {val: null, index: null},
        stress: {val: null, index: null},
        anxiety: {val: null, index: null},
        title: {val: ""},
        note: {val: ""},
        isPublic: {val: 0},
        date: {val: moment()}
    };

    if (data) {
        for (const key in answer) {
            if (!data[key]) continue;

            answer[key].val = data[key];
            if (answer[key].index !== undefined) answer[key].index = getValueIndex(key, data[key]);
        }
    }

    return answer;
};

export default getAnswer;