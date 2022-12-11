import Head from "next/head";
import { useEffect, useRef } from "react";

export function PageWrapper({title, children}) {
    return (
        <div>
        <Head>
          <title>{title}</title>
          <meta name="description" content="Tacton AoC Web" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
          {children}
        </main>
  
      </div>
    );
}


export function Canvas(props) {
  
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    props.render(canvas, context)
  }, [])
  
  return <canvas ref={canvasRef} {...props}/>
}