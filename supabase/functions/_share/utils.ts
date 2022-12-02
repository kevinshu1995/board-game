import { validate, firstMessages } from "https://deno.land/x/validasaur/mod.ts";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

export class HttpError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);

        this.name = "httpError";
        this.status = status;
    }
}

export function handleUrlPattern(targetUrl: string, url: string = "") {
    const taskPattern = new URLPattern({ pathname: url });
    return taskPattern.exec(targetUrl);
}

interface QueryType {
    [key: string]: string;
}
export function parseUrlQuery(url: string): QueryType | null {
    const { search } = new URLPattern(url);
    if (search === "") {
        return null;
    }
    return search.split("&").reduce((query: object, curr: string) => {
        const [key, value] = curr.split("=");
        return {
            ...query,
            [key]: value,
        };
    }, {});
}

export const generateResponseObj = (data: any, status: number, message: string) => {
    return data === null ? { status, message } : { data, status, message };
};

export const generateResponse = (data: any, status: number, message: string) =>
    new Response(JSON.stringify(generateResponseObj(data, status, message)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status,
    });

type ValidateBody = (
    body: object,
    rules: object
) => Promise<[passes: boolean, errors: object, errorCb: () => void]>;

export const validateBody: ValidateBody = async (body, rules) => {
    const [passes, errors] = await validate(body, { ...rules });

    function errorCb() {
        if (passes === false) {
            const errorMsg = Object.values(firstMessages(errors)).join(", ");
            return generateResponse(null, 400, `Bad Request - ${errorMsg}`);
        }
    }

    return [passes, errors, errorCb];
};

