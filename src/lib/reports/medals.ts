import type { LeaderBoard } from "../../types/leaderboard";
import type { Report } from "../../types/report";
import { comparingInt } from "../comparator";
import { releaseSecond } from "../time";

type medalCounts = {
    0: number,
    1: number,
    2: number
}

type memberMedals = {
    [name: string]: {
        name: string,
        totals: medalCounts,
        medals: medalCounts[]
    }
}

const medalCounts : medalCounts = {
    0: 0,
    1: 0,
    2: 0
}

export function Medals(leaderboard: LeaderBoard): Report {

    const memberMedals : memberMedals = {};

    // prepare structure for each member
    Object.values(leaderboard.members).forEach(member => {
        const medals = [null];
        for (let d=1; d<=25; d++) medals.push({...medalCounts});
        memberMedals[member.name] = { 
            name: member.name, 
            totals: {... medalCounts}, 
            medals: medals
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
            filter((a,i)=>i<=3).
            forEach((medal, i) => {
                // update the member medals structure
                memberMedals[medal.name].totals[i] += 1;
                memberMedals[medal.name].medals[d][i] = 1;
            });
    }
    // remove members without any medal and sort by gold,silver,bronze
    const toplist = Object.values(memberMedals).filter(a=>(a.totals[0]+a.totals[1]+a.totals[2])>0);
    toplist.sort(comparingInt(m => -(m.totals[0]*25*25 + m.totals[1]*25 + m.totals[2])));

    const lines = toplist.map(pos => {
        const line = [pos.name];
        for (let d=1; d<=25; d++) {
            let sym = '';
            if (pos.medals[d][0]==1) {
                sym = '🥇';
            } else if (pos.medals[d][1]==1) {
                sym = '🥈';
            } else if (pos.medals[d][2]==1) {
                sym = '🥉';
            }
            line.push(sym);
        }
        line.push(`${pos.totals[0]}`);
        line.push(`${pos.totals[1]}`);
        line.push(`${pos.totals[2]}`);
       return line; 
    });

    const columns : string[] = ["Name"];
    for (let d=1; d<=25; d++) columns.push(`${d}`);
    columns.push('🥇', '🥈', '🥉');

    return {
        title: "Medals",
        columns: columns,
        lines
    };

}
