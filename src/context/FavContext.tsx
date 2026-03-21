import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db } from "../services/Firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { Movie } from "../types/Movie";

interface FavContextType {
  favorites: Movie[];
  addFav: (movie: Movie) => Promise<void>;
  removeFav: (movieId: number) => Promise<void>;
  isFav: (movieId: number) => boolean;
}

const FavContext = createContext<FavContextType | undefined>(undefined);

export function FavProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }

    const favsRef = collection(db, "users", currentUser.uid, "favorites");
    const unsubscribe = onSnapshot(favsRef, (snapshot) => {
      const favList: Movie[] = [];
      snapshot.forEach((docSnap) => {
        favList.push(docSnap.data() as Movie);
      });
      setFavorites(favList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addFav = async (movie: Movie) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, "users", currentUser.uid, "favorites", movie.id.toString());
      await setDoc(docRef, movie);
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  };

  const removeFav = async (movieId: number) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, "users", currentUser.uid, "favorites", movieId.toString());
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const isFav = (movieId: number) => {
    return favorites.some((fav) => fav.id === movieId);
  };

  return (
    <FavContext.Provider value={{ favorites, addFav, removeFav, isFav }}>
      {children}
    </FavContext.Provider>
  );
}

export function useFav() {
  const context = useContext(FavContext);
  if (!context) throw new Error("useFav must be used within FavProvider");
  return context;
}
