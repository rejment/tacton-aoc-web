import { PageWrapper } from '../../lib/components';
import { getLeaderboard } from '../../lib/leaderboard'
import type AOC from '../../types/leaderboard'

// this page is accessible at /2022/podium
export default function Page({leaderboard, year}) {
    
  return (
    <PageWrapper title="Podium">
        <h1>Podium for AoC {year}</h1>
        <div>some logic should go here</div>
        <div>we are currently using the cookie of user {leaderboard.members[leaderboard.owner_id].name}</div>
    </PageWrapper>
  )
}

export async function getServerSideProps(context) {
  const { year } = context.query;
  const leaderboard = await getLeaderboard(year)
  return { props: { leaderboard, year } }
}