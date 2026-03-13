import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Movie } from "../../types/Movie";

const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      try {
        // Fetch movie details
        const res = await axios.get(`${BASE_URL}/movie/${id}?api_key=${TMDB_KEY}&language=en-US`);
        const data = res.data;

        // Fetch trailer
        const trailerRes = await axios.get(
          `${BASE_URL}/movie/${id}/videos?api_key=${TMDB_KEY}&language=en-US`
        );
        const trailer = trailerRes.data.results.find(
          (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        // Map genre IDs
        const genreMap: { [key: number]: string } = {
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
        const genres = data.genres.map((g: any) => g.name);

        setMovie({
          id: data.id,
          title: data.title,
          overview: data.overview,
          poster_path: data.poster_path,
          release_date: data.release_date,
          trailerKey: trailer ? trailer.key : null,
          genres,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <h2>Loading movie...</h2>;
  if (!movie) return <h2>Movie not found</h2>;

  return (
    <div style={{ padding: "20px", color: "black" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Back
      </button>

      <h1>{movie.title}</h1>
      <p>{movie.release_date}</p>
      <p>{movie.genres.join(", ")}</p>
      <p>{movie.overview}</p>

      {movie.trailerKey && (
        <iframe
          width="900"
          height="506"
          src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=0`}
          title="Movie Trailer"
          allow="autoplay; fullscreen"
          style={{ borderRadius: "8px", marginTop: "20px" }}
        ></iframe>
      )}
    </div>
  );
};

export default MovieDetails;