# Preview runbook

## Reproduce uncommitted artifacts

- Use the project checkout as the working directory.
- Copy `.env.local` from the main checkout into this worktree when it exists; never commit or
  document its values. (No `.env.local` exists today — only `.env.local.example`.)
- Install the locked dependencies with `npm install` using `package-lock.json`.
- Remove `.next` before starting a server if a previous server or a `next build` used a
  different build. Never run `next build` while a dev server is running — they share `.next`
  and corrupt each other.

## Run the server

- Start the Next.js development server with `npm run dev` from the project root.
- The project default port is `3000`. Pass a different one with `npm run dev -- -p <port>`.
- **Write the server's stdout/stderr OUTSIDE the project directory.** Next's watcher treats
  the whole checkout — including `.freebuff/` — as watched content, so a log file written
  inside the repo re-triggers a rebuild, which writes more log, which triggers another
  rebuild. That loop aborts in-flight chunk responses and shows up as
  `SyntaxError: Invalid or unexpected token`, `ChunkLoadError`, a page that renders but never
  hydrates, and navigation that feels randomly slow. Use the OS temp dir instead, e.g.
  `%TEMP%\freebuff-preview-<thread>.log`.

Start it detached (Windows) and record the printed pid:

```
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','-p','3000' -RedirectStandardOutput '%TEMP%\freebuff-preview-<thread>.log' -RedirectStandardError '%TEMP%\freebuff-preview-<thread>.log.err' -WindowStyle Hidden -PassThru).Id"
```

- Name the executable exactly (`npm.cmd`, `node.exe`); `Start-Process` does not resolve shell
  shims like `npm`.
- Keep the `'--'` separator before any port flag. Without it npm swallows `-p` as one of its own
  options and the script receives a bare `next dev 3000`, which Next reads as a *directory* and
  the server exits with "Invalid project directory provided".
- stdout and stderr must go to DIFFERENT files.
- The `powershell` call can hang the calling shell after the child is already running; verify
  from a separate command with `netstat -ano | grep ':3000'` and a `curl -I` to the URL.
- Confirm the pid survived with `powershell -NoProfile -Command "Get-Process -Id <pid>"`, then
  register the preview with that pid.

## Watcher guard

`next.config.mjs` sets `webpack.watchOptions.ignored` (dev only) for `node_modules`, `.git`,
`.next`, `.freebuff`, `.turbo`, `*.log`, `*.log.*` and `*.tsbuildinfo`. Next otherwise watches the
whole checkout, so anything that writes into the repo spins up a rebuild loop. Verify the guard
still holds after changing build config: append to `.freebuff/probe.log` a few times and confirm
the `Compiled` count does not move, then edit a real source file and confirm it does.

## Health checks

- `curl -sS -o /dev/null -w '%{http_code}' http://localhost:3000/` should return `200`.
- The server log should show one `Compiled` line per route visited and then stay quiet. If
  `Compiled` keeps climbing while nobody is editing files, the watcher is in a rebuild loop —
  move the log out of the project directory and re-check `watchOptions.ignored`.
- A healthy page hydrates: clicking the theme toggle in the navbar flips
  `document.documentElement.dataset.theme` and writes `ai-portal-theme` to `localStorage`.
  If the toggle does nothing and the console shows a `SyntaxError`, the client bundle was
  truncated by a rebuild mid-request.
