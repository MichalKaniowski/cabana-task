# Resort Map App

This project is a full-stack Next.js app for viewing a resort map and booking cabanas. The frontend renders the resort as a tile-based interactive map, while the backend exposes REST endpoints for loading the map and validating and creating cabana bookings.

## Screenshot

Screenshot of the running app: [screenshot.png](./screenshot.png)

## How To Run

Install dependencies:

```bash
npm install
```

Start the app with the default input files:

```bash
npm run dev
```

Start the app with custom files:

```bash
npm run dev -- --map ./src/map-variant.ascii --bookings ./src/bookings-variant.json
```

For a production build, run:

```bash
npm run build
npm run start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## API Overview

The frontend talks only to REST endpoints:

- `GET /api/map` returns the formatted resort map with tile metadata and cabana booking state.
- `POST /api/cabanas/book` validates guest details and books a cabana if it is still available.

The backend reads the map and guest data from files configured through CLI arguments. Cabana reservations themselves are kept in memory.

## Design Decisions And Trade-Offs

Design decisions:

- Next.js is used for both frontend and API routes, which keeps setup small and doesn't require to create backend and frontend projects.
- A custom Node entrypoint (`server.mjs`) forwards `--map` and `--bookings` arguments into runtime environment variables, so input files can be swapped without changing application code.
- The map is generated on the backend from the ASCII source file, and the frontend only renders API data. This keeps the client focused on presentation and interaction instead of map parsing.
- Cabana booking state is stored in memory using a server-side map, real auth is not implemented, and I did not use server actions. That matches the task requirements, which ask for a REST API-based solution and to not use persistent storage or a real authentication.
- React Query is used to keep data fetching straightforward. It handles loading and error states for us, and after a successful booking it allows the app to refetch server state with very little code, so the UI stays in sync with the backend. It also gives the project a good foundation for future improvements such as more deliberate cache management, background refetching and more.

Trade-offs:

- For larger projects, I would move toward a feature-based structure, where each feature owns its own components, hooks, types, and server communication.
- I kept validation lightweight. Normally I would use `zod` for schema validation and safer request/response parsing.

## Project Structure

- `src/app/page.tsx` contains the main page and map loading state.
- `src/app/api/map/route.ts` serves the resort map.
- `src/app/api/cabanas/book/route.ts` handles booking requests and validation.
- `src/app/api/map/build-resort-map.ts` transforms the ASCII map into UI-friendly tile data.
- `src/app/api/cabanas/book/cabana-bookings.ts` contains guest lookup and in-memory booking state.
- `src/components/resort-map/*` contains the map and booking UI.
- `server.mjs` is the custom startup entrypoint that accepts CLI file arguments, which is not natively supported by Next.js.

## Tests

To be added.

## AI Workflow

`AI.md` has not been added yet in the current state of the repository.
AI workflow used by me: [AI.md](./AI.md)
