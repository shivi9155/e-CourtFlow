# e-CourtFlow — Frontend

This README documents the frontend of the e-CourtFlow project (React + Vite).

## Overview

The frontend is built with React and Vite. It provides the public-facing UI for searching cases, viewing judge profiles, and administrative UI for managing cases, judges, and hearings.

## Prerequisites

- Node.js 18+ and npm
- Backend API running (see `Backend/README.md`)

## Quick setup

From the project root (where `package.json` and `vite.config.js` live):

```bash
npm install
npm run dev
```

If you prefer to run only frontend files directly (not required):

```bash
cd src
# Not necessary to run from src for Vite projects; run from project root.
```

## Environment variables

Vite exposes variables using the `VITE_` prefix. Recommended:

```
VITE_API_URL=http://localhost:5000/api
```

In code, use `import.meta.env.VITE_API_URL` to read the API base URL. The frontend uses `src/services/api.js` to centralize API calls.

## Important files & folders

- `src/App.jsx` — App entry and route definitions.
- `src/pages/` — Pages (Cases, CaseDetail, Judges, Admin pages, etc.).
- `src/components/` — Reusable components (Navbar, CaseCard, SearchBar, PrivateRoute).
- `src/services/api.js` — API client and base URL.
- `src/context/` — Auth and Theme contexts.

## Running & Building

- Development server (fast HMR):

```bash
npm run dev
```

- Build for production:

```bash
npm run build
# Optional preview
npm run preview
```

## Demo / Testing flow

1. Start the backend and seed sample data: see `Backend/README.md`.
2. Start the frontend: `npm run dev`.
3. Visit the local dev URL (usually `http://localhost:5173`) and try:
   - Search a case
   - Open a case detail
   - Login to admin and add a case or schedule a hearing

## Screenshots & Assets

Place any UI screenshots under `public/` or `src/assets/` and reference them in slides or documentation where needed.

## Contributing

- Keep components small and focused.
- Use the `src/services/api.js` for HTTP calls.
- Add unit/component tests when adding new behaviors.

## Notes for deployment

- Ensure `VITE_API_URL` points to the production API endpoint.
- Serve the `dist` folder behind a static host or via an application server.

---
