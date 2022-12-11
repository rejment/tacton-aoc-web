import type { LeaderBoard } from "../../types/leaderboard";
import type { Report } from "../../types/report";
import { comparingInt } from "../comparator";
import { formatSeconds, releaseSecond } from "../time";

function clubName(duration, solvedAll) {
	if (duration < 60*60) {
		return "One-hour";
	} else if (duration < 2*60*60) {
		return "Breakfast (<2h)";
	} else if (duration < 6*60*60) {
		return "Morning (<6h)";
	} else if (duration < 24*60*60) {
		return "Same Day";
	} else if (solvedAll) {
		return "All Stars";
	} else {
		return "";
	} 
}
	
export function MaxTimes(leaderboard: LeaderBoard): Report {
	const days = Object.values(leaderboard.members)
		.flatMap(member => Object.entries(member.completion_day_level).map(([date, day]) => date))
		.filter( (el, i, arr) => arr.indexOf(el) === i);
		
	const now = Math.trunc(Date.now() / 1000 / 60 /60 ) * 60 * 60 ; //Rounding to nearest hour to avoid "hydration" problems ???
	
    let list = Object.values(leaderboard.members).map(member => {
    	if (Object.values(member.completion_day_level).length==0) {
    		return null;
    	}
    	const durations = days.map(date => {
    		const day = member.completion_day_level[date];
    		return (day?.["2"]?.get_star_ts??now) - releaseSecond(parseInt(leaderboard.event), parseInt(date));
        });
        const solvedAll = days.map(date => {
        	const day = member.completion_day_level[date];
        	return day?.["2"] != null;
        }).reduce((a,b) => a && b);
         
    	const maxDuration = durations.reduce((a,b)=> Math.max(a,b), 0);
        return { 
        	name: member.name,
        	duration: maxDuration,
        	club: clubName(maxDuration, solvedAll),
        	solvedAll: solvedAll
        }
    });
    
	list = list.filter(n => n != null);
	
    list.sort(comparingInt(a=>a.duration));

    list.length = Math.min(list.length, 40);

    return {
        title: "Max Time To Solve",
        columns: ["Rank", "Name", "Time", "Club", "All Stars"],
        lines: list.map((member, i) => ([
            `${i + 1}`,
            member.name,
            formatSeconds(member.duration),
            member.club,
            member.solvedAll?"*":""
        ]))
    };
}