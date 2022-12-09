import type AOC from "../types/leaderboard"

const CACHE_TIMEOUT = 1000*60*10 // 10 minutes

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

    if (cache.data && ((now-cache.timestamp)<CACHE_TIMEOUT)) {
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

