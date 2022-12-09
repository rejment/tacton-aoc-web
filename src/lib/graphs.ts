import type { LeaderBoard } from "../types/leaderboard";
import type { Graph, GraphMaker } from "../types/graph";
import { ScoreGraph } from "./graphs/scoregraph";

export function getAllGraphs(leaderboard : LeaderBoard) : Report[] {
    return graphs.map(r => r(leaderboard));
}

const graphs : GraphMaker[] = [
    ScoreGraph
];

