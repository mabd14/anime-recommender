'use client'
import Image from "next/image";
import TopAnimePage from "./component/topanime"
import { useState } from "react";

const Input = () => {
  const [inputValue, setInputValue] = useState('');
  const [animeData, setAnimeData] = useState({});
  const [animeRecommendations, setAnimeRecommendations] = useState([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = async () => {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}&order_by=title&sort=asc&limit=10`);
    const data = await response.json();
    setAnimeData(data);
    if (data.data && data.data.length > 0) {
      // Assume the first result is the most relevant
      const animeId = data.data[0].mal_id;

      // Fetch recommendations using the anime ID
      const recResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
      const recData = await recResponse.json();
      setAnimeRecommendations(recData.data.slice(0,10));
    } else {
      console.log('No anime found.');
      setAnimeRecommendations([]);
    }
  };

  return (
    <div className="flex flex-col items-center p-5 space-y-6">
      {/* Search Container */}
      <div className="bg-gray-200 rounded-lg p-5">
        <div className="flex">
          {/* Search Icon Container */}
          <div className="flex items-center justify-center w-10 bg-white p-5 border-r border-gray-200 rounded-tl-lg rounded-bl-lg">
            <svg 
              viewBox="0 0 20 20" 
              aria-hidden="true" 
              className="w-5 fill-gray-500 transition pointer-events-none absolute"
            >
              <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z" />
            </svg>
          </div>
  
          {/* Search Input */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full max-w-[160px] bg-white pl-2 text-base font-semibold outline-none"
            placeholder="Search Anime"
          />
  
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-blue-500 px-4 py-2 text-white font-semibold rounded-tr-lg rounded-br-lg hover:bg-blue-800 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
  
      {/* Results Container */}
      {animeRecommendations?.length > 0 && (
        <div className="w-full max-w-2xl bg-gray-100 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Recommendations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {animeRecommendations.map((rec: any, index: number) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <a 
                  href={rec.entry.url}
                  className="block"
                >
                  <h3 className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors">
                    {rec.entry.title}
                  </h3>
                  {/* Add more anime details here if available */}

                  <div className="mt-2 text-sm">
                    <Image src={rec.entry.images.jpg.image_url} alt="Image" width={300} height={300}/>
                  </div>

                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const RandomAnime = () => {

  const [imgSrc, setImgSrc] = useState('');
  const [animeTitle, setAnimeTitle] = useState('');
  const [animeScore, setAnimeScore] = useState('');
  const [animeSynposis, setAnimeSynposis] = useState('');
  const [animeEnglishTitle, setAnimeEnglishTitle] = useState('');
  const [animeStatus, setAnimeStatus] = useState('');
  const [animeGenres, setAnimeGenres] = useState([]);
  const [showTitle, setShowTitle] = useState(false);



  const getRandom = async () => {
    const response = await fetch('https://api.jikan.moe/v4/random/anime')
    const data = await response.json();
    const imgSource = data.data.images.jpg.image_url;
    const animeTitle = data.data.title
    const animescore = data.data.score;
    const animesynposis = data.data.synopsis
    const animeenglishtitle = data.data.title_english
    const animestatus = data.data.status
    const animegenres = data.data.genres.map((genre: { name: string }) => genre.name).join(',');
    setImgSrc(imgSource);
    setAnimeTitle(animeTitle);
    setAnimeScore(animescore)
    setAnimeSynposis(animesynposis)
    setAnimeEnglishTitle(animeenglishtitle)
    setAnimeStatus(animestatus)
    setAnimeGenres(animegenres)
    setShowTitle(true);

  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <button
        onClick={getRandom}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Get Random Anime
      </button>

      {showTitle && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {animeTitle}
            </h1>
            <h2 className="text-xl text-gray-600">
              {animeEnglishTitle}
            </h2>
          </div>

          <div className="flex items-center">
            <span className="text-lg font-semibold text-indigo-600">
              Score: {animeScore}
            </span>
          </div>

          {imgSrc && (
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <Image
                src={imgSrc}
                alt="Anime Cover"
                width={300}
                height={300}
                className="rounded-lg object-cover shadow-md"
              />
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
            <p className="text-gray-700 leading-relaxed">
              {animeSynposis}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <p className="text-gray-700 leading-relaxed">
              {animeStatus}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Genres</h3>
            <p className="text-gray-700 leading-relaxed">
              {animeGenres}
            </p>
          </div>
        </div>


      )}
    </div>
  );
};




export default function Home() {
  return (
    <div>
      <title>Landing Page</title>
      <TopAnimePage />
      <Input />
      <RandomAnime />
    </div>
  );
}
