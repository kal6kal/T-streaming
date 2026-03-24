# T-Streaming

**Movie discovery & streaming-style UI powered by TMDB** — search, browse genres, open rich details, watch trailers, save favorites.

This file is the same as the main README **without** embedded screenshots. Use it where image hosting or repo size matters, or paste into contexts that strip images.

---

## Features

- Movie and TV discovery by category / genre
- Search with autocomplete
- Detail pages: overview, cast, rating, release date
- Trailer playback (YouTube modal)
- Favorites for signed-in users
- Email/password and Google authentication
- Dark / light theme
- Responsive layout for mobile and desktop

## Tech stack

| Area        | Stack                                      |
| ----------- | ------------------------------------------ |
| UI          | React, TypeScript                          |
| Routing     | React Router v6                            |
| Data        | TMDB API (Axios)                           |
| Auth        | Firebase (via app context)                 |
| Styling     | Global CSS, responsive breakpoints         |

## Prerequisites

- Node.js (LTS recommended)
- npm
- A [TMDB](https://www.themoviedb.org/) API key

## Installation

```bash
git clone <your-repo-url>
cd m-streaming
npm install
```

Create a `.env` file in the project root:

```env
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

## Usage

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

- `/` — homepage (after sign-in, per your `PrivateRoute` setup)
- `/login`, `/register` — authentication
- `/movie/:id`, `/tv/:id` — title details
- `/fav` — favorites (signed-in)

## Project structure

```text
public/
  logo.jpg
  index.html

src/
  assets/          # images (screenshots, logos, backgrounds)
  components/
  context/
  hooks/
  pages/
  App.tsx
```

## Notes & limitations

- **TMDB** supplies metadata only; playback depends on your integration (e.g. YouTube trailers in-app).
- **Third-party embeds** (if you add them) may be blocked by browsers, ad blockers, or region.
- **Home back behavior**: custom hook may attempt tab close / blank-page fallback on `/` — behavior varies by browser.

## Future improvements

- Richer filters (year, rating, language)
- Watchlist / continue watching
- PWA or offline caching for carousels
- End-to-end tests for auth and routing

## License

MIT

---

*Screenshots version: [`README.md`](./README.md).*
