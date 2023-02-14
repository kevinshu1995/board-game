import { rest } from "msw";

const posts = [
    {
        userId: 1,
        id: 1,
        title: "first post title",
        body: "first post body",
    },
    // ...
];

export const restHandlers = [
    rest.get("https://rest-endpoint.example/path/to/posts", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(posts));
    }),
];
