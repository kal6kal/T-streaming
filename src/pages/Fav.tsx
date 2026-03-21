// src/pages/Fav.tsx
import { useNavigate } from "react-router-dom";
import { useFav } from "../context/FavContext";
import MovieCard from "../components/MovieCard/MovieCard";

const Fav = () => {
  const { favorites } = useFav();
  const navigate = useNavigate();

  const handleCardClick = (id: number, type: "movie" | "tv") => {
    navigate(`/${type}/${id}`);
  };

  return (
    <div style={{ padding: "40px", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>My Favorites</h1>
      
      {favorites.length === 0 ? (
        <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem" }}>
          You haven't added any favorites yet. Go discover some movies!
        </p>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", 
          gap: "20px" 
        }}>
          {favorites.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={() => handleCardClick(movie.id, "movie")} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Fav;