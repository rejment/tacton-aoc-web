
// Type definitions for the JSON files from the leaderboard API as of Dec 9, 2022

export type LeaderBoard = {
    members: {
        [id: string]: Member
    };
    event: string;
    owner_id: number;
}


export type Member = {
    name: string;
    last_star_ts: number;
    stars: number;
    id: number;
    global_score: number;
    local_score: number;
    completion_day_level: { 
        [id:string]: Day 
    }
}

export type Day = {
    "1": Star;
    "2"?: Star;
}

export type Star = {
    get_star_ts: number;
    star_index: number;
}
