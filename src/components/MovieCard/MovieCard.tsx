// src/components/MovieCard/MovieCard.tsx
import React from "react";
import { Movie } from "../../types/Movie";

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void; // handle click
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div
      onClick={onClick}
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
          borderRadius: "6px",
          transition: "transform 0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          padding: "2px 4px",
          background: "rgba(0,0,0,0.6)",
          color: "",
          fontSize: "12px",
          textAlign: "center",
          borderBottomLeftRadius: "6px",
          borderBottomRightRadius: "6px",
        }}
      >
        {movie.title}
      </div>
    </div>
  );
};

export default MovieCard;