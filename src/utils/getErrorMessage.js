const getErrorMessage = (error) => {
    let text = error.message ? error.message : error.error_data.error_msg;

    if (text === undefined || text === "Network Error" || text.match(/timeout.*exceeded/) !== null) {
        text = "Проверьте интернет-подключение или повторите попытку после сброса кэша в меню сервиса";
    }

    return text;
};

export default getErrorMessage;