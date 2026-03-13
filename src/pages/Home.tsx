// src/pages/Home.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar";
import CategorySection from "../components/CategorySection/CategorySection";
import { Movie } from "../types/Movie";

const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const categories = ["Action", "Drama", "Comedy", "Adventure"];

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch initial random popular movies on page load
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`
      );
      const results = res.data.results;

      const moviesWithGenres: Movie[] = results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        genres: movie.genre_ids.map((id: number) => {
          const map: { [key: number]: string } = {
            28: "Action",
            12: "Adventure",
            16: "Animation",
            35: "Comedy",
            80: "Crime",
            18: "Drama",
            10751: "Family",
            14: "Fantasy",
            27: "Horror",
          };
          return map[id] || "Other";
        }),
      }));

      setMovies(moviesWithGenres);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Live search: fetch from TMDB API
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setAutocompleteResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/search/movie?api_key=${TMDB_KEY}&language=en-US&query=${query}&page=1`
      );
      const results = res.data.results;

      const moviesWithPoster: Movie[] = results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview,
        release_date: movie.release_date,
        genres: [],
      }));

      setAutocompleteResults(moviesWithPoster);
    } catch (err) {
      console.error("Search error:", err);
      setAutocompleteResults([]);
    }
  };

  const handleSelectMovie = (movieId: number) => {
    navigate(`/movie/${movieId}`);
    setSearchQuery("");
    setAutocompleteResults([]);
  };

  const moviesByCategory = (category: string) =>
    movies.filter((movie) => movie.genres.includes(category));

  return (
    <div style={{ padding: "20px", backgroundColor: "#fff", minHeight: "100vh" }}>
      <h1 style={{ color: "#000", marginBottom: "20px" }}>Discover Movies</h1>

      <div style={{ position: "relative", maxWidth: "400px", marginBottom: "20px" }}>
        <SearchBar value={searchQuery} onSearch={handleSearch} />

        {autocompleteResults.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: 0,
              width: "100%",
              backgroundColor: "#f1f1f1",
              borderRadius: "8px",
              maxHeight: "300px",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            {autocompleteResults.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleSelectMovie(movie.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: "40px", borderRadius: "4px" }}
                  />
                )}
                <span style={{ color: "#000" }}>{movie.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category sections */}
      {categories.map((category) => (
        <CategorySection
          key={category}
          title={category}
          movies={moviesByCategory(category)}
          onMovieClick={(movieId: number | string) => navigate(`/movie/${movieId}`)}
        />
      ))}
    </div>
  );
};

export default Home;