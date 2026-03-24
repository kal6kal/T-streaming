# T-Streaming

Modern React movie discovery and streaming-style app powered by TMDB.

`T-Streaming` lets users search movies/TV content, browse curated genres, view rich details, save favorites, and watch trailers. Optional third-party embed playback can be integrated for full-movie experiences.

## Features

- Movie and TV discovery by category/genre
- Fast search with autocomplete results
- Detailed title pages (overview, cast, rating, release date)
- Trailer playback from movie details
- Favorites list for signed-in users
- Authentication flows (email/password and Google sign-in)
- Optional embedded playback integration using TMDB IDs
- Homepage back-button handling with exit/fallback behavior

## Tech Stack

- React
- React Router v6
- TypeScript
- Axios
- TMDB API
- Firebase Authentication (through app context)
- CSS modules/global CSS styles

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root:
   ```bash
   REACT_APP_TMDB_API_KEY=your_tmdb_api_key
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open:
   [http://localhost:3000](http://localhost:3000)

## Usage

- Open `/` to access the homepage.
- Use the search bar to find movies or TV shows quickly.
- Click a title card to open `MovieDetails`.
- Play the trailer from details page.
- Sign in to save and manage favorites.

## Project Structure

```text
public/
  index.html
  logo.jpg

src/
  components/      # shared UI components (Navbar, TrailerModal, etc.)
  context/         # auth/theme/favorites providers
  hooks/           # reusable custom hooks (e.g. useBackButton)
  pages/           # route-level pages (Home, Auth, MovieDetails, Fav)
  assets/          # static source assets
  App.tsx          # router + app layout
```

## Notes and Limitations

- TMDB is used for metadata and discovery.
- Third-party embedded playback providers (for example VidSrc) are outside project control.
- Embedded players may fail due to:
  - browser security restrictions
  - ad blockers / DNS filters
  - regional/network availability
- Some providers may show ads or open additional tabs.

## Future Improvements

- Improved player abstraction with provider fallbacks
- Better mobile navigation and accessibility refinements
- Server-side API proxy layer for request protection/rate handling
- Enhanced caching for search/details to reduce API calls
- Unit/integration test coverage for critical routes and hooks

## License

MIT
