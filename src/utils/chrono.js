

export const setf = (a) => {
    return ((a < 10) ? "0" : "") + String(a);
}

export const getDateDescription = (a, b) => {
    const monthsRu = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const monthsEn = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const diff = (b - a) / 1000;
    if (diff < 60) return "только что";
    if (diff < 60 * 60) {
        const m = Math.floor(diff / 60);
        if (11 <= m && m <= 20) {
            return String(m) + " минут назад";
        }
        const mod = m % 10;
        if (mod === 1)
            return String(m) + " минуту назад";
        if (1 < mod && mod < 5)
            return String(m) + " минуты назад";
        return String(m) + " минут назад";
    }
    if (diff < 60 * 60 * 4) {
        const h = Math.floor(diff / (60 * 60));
        if (h === 1)
            return "час назад";
        if (h === 2)
            return "два часа назад";
        if (h === 3)
            return "три часа назад";
    }
    const h = a.getHours();
    const m = a.getMinutes();
    if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()) {
        return "сегодня в " + setf(h) + ":" + setf(m);
    }
    a.setDate(a.getDate() + 1);
    if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()) {
        const h = a.getHours();
        const m = a.getMinutes();
        return "вчера в " + setf(h) + ":" + setf(m);
    }
    a.setDate(a.getDate() - 1);
    const month = a.getMonth();
    const date = a.getDate();
    const year = a.getFullYear();
    if (a.getFullYear() === b.getFullYear())
        return String(date) + ' ' + monthsRu[month] + " в " + setf(h) + ":" + setf(m);
    return String(date) + ' ' + monthsRu[month] + " " + String(year) + " в " + setf(h) + ":" + setf(m);
}

