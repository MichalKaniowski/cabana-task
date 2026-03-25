# AGENTS.md

This file provides guidelines for agentic coding assistants working in this repository.

## Commands

```bash
npm run dev      # Start the app in development mode
npm run build    # Build for production
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Project Structure

```text
src/
├── app/          # App Router pages, layouts, and API routes
├── components/   # UI components
├── hooks/        # Custom React hooks
├── lib/          # Shared utilities and clients
└── types.ts      # Shared domain types
```

## Conventions

- Use the `@/*` path alias for imports from `src`.
- Name files in kebab-case and functions in camelCase.
- Create new functions as arrow functions, including handlers and helpers.
- Use TanStack Query for server data: `useQuery` for reads and `useMutation` for writes.
- Fetch through the shared `kyInstance` from `@/lib/ky`.
- Use Tailwind utility classes directly in components.
- Keep API routes small, validate request data early, and return human-readable errors.
- Keep types explicit for props, request bodies, and API responses.
- Run `npm run lint` before finishing substantial changes.
