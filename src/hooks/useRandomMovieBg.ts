import { useState, useEffect } from "react";
import axios from "axios";

const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export function useRandomMovieBg(fallbackUrl: string) {
  const [bgUrls, setBgUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRandomBg = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${TMDB_KEY}`);
        const movies = res.data.results.filter((m: any) => m.backdrop_path);
        if (movies.length > 0) {
          const urls = movies.map((m: any) => `https://image.tmdb.org/t/p/original${m.backdrop_path}`);
          // Shuffle array for randomness
          const shuffled = urls.sort(() => 0.5 - Math.random());
          setBgUrls(shuffled);
        }
      } catch (err) {
        console.error("Failed to fetch random movie background:", err);
      }
    };
    
    fetchRandomBg();
  }, []);

  useEffect(() => {
    if (bgUrls.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bgUrls.length);
    }, 8000); // Rotate every 8 seconds
    return () => clearInterval(interval);
  }, [bgUrls]);

  return bgUrls.length > 0 ? bgUrls[currentIndex] : fallbackUrl;
}
