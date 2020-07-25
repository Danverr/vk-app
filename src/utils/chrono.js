export const setf = (a) => {
    return ((a < 10) ? "0" : "") + String(a);
}

export const getDateDescription = (a, b) => {
    const monthsRu = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    if (b.diff(a, 'minutes') < 1) {
        return "только что";
    }

    if (b.diff(a, 'hours') < 1) {
        let m = b.diff(a, 'minutes', 0);
        if (11 <= m && m <= 20) {
            return m + " минут назад";
        }
        const mod = m % 10;
        if (mod === 1)
            return m + " минуту назад";
        if (1 < mod && mod < 5)
            return m + " минуты назад";
        return m + " минут назад";
    }

    let h = b.diff(a, 'hours');
    if (h <= 4) {
        const rets = ["час", "два часа", "три часа", "четыре часа"];
        return rets[h - 1] + " назад";
    }

    if (b.format("YYYY-MM-DD") === a.format("YYYY-MM-DD")) {
        return "сегодня в " + a.format("HH:mm");
    }

    if (b.add(-1, 'days').format("YYYY-MM-DD") === a.format("YYYY-MM-DD")) {
        return "вчера в " + a.format("HH:mm");
    }

    let m = Number.parseInt(a.format("MM"));
    if (b.format("YYYY") === a.format("YYYY")) {
        return a.format("D") + " " + monthsRu[m - 1] + " " + a.format("в HH:mm");
    }

    return a.format("D") + " " + monthsRu[m - 1] + " " + a.format("YYYY") + " " + a.format("в HH:mm");

}

export default getDateDescription;