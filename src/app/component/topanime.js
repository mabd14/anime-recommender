export async function getServerSideProps() {
    const res = await fetch('https://api.jikan.moe/v4/top/anime/')
    const data = await res.json()
    return { props: { data } }
  }

const TopAnimePage = () => {
    return (
        <h1>Home</h1>
    )

}

export default TopAnimePage