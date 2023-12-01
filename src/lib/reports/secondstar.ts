import type { LeaderBoard } from "../../types/leaderboard";
import type { Report } from "../../types/report";
import { comparingInt } from "../comparator";
import { formatSeconds } from "../time";

export function SecondStar(leaderboard: LeaderBoard): Report {

    const dayList = Object.values(leaderboard.members).flatMap(member => 
        Object.entries(member.completion_day_level).flatMap(([date, day]) => {
            const duration = (day["2"]?.get_star_ts??0) - (day["1"].get_star_ts);
            return {
                name: member.name,
                title: `Day ${date} part B`,
                duration,
                durationText: formatSeconds(duration),
            }
        })).filter(a => a.duration > 0);

    dayList.sort(comparingInt(a=>a.duration));

    dayList.length = Math.min(dayList.length, 20);

    return {
        title: "Top 20 fastest part B (all days)",
        columns: ["Rank", "Name", "Title", "Time"],
        lines: dayList.map((day, i) => ([
            `${i + 1}`,
            day.name,
            day.title,
            day.durationText,
        ]))
    };

}
