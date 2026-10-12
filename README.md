# 3008 Minimap

A dark, IKEA-inspired minimap prototype and Windows desktop app for Roblox 3008. No generated images or external image assets are used.

## Features

- Canvas-drawn facility map and responsive dashboard.
- Searchable player radar, coordinate focus, zoom, and reset.
- Add base, supplies, danger, friend, and custom markers.
- Browser-local marker storage and JSON export.
- Optional backend relay for server-reported player positions.
- Electron desktop app with Windows installer and portable `.exe` build.

## Run in a browser / local server

Requires Node.js 20 or newer:

```sh
npm install
npm start
```

Open http://localhost:3000.

## Run the desktop app in development

```sh
npm install
npm run desktop
```

## Build Windows executables

On Windows (or with a Windows GitHub Actions runner):

```sh
npm install
npm run dist
```

Outputs are written to `dist/`: a Windows installer and a portable executable. A GitHub Actions workflow at `.github/workflows/build-windows.yml` builds both on pushes to `main` or `master`, and on manual runs. When the workflow finishes, open the run under the repository's **Actions** tab and download the `3008-minimap-windows` artifact. GitHub Actions artifacts are temporary build downloads, not a permanent release.

## Connect a live backend

1. Deploy `server.js` to a host that supports a persistent Node.js process and HTTPS. GitHub Pages cannot run Node servers. Set a strong `MINIMAP_TOKEN` environment variable on the backend.
2. In the Roblox experience you own or are authorized to administer, put `roblox/MinimapReporter.server.lua` in `ServerScriptService`.
3. Set `REPORT_URL` in the Lua script to `https://YOUR-BACKEND-HOST/api/report`, and set its server-only `TOKEN` to the same secret. Enable HTTP requests in Roblox Studio and set coordinate bounds to match your own map.
4. Open 3008 Minimap and enter the backend's base URL (for example, `https://YOUR-BACKEND-HOST`) in **Backend API URL**, then click **Save connection**. The app polls `/api/players` every five seconds.

The map shows live positions only after the backend receives a valid recent report. Otherwise it stays in demo mode. The sample coordinate bounds are examples and are not verified for the official 3008 game.

## Security and privacy

- The backend requires a bearer token for `POST /api/report`; never expose that token in browser code or a LocalScript.
- The sample `GET /api/players` endpoint is public and has permissive read CORS so the desktop/browser UI can fetch it. Anyone who can reach it may see reported positions. **Do not use this public endpoint for private servers or sensitive player locations.** Add authentication/access controls and tighten CORS before public deployment if needed.
- Use HTTPS, rotate leaked tokens, and only display locations when you have permission.
- This project cannot read the official 3008 game's live server positions unless an authorized integration is provided by that game. The included Roblox reporter is for your own authorized experience, not exploit tools or unauthorized game access.
- Never request Roblox passwords or cookies.

## Project files

- `index.html` — UI, map, markers, and configurable backend connection.
- `server.js` — static web server and position API.
- `electron/main.js` — desktop window and local API server startup.
- `roblox/MinimapReporter.server.lua` — server-side reporter example.
- `.github/workflows/build-windows.yml` — automated Windows builds.
