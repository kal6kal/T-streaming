// src/components/MovieCard/MovieCard.tsx
import React from "react";
import { Movie } from "../../types/Movie";
import { useFav } from "../../context/FavContext";
import { useAuth } from "../../context/AuthContext";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void; // handle click
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const { isFav, addFav, removeFav } = useFav();
  const { currentUser } = useAuth();
  
  const favorite = isFav(movie.id);

  const handleFavToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the card
    if (!currentUser) {
      alert("Please login to manage favorites.");
      return;
    }
    if (favorite) {
      removeFav(movie.id);
    } else {
      addFav(movie);
    }
  };

  return (
    <div
      onClick={onClick}
      className="premium-card"
      style={{
        minWidth: "160px",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        style={{
          width: "100%",
          display: "block", // Ensure no whitespace below image
        }}
      />
      
      {/* Heart Icon for Favorites */}
      <div 
        onClick={handleFavToggle}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: favorite ? "rgba(229, 9, 20, 0.9)" : "rgba(0,0,0,0.6)",
          color: "#fff",
          borderRadius: "50%",
          width: "35px",
          height: "35px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          transition: "background 0.3s, transform 0.2s",
          zIndex: 20
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {favorite ? "♥" : "♡"}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          padding: "10px 5px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
          color: "#fff", // Text should always be white on image overlay
          fontSize: "14px",
          fontWeight: "500",
          textAlign: "center",
          boxSizing: "border-box"
        }}
      >
        {movie.title}
      </div>
    </div>
  );
};

export default MovieCard;