import { rest } from "msw";
import { baseUrl } from "./../config";

export const availableRoomId = 34;
export const availableRoomUuid = "00000000-0000-0000-0000-000000000000";

export const roomAccesses = {
    noPasswordRegistered: {
        uuid: "11111111-1111-1111-1111-111111111111",
        id: 1,
    },
    needPasswordRegistered: {
        uuid: "22222222-2222-2222-2222-222222222222",
        id: 2,
    },
    noPasswordNotRegistered: {
        uuid: "33333333-3333-3333-3333-333333333333",
        id: 3,
    },
    needPasswordNotRegistered: {
        uuid: "44444444-4444-4444-4444-444444444444",
        id: 4,
    },
};

const publicRooms = {
    200: {
        data: {
            rooms: [
                {
                    id: availableRoomId,
                    game_id: 1,
                    room_name: "許文修's room",
                    created_at: "2022-12-26T06:53:24.969032+00:00",
                    round_time: null,
                    does_guest_can_chat: false,
                    status: 2,
                    game_start_at: null,
                    game_end_at: null,
                    room_player_count_limit: 4,
                    is_private: false,
                    is_optional_game_role: false,
                    uuid: availableRoomUuid,
                    team_count: 2,
                    room_players: ["9b8763d6-54bf-41f5-a057-2902d8d5dca8"],
                    is_full: false,
                },
            ],
            query: {
                game_id: 1,
                get_mine_rooms: false,
                per_page: 8,
                page: 1,
            },
            meta: {
                total: 12,
                per_page: 8,
                page: 1,
                total_page: 2,
            },
        },
        status: 200,
        message: "success",
    },
};

const roomPlayers = {
    200: {
        data: {
            players: [
                {
                    user_id: "9b8763d6-54bf-41f5-a057-2902d8d5dca8",
                    team_turns: 0,
                    final_score: 0,
                    room_role: 1,
                    game_role: null,
                    is_winner: null,
                    is_leaving: false,
                    enter_time: "2022-12-26T06:53:25.288592+00:00",
                },
            ],
            room_id: availableRoomId,
        },
        status: 200,
        message: "success",
    },
    404: {
        status: 404,
        message: "Room is not found",
    },
};

const roomData = {
    200: {
        data: {
            room: {
                info: {
                    id: availableRoomId,
                    game_id: 1,
                    uuid: availableRoomUuid,
                    room_name: "許文修's room",
                    is_full: false,
                    status: 2,
                },
                room_settings: {
                    team_count: 2,
                    round_time: null,
                    does_guest_can_chat: false,
                    room_player_count_limit: 4,
                    is_private: false,
                    is_optional_game_role: false,
                },
                time: {
                    created_at: "2022-12-26T06:53:24.969032+00:00",
                    game_start_at: null,
                    game_end_at: null,
                },
            },
            players: [
                {
                    room_id: availableRoomId,
                    user_id: "9b8763d6-54bf-41f5-a057-2902d8d5dca8",
                    team_turns: 0,
                    final_score: 0,
                    room_role: 1,
                    game_role: null,
                    is_winner: null,
                    is_leaving: false,
                    enter_time: "2022-12-26T06:53:25.288592+00:00",
                },
            ],
            game_roles: [
                {
                    id: 2,
                    game_id: 1,
                    name_zh_tw: "幹員",
                    intro_zh_tw: "負責解析線索",
                    each_team_max_count: null,
                    each_team_min_count: 1,
                },
                {
                    id: 1,
                    game_id: 1,
                    name_zh_tw: "領袖",
                    intro_zh_tw: "負責出線索",
                    each_team_max_count: 1,
                    each_team_min_count: 1,
                },
            ],
            room_roles: [
                {
                    id: 2,
                    name_zh_tw: "房客",
                    intro_zh_tw: "能參與遊戲進行",
                },
                {
                    id: 3,
                    name_zh_tw: "觀眾",
                    intro_zh_tw: "只能觀看遊戲進行",
                },
                {
                    id: 1,
                    name_zh_tw: "房長",
                    intro_zh_tw: "可以調整房間設定，亦能參與遊戲",
                },
            ],
        },
        status: 200,
        message: "success",
    },
    404: {
        status: 404,
        message: "Room is not found",
    },
};

const roomAccess = {
    200: {
        noPasswordRegistered: {
            data: {
                room_id: roomAccesses.noPasswordRegistered.id,
                room_name: "許文修's room",
                status: 2,
                uuid: roomAccesses.noPasswordRegistered.uuid,
                is_full: false,
                user_registered: true,
                needPassword: false,
            },
            status: 200,
            message: "This room is available",
        },
        needPasswordRegistered: {
            data: {
                room_id: roomAccesses.needPasswordRegistered.id,
                room_name: "許文修's room",
                status: 2,
                uuid: roomAccesses.needPasswordRegistered.uuid,
                is_full: false,
                user_registered: true,
                needPassword: true,
            },
            status: 200,
            message: "This room need password to access",
        },
        noPasswordNotRegistered: {
            data: {
                room_id: roomAccesses.noPasswordNotRegistered.id,
                room_name: "許文修's room",
                status: 2,
                uuid: roomAccesses.noPasswordNotRegistered.uuid,
                is_full: false,
                user_registered: false,
                needPassword: false,
            },
            status: 200,
            message: "This room is available",
        },
        needPasswordNotRegistered: {
            data: {
                room_id: roomAccesses.needPasswordNotRegistered.id,
                room_name: "kevin Hsu's room",
                status: 2,
                uuid: roomAccesses.needPasswordNotRegistered.uuid,
                is_full: false,
                user_registered: false,
                needPassword: true,
            },
            status: 200,
            message: "This room need password to access",
        },
    },
    404: {
        status: 404,
        message: "Room is not found",
    },
};

export default [
    // getPublicRooms
    rest.get(`${baseUrl}/room`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(publicRooms["200"]));
    }),

    // getRoomPlayers only for room_id = availableRoomId
    rest.get(`${baseUrl}/room/:room_id/players`, (req, res, ctx) => {
        const { room_id } = req.params;
        if (room_id === String(availableRoomId)) {
            return res(ctx.status(200), ctx.json(roomPlayers["200"]));
        }
        return res(ctx.status(404), ctx.json(roomPlayers["404"]));
    }),

    // getRoomData only for room_id = availableRoomId
    rest.get(`${baseUrl}/room/:room_id`, (req, res, ctx) => {
        const { room_id } = req.params;
        if (room_id === String(availableRoomId)) {
            return res(ctx.status(200), ctx.json(roomData["200"]));
        }
        return res(ctx.status(404), ctx.json(roomData["404"]));
    }),

    // getRoomAccess
    rest.get(`${baseUrl}/room/access/:room_uuid`, (req, res, ctx) => {
        console.log("access!");
        const { room_uuid } = req.params;
        if (room_uuid === roomAccesses.noPasswordRegistered.uuid) {
            return res(ctx.status(200), ctx.json(roomAccess["200"].noPasswordRegistered));
        }
        if (room_uuid === roomAccesses.needPasswordRegistered.uuid) {
            return res(ctx.status(200), ctx.json(roomAccess["200"].needPasswordRegistered));
        }
        if (room_uuid === roomAccesses.noPasswordNotRegistered.uuid) {
            return res(ctx.status(200), ctx.json(roomAccess["200"].noPasswordNotRegistered));
        }
        if (room_uuid === roomAccesses.needPasswordNotRegistered.uuid) {
            return res(ctx.status(200), ctx.json(roomAccess["200"].needPasswordNotRegistered));
        }
        return res(ctx.status(404), ctx.json(roomAccess["404"]));
    }),
];

