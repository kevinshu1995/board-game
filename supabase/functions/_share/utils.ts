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

export const generateResponseObj = (data: any, status: number, message: string) => {
    return data === null ? { status, message } : { data, status, message };
};

export const generateResponse = (data: any, status: number, message: string) =>
    new Response(JSON.stringify(generateResponseObj(data, status, message)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status,
    });

