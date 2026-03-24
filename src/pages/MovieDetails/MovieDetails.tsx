// src/pages/MovieDetails/MovieDetails.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Movie } from "../../types/Movie";
import TrailerModal from "../../components/TrailerModal/TrailerModal";
import { useFav } from "../../context/FavContext";
import { useAuth } from "../../context/AuthContext";
import "./MovieDetails.css";

const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFav, addFav, removeFav } = useFav();
  const { currentUser } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const tmdbId = id ?? "";

  useEffect(() => {
    const fetchMovie = async () => {
      if (!tmdbId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/movie/${tmdbId}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits,videos`
        );
        const data = res.data;

        const trailer = data.videos?.results?.find(
          (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        const genres = Array.isArray(data.genres) ? data.genres.map((g: any) => g.name) : [];
        const cast =
          Array.isArray(data.credits?.cast) ? data.credits.cast.slice(0, 5).map((c: any) => c.name) : [];

        setMovie({
          id: data.id,
          title: data.title || data.name,
          overview: data.overview || "No overview available.",
          poster_path: data.poster_path,
          release_date: data.release_date || data.first_air_date,
          trailerKey: trailer ? trailer.key : null,
          genres,
          rating: data.vote_average,
          cast,
        });
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [tmdbId]);

  const favorite = movie ? isFav(movie.id) : false;

  const handleFavToggle = () => {
    if (!movie) return;
    if (!currentUser) {
      alert("Please log in to add favorites");
      return;
    }
    if (favorite) removeFav(movie.id);
    else addFav(movie);
  };

  if (loading) {
    return (
      <h2 style={{ padding: "100px 20px", color: "var(--text-primary)" }}>
        Loading details...
      </h2>
    );
  }

  if (!movie) {
    return (
      <h2 style={{ padding: "100px 20px", color: "var(--text-primary)" }}>
        Not found
      </h2>
    );
  }

  return (
    <div className="movie-details">
      <button onClick={() => navigate(-1)} className="movie-details__backBtn" type="button">
        {"<- Back"}
      </button>

      <div className="movie-details__layout">
        {movie.poster_path && (
          <img
            className="movie-details__poster premium-card"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        )}

        <div className="movie-details__info">
          <div className="movie-details__titleRow">
            <h1 className="movie-details__title">{movie.title}</h1>
            <button
              type="button"
              onClick={handleFavToggle}
              className={`movie-details__favBtn ${favorite ? "is-fav" : ""}`}
              title={favorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {favorite ? "♥" : "♡"}
            </button>
          </div>

          <p className="movie-details__meta">{movie.release_date}</p>
          <p className="movie-details__genres">{movie.genres.join(" • ")}</p>

          <div className="movie-details__stats">
            {movie.rating ? (
              <div>
                <strong>Rating:</strong> {movie.rating.toFixed(1)} / 10
              </div>
            ) : null}
            {movie.cast && movie.cast.length > 0 ? (
              <div>
                <strong>Cast:</strong> {movie.cast.join(" • ")}
              </div>
            ) : null}
          </div>

          <p className="movie-details__overview">{movie.overview}</p>

          <div className="movie-details__actions">
            {movie.trailerKey && (
              <button
                type="button"
                onClick={() => setShowTrailer(true)}
                className="movie-details__btn movie-details__btn--trailer"
              >
                ▶ Play Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {showTrailer && movie.trailerKey && (
        <TrailerModal trailerKey={movie.trailerKey} onClose={() => setShowTrailer(false)} />
      )}
    </div>
  );
};

export default MovieDetails;