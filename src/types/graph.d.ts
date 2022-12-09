import { LeaderBoard } from "./leaderboard";

export type GraphMaker = (a: LeaderBoard) => Graph;

export type Graph = {
    title: string,
    dataurl: string
}