# Preview runbook

## Reproduce uncommitted artifacts

- Use the project checkout as the working directory.
- Copy `.env.local` from the main checkout into this worktree when it exists; never commit or document its values.
- Install the locked dependencies with `npm install` using `package-lock.json`.
- Ensure generated build output is fresh by removing `.next` before starting a new development preview if a prior server used a different build.

## Run the server

- Start the Next.js development server with `npm run dev` from the project root.
- The default preview URL is `http://localhost:3000/`.
- For a worktree-specific preview, choose another free port and pass it as `npm run dev -- -p <port>`.
