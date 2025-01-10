import { useState } from 'react';
import Image from 'next/image';

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
      const animegenres = data.data.genres.map((genre) => genre.name).join(',');
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
  
  export default RandomAnime;