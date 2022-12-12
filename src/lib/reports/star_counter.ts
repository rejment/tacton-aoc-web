import type {LeaderBoard} from "../../types/leaderboard";
import type {Report} from "../../types/report";
import {range} from "../range";

const pattern = [
    "..................................................",
    "########..#####...#####..########..#####..##....##",
    "########.#######.#######.########.#######.###...##",
    "...##....##...##.##...##....##....##...##.####..##",
    "...##....#######.##.........##....##...##.#####.##",
    "...##....#######.##.........##....##...##.##.#####",
    "...##....##...##.##...##....##....##...##.##..####",
    "...##....##...##.#######....##....#######.##...###",
    "...##....##...##..#####.....##.....#####..##....##",
    "..................................................",
    "......#######........................#######......",
    ".....#########......................###...###.....",
    "....###.....###....................###.....###....",
    "....##.......##........####........##.......##....",
    "....##.......##.......######.......##.......##....",
    "....###########......##....##......##.............",
    "....###########......##....##......##.............",
    "....##.......##......##....##......##.......##....",
    "....##.......##......##....##......##.......##....",
    "....##.......##......##....##......###.....###....",
    "....##.......##.......######........###...###.....",
    "....##.......##........####..........#######......",
    "..................................................",
];

export function StarCounter(leaderboard: LeaderBoard): Report {

    const starCounts = range(1, 50).map(i => 0);

    Object.values(leaderboard.members).forEach(member => {
        Object.entries(member.completion_day_level).forEach(([date, day]) => {
            const dateI = parseInt(date);
            const star1 = (dateI - 1) * 2;
            const star2 = (dateI * 2) - 1;
            starCounts[star1]++;
            if (day["2"] != null) starCounts[star2]++;
        });
    });

    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSTUVWXYZ";

    function pseudoRandChar(a, b, c) {
        return chars.at((a * 31 + b * 17 + c * 9) % 57 % chars.length);
    }

    const lines = pattern.map((line, index) => [starCounts.map((num, index2) => (num > index ? line.at(index2) : pseudoRandChar(index, index2, num))).join("").replaceAll(".", "\u00A0")]);

    return {
        title: "Star Collector",
        columns: [""],
        lines: lines,
    };
}