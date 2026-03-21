// src/types/movie.ts
export interface Movie {
  id: number;             // TMDB movie ID
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  trailerKey?: string | null;
  genres: string[];
  rating?: number;
  cast?: string[];
}