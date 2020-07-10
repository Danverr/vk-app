import axios from "axios";
import qs from "qs";

const instance = axios.create({
    baseURL: "https://vk-app-server.herokuapp.com/",
    responseType: "json",
    timeout: 10 * 1000,
    headers: {
        "X-VK-SIGN": window.location.search,
    },
});

const api = async (method, url, data) => {
    method = method.toUpperCase();

    return await instance({
        method: method,
        url: url,
        params: method === "GET" ? data : null,
        data: method !== "GET" ? qs.stringify(data) : null,
    })
        .catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.error(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }

            throw error;
        });
};

export default api;