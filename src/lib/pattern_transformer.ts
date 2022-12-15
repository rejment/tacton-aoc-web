import type {LeaderBoard} from "../types/leaderboard";
import {range} from "./range";

export function getTransformedPattern(leaderboard: LeaderBoard, pattern: String) {

    const starCounts = range(1, 50).map(i => 0);

    let totalStars = Object.values(leaderboard.members).map(member => member.stars).reduce((a,b) => a + b, 0);

    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTSTUVWXYZ";

    function pseudoRandChar(a, b, c = 0) {
        return chars.at((a * 31 + b * 17 + c * 9) % 57 % chars.length);
    }

    //Currently, the art is revealed row per row.
    //TODO: Find a way to reveal the art in a nicer, like from the middle first, or from the edges first.
    return Array.from(pattern)
        .map((char, index) =>
            (char==="\n" || totalStars > index ? char : pseudoRandChar(index, totalStars))).join("").replaceAll(" ", "\u00A0");

}