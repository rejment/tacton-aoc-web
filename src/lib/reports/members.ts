import type { LeaderBoard } from "../../types/leaderboard";
import type { Report } from "../../types/report";
import { comparingInt } from "../comparator";
import { formatSeconds, releaseSecond } from "../time";

export function Members(leaderboard: LeaderBoard): Report {

    const dayList = Object.values(leaderboard.members).map(member => {
            return {
                name: member.name,
                score: member.local_score,
            }
        });

    dayList.sort(comparingInt(a=>-a.score));

    dayList.length = Math.min(dayList.length, 20);

    return {
        title: "Official Score",
        columns: ["Rank", "Name", "Score"],
        lines: dayList.map((day, i) => ([
            `${i + 1}`,
            day.name,
            `${day.score}`,
        ]))
    };

}
