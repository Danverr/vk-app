const getErrorMessage = (error) => {
    let text = error.message ? error.message : error.error_msg;

    if (text === "Network Error" || text.match(/timeout.*exceeded/) !== null) {
        text = "Проверьте интернет-подключение или повторите попытку позже";
    }

    return text;
};

export default getErrorMessage;