import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default function HeroBanner() {
  const [movie, setMovie] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/trending/all/day?api_key=${TMDB_KEY}`);
        const results = res.data.results.filter((item: any) => item.backdrop_path);
        if (results.length > 0) {
          const randomItem = results[Math.floor(Math.random() * results.length)];
          setMovie(randomItem);
        }
      } catch (err) {
        console.error("Failed to fetch hero banner:", err);
      }
    };
    fetchTrending();
  }, []);

  if (!movie) return null;

  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const title = movie.title || movie.name || movie.original_name;
  const bgUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const mediaType = movie.media_type || "movie";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "550px",
        color: "white",
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div 
        style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%), linear-gradient(to top, var(--bg-primary) 0%, transparent 20%)"
        }}
      />
      
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "40px",
          transform: "translateY(-50%)",
          maxWidth: "600px"
        }}
      >
        <h1 
          style={{ 
            fontSize: "3.5rem", 
            fontWeight: 800, 
            marginBottom: "15px", 
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            lineHeight: "1.1"
          }}
        >
          {title}
        </h1>
        <p 
          style={{ 
            fontSize: "1.1rem", 
            lineHeight: "1.5", 
            marginBottom: "30px", 
            color: "#e5e5e5",
            textShadow: "1px 1px 3px rgba(0,0,0,0.8)"
          }}
        >
          {truncate(movie.overview, 200)}
        </p>

        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={() => navigate(`/${mediaType}/${movie.id}`)}
            style={{
              padding: "12px 28px",
              fontSize: "1.1rem",
              fontWeight: 600,
              backgroundColor: "var(--accent-color)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "transform 0.2s, background-color 0.2s",
              boxShadow: "0 4px 15px rgba(229, 9, 20, 0.4)"
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.backgroundColor = "#f6121d"; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.backgroundColor = "var(--accent-color)"; }}
          >
            ▶ Play Trailer
          </button>
          
          <button
            onClick={() => navigate(`/${mediaType}/${movie.id}`)}
            style={{
              padding: "12px 28px",
              fontSize: "1.1rem",
              fontWeight: 600,
              backgroundColor: "rgba(109, 109, 110, 0.7)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(109, 109, 110, 0.9)"; e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(109, 109, 110, 0.7)"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  );
}
