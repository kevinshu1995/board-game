import { rest } from "msw";
import { baseUrl } from "./../config";

const setupNewRoomRooms = {
    "200": {
        pass: true,
        error: "",
        response: {
            status: 200,
            data: {
                // TODO data
                players: [],
                room: {},
            },
        },
    },
    "400": {
        pass: false,
        error: "badRequest",
        response: {
            status: 400,
            message: "Bad Request - body is invalid",
        },
    },
};

const registerNewPlayerRooms = {
    ...setupNewRoomRooms,
    "423": {
        pass: false,
        error: "isFull",
        response: {
            status: 423,
            message: "this room is full",
        },
    },
    "403": {
        pass: false,
        error: "wrongPassword",
        response: {
            status: 403,
            message: "room's password is wrong",
        },
    },
    "404": {
        pass: false,
        error: "notFound",

        response: {
            status: 404,
            message: "Room is not found",
        },
    },
    "422": {
        pass: false,
        error: "notWaiting",
        response: {
            status: 422,
            message: "this room is not in waiting",
        },
    },
    "409": {
        pass: false,
        error: "registered",
        response: {
            status: 409,
            message: "this player has already registered to this room",
        },
    },
};

function registerNewPlayer(req, res, ctx, targetRoom) {
    const { room_id } = req.params;
    const theRoom = targetRoom[room_id as string];
    if (theRoom === undefined) {
        return res(ctx.status(404), ctx.json(targetRoom[4].response));
    }
    return res(ctx.status(theRoom.response.status), ctx.json(theRoom.response));
}

export default [
    // setupNewRoom
    rest.post(`${baseUrl}/room`, (req, res, ctx) => {
        return registerNewPlayer(req, res, ctx, setupNewRoomRooms);
    }),

    // registerNewPlayer
    rest.post(`${baseUrl}/room/:room_id/player`, async (req, res, ctx) => {
        return registerNewPlayer(req, res, ctx, registerNewPlayerRooms);
    }),
];

