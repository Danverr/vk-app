
import React from 'react';
import TextPost from '../components/TextPost/TextPost.js'
import bridge from "@vkontakte/vk-bridge";
import api from '../utils/api.js'
import moment from 'moment';
import ErrorPlaceholder from '../components/errorPlaceholder/errorPlaceholder.js';

import { Spinner } from '@vkontakte/vkui';

/* методы, которые можно использовать в оболочках */

function Error(error) {
    this.setError(error);
}

function fetchFriendsInfoPromise() {
    if (this.mode !== 'feed') {
        this.friendsInfo = [];
        this.friendsInfo.push(this.userInfo);
        this.fetchEntries();
        return;
    }
    const Promise = api("GET", "/statAccess/", { type: 'fromId' });
    Promise.then((result) => {
        const InfoPromise = bridge.send("VKWebAppCallAPIMethod", {
            method: "users.get",
            params: {
                access_token: this.userToken,
                v: "5.103",
                user_ids: result.data.join(","),
                fields: "photo_50, photo_100"
            }
        });
        InfoPromise.then((result) => {
            this.friendsInfo = result.response;
            this.friendsInfo.push(this.userInfo);
            this.fetchEntries();
        });
        InfoPromise.catch((error) => { this.Error(error); });
    });
    Promise.catch((error) => { this.Error(error); });
}

function fetchEntriesPromise() {
    const Promise = ((this.mode === 'feed') ? api("GET", "/entries/", {}) : api("GET", "/entries/", { users: this.userInfo.id }));
    Promise.then((result) => {
        this.entries = result.data;
        this.fetchEntries();
    });
    Promise.catch((error) => { this.Error(error); });
}

function setEntries(outside = null, entries = null) {
    if (outside) {
        this.entriesList = entries;
    }
    const temp = this.getRenderedEntries();
    this.renderedEntries = temp;
    this.setDisplayEntries(temp);
}

function calendarStateUpdate() {
    const temp = {};
    this.entries.forEach((entry) => {
        let date = moment.utc(entry.date);
        let now = date.local().format("YYYY-MM-DD");

        if (temp[now] == null) temp[now] = [entry];
        else temp[now] = [...temp[now], entry];
    });
    this.entriesOfDate = temp;

    let stats = {};

    for (let day in temp) {
        let mood = 0, stress = 0, anxiety = 0;

        temp[day].forEach((entry) => {
            mood += entry.mood;
            stress += entry.stress;
            anxiety += entry.anxiety;
        });

        mood /= temp[day].length;
        stress /= temp[day].length;
        anxiety /= temp[day].length;
        mood = Math.floor(mood + 0.5);
        stress = Math.floor(stress + 0.5);
        anxiety = Math.floor(anxiety + 0.5);
        stats[day] = { mood: mood, stress: stress, anxiety: anxiety };
    }
    this.userStats = stats;
    this.setUserStats(stats);
}

function fetchEntries() {
    if (!this.entries || !this.friendsInfo) return;

    const usersMap = {};

    this.friendsInfo.map((friend) => {
        usersMap[friend.id] = friend;
    });

    this.entriesList = [];

    this.entries.forEach((entry) => {
        const obj = {
            post: entry,
            user: usersMap[entry.userId],
            currentUser: this.userInfo,
            states: this,
        };
        this.entriesList.push(obj);
    });

    if (this.mode === 'calendar') {
        this.calendarStateUpdate();
    }

    if (this.setFetching != null) {
        this.setFetching(0);
    }

    if (this.mode !== 'calendar') {
        this.setEntries();
    }
}

/* загружает посты пользователя и его друзей (либо только юзера, если mode === 'diary') */
function updateState() {
    this.friendsInfo = null;
    this.entries = null;
    this.fetchFriendsInfoPromise();
    this.fetchEntriesPromise();
}

function deleteEntryFromBase(id) {
    return api("DELETE", "/entries/", { entryId: id });
}

/* удаление поста из оболочки */
function deleteEntryFromList(post) {
    this.entriesList.splice(this.entriesList.findIndex((e) => { return e === post; }), 1);
    this.entries.splice(this.entries.findIndex((e) => { return e === post.post }), 1);
    this.setEntries();
    if (this.mode === 'calendar') {
        this.calendarStateUpdate();
    }
}

function getRenderedEntries() {
    if (!this.entriesList) {
        return null;
    }
    return this.entriesList.map((entry) => <TextPost key={entry.post.entryId} postData={entry} />);
}

/* возвращает объект оболочки с нужным mode */
function getInstance(needMode) {
    return {
        mode: needMode,
        entriesList: null,

        renderedEntries: <Spinner size="large" style={{ marginTop: 20 }} />,

        getRenderedEntries: getRenderedEntries,
        setEntries: setEntries,

        fetchFriendsInfoPromise: fetchFriendsInfoPromise,
        updateState: updateState,
        fetchEntries: fetchEntries,
        fetchEntriesPromise: fetchEntriesPromise,

        deleteEntryFromBase: deleteEntryFromBase,
        deleteEntryFromList: deleteEntryFromList,

        calendarStateUpdate: calendarStateUpdate,
        Error: Error,
    }
}

// используемые оболочки

export const states = {
    feed: getInstance('feed'),
    calendar: getInstance('calendar'),
};

export default states;