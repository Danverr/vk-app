import React from "react";
import moment from "moment";
import DatePicker from "react-mobile-datepicker";
import {PopoutWrapper} from "@vkontakte/vkui";

const callPicker = (type, startDate, maxDate, setPopout, callback, ...callbackArgs) => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    let dateConfig = {
        'year': {format: 'YYYY', caption: 'Год', step: 1},
        'month': {format: date => months[date.getMonth()], caption: 'Месяц', step: 1},
        'date': {format: 'D', caption: 'День', step: 1}
    };
    let formatDate = (date) => {
        const now = moment();
        return moment(date).hour(now.hour()).minute(now.minute()).second(now.second());
    };

    let timeConfig = {
        'hour': {format: 'hh', caption: 'Час', step: 1},
        'minute': {format: 'mm', caption: 'Мин', step: 1}
    };

    let config = dateConfig;
    if (type === "time") config = timeConfig;

    setPopout(
        <PopoutWrapper alignY="center" alignX="center">
            <DatePicker
                dateConfig={config}
                value={startDate}
                max={type === "date" ? maxDate : new Date(2050, 0, 1)}
                isOpen={true}
                confirmText={"ОК"}
                cancelText={"Отмена"}
                showHeader={false}
                onCancel={() => setPopout(null)}
                onSelect={(res) => {
                    res = moment(res);
                    if (type === "date") res = formatDate(res);

                    callback(res, ...callbackArgs);
                    setPopout(null);
                }}
            />
        </PopoutWrapper>
    );
};

export default callPicker;