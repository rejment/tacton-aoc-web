import type {LeaderBoard} from "../../types/leaderboard";
import type {Report} from "../../types/report";
import {releaseSecond} from "../time";
import {range} from "../range";


export function CollectedStars(leaderboard: LeaderBoard): Report {
    const firstRelease = releaseSecond(parseInt(leaderboard.event), 1);

    function dayOfSecond(second) {
        return Math.trunc((second - firstRelease) / 60 / 60 / 24);
    }

    let list: number[] = range(1, 31).map(() => 0);
    Object.values(leaderboard.members).forEach(member =>
        Object.values(member.completion_day_level).forEach(day =>
            Object.values(day)
                .map(star => dayOfSecond(star.get_star_ts))
                .filter(d => d < 31)
                .forEach(d => list[d]++)
        )
    );

    list = list.filter(n => n > 0);

    return {
        title: "Collected Stars Each Day",
        columns: ["Day", "Number of Stars"],
        lines: list.map((stars, i) => ([
            `${i + 1} December ${leaderboard.event}`,
            `${stars}`
        ]))
    };
}