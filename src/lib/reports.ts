import type { LeaderBoard } from "../types/leaderboard";
import type { Report, ReportMaker } from "../types/report";
import { FirstStar } from "./reports/firststar";
import { Medals } from "./reports/medals";
import { Members } from "./reports/members";
import { SecondStar } from "./reports/secondstar";
import { MaxTimes } from "./reports/maxtimes";
import {CollectedStars} from "./reports/totalcollectedstars";
import {MostStarsPerDay} from "./reports/moststarsperday";

export function getAllReports(leaderboard : LeaderBoard) : Report[] {
    return reports.map(r => r(leaderboard));
}

const reports : ReportMaker[] = [
    Medals,
    Members,
    FirstStar,
    SecondStar,
    MaxTimes,
    CollectedStars,
    MostStarsPerDay,
];

