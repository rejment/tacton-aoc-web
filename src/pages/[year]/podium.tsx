import { useEffect, useRef } from 'react';
import { PageWrapper } from '../../lib/components';
import { getLeaderboard } from '../../lib/leaderboard-api'

const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    //Our first draw
    context.fillStyle = '#000000'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }, [])
  
  return <canvas ref={canvasRef} {...props}/>
}

// this page is accessible at /2022/podium
export default function Page({leaderboard, year}) {
    
  return (
    <PageWrapper title="Podium">
        <h1>Podium for AoC {year}</h1>
        <div>some logic should go here</div>
        <div>we are currently using the cookie of user {leaderboard.members[leaderboard.owner_id].name}</div>
        <Canvas />
    </PageWrapper>
  )
}

export async function getServerSideProps(context) {
  const { year } = context.query;
  const leaderboard = await getLeaderboard(year)
  return { props: { leaderboard, year } }
}