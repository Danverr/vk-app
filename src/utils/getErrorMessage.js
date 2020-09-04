const getErrorMessage = (error) => {
    let text = "";
    if (error.message) text = error.message;
    if (error.error_data && error.error_data.error_reason) text = error.error_data.error_reason;

    if (text === "Network Error" || text.match(/timeout.*exceeded/) !== null) {
        text = "Проверьте интернет-подключение или повторите попытку после сброса кэша в меню сервиса";
    }

    return text;
};

export default getErrorMessage;