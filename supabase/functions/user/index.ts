// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_share/cors.ts";

console.log(`Function "browser-with-cors" up and running!`);

serve(async req => {
    // This is needed if you're planning to invoke your function from a browser.
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { name } = await req.json();
        const data = {
            message: `Hello ${name}!`,
        };

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/user' \
//   --header 'Authorization: Bearer {token}' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"test"}'

