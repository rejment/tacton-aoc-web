import Head from 'next/head'
import { getLeaderboard } from '../lib/leaderboard'

export default function Home({leaderboard}) {
  return (
    <div>
      <Head>
        <title>Tacton AoC Web</title>
        <meta name="description" content="Tacton AoC Web" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to the Tacton AoC Web!</h1>
        Members:
        <ul>
          {Object.values(leaderboard.members)
            .filter(member => member.local_score>0)
            .sort((a,b)=>b.local_score-a.local_score)
            .map(member => (
            <li key={member.id}>{member.name} {member.local_score}p</li>
          ))}
        </ul>

      </main>

    </div>
  )
}

export async function getServerSideProps(context) {
  const leaderboard = await getLeaderboard()
  return { props: { leaderboard } }
}