import api from '../utils/api';
import moment from 'moment';
import React from 'react';
import {Spinner, Button} from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge'

const UPLOADED_QUANTITY = 200;
const FIRST_BLOCK_SIZE = 25;

function back(ar) {
    return ar[ar.length - 1];
};

function cmp(l, r) {
    if (moment.utc(l.date).isBefore(moment.utc(r.date))) return 1;
    if (moment.utc(r.date).isBefore(moment.utc(l.date))) return -1;
    return 0;
}

let deleteEntryFromFeedList = (entryId) => {
    entryWrapper.entries.splice(entryWrapper.entries.findIndex(e => e.entryId === entryId), 1);
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

    /*---------ToolTips---------*/
    toolTips: [],
    currentToolTip: -1,
    t: [0, 0, 0, 0],
    v: [0, 0, 0, 0],
    rerenderTP: {},
    rerenderAP: {},
    tQueue: [],

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

    updateTips: (entries) => {
        for (let entry of entries) {
            let f = entryWrapper.needTool(entry);
            if (f) {
                entryWrapper.t[f] = 1;
                entryWrapper.toolTips.push(entry);
            }
        }
    },

    goNextToolTip: () => {
        if (!entryWrapper.tQueue.length || entryWrapper.currentToolTip !== -1) return;

        entryWrapper.tQueue.sort();
        let entry = entryWrapper.entries[entryWrapper.tQueue[0]];
        entryWrapper.tQueue.splice(0, 1);

        document.body.style.overflow = 'hidden';
        let why = 1;
        if (entry.systemFlag) why = 2;
        else if (entry.userId !== entryWrapper.userInfo.id) why = 3;

        bridge.send("VKWebAppStorageSet", {key: names[why], value: "" + false});
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
        return api("DELETE", "/v1.1/entries/", {entryId: entryId});
    },

    postEdge: (id) => {
        return api("POST", "/v1.1/statAccess/", {toId: id});
    },

    postComplaint: (entryId) => {
        return api("POST", "/v1.1/complaints/", {entryId: entryId});
    },

    fetchFriendsInfo: async () => {
        if (entryWrapper.mode === 'diary') return;

        try {
            entryWrapper.accessEntries = (await api("GET", "/v1.1/statAccess", {type: 'fromId'})).data;

            entryWrapper.friends = [];
            entryWrapper.accessEntries.forEach((accessEntry) => {
                accessEntry.systemFlag = 1;
                entryWrapper.friends.push(accessEntry.id)
            });

            entryWrapper.friends.push(entryWrapper.userInfo.id);
            const newFriends = [];
            entryWrapper.friends.forEach((friend) => {
                if (typeof entryWrapper.usersMap[friend] === 'undefined') {
                    newFriends.push(friend);
                }
            });


            if (newFriends.length) {
                const Promise = await api("GET", "/v1.1/vkApi/", {
                    method: "users.get",
                    params: {
                        user_ids: newFriends.join(","),
                        fields: "photo_50, photo_100, sex"
                    }
                });

                if (Promise.data.error) throw Promise.data.error;

                Promise.data.response.forEach((friend) => {
                    entryWrapper.usersMap[friend.id] = friend;
                });
            }

        } catch (error) {
            entryWrapper.wantUpdate = 1;
            entryWrapper.setErrorPlaceholder(error);
        }
    },

    fetchPseudoFriends: async () => {
        if (entryWrapper.mode === 'diary') return;

        try {
            entryWrapper.pseudoFriends = {};
            (await api("GET", "/v1.1/statAccess", {type: 'toId'})).data.forEach((friend) => {
                entryWrapper.pseudoFriends[friend.id] = 1;
            });
        } catch (error) {
            entryWrapper.setErrorPlaceholder(error);
            entryWrapper.wantUpdate = 1;
        }
    },

    fetchEntriesPack: (PACK_SZ, beforeDate, beforeId) => {
        const queryData = {
            beforeDate: beforeDate,
            beforeId: beforeId,
            count: PACK_SZ,
            users: (entryWrapper.mode === 'diary') ? entryWrapper.userInfo.id : entryWrapper.friends.join(',')
        };
        return api("GET", "/v1.1/entries/", queryData);
    },

    init: async () => {
        entryWrapper.hasMore = 1;
        entryWrapper.accessEntriesPointer = 0;
        entryWrapper.wantUpdate = 0;
        entryWrapper.entries = [];
        entryWrapper.accessEntries = [];
        entryWrapper.queue = [];
        entryWrapper.currentToolTip = -1;
        entryWrapper.toolTips = [];
        entryWrapper.tQueue = [];
        entryWrapper.t = [0, 0, 0, 0];
        await entryWrapper.fetchFriendsInfo();
        await entryWrapper.fetchPseudoFriends();
        entryWrapper.updateTips(entryWrapper.accessEntries);
    },

    Pop: (POP_LIMIT = 25, isFirstTime) => {
        let cur = Math.min(POP_LIMIT, entryWrapper.queue.length);

        const WIDTH = document.documentElement.clientWidth - 64;
        const HEIGHT_STR = 20;
        const HEIGHT = document.documentElement.clientHeight;

        function getHeight(entry) {
            if (entry.systemFlag) {
                return 160;
            }
            let ret = 180;
            ret += (Math.ceil(entry.note.length / WIDTH)) * HEIGHT_STR;
            return ret;
        }

        let sumHeights = 0;

        for (let i = 0; i < cur;) {
            if (isFirstTime) {
                if (sumHeights > HEIGHT) {
                    cur = i;
                    break;
                }
            } else {
                if (entryWrapper.entries.length) {
                    const lEntry = back(entryWrapper.entries);
                    const isEqual = (a) => {
                        if (lEntry.systemFlag ^ a.systemFlag) return 0;
                        if (lEntry.systemFlag) return lEntry.id === a.id;
                        return lEntry.entryId === a.entryId;
                    }
                    if (entryWrapper.toolTips.findIndex(isEqual) !== -1) {
                        cur = i;
                        break;
                    }
                }
            }

            if (entryWrapper.accessEntriesPointer < entryWrapper.accessEntries.length
                && cmp(entryWrapper.accessEntries[entryWrapper.accessEntriesPointer], entryWrapper.queue[i]) === -1) {
                let current = entryWrapper.accessEntries[entryWrapper.accessEntriesPointer++];
                entryWrapper.entries.push(current);
                sumHeights += getHeight(current);
                continue;
            }

            sumHeights += getHeight(entryWrapper.queue[i]);
            entryWrapper.entries.push(entryWrapper.queue[i]);
            i++;
        }
        entryWrapper.loading = 0;
        entryWrapper.setDisplayEntries(entryWrapper.entries.slice(0));
        if (entryWrapper.hasMore) {
            entryWrapper.setLoading(<Spinner size='small'/>);
        }
        entryWrapper.queue.splice(0, cur);
    },


    fetchEntries: async (isFirstTime = null) => {

        if (isFirstTime) {
            await entryWrapper.init();
        }

        if (entryWrapper.queue.length) {
            entryWrapper.Pop();
            return;
        }

        let beforeDate = (entryWrapper.entries.length) ? back(entryWrapper.entries).date :
            moment.utc().add(1, 'day').format("YYYY-MM-DD HH:MM:SS");

        let beforeId = (entryWrapper.entries.length) ? back(entryWrapper.entries).entryId : Infinity;

        try {
            let newEntries = (await entryWrapper.fetchEntriesPack(UPLOADED_QUANTITY, beforeDate, beforeId)).data;
            entryWrapper.updateTips(newEntries);
            entryWrapper.wasError = 0;
            entryWrapper.queue = entryWrapper.queue.concat(newEntries);
            const coming = entryWrapper.accessEntries.length - entryWrapper.accessEntriesPointer + newEntries.length;
            if (coming === 0 || (isFirstTime && coming < FIRST_BLOCK_SIZE)) {
                entryWrapper.setLoading(null);
                entryWrapper.hasMore = false;
            }
            if (!newEntries.length || (isFirstTime && coming < FIRST_BLOCK_SIZE)) {
                while (entryWrapper.accessEntriesPointer < entryWrapper.accessEntries.length) {
                    entryWrapper.queue.push(entryWrapper.accessEntries[entryWrapper.accessEntriesPointer++]);
                }
                entryWrapper.queue.sort(cmp);
            }
            if (!isFirstTime) {
                entryWrapper.Pop();
            } else {
                entryWrapper.Pop(FIRST_BLOCK_SIZE, 1);
                entryWrapper.setFetching(null);
            }
        } catch (error) {
            if (isFirstTime) {
                entryWrapper.setDisplayEntries([]);
                entryWrapper.setErrorPlaceholder(error);
                entryWrapper.wantUpdate = 1;
            } else {
                entryWrapper.wasError = 1;
                entryWrapper.setLoading(
                    <Button size="m" mode="tertiary" onClick={() => {
                        entryWrapper.setLoading(<Spinner size='small'/>);
                        entryWrapper.fetchEntries();
                    }}>
                        Попробовать снова
                    </Button>
                );
            }
        }
    },
};

export default entryWrapper;
