// src/components/CategorySection/CategorySection.tsx
import React from "react";
import MovieCard from "../MovieCard/MovieCard";
import { Movie } from "../../types/Movie";

interface CategorySectionProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movieId: number) => void; // ✅ Add this
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, movies, onMovieClick }) => {
  if (movies.length === 0) return null;

  return (
    <div className="category-section" style={{ marginBottom: "30px" }}>
      <h2 style={{ color: "black", marginBottom: "10px" }}>{title}</h2>

      {/* Horizontal scroll */}
      <div
        className="movie-row"
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "12px",
          paddingBottom: "10px",
        }}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => onMovieClick && onMovieClick(movie.id)} // pass click handler
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;