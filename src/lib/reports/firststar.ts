import type { LeaderBoard } from "../../types/leaderboard";
import type { Report } from "../../types/report";
import { formatSeconds, releaseSecond } from "../time";

export function FirstStar(leaderboard: LeaderBoard): Report {

    const dayList = Object.values(leaderboard.members).flatMap(member => 
        Object.entries(member.completion_day_level).flatMap(([date, day]) => {
            const duration = day[1].get_star_ts - releaseSecond(parseInt(leaderboard.event), parseInt(date));
            return {
                name: member.name,
                title: `Day ${date} part A`,
                duration,
            }
        }));

    dayList.sort((a, b) => a.duration - b.duration);

    dayList.length = Math.min(dayList.length, 20);

    return {
        title: "Top 20 fastest part A (all days)",
        columns: ["Rank", "Name", "Title", "Time"],
        lines: dayList.map((day, i) => ([
            `${i + 1}`,
            day.name,
            day.title,
            formatSeconds(day.duration)
        ]))
    };

}
