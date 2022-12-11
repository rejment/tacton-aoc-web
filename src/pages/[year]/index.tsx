import { Canvas, PageWrapper } from '../../lib/components';
import { getLeaderboard } from '../../lib/leaderboard-api'
import { getAllReports } from '../../lib/reports'
import { getAllGraphs } from '../../lib/graphs'

import Image from 'next/image'
import { range } from '../../lib/range';

export default function Page({leaderboard, year}) {
  const reports = getAllReports(leaderboard);
  const graphs = getAllGraphs(leaderboard);

  return (
    <PageWrapper title="Tacton AoC Web">

        <h1>Welcome to the {year} Tacton AoC Web!</h1>

        <ul id="years">
            {range(2015,2022).map(y=>(
                <li className={year==y?'active':''} key={y}><a href={`/${y}`}>{y}</a></li>
            ))}
        </ul>


        { reports.map(report => (
            <div key={report.title}>
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
                    {line.map((cell,i) => (<td key={cell+i}>{cell}</td>))}
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
        ))}
        { graphs.map(graph => (
            <div key={graph.title}>
              <>
                {graph.title}
                <Canvas width={700} height={400} style={{width:"700px"}} render={canvas=>graph.render(canvas, leaderboard)}/>
              </>
            </div>
        ))}

    </PageWrapper>
  )
}

export async function getServerSideProps(context) {
  const { year } = context.query;

  const leaderboard = await getLeaderboard(year)
  return { props: { leaderboard, year } }
}