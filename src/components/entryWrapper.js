import api from '../utils/api';
import moment from 'moment';
import React from 'react';
import { Spinner, Button } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge'

const UPLOADED_QUANTITY = 200;
const MAXPOP = 30;
const PIXELS = 200;

function cmp(l, r) {
    if (moment.utc(l.date).isBefore(moment.utc(r.date))) return 1;
    if (moment.utc(r.date).isBefore(moment.utc(l.date))) return -1;
    return 0;
}

let deleteEntryFromFeedList = (entryId) => {
    const id = entryWrapper.entryIndex({ entryId: entryId });
    entryWrapper.entries.splice(id, 1);

    let inTool = entryWrapper.toolTips.findIndex((e) => { return (!e.systemFlag && e.entryId === entryId) });

    if (inTool !== -1) {
        entryWrapper.toolTips.splice(inTool, 1);
        entryWrapper.t[1] = 0;
        entryWrapper.entries.forEach((entry) => {
            if (!entryWrapper.t[1] && entry.userId === entryWrapper.userInfo.id) {
                entryWrapper.t[1] = 1;
                entryWrapper.toolTips.push(entry);
                entryWrapper.toolTips.sort((left, right) => {
                    let l = entryWrapper.entryIndex(left);
                    let r = entryWrapper.entryIndex(right);
                    return (l < r) ? -1 : 1;
                })
            }
        })
    }

}

function getYcoord(id) {
    let elem = document.querySelector(`.TextPost:nth-child(${id + 1})`);
    if (!elem) return 0;
    const top = elem.getBoundingClientRect().top + window.pageYOffset;
    return top - PIXELS;
}

let names = ["", "showEntryNotifTooltip", "showAccessNotifTooltip", "showHealthNotifTooltip"];

export let entryWrapper = {
    usersMap: {},
    entries: [],
    mode: 'feed',
    hasMore: 1,
    queue: [],
    accessEntries: [],
    accessEntriesPointer: 0,
    wantUpdate: 1,
    editingEntry: null,

    entryIndex: (entry) => {
        if (entry.systemFlag) {
            return entryWrapper.entries.findIndex(e => {
                return (e.systemFlag && e.id === entry.id);
            })
        }
        return entryWrapper.entries.findIndex(e => e.entryId === entry.entryId);
    },

    /*---------ToolTips---------*/
    currentScroll: Infinity,
    toolTips: [],
    currentToolTip: -1,
    t: [0, 0, 0, 0],
    v: [0, 0, 0, 0],
    rerenderTP: {},
    rerenderAP: {},
    tQueue: [],

    setCurrentScroll: () => {
        if (entryWrapper.toolTips.length) {
            entryWrapper.currentScroll = getYcoord(entryWrapper.entryIndex(entryWrapper.toolTips[0]));
        } else {
            entryWrapper.currentScroll = Infinity;
        }
    },

    needTool: (entry) => {
        if (entry.systemFlag) {
            return (!entryWrapper.t[2] && entryWrapper.v[2]) ? 2 : null;
        }
        if (!entryWrapper.t[1] && entryWrapper.v[1] && entry.userId === entryWrapper.userInfo.id)
            return 1;
        if (!entryWrapper.t[3] && entryWrapper.v[3] && entry.userId !== entryWrapper.userInfo.id && (entry.stress > 3 || entry.anxiety > 3 || entry.mood < 3))
            return 3;
        return null;
    },

    updateTips: (entry) => {
        let f = entryWrapper.needTool(entry);
        if (!f) return;
        entryWrapper.t[f] = 1;
        entryWrapper.toolTips.push(entry);
    },

    goNextToolTip: () => {
        if (!entryWrapper.tQueue.length || entryWrapper.currentToolTip !== -1) return;

        let entry = entryWrapper.tQueue[0];
        entryWrapper.tQueue.splice(0, 1);

        let why = 1;
        if (entry.systemFlag) why = 2;
        else if (entry.userId !== entryWrapper.userInfo.id) why = 3;

        document.body.style.overflow = 'hidden';
        bridge.send("VKWebAppStorageSet", { key: names[why], value: "" + false });
        entryWrapper.v[why] = 0;

        if (entry.systemFlag) {
            entryWrapper.currentToolTip = [1, entry.id];
            entryWrapper.rerenderAP[entry.id](1);
        } else {
            entryWrapper.currentToolTip = [0, entry.entryId];
            entryWrapper.rerenderTP[entry.entryId](1);
        }
    },

    initToolTips(vkStorage) {
        for (let i = 1; i <= 3; ++i)
            entryWrapper.v[i] = vkStorage.getValue(names[i]);
    },

    /*-------------------------*/

    deleteEntryFromFeedList: deleteEntryFromFeedList,
    deleteEntryFromList: deleteEntryFromFeedList,

    getEntry: (entryData) => {
        let entry = {};
        for (let key in entryData) {
            entry[key] = entryData[key].val;
        }
        entry.userId = entryWrapper.userInfo.id;
        entry.date = entry.date.utc().format("YYYY-MM-DD HH:mm:ss");
        return entry;
    },

    editEntryFromFeedList: (entryData) => {
        let entry = entryWrapper.getEntry(entryData);
        entryWrapper.entries[entryWrapper.entries.findIndex(e => e.entryId === entry.entryId)] = entry;
    },

    addEntryToFeedList: (entryData) => {
        let entry = entryWrapper.getEntry(entryData);

        let needPush = 0;
        if (entryWrapper.needTool(entry)) needPush = 1;
        for (let i in entryWrapper.toolTips) {
            let tool = entryWrapper.toolTips[i];
            if (!tool.systemFlag && tool.userId === entryWrapper.userInfo.id) {
                needPush = 1;
                entryWrapper.toolTips.splice(i, 1);
                break;
            }
        }

        if (needPush) {
            entryWrapper.toolTips.splice(0, 0, entry);
        }

        entryWrapper.entries.splice(0, 0, entry);
    },

    deleteEntryFromBase: (entryId) => {
        return api("DELETE", "/v1.2.0/entries/", { entryId: entryId });
    },

    postEdge: async (id) => {
        const signatures = await bridge.sendPromise("VKWebAppCallAPIMethod", {
            method: "friends.areFriends",
            params: {
                need_sign: 1,
                user_ids: id,
                access_token: entryWrapper.userToken,
                v: "5.120"
            }
        });
        signatures.response.forEach(friend => friend.id = friend.user_id);
        return api("POST", "/v1.2.0/statAccess/", { users: JSON.stringify(signatures.response) });
    },

    postComplaint: (entryId) => {
        return api("POST", "/v1.2.0/complaints/", { entryId: entryId });
    },

    fetchFriendsInfo: async () => {
        if (entryWrapper.mode === 'diary') return;
        entryWrapper.accessEntries = (await api("GET", "/v1.2.0/statAccess", { type: 'fromId' })).data;

        entryWrapper.friends = [];
        entryWrapper.friends.push(entryWrapper.userInfo.id);
        entryWrapper.accessEntries.forEach((accessEntry) => {
            accessEntry.systemFlag = 1;
            entryWrapper.friends.push(accessEntry.id)
        });

        const Promise = await api("GET", "/v1.2.0/vkApi/users.get", {
            users: entryWrapper.friends.join(","),
        });

        Promise.data.forEach((friend) => {
            entryWrapper.usersMap[friend.id] = friend;
        })
    },

    fetchPseudoFriends: async () => {
        if (entryWrapper.mode === 'diary') return;

        entryWrapper.pseudoFriends = {};
        (await api("GET", "/v1.2.0/statAccess", { type: 'toId' })).data.forEach((friend) => {
            entryWrapper.pseudoFriends[friend.id] = 1;
        });
    },

    fetchEntriesPack: (PACK_SZ, beforeDate, beforeId) => {
        const queryData = {
            beforeDate: beforeDate,
            beforeId: beforeId,
            count: PACK_SZ,
            users: (entryWrapper.mode === 'diary') ? entryWrapper.userInfo.id : entryWrapper.friends.join(',')
        };
        return api("GET", "/v1.2.0/entries/", queryData);
    },

    init: async () => {
        try {
            entryWrapper.hasMore = 1;
            entryWrapper.accessEntriesPointer = 0;
            entryWrapper.entries = [];
            entryWrapper.accessEntries = [];
            entryWrapper.queue = [];
            entryWrapper.currentToolTip = -1;
            entryWrapper.toolTips = [];
            entryWrapper.tQueue = [];
            entryWrapper.t = [0, 0, 0, 0];
            entryWrapper.loading = 0;
            entryWrapper.currentScroll = Infinity;
            await entryWrapper.fetchFriendsInfo();
            await entryWrapper.fetchPseudoFriends();
            return 1;
        } catch (error) {
            entryWrapper.setDisplayEntries([]);
            entryWrapper.setLoading(<Spinner size='large' />);
            entryWrapper.setErrorPlaceholder(error);
            entryWrapper.wantUpdate = 1;
            return 0;
        }
    },

    Pop: (POP_LIMIT = MAXPOP) => {
        let cur = Math.min(POP_LIMIT, entryWrapper.queue.length);

        for (let i = 0; i < cur;) {
            if (entryWrapper.accessEntriesPointer < entryWrapper.accessEntries.length
                && cmp(entryWrapper.accessEntries[entryWrapper.accessEntriesPointer], entryWrapper.queue[i]) === -1) {
                let current = entryWrapper.accessEntries[entryWrapper.accessEntriesPointer++];
                entryWrapper.updateTips(current);
                entryWrapper.entries.push(current);
                continue;
            }

            entryWrapper.updateTips(entryWrapper.queue[i]);
            entryWrapper.entries.push(entryWrapper.queue[i]);
            i++;
        }
        entryWrapper.loading = 0;
        entryWrapper.setDisplayEntries(entryWrapper.entries.slice(0));
        if (entryWrapper.hasMore) {
            entryWrapper.setLoading(<Spinner size='small' />);
        }
        entryWrapper.queue.splice(0, cur);
    },


    fetchEntries: async (isFirstTime = null) => {

        if (isFirstTime) {
            if (!await entryWrapper.init()){ // если init зашел в catch
                return;
            }
        }

        if (entryWrapper.queue.length) { // есть что показать пользователю
            entryWrapper.Pop();
            return;
        }

        let beforeDate = moment.utc().add(1, 'day').format("YYYY-MM-DD HH:MM:SS");
        let beforeId = Infinity;

        for (let i = entryWrapper.entries.length - 1; i >= 0; --i) {
            if (entryWrapper.entries[i].systemFlag) continue;
            beforeDate = entryWrapper.entries[i].date;
            beforeId = entryWrapper.entries[i].entryId;
            break;
        }

        try {
            let newEntries = (await entryWrapper.fetchEntriesPack(UPLOADED_QUANTITY, beforeDate, beforeId)).data;
            entryWrapper.wasError = 0;
            entryWrapper.queue = entryWrapper.queue.concat(newEntries);
            const coming = entryWrapper.accessEntries.length - entryWrapper.accessEntriesPointer + newEntries.length;
            if (coming === 0 || (isFirstTime && coming < MAXPOP)) {
                entryWrapper.setLoading(null);
                entryWrapper.hasMore = false;
            }
            if (!newEntries.length || (isFirstTime && coming < MAXPOP)) {
                while (entryWrapper.accessEntriesPointer < entryWrapper.accessEntries.length) {
                    entryWrapper.queue.push(entryWrapper.accessEntries[entryWrapper.accessEntriesPointer++]);
                }
                entryWrapper.queue.sort(cmp);
            }
            entryWrapper.Pop();
            entryWrapper.setFetching(null);
        } catch (error) {
            if (isFirstTime) {
                entryWrapper.setDisplayEntries([]);
                entryWrapper.setLoading(<Spinner size='large' />);
                entryWrapper.setErrorPlaceholder(error);
                entryWrapper.wantUpdate = 1;
            } else {
                entryWrapper.wasError = 1;
                entryWrapper.setLoading(
                    <Button size="m" mode="tertiary" onClick={() => {
                        entryWrapper.setLoading(<Spinner size='large' />);
                        entryWrapper.fetchEntries();
                    }}>
                        Загрузить записи
                    </Button>
                );
            }
        }
    },
};

export default entryWrapper;
