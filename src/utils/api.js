import axios from "axios";

export default axios.create({
    baseURL: "https://vk-app-server/",
    responseType: "json",
});