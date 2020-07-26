import bridge from "@vkontakte/vk-bridge";
import api from '../utils/api';
import moment from 'moment';
import React from 'react';
import { Spinner, Placeholder, Button } from '@vkontakte/vkui';

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
        const cmp = e => { return e.entryId === entry.entryId };
        entryWrapper.entries[entryWrapper.entries.findIndex(cmp)] = entry;
    },

    addEntryToFeedList: (entryData) => {
        entryWrapper.entries.splice(0, 0, entryWrapper.getEntry(entryData));
    },

    deleteEntryFromBase: (entryData) => {
        return api("DELETE", "/entries/", { entryId: entryData.post.entryId });
    },

    postEdge: (id) => {
        return api("POST", "/statAccess/", { toId: id });
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
            entryWrapper.wantUpdate = 1;
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
            entryWrapper.wantUpdate = 1;
        }
    },

    fetchEntriesPack: (PACK_SZ, lastDate) => {
        const queryData = {
            lastDate: lastDate,
            count: PACK_SZ,
            users: (entryWrapper.mode === 'diary') ? entryWrapper.userInfo.id : entryWrapper.friends.join(',')
        };
        return api("GET", "/entries/", queryData);
    },

    fetchEntries: async (isFirstTime = null) => {
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
            if (entryWrapper.hasMore) {
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
            entryWrapper.wasError = 0;
            entryWrapper.queue = entryWrapper.queue.concat(newEntries);
            const coming = entryWrapper.accessEntries.length - entryWrapper.accessEntriesPointer + newEntries.length;
            if (coming === 0 || (isFirstTime && coming < FIRST_BLOCK_SIZE)) {
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
                entryWrapper.setDisplayEntries([]);
                entryWrapper.setErrorPlaceholder(error);
                entryWrapper.wantUpdate = 1;
            }
            else {
                entryWrapper.wasError = 1;
                entryWrapper.setLoading(<Placeholder
                    header="Упс, что-то пошло не так!"
                    action={<Button size="xl" onClick={() => {
                        entryWrapper.setLoading(<Spinner size='large' />);
                        setTimeout(entryWrapper.fetchEntries, 1000);
                    }}> Попробовать снова </Button>}
                >
                </Placeholder>);
            }
        }
    },

}

export default entryWrapper;
