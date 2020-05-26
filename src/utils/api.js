import axios from "axios";
<<<<<<< HEAD
=======
import qs from "qs";
>>>>>>> chart

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
<<<<<<< HEAD
        data: method !== "GET" ? data : null,
    })
        .catch(error => {
            console.log(error.response.data)
=======
        data: method !== "GET" ? qs.stringify(data) : null,
    })
        .catch(error => {
            if (error.response) console.log(error.response.data);
            else console.log(error);
>>>>>>> chart
        });
};

export default api;
