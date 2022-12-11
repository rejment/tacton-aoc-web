import { LeaderBoard } from "./leaderboard";

export type GraphMaker = () => Graph;

export type Graph = {
    title: string,
    render: (canvas:any, leaderboard: LeaderBoard) => void
}