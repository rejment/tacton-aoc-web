import { Canvas, PageWrapper } from '../../lib/components';
import { getLeaderboard } from '../../lib/leaderboard-api'
import { getAllReports } from '../../lib/reports'
import { getAllGraphs } from '../../lib/graphs'
import { getTransformedPattern } from "../../lib/pattern_transformer";

import Image from 'next/image'
import { range } from '../../lib/range';
import { readFile } from "fs/promises";
import path from "path";

export default function Page({leaderboard, year, pattern}) {
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

        <div key="ascii-art">
            <pre>
                {getTransformedPattern(leaderboard, pattern)}
            </pre>
        </div>

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
  const leaderboard = await getLeaderboard(year);
  const pattern = year === "2022" ? await readFile(path.join(process.cwd(), "pattern_2022.txt"), "utf8") : "";
  return {props: {leaderboard, year, pattern}}
}