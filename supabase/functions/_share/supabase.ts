import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { HttpError } from "./utils.ts";

export const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

export const isValidUser = async (req: Request) => {
    const authHeader = req.headers.get("Authorization")!;
    // Get JWT from auth header
    const jwt = authHeader.replace("Bearer ", "");

    if (!jwt) {
        throw new HttpError("Token is required", 403);
    }
    // Get the user object
    const {
        data: { user },
    } = await supabaseAdmin.auth.getUser(jwt);
    if (!user) throw new HttpError("Token is inValid", 403);

    return true;
};

