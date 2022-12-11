import type { LeaderBoard } from "../../types/leaderboard";
import type { Report } from "../../types/report";
import { comparingInt } from "../comparator";
import { range } from "../range";
import { releaseSecond } from "../time";

type memberMedals = {
    [name: string]: {
        name: string,
        totals: number[],
        medals: number[]
    }
}

export function Medals(leaderboard: LeaderBoard): Report {

    const memberMedals : memberMedals = {};

    // prepare structure for each member
    Object.values(leaderboard.members).forEach(member => {
        memberMedals[member.name] = { 
            name: member.name, 
            totals: [0, 0, 0], 
            medals: range(0, 25).map(i=>3)
        };
    });

    for (let d=1; d<=25; d++) {
        // get the durations for every person that got both stars
        const durations = Object.values(leaderboard.members).
            filter(member=>member.completion_day_level[d]?.[2]).
            map(member=>{
                const duration = member.completion_day_level[d]["2"].get_star_ts - releaseSecond(parseInt(leaderboard.event), d);
                return {
                    name: member.name,
                    duration
                };
            }).
            sort(comparingInt(a=>a.duration)).
            filter((a,i)=>i<3).
            forEach((medal, i) => {
                // update the member medals structure
                memberMedals[medal.name].totals[i] += 1;
                memberMedals[medal.name].medals[d] = i;
            });
    }
    // remove members without any medal and sort by gold,silver,bronze
    const toplist = Object.values(memberMedals).filter(a=>(a.totals[0]+a.totals[1]+a.totals[2])>0);
    toplist.sort(comparingInt(m => -(m.totals[0]*25*25 + m.totals[1]*25 + m.totals[2])));

    const columns : string[] = ["Name", ... range(1,25).map(i=>`${i}`), '🥇', '🥈', '🥉'];

    const lines = toplist.map(pos => (
        [pos.name, ...range(1, 25).map(d=>['🥇', '🥈', '🥉', ' '][pos.medals[d]]), ...pos.totals.map(i=>`${i}`)]
    ));

    return {
        title: "Medals",
        columns,
        lines
    };

}
