import Head from 'next/head'
import type AOC from "../types/leaderboard"
import { getLeaderboard } from '../lib/leaderboard'
import { getAllReports } from '../lib/reports'

export default function Home({leaderboard}) {
  const reports = getAllReports(leaderboard);
  return (
    <div>
      <Head>
        <title>Tacton AoC Web</title>
        <meta name="description" content="Tacton AoC Web" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to the Tacton AoC Web!</h1>

        { reports.map(report => (
            <>
              {report.title}
              <table>
              <thead>
                  <tr>
                    {report.columns.map(col => (<th key={col}>{col}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {report.lines.map(line=>(
                    <tr key={line.join("-")}>
                    {line.map(cell => (<td key={cell}>{cell}</td>))}
                  </tr>
                  ))}
                </tbody>
              </table>
            </>
        ))}

      </main>

    </div>
  )
}

export async function getServerSideProps(context) {
  const leaderboard = await getLeaderboard()
  return { props: { leaderboard } }
}