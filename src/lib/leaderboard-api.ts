import type AOC from "../types/leaderboard"

const CACHE_TIMEOUT = 1000*60*15 // 15 minutes

export async function getLeaderboard(year: string): Promise<AOC.LeaderBoard> {
    const now = Date.now()

    // keep a global set of caches, one per year
    if (!global.leaderboardCache) {
        global.leaderboardCache = {}
    }

    const caches = global.leaderboardCache
    if (!caches[year]) {
        caches[year] = {};
    }
    const cache = caches[year];

    const month = new Date(now).getUTCMonth();
    const hour = new Date(now).getUTCHours();
    let cache_timeout = CACHE_TIMEOUT;
    if (month == 11 && hour == 5) {
        cache_timeout = 1000*60*15; // 1 minute
    }    

    if (cache.data && ((now-cache.timestamp)<cache_timeout)) {
        return cache.data
    }

    const res = await fetch(`https://adventofcode.com/${year}/leaderboard/private/view/31339.json`,{
        headers: {
            cookie: "session=" + process.env.AOC_SESSION
        }
    })
    const data = await res.json()

  
    cache.timestamp = now
    cache.data = data

    return data
  }

