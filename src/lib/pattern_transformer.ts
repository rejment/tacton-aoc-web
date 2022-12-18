import type {LeaderBoard} from "../types/leaderboard";
import {range} from "./range";

export function getTransformedPattern(leaderboard: LeaderBoard, pattern: string) {

    type Point = [number, number];

    let totalStars = Object.values(leaderboard.members).map(member => member.stars).reduce((a, b) => a + b, 0);

    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSTUVWXYZ";

    function pseudoRandChar(a, b, c = 0) {
        return chars.at((a * 31 + b * 17 + c * 9) % 57 % chars.length);
    }

    const lines = pattern.split("\n");
    const mid : Point = [lines.length / 2, lines.map(l => l.length).reduce((a, b) => Math.max(a, b), 0) / 2];

    function dist([x0, y0], [x1, y1]) {
        //return 3*Math.abs(x0-x1) + Math.abs(y0-y1); //This gives a diamond/losange shape
        return Math.max(3 * Math.abs(x0 - x1), Math.abs(y0 - y1)); //This gives a rectangle shape
        //return Math.sqrt(5* (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)); //This gives a round/oval shape
    }

    const coordinates = lines.flatMap((line, i) => Array.from(line).map((c, j) => [i, j])) as Point[];
    coordinates.sort((a, b) => dist(a, mid) - dist(b, mid));
    coordinates.length = Math.min(coordinates.length, totalStars);
    const revealed = lines.map(line => Array.from(line).map(c => false));
    for (let [x, y] of coordinates) {
        revealed[x][y] = true;
    }

    const remaining = lines.map(l => l.length).reduce((a, b) => a + b, 0) - totalStars;

    return {
        pattern: lines.map((line, i) =>
            Array.from(line).map((c, j) =>
                revealed[i][j] ? c : pseudoRandChar(i, j, totalStars)
            ).join("").replaceAll(" ", "\u00A0")
        ).join("\n"),
        remaining
    };
}