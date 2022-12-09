import { LeaderBoard } from "./leaderboard";

export type ReportMaker = (a: LeaderBoard) => Report;

export type Report = {
    title: string,
    columns: string[];
    lines: string[][];
}