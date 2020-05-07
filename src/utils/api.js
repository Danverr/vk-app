import axios from "axios";

const instance = axios.create({
    baseURL: "https://vk-app-server/",
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
        data: method !== "GET" ? data : null,
    })
        .catch(error => {
            console.log(error.response.data)
        });
};

export default api;
