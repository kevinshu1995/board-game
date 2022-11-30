import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

import { supabaseAdmin } from "../_share/supabase.ts";

import { corsHeaders, HttpError, handleUrlPattern, generateResponse } from "../_share/utils.ts";

import { TableGame, GameResponse } from "./../_share/types.ts";

async function getGames(supabaseClient: any) {
    const { data: games, error: gamesError } = await supabaseClient.from("games").select(`
    id,
    name_zh_tw,
    max_player,
    min_player,
    game_intro_zh_tw,
    degree_of_difficulty
  `);
    if (gamesError) throw gamesError;

    const formatGames: GameResponse[] = games.map((game: TableGame) => {
        return {
            game_id: game.id,
            name_zh_tw: game.name_zh_tw,
            player_range: {
                max: game.max_player,
                min: game.min_player,
            },
            game_intro_zh_tw: game.game_intro_zh_tw,
            degree_of_difficulty: game.degree_of_difficulty,
            // TODO 遊玩時間
            // play_time
        };
    });

    return generateResponse(formatGames, 200, "Get games success");
}

async function getGame(supabaseClient: any, gameId: string) {
    const { data: game, error: gamesError } = await supabaseClient
        .from("games")
        .select("*")
        .eq("id", Number(gameId));
    if (gamesError) throw gamesError;

    const theGame: TableGame = game[0];

    if (theGame === undefined) {
        return generateResponse(null, 404, "Game is not found");
    }

    const formatGame: GameResponse = {
        game_id: theGame.id,
        name_zh_tw: theGame.name_zh_tw,
        player_range: {
            max: theGame.max_player || null,
            min: theGame.min_player || null,
            step: theGame.player_count_step || null,
        },
        team_range: {
            max: theGame.max_team || null,
            min: theGame.min_team || null,
            step: theGame.team_count_step || null,
        },
        available_round_seconds: theGame.available_round_seconds,
        unique_info: theGame.unique_info,
        degree_of_difficulty: theGame.degree_of_difficulty,
        game_intro_zh_tw: theGame.game_intro_zh_tw,
    };

    return generateResponse(formatGame, 200, "Get game success");
}

serve(async req => {
    const { url, method } = req;

    console.log("request", req);

    // This is needed if you're planning to invoke your function from a browser.
    if (method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        if (method === "GET") {
            const testGetGames = handleUrlPattern(url, "/game");
            if (testGetGames !== null) {
                return getGames(supabaseAdmin);
            }

            const testGetGame = handleUrlPattern(url, "/game/:game_id");
            if (testGetGame !== null) {
                const gameId: string = testGetGame?.pathname.groups.game_id || "";
                if (gameId) {
                    return getGame(supabaseAdmin, gameId);
                }
            }
            throw new HttpError("api url is not found", 404);
        }

        throw new HttpError("method is required", 400);
    } catch (error) {
        console.error(error);

        return generateResponse(null, error.status || 400, error.message);
    }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/game' \
//   --header 'Authorization: Bearer {token}' \
//   --header 'Content-Type: application/json' \

