'use client'
import TopAnimePage from "./component/topanime"
import ReccomenderAnime from "./component/recomenderAnime"
import RandomAnime from "./component/randomAnime"

export default function Home() {
  return (
    <main className="min-h-screen h-full w-full relative">
      <div className="fixed inset-0 bg-wallscreen bg-cover bg-center bg-no-repeat" />
      <div className="fixed inset-0 bg-white/15" />
      <div className="relative z-10">
        <title>Landing Page</title>
        <TopAnimePage />
        <ReccomenderAnime/>
        <RandomAnime/>
      </div>
    </main>
  );
}