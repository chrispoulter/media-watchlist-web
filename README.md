# Media Watchlist

A React SPA for tracking movies and TV shows you want to watch. Search TMDB, build your list, manage your account — all in one place.

Connects to [media-watchlist-api](https://github.com/chrispoulter/media-watchlist-api) for data and authentication.

## Tech Stack

- **[Vite 8](https://vite.dev/)** + **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** for styling
- **[shadcn/ui](https://ui.shadcn.com/)** component library (New York style, Radix UI primitives)
- **[TanStack Query v5](https://tanstack.com/query/latest)** for server state
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** for forms and validation
- **[better-auth](https://better-auth.com/)** for authentication (cookie-based sessions)
- **[React Router v7](https://reactrouter.com/)** for client-side routing
- **[ky](https://github.com/sindresorhus/ky)** for API requests
- **[Sonner](https://sonner.emilkowal.ski/)** for toast notifications

## Features

### Authentication

- Register with email, password, first name, last name, and date of birth
- Register / sign in with Google OAuth
- Sign in with email and password (remember me option)
- Two-factor authentication (TOTP) at sign-in
- Forgot password / reset password via email link

### Watchlist

- Search TMDB for movies and TV shows with debounced input and type filter (All / Movies / TV)
- Add titles to your watchlist directly from search results
- View your full watchlist as a poster grid
- Remove titles from your watchlist

### Profile

- Update name and date of birth
- Change email address
- Change password (revokes other sessions)
- Enable / disable TOTP two-factor authentication with QR code setup flow
- Delete account

## Prerequisites

- **Node 24+**
- **media-watchlist-api** running (see its README for setup)

## Getting Started

```bash
# 1. Copy environment file and set the API URL
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`. API requests are directed to `VITE_API_URL` during development.

## Environment Variables

| Variable       | Description                         | Default                 |
| -------------- | ----------------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL of the media-watchlist-api | `http://localhost:3000` |

## Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Type check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |
| `npm run format`  | Format all files with Prettier       |

## Docker

### Development

`docker compose up` starts the full stack:

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| API      | http://localhost:3000 |
| Mailpit  | http://localhost:8025 |

Create a `.env` file in the project root with the required secrets before starting:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
TMDB_API_READ_TOKEN=...
```

```bash
docker compose up
```

`VITE_API_URL` is set automatically to the API service inside the compose network.

### Production

Build the image (nginx serves the static site):

```bash
docker build -t media-watchlist-web .
```

Run with the API URL supplied at runtime:

```bash
docker run -p 80:80 \
  -e VITE_API_URL=https://your-api.example.com \
  media-watchlist-web
```

At container startup, `VITE_API_URL` is injected into `env.js` by the entrypoint script. The app reads it at runtime via `window.__ENV__`, so the same image runs in any environment without rebuilding. nginx serves the SPA via `try_files $uri /index.html`.

## CI/CD

A single CI workflow runs on every push and pull request to any branch. It type checks, lints, and builds the project using Node.js 24.

## Project Structure

```
src/
├── lib/                    # API client, better-auth singleton, utilities
├── types/                  # shared TypeScript types
├── components/
│   ├── ui/                 # shadcn/ui generated components
│   └── ...                 # layout, route guards, header, shared UI
├── pages/                  # error and not-found fallback pages
└── features/
    ├── auth/               # login, register, two-factor, forgot/reset password
    ├── profile/            # profile info, security (2FA settings), danger zone
    ├── watchlist/          # React Query hooks, grid, item cards
    └── search/             # debounced search bar, result cards
```

## License

[MIT](LICENSE)
