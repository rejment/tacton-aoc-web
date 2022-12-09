import Head from "next/head";

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