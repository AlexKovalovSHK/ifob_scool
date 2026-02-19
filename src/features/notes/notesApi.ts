import $api from "../auth/api";
import { getToken } from "../auth/utils";
import { NoteListContent } from "./noteTypes";


export const getSongsData = async (query: string, page: number, size: number) => {
    if (query.trim() === "") {
        const data = await fetchSongList(page, size);
        return {
            songs: data.content || [],
            totalPages: data.totalPages || 0
        };
    } else {
        const data = await searchSongs(query, page, size);
        return {
            songs: Array.isArray(data) ? data.map((item: any) => item.song) : [],
            totalPages: 1 // Поиск не дает пагинации в этом API
        };
    }
};

export async function fetchSongList(page: number = 0, size: number = 50): Promise<NoteListContent> {
    const res = await $api.get<NoteListContent>(
        `/api/songs-proxy`, // Относительный путь! Vite проксирует его на localhost:5002/api/songs-proxy
        {
            params: { page, size }, // Правильная передача query-параметров в axios
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            // withCredentials: true, // Нужно только если вы используете Cookies/Sessions
        }
    );
    return res.data;
}

export async function searchSongs(name: string, page: number = 0, size: number = 50): Promise<NoteListContent> {
    const res = await $api.get<NoteListContent>(
        `/api/songs-find`, 
        {
            params: { name, page, size }
        }
    );
    return res.data;
}