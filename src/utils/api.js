import axios from "axios";
import qs from "qs";

const instance = axios.create({
    baseURL: "https://vk-app-server.herokuapp.com/",
    responseType: "json",
    timeout: 10000,
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
            if (error.response) console.error(error.response.data);
            else console.error(error);
        });
};

export default api;