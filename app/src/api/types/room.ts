export enum RoomStatus {
    None, // 被放棄的房間
    processing = 0,
    complete = 1,
    waiting = 2,
}

export enum RoomStatusZhTw {
    None, // 被放棄的房間
    processing = "進行中",
    complete = "已結束",
    waiting = "等待中",
}

export enum RoomPlayerRole {
    chief = 1,
    player,
    audience,
}

export type CreateRoom = {
    game_id: number;
    team_count: number;
    player_count_max: number | null;
    round_seconds?: number | null;
    room_name?: string;
    does_guest_can_chat?: boolean;
    password?: string | null;
    is_private?: boolean;
    is_optional_game_role?: boolean;
};

// TODO room
// export type Room = {}

export type RoomListBody = {
    game_id?: number | null;
    status?: RoomStatus.processing | RoomStatus.waiting | RoomStatus.complete | null; // 要哪種狀態的房間, 沒給就是不篩選
    is_full?: boolean | null; // 要哪種狀態的房間，沒給就是不篩選
    has_password?: boolean | null; // 要哪種狀態的房間，沒給就是不篩選
    per_page?: number | null;
    page?: number;
    keyword?: string | null; // 搜尋房間標題用
    get_mine_rooms?: boolean; // 是否只取得使用者自己的房間
};

export type DeletePlayerBody = {
    room_id: number | null;
    player_id: string | null;
};

