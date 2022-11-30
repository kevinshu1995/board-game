export type TableGame = {
    id: number;
    name_zh_tw?: string;
    min_team?: number;
    max_team?: number;
    team_count_step?: number;
    min_player?: number;
    max_player?: number;
    player_count_step?: number;
    available_round_seconds?: number[];
    unique_info?: object;
    available_to_play?: number;
    degree_of_difficulty?: number;
    game_intro_zh_tw?: string;
};

export type GameResponse = {
    game_id: number;
    name_zh_tw?: string;
    player_range?: {
        max: number | null;
        min: number | null;
        step: number | null;
    };
    team_range?: {
        max: number | null;
        min: number | null;
        step: number | null;
    };
    available_round_seconds?: number[];
    unique_info?: object;
    available_to_play?: number;
    degree_of_difficulty?: number;
    game_intro_zh_tw?: string;
};
