// this page will not render anything, the getServerSideProps makes a redirect instead
export default function Nothing() {
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/2023',
      permanent: false,
    },
  }
}