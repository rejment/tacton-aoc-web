import type { LeaderBoard } from "../types/leaderboard";
import type { Graph, GraphMaker } from "../types/graph";
import { ScoreGraph } from "./graphs/scoregraph";


export function getAllGraphs(leaderboard : LeaderBoard) : Graph[] {
    return graphs.map(r => r());
}

const graphs : GraphMaker[] = [
    ScoreGraph
];

