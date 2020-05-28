import React, {useState, useEffect} from 'react';
import api from "./api";

const useUserEntries = (usersInfo) => {
    let [userEntries, setUserEntries] = useState(null);

    // Загрузка записей пользователя
    useEffect(() => {
        const fetchEntries = async () => {
            if (!usersInfo) return;

            const entriesPromise = await api("GET", "/entries/", {
                userId: usersInfo[0].id,
            });

            setUserEntries(entriesPromise.data);
        };

        fetchEntries();
    }, [usersInfo]);

    return userEntries;
};

export default useUserEntries;