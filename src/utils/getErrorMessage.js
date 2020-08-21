const getErrorMessage = (error) => {
    let text = error.message ? error.message : error.error_msg;

    if (text === "Network Error") {
        text = "Потеряно соединение с интернетом";
    }

    return text;
};

export default getErrorMessage;