// src/pages/MovieDetails/MovieDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Movie } from "../../types/Movie";
import TrailerModal from "../../components/TrailerModal/TrailerModal";
import { useFav } from "../../context/FavContext";
import { useAuth } from "../../context/AuthContext";

const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { isFav, addFav, removeFav } = useFav();
  const { currentUser } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const mediaType = location.pathname.includes("/tv/") ? "tv" : "movie";

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      try {
        const res = await axios.get(
          `${BASE_URL}/${mediaType}/${id}?api_key=${TMDB_KEY}&language=en-US&append_to_response=credits,videos`
        );
        const data = res.data;

        // Extract trailer from combined request
        const trailer = data.videos?.results?.find(
          (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        const genres = data.genres.map((g: any) => g.name);
        const cast = data.credits?.cast?.slice(0, 5).map((c: any) => c.name) || [];

        setMovie({
          id: data.id,
          title: data.title || data.name,
          overview: data.overview,
          poster_path: data.poster_path,
          release_date: data.release_date || data.first_air_date,
          trailerKey: trailer ? trailer.key : null,
          genres,
          rating: data.vote_average,
          cast,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, mediaType]);

  if (loading) return <h2 style={{ padding: "100px 20px", color: "var(--text-primary)" }}>Loading details...</h2>;
  if (!movie) return <h2 style={{ padding: "100px 20px", color: "var(--text-primary)" }}>Not found</h2>;

  const favorite = isFav(movie.id);
  const handleFavToggle = () => {
    if (!currentUser) {
      alert("Please log in to add favorites");
      return;
    }
    if (favorite) removeFav(movie.id);
    else addFav(movie);
  };

  return (
    <div style={{ padding: "20px 40px", position: "relative", minHeight: "100vh" }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: "20px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
      >
        ← Back
      </button>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", marginTop: "20px" }}>
        {/* Poster */}
        {movie.poster_path && (
          <img 
            className="premium-card"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
            style={{ width: "300px", borderRadius: "10px", boxShadow: "var(--card-shadow)", height: "fit-content" }} 
          />
        )}
        
        {/* Details */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "10px" }}>
            <h1 style={{ fontSize: "3rem", margin: 0, color: "var(--text-primary)" }}>{movie.title}</h1>
            
            {/* Add to Favorites Button */}
            <button 
              onClick={handleFavToggle}
              style={{
                background: favorite ? "var(--accent-color)" : "transparent",
                color: favorite ? "#fff" : "var(--accent-color)",
                border: `2px solid var(--accent-color)`,
                borderRadius: "50%",
                width: "50px", height: "50px",
                display: "flex", justifyContent: "center", alignItems: "center",
                fontSize: "24px", padding: 0,
                transition: "all 0.3s ease"
              }}
              title={favorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {favorite ? "♥" : "♡"}
            </button>
          </div>
          
          <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "15px" }}>{movie.release_date}</p>
          <p style={{ marginBottom: "20px", fontWeight: "bold", color: "var(--text-primary)" }}>{movie.genres.join(" • ")}</p>
          
          {/* New Rating and Cast Section */}
          <div style={{ 
            display: "flex", flexDirection: "column", gap: "8px", 
            marginBottom: "20px", color: "var(--text-secondary)", fontSize: "1.1rem" 
          }}>
            {movie.rating ? <div>⭐ <strong>Rating:</strong> {movie.rating.toFixed(1)} / 10</div> : null}
            {movie.cast && movie.cast.length > 0 ? <div>🎭 <strong>Cast:</strong> {movie.cast.join(" • ")}</div> : null}
          </div>

          <p style={{ fontSize: "1.1rem", lineHeight: "1.5", marginBottom: "30px", maxWidth: "800px", color: "var(--text-secondary)" }}>
            {movie.overview}
          </p>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {movie.trailerKey && (
              <button 
                onClick={() => setShowTrailer(true)} 
                style={{ backgroundColor: "var(--accent-color)", color: "#fff", border: "none", display: "flex", alignItems: "center", gap: "8px" }}
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