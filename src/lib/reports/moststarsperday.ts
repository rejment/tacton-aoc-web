import type {LeaderBoard} from "../../types/leaderboard";
import type {Report} from "../../types/report";
import {comparingInt} from "../comparator";
import {releaseSecond} from "../time";
import {range} from "../range";


export function MostStarsPerDay(leaderboard: LeaderBoard): Report {
    const firstRelease = releaseSecond(parseInt(leaderboard.event), 1);

    function dayOfSecond(second) {
        return Math.trunc((second - firstRelease) / 60 / 60 / 24);
    }

    let allList = Object.values(leaderboard.members).flatMap(member => {
        let list: number[] = range(1, 31).map(() => 0);
        Object.values(member.completion_day_level).forEach(day =>
            Object.values(day)
                .map(star => dayOfSecond(star.get_star_ts))
                .filter(d => d < 31)
                .forEach(d => list[d]++)
        )
        return list.map((stars, i) => {
            return {day: i + 1, member: member.name, stars: stars};
        });
    });

    allList = allList.filter(el => el.stars > 2); //Not interested in only 2 stars per day

    allList.sort(comparingInt(d => -1000 * d.stars + d.day));

    allList.length = Math.min(allList.length, 20);

    return {
        title: "Most Collected Stars in a Day",
        columns: ["Rank", "Name", "Day", "Number of Stars"],
        lines: allList.map((element, i) => ([
            `${i}`,
            element.member,
            `${element.day} December ${leaderboard.event}`,
            `${element.stars}`
        ]))
    };
}