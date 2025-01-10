'use client'
import TopAnimePage from "./component/topanime"
import InputHandle from "./component/inputHandle"
import RandomAnime from "./component/randomAnime";


export default function Home() {
  return (
<div className="relative h-screen w-full">
  <div className="absolute inset-0 bg-wallscreen bg-cover bg-center" />
  <div className="absolute inset-0 bg-white opacity-15" />
  <div className="relative z-10">
    <title>Landing Page</title>
    <TopAnimePage />
    <InputHandle/>
    <RandomAnime/>
  </div>
</div>
  );
}
