import { Canvas, PageWrapper } from '../../lib/components';
import { getLeaderboard } from '../../lib/leaderboard-api'
import { getAllReports } from '../../lib/reports'
import { getAllGraphs } from '../../lib/graphs'
import { getTransformedPattern } from "../../lib/pattern_transformer";

import { range } from '../../lib/range';
import { readFile } from "fs/promises";
import path from "path";

export default function Page({leaderboard, year, pattern}) {
  const reports = getAllReports(leaderboard);
  const graphs = getAllGraphs(leaderboard);
  const transformed = getTransformedPattern(leaderboard, pattern)

  return (
      <PageWrapper title="Tacton AoC Web">

          <h1>Welcome to the {year} Tacton AoC Web!</h1>

          <ul id="years">
              {range(2015, 2024).map(y => (
                  <li className={year == y ? 'active' : ''} key={y}><a href={`/${y}`}>{y}</a></li>
              ))}
          </ul>

          {
              transformed.pattern.length === 0 ?
                  <div/>
                  :
                  <div key="ascii-art">
                      <h3>Overall Progress</h3>
                      <pre>{transformed.pattern}</pre>
                      <div>
                          One character is revealed for each star obtained by anyone on the leaderboard.
                          {
                              (transformed.remaining > 0) ?
                                  <div>Let&apos;s collect as many of them to reveal the entire image!
                                      Only {transformed.remaining} left to reach the goal...</div>
                                  :
                                  <div>Enough stars have been collected. Well done</div>
                          }
                      </div>

                  </div>
          }

          {reports.map(report => (
              <div key={report.title}>
                  <h3>{report.title}</h3>
                  <table>
                      <thead>
                      <tr>
                          {report.columns.map(col => (<th key={col}>{col}</th>))}
                      </tr>
                      </thead>
                      <tbody>
                      {report.lines.map(line => (
                          <tr key={line.join("-")}>
                              {line.map((cell, i) => (<td key={cell + i}>{cell}</td>))}
                          </tr>
                      ))}
                      </tbody>
                  </table>
              </div>
          ))}
          {graphs.map(graph => (
              <div key={graph.title}>
                  <>
                      <h3>{graph.title}</h3>
                      <Canvas width={700} height={400} style={{width: "700px"}}
                              render={canvas => graph.render(canvas, leaderboard)}/>
                  </>
              </div>
          ))}

      </PageWrapper>
  )
}

export async function getServerSideProps(context) {
  const { year } = context.query;
  const leaderboard = await getLeaderboard(year);
  const pattern =
      year === "2022" ? await readFile(path.join(process.cwd(), "pattern_2022.txt"), "utf8")
          : year === "2023" ? await readFile(path.join(process.cwd(), "pattern_2023.txt"), "utf8")
              : "";
  return {props: {leaderboard, year, pattern}}
}
