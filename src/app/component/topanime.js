import { useState, useEffect } from 'react';

const TopAnimePage = () => {
  const [animeData, setAnimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=10');
        const data = await res.json();
        setAnimeData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        Highest Rated Anime
      </h1>
  
      {/* Anime Side Scroller */}
      <div className="flex overflow-x-scroll space-x-6 scrollbar-hide">
        {animeData.map((anime) => (
          <div
            key={anime.mal_id}
            className="min-w-[200px] bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            {/* Anime Image */}
            <img
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              className="w-full h-56 object-cover"
            />
  
            {/* Anime Info */}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{anime.title}</h2>
              <p className="text-gray-700">Rating: {anime.score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  
};

export default TopAnimePage;
