// db
export type TablePlayer = {
    room_id: number;
    user_id: number | null;
    team_turns: number;
    final_score: number;
    room_role: number;
    game_role: number | null;
    is_winner: boolean | null;
    is_leaving: boolean;
    enter_time: number; // timestamp
};

