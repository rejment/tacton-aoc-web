import type { LeaderBoard } from "../types/leaderboard";
import type { Report, ReportMaker } from "../types/report";
import { FirstStar } from "./reports/firststar";
import { Members } from "./reports/members";
import { SecondStar } from "./reports/secondstar";

export function getAllReports(leaderboard : LeaderBoard) : Report[] {
    return reports.map(r => r(leaderboard));
}

const reports : ReportMaker[] = [
    Members,
    FirstStar,
    SecondStar,
];

