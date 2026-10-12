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

## Deploy the backend on Render

A Render Blueprint is included in `render.yaml`. To create the hosted service (this requires your Render account; committing this file does not deploy it automatically):

1. Open [Render](https://render.com/) and sign in, then choose **New → Blueprint** and connect this GitHub repository.
2. Select `gggevego15-ui/3008Minimap` and deploy the Blueprint from `render.yaml`. Render will create a Node web service and generate `MINIMAP_TOKEN`.
3. When deployment finishes, open the service's **Settings / Environment** and copy the generated `MINIMAP_TOKEN` privately. Never commit this secret to GitHub or put it in browser-side code.
4. Test `https://YOUR-RENDER-SERVICE.onrender.com/api/health`. It should return JSON with `ok: true`. The `connected` field remains false until a fresh Roblox report arrives. Free services may sleep after inactivity, so the first request can take a little time.
5. In the Roblox experience you own or are authorized to administer, put `roblox/MinimapReporter.server.lua` in `ServerScriptService`.
6. Set `REPORT_URL` in the script to `https://YOUR-RENDER-SERVICE.onrender.com/api/report`. Replace the Lua `TOKEN` placeholder with the same generated secret. Keep this in a server-only Script; do not put it in a LocalScript or public client code. Enable HTTP requests in Roblox Studio and calibrate the coordinate bounds for your own map.
7. Open 3008 Minimap and enter the base URL `https://YOUR-RENDER-SERVICE.onrender.com` in **Backend API URL**, then click **Save connection**. The app polls `/api/players` every five seconds.

## Connect a live backend manually

For another Node.js host, deploy `server.js` as a persistent Node process with HTTPS and set a strong `MINIMAP_TOKEN` environment variable. GitHub Pages cannot run Node servers. Then follow steps 5–7 above using that host's URL.

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
