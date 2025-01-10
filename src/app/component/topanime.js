import { useState, useEffect } from "react";

const TopAnimePage = () => {
  const [animeData, setAnimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      // Define the GraphQL query
      const query = `
        query {
          Page(page: 1, perPage: 10) {
            media(type: ANIME, sort: SCORE_DESC) {
              id
              title {
                english
                romaji
              }
              averageScore
              coverImage {
                large
              }
              siteUrl
            }
          }
        }
      `;

      try {
        // Fetch data from AniList GraphQL API
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({ query }), // Send the query in the request body
        });

        const data = await res.json();

        // Update state with the fetched anime data
        setAnimeData(data.data.Page.media);
      } catch (err) {
        // Handle errors
        setError(err.message);
      } finally {
        // Stop the loading state
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (isLoading)
    return <div className="text-white text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-white text-center mt-10">Error: {error}</div>;

  return (
    <div className="w-full bg-transparent">
      {/* Container */}
      <div className="container mx-auto p-4 bg-gradient-to-b from-transparent to-[#ffffff80] rounded-lg">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-6 text-white drop-shadow-lg">
          Highest Rated Anime
        </h1>

        {/* Anime Side Scroller */}
        <div className="flex overflow-x-scroll space-x-6 scrollbar-hide p-4">
          {animeData.map((anime) => (
            <div
              key={anime.id}
              className="min-w-[200px] bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              {/* Anime Image */}
              <img
                src={anime.coverImage.large}
                alt={anime.title.english || anime.title.romaji}
                className="w-full h-56 object-cover"
              />

              {/* Anime Info */}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  {anime.title.english || anime.title.romaji}
                </h2>
                <p className="text-gray-700">Rating: {anime.averageScore}%</p>
                <a
                  href={anime.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                >
                  View on AniList →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopAnimePage;
