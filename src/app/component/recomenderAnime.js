import React from 'react';
import { useState, useRef, useEffect } from 'react';

const ReccomenderAnime = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [originalAnime, setOriginalAnime] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchListQuery = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
          }
        }
      }
    }
  `;

  const fullSearchQuery = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        id
        title {
          romaji
          english
        }
        description
        coverImage {
          large
        }
        averageScore
        recommendations (sort: RATING_DESC) {
          nodes {
            rating
            mediaRecommendation {
              id
              title {
                romaji
                english
              }
              description
              coverImage {
                large
              }
              averageScore
              siteUrl
            }
          }
        }
      }
    }
  `;

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (error) setError('');

    if (value.trim().length >= 2) {
      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: searchListQuery,
            variables: {
              search: value
            }
          })
        });

        const data = await response.json();
        if (data.data?.Page?.media) {
          setSearchResults(data.data.Page.media);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleAnimeSelect = async (animeId) => {
    setInputValue('');
    setShowDropdown(false);
    setIsLoading(true);
    setError('');
    setRecommendations([]);
    setOriginalAnime(null);

    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: fullSearchQuery,
          variables: {
            id: animeId
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch anime data');
      }

      if (!data.data.Media) {
        setError('No anime found');
        return;
      }

      const foundAnime = data.data.Media;
      setOriginalAnime(foundAnime);

      const recommendations = foundAnime.recommendations.nodes
        .filter(rec => rec.mediaRecommendation && rec.rating > 0)
        .slice(0, 10);
      
      setRecommendations(recommendations);
      
      if (recommendations.length === 0) {
        setError('No recommendations found for this anime');
      }

    } catch (err) {
      setError('An error occurred while fetching data. Please try again later.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = (titleObj) => titleObj.english || titleObj.romaji;

  return (
    <div>
      <div className="max-w-4xl mx-auto pt-8 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Anime Recommender</h1>
          <p className="text-gray-600">Search for an anime to get personalised recommendations</p>
        </div>
        
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 space-y-6">
          {/* Search Section */}
          <div className="w-full max-w-xl relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm">
              <div className="flex items-center pl-3">
                <svg 
                  viewBox="0 0 20 20" 
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                >
                  <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z" />
                </svg>
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full py-3 px-2 text-base outline-none rounded-l-lg"
                placeholder="Start typing anime title..."
                disabled={isLoading}
              />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.map((anime) => (
                  <div
                    key={anime.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAnimeSelect(anime.id)}
                  >
                    <img
                      src={anime.coverImage.medium}
                      alt={getTitle(anime.title)}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="ml-3">
                      <div className="font-medium">{getTitle(anime.title)}</div>
                      {anime.title.romaji !== anime.title.english && (
                        <div className="text-sm text-gray-500">{anime.title.romaji}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="w-full max-w-xl text-center text-gray-600">
              Loading...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-xl p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* Original Anime Card */}
          {originalAnime && (
            <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Selected Anime</h2>
              <div className="flex gap-4">
                <img
                  src={originalAnime.coverImage.large}
                  alt={getTitle(originalAnime.title)}
                  className="w-32 h-44 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-medium">{getTitle(originalAnime.title)}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {originalAnime.description?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Rating:</span> {originalAnime.averageScore ? `${originalAnime.averageScore}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Grid */}
          {recommendations.length > 0 && (
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-6">Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec) => (
                  <div
                    key={rec.mediaRecommendation.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={rec.mediaRecommendation.coverImage.large}
                      alt={getTitle(rec.mediaRecommendation.title)}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors">
                        {getTitle(rec.mediaRecommendation.title)}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Rating: {rec.mediaRecommendation.averageScore}%
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {rec.rating} users recommended this
                      </p>
                      <a
                        href={rec.mediaRecommendation.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReccomenderAnime;