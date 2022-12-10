import type { LeaderBoard } from "../types/leaderboard";
import type { Graph, GraphMaker } from "../types/graph";


export function getAllGraphs(leaderboard : LeaderBoard) : Graph[] {
    return graphs.map(r => r(leaderboard));
}

const graphs : GraphMaker[] = [
];

