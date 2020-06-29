
import React from 'react';
import TextPost from '../components/TextPost/TextPost.js'
import bridge from "@vkontakte/vk-bridge";
import api from '../utils/api.js'

const renderData = (post) => {
    return <TextPost postData={post} />;
}

/* методы, которые можно использовать в оболочках */

function setUserInfo(userInfo) {
    this.userInfo = userInfo;
}

function setDeleted(value) {
    this.deleted = value;
}

function setRenderedEntries(entries) {
    this.renderedEntries = entries;
}

function setMode(mode) {
    this.currentMode = mode;
}

function setNeedUpdate(value) {
    this.needUpdate = value;
}

function setUserToken(userToken) {
    this.userToken = userToken;
}

function fetchFriendsInfoPromise() {
    api("GET", "/statAccess/", { type: 'fromId' }).then((result) => {
        bridge.send("VKWebAppCallAPIMethod", {
            method: "users.get",
            params: {
                access_token: this.userToken,
                v: "5.103",
                user_ids: result.data.join(","),
                fields: "photo_50, photo_100"
            }
        }).then((result) => {
            this.friendsInfo = result.response;
            this.fetchEntries();
        });
    });
}

function fetchEntriesPromise() {
    api("GET", "/entries/", {  }).then((result) => {
        this.entries = result.data;
        this.fetchEntries();
    });
}

function fetchEntries() {
    if (!this.entries || !this.friendsInfo) return;

    const usersMap = {};
    usersMap[this.userInfo.id] = this.userInfo;

    this.friendsInfo.map((friend) => {
        usersMap[friend.id] = friend;
    });

    this.renderedEntries = [];

    this.entries.map((entry) => {
        if (this.currentMode === 'feed' || (entry.userId === this.userInfo.id)) {
            const obj = {
                post: entry,
                user: usersMap[entry.userId],
                currentUser: this.userInfo,
                states: this,
            };
            this.renderedEntries.push(obj);
        }
    });
    if (this.setFetching != null) {
        this.setFetching(0);
    }
    this.setDisplayEntries(this.getRenderedEntries());
}

/* загружает посты пользователя и его друзей (либо только юзера, если currentMode='diary') */ 
function updateState() {
    this.friendsInfo = null;
    this.entries = null;
    this.fetchFriendsInfoPromise();
    this.fetchEntriesPromise();
}

function deleteEntryFromBase(id) {
    return api("DELETE", "/entries/", { entryId: id });
}

function addEntryToBase(post) {
    return api("POST", "/entries/", {
        entries: JSON.stringify(
            [post]),
    });
}

/* добавление поста в оболочку */
function addEntryToList(post) {
    this.setDeleted(0);
    this.renderedEntries.push(post);
    this.renderedEntries.sort((left, right) => {
        const l = new Date(left.post.date);
        const r = new Date(right.post.date);
        return ((l < r) ? 1 : (l > r) ? -1 : 0);
    });
    this.setDisplayEntries(null);
    this.setDisplayEntries(this.getRenderedEntries());
}

/* удаление поста из оболочки */
function deleteEntryFromList(post) {
    this.setDeleted(1);
    this.renderedEntries.splice(this.renderedEntries.findIndex((e) => { return e === post; }), 1);
    this.setDisplayEntries(null);
    this.setDisplayEntries(this.getRenderedEntries());
}

/*  основные функции, нужные для работы оболочки  */
function init(setDeletedEntryField, setCurPopout, setDisplayEntries, userInfo, userToken, setFetching) {
    this.setDeletedEntryField = setDeletedEntryField;
    this.setCurPopout = setCurPopout;
    this.setDisplayEntries = setDisplayEntries;
    this.setUserInfo(userInfo);
    this.setUserToken(userToken);
    this.setFetching = setFetching;
}

function getRenderedEntries() {
    return this.renderedEntries.map((entry) => <TextPost key={entry.post.entryId} postData={entry} />);
}

/* возвращает объект оболочки для feed (также подходит для calendar) */
function getInstance() { 
    return  {
        currentMode: 'feed',
        needUpdate: 1,
        renderedEntries: null,
        init: init,

        getRenderedEntries: getRenderedEntries,
        setUserInfo: setUserInfo,
        setDeleted: setDeleted,
        setRenderedEntries: setRenderedEntries,
        setUserToken: setUserToken,
        setMode: setMode,
        setNeedUpdate: setNeedUpdate,
        fetchFriendsInfoPromise: fetchFriendsInfoPromise,

        updateState: updateState,
        fetchEntries: fetchEntries,
        fetchEntriesPromise: fetchEntriesPromise,

        deleteEntryFromBase: deleteEntryFromBase,
        addEntryToBase: addEntryToBase,
        addEntryToList: addEntryToList,
        deleteEntryFromList: deleteEntryFromList,
    }
}

// используемые оболочки

export const states = {
    feed: getInstance(),
    calendar: getInstance(), 
};

export default states;
