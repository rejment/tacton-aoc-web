import type {LeaderBoard} from "../../types/leaderboard";
import type {Graph} from "../../types/graph";

const hexColors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#808080', '#ffffff']


function getFinisherResults(members: any) {
    let star_1 = {};
    let star_2 = {};
    const memberIds = Object.keys(members);
    for (let id of memberIds) {
        let member = members[id];
        for (let day = 1; day <= 25; day++) {
            let day_entry = member.completion_day_level[day];
            if (day_entry && day_entry["1"] ) {
                if (!star_1[day]) star_1[day] = {};
                star_1[day][day_entry["1"].get_star_ts] = id;
            }
            if (day_entry && day_entry["2"] ) {
                if (!star_2[day]) star_2[day] = {};
                star_2[day][day_entry["2"].get_star_ts] = id;
            }
        }
    }
    return {
        star_1,
        star_2,
        maxScore: memberIds.length
    }
}

function createPointsList(finisherResults: any) {
    let pointsList = [];

    for (let day = 1; day <= 25; day++) {
        let day_entries_star_1 = finisherResults.star_1[day];
        if (!day_entries_star_1) break;
        let timestamps = Object.keys(day_entries_star_1);
        timestamps = timestamps.sort((a: any, b: any) => (a - b));

        let points = finisherResults.maxScore;
        for (let timestamp of timestamps) {
            let userId = day_entries_star_1[timestamp];
            pointsList.push({
                userId: userId,
                points: points,
                timestamp: timestamp,
                stars: day * 2 - 1
            });
            points--;
        }

        let day_entries_star_2 = finisherResults.star_2[day];
        timestamps = Object.keys(day_entries_star_2 || {});
        timestamps = timestamps.sort((a: any, b: any) => (a - b));

        points = finisherResults.maxScore;
        for (let timestamp of timestamps) {
            let userId = day_entries_star_2[timestamp];
            pointsList.push({
                userId: userId,
                points: points,
                timestamp: timestamp,
                stars: day * 2
            });
            points--;
        }
    }

    return pointsList
}

function addUserEntry(userLines: any, entry: any, startTimeStamp: number) {
    if (!userLines[entry.userId]) {
        userLines[entry.userId] = {
            points: 0,
            line: []
        };
    }
    let x = (entry.timestamp - startTimeStamp) / 3600;
    userLines[entry.userId].line.push({x: x, y: userLines[entry.userId].points});    
    userLines[entry.userId].points += entry.points;
    userLines[entry.userId].line.push({x: x, y: userLines[entry.userId].points});
}

function createUserLines(pointsList: any, startTimeStamp: number) {
    let userLines = {};
    for (let entry of pointsList) {
        addUserEntry(userLines, entry, startTimeStamp);
        const userIds = Object.keys(userLines);
        for (let id of userIds) {
            if (id == entry.userId) continue;
            addUserEntry(userLines, {
                userId: id,
                points: 0,
                timestamp: entry.timestamp,
                stars: entry.stars
            }, startTimeStamp)
        }
    }
    return userLines
}

function getSortedUserIds(userLines: any) {
    let userIds = Object.keys(userLines);
    return userIds.sort((a, b) => (userLines[b].points - userLines[a].points));    
}

function drawLines(ctx: any, userIds: any, userLines: any) {   
    if (!userLines[userIds[0]]) return;
    const maxPoints = userLines[userIds[0]].points    
    const pxPerPoint = 3800 / maxPoints

    let i = 0;
    for (let id of userIds) {
        const userColorHex = hexColors[i++ % hexColors.length]

        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = userColorHex;
        ctx.moveTo(2, 3900);
        let linePoints = userLines[id].line;
        for (let p of linePoints) {
            ctx.lineTo((50 + p.x * 10), (3900 - p.y * pxPerPoint));
        }
        ctx.stroke();
    }
}

function drawUserNames(ctx: any, userIds: any, userLines: any, members: any) {
    let i = 0;
    for (let id of userIds) {
        ctx.fillStyle = hexColors[i % hexColors.length];
        ctx.textAlign = 'left';
        ctx.font = (50) + 'pt Arial'

        let name = members[id].name;
        if (!name) name = "- anonymous user -";
        ctx.fillText(userLines[id].points + " : " + name, 100 , (100 + (i * 85)))
        i++;
    }
}

export function ScoreGraph(): Graph {

    const render = (canvas: any, leaderboard: LeaderBoard) => {
        const year = leaderboard.event
        const startTimeStamp = Math.floor(Date.parse('01 Dec ' + year + ' 05:00:00 GMT') / 1000);

        const finisherResults = getFinisherResults(leaderboard.members)
        let pointsList = createPointsList(finisherResults)
        pointsList = pointsList.sort((a, b) => (a.timestamp - b.timestamp));
        const userLines = createUserLines(pointsList, startTimeStamp)
        const userIds = getSortedUserIds(userLines)

        const scale = 2;
        const width = 700 * scale;
        const height = 400 * scale;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#111'
        ctx.fillRect(0, 0, width, height)
        ctx.scale(scale/10,scale/10);
    
        drawLines(ctx, userIds, userLines)
        drawUserNames(ctx, userIds, userLines, leaderboard.members)
    };
    return {
        title: "Score/Time graph of all members",
        render
    };

}