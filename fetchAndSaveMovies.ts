// scripts/fetchAndSaveMovies.ts
import "dotenv/config";
import fetch from "node-fetch";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID!,
  appId: process.env.REACT_APP_FIREBASE_APP_ID!,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// TMDB config
const API_KEY = process.env.REACT_APP_TMDB_API_KEY!;
const START_PAGE = 6; // start after top popular pages
const END_PAGE = 10;  // fetch up to page 10

// Fetch genre mapping
async function fetchGenres() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
  );
  const data = await res.json();
  const mapping: { [key: number]: string } = {};
  data.genres.forEach((g: any) => (mapping[g.id] = g.name));
  return mapping;
}

// Sanitize movie
function sanitizeMovie(movie: any, genres: string[], trailerKey: string | null) {
  return {
    tmdbId: movie.id,
    title: movie.title,
    overview: movie.overview || "",
    poster_path: movie.poster_path || "",
    release_date: movie.release_date || "",
    trailerKey,
    genres,
  };
}

// Main
async function fetchAndSaveMovies() {
  try {
    const genreMapping = await fetchGenres();

    for (const genreId of Object.keys(genreMapping)) {
      const genreName = genreMapping[Number(genreId)];
      console.log(`\n🎬 Fetching movies for genre: ${genreName}`);

      for (let page = START_PAGE; page <= END_PAGE; page++) {
        console.log(`Fetching page ${page} for genre ${genreName}...`);
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&language=en-US`
        );
        const data = await res.json();
        if (!data.results || !Array.isArray(data.results)) continue;

        for (const movie of data.results) {
          if (!movie.id || !movie.title) continue;

          // Skip duplicates
          const q = query(collection(db, "movies"), where("tmdbId", "==", movie.id));
          const existing = await getDocs(q);
          if (!existing.empty) {
            console.log(`Already exists, skipping: ${movie.title}`);
            continue;
          }

          // Fetch trailer
          let trailerKey: string | null = null;
          try {
            const trailerRes = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
            );
            const trailerData = await trailerRes.json();
            const trailer = trailerData.results?.find(
              (v: any) => v.type === "Trailer" && v.site === "YouTube"
            );
            trailerKey = trailer?.key || null;
          } catch {
            trailerKey = null;
          }

          // Map genres
          const genres =
            movie.genre_ids?.map((id: number) => genreMapping[id]).filter(Boolean) ||
            ["Unknown"];

          await addDoc(collection(db, "movies"), sanitizeMovie(movie, genres, trailerKey));
          console.log(`✅ Added: ${movie.title} [${genres.join(", ")}]`);
        }
      }
    }

    console.log("\n🎉 Done fetching new movies!");
  } catch (err) {
    console.error("❌ Error fetching or saving movies:", err);
  }
}

fetchAndSaveMovies();