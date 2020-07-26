import bridge from "@vkontakte/vk-bridge";
import api from '../utils/api';
import moment from 'moment';
import React from 'react';
import { Spinner } from '@vkontakte/vkui';

const UPLOADED_QUANTITY = 1000;
const FIRST_BLOCK_SIZE = 15;

function back(ar) {
    return ar[ar.length - 1];
};

function cmp(l, r) {
    if (moment.utc(l.date).isBefore(moment.utc(r.date))) return 1;
    if (moment.utc(r.date).isBefore(moment.utc(l.date))) return -1;
    return 0;
}

let deleteEntryFromFeedList = (entryData) => {
    entryWrapper.entries.splice(entryWrapper.entries.findIndex((e) => { return e.entryId === entryData.post.entryId }), 1);
}

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

    deleteEntryFromFeedList: deleteEntryFromFeedList,
    deleteEntryFromList: deleteEntryFromFeedList,

    editEntryFromFeedList: (entryData) => {
        if (!entryWrapper.editingEntry) {
            entryWrapper.addEntryToFeedList(entryData);
        } else {
            let entry = {};
            for (let key in entryData) {
                entry[key] = entryData[key].val;
            }
            entry.userId = entryWrapper.userInfo.id;
            entry.date = entry.date.utc().format("YYYY-MM-DD HH:mm:ss");
            entryWrapper.entries[entryWrapper.entries.findIndex((e) => { return e === entryWrapper.editingEntry.post })] = entry;
        }
        entryWrapper.editingEntry = null;
    },

    addEntryToFeedList: (entryData) => {
        let entry = {};
        for (let key in entryData) {
            entry[key] = entryData[key].val;
        }
        entry.userId = entryWrapper.userInfo.id;

        entry.date = entry.date.utc().format("YYYY-MM-DD HH:mm:ss");

        for (let key in entryWrapper.entries) {
            if (cmp(entry, entryWrapper.entries[key]) === -1) {
                entryWrapper.entries.splice(key, 0, entry);
                return;
            }
        }

        if (!entryWrapper.hasMore) {
            entryWrapper.entries.push(entry);
        } else {
            for (let key in entryWrapper.queue) {
                if (cmp(entry, entryWrapper.queue[key]) === -1) {
                    entryWrapper.queue.splice(key, 0, entry);
                    return;
                }
            }
        }
    },

    deleteEntryFromBase: (entryData) => {
        const Promise = api("DELETE", "/entries/", { entryId: entryData.post.entryId })
            .catch((error) => { entryWrapper.setErrorSnackbar(error) });
        return Promise;
    },

    fetchFriendsInfo: async () => {
        if (entryWrapper.mode === 'diary') return;

        try {
            entryWrapper.accessEntries = (await api("GET", "/statAccess", { type: 'fromId' })).data;
            entryWrapper.friends = [];
            entryWrapper.accessEntries.forEach((accessEntry) => {
                accessEntry.systemFlag = 1; entryWrapper.friends.push(accessEntry.id)
            });

            entryWrapper.friends.push(entryWrapper.userInfo.id);
            const newFriends = [];
            entryWrapper.friends.forEach((friend) => {
                if (typeof entryWrapper.usersMap[friend] === 'undefined') {
                    newFriends.push(friend);
                }
            });

            if (newFriends.length) {
                const newFriendsData = (await bridge.send("VKWebAppCallAPIMethod", {
                    method: "users.get",
                    params: {
                        access_token: entryWrapper.userToken,
                        v: "5.103",
                        user_ids: newFriends.join(","),
                        fields: "photo_50, photo_100, sex"
                    }
                })).response;
                newFriendsData.forEach((friend) => { entryWrapper.usersMap[friend.id] = friend; });
            }

        } catch (error) {
            entryWrapper.setErrorPlaceholder(error);
        }
    },

    fetchPseudoFriends: async () => {
        if (entryWrapper.mode === 'diary') return;

        try {
            entryWrapper.pseudoFriends = {};
            (await api("GET", "/statAccess", { type: 'toId' })).data.forEach((friend) => {
                entryWrapper.pseudoFriends[friend.id] = 1;
            });
        } catch (error) {
            entryWrapper.setErrorPlaceholder(error);
        }
    },

    fetchEntriesPack: async (PACK_SZ, lastDate, isFirstTime) => {
        try {
            const queryData = {
                lastDate: lastDate,
                count: PACK_SZ,
                users: (entryWrapper.mode === 'diary') ? entryWrapper.userInfo.id : entryWrapper.friends.join(',')
            };
            return await api("GET", "/entries/", queryData);
        } catch (error) {
            if (isFirstTime) {
                entryWrapper.setErrorPlaceholder(error);
            } else {
                entryWrapper.setErrorSnackbar(error);
            }
        }
    },

    fetchEntries: async (isFirstTime = null, afterPull = null) => {
        const Pop = (POP_LIMIT = 2) => {
            let cur = Math.min(POP_LIMIT, entryWrapper.queue.length);
            let obj = entryWrapper.entries.slice(0);
            for (let i = 0; i < cur;) {
                if (entryWrapper.accessEntriesPointer < entryWrapper.accessEntries.length && cmp(entryWrapper.accessEntries[entryWrapper.accessEntriesPointer], entryWrapper.queue[i]) === -1) {
                    let current = entryWrapper.accessEntries[entryWrapper.accessEntriesPointer++];
                    entryWrapper.entries.push(current);
                    obj.push(current);
                    cur--;
                    continue;
                }
                obj.push(entryWrapper.queue[i]);
                entryWrapper.entries.push(entryWrapper.queue[i]);
                i++;
            }
            entryWrapper.setDisplayEntries(obj);
            if (afterPull && entryWrapper.hasMore) {
                entryWrapper.setLoading(<Spinner size='large' />);
            }
            entryWrapper.queue.splice(0, cur);
        }

        if (isFirstTime) {
            entryWrapper.hasMore = 1;
            entryWrapper.accessEntriesPointer = 0;
            entryWrapper.wantUpdate = 0;
            entryWrapper.entries = [];
            entryWrapper.accessEntries = [];
            entryWrapper.queue = [];
            await entryWrapper.fetchFriendsInfo();
            await entryWrapper.fetchPseudoFriends();
        }

        if (entryWrapper.queue.length) { Pop(); return }

        let lastDate = (entryWrapper.entries.length) ? back(entryWrapper.entries).date :
            moment.utc().add(1, 'day').format("YYYY-MM-DD HH:MM:SS");

        try {
            const newEntries = (await entryWrapper.fetchEntriesPack(UPLOADED_QUANTITY, lastDate, isFirstTime)).data;
            entryWrapper.queue = entryWrapper.queue.concat(newEntries);
            const coming = entryWrapper.accessEntries.length - entryWrapper.accessEntriesPointer + newEntries.length;
            if (coming == 0 || (isFirstTime && coming < FIRST_BLOCK_SIZE)) {
                entryWrapper.setLoading(null);
                entryWrapper.hasMore = false;
            }
            if (!newEntries.length) {
                while (entryWrapper.accessEntriesPointer < entryWrapper.accessEntries.length) {
                    entryWrapper.queue.push(entryWrapper.accessEntries[entryWrapper.accessEntriesPointer++]);
                }
                entryWrapper.queue.sort(cmp);
            }
            if (!isFirstTime) {
                Pop();
            } else {
                Pop(FIRST_BLOCK_SIZE);
                entryWrapper.setFetching(null);
            }
        }
        catch (error) {
            if (isFirstTime) {
                entryWrapper.setErrorPlaceholder(error);
            } else {
                entryWrapper.setErrorSnackbar(error);
            }
            setTimeout(entryWrapper.fetchEntries, 10000);
        }
    },

}

export default entryWrapper;
