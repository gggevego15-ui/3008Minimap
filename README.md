# 3008 Minimap

A responsive dark, IKEA-inspired minimap prototype for Roblox 3008. No generated images or external image assets are used.

## Features

- Canvas-drawn facility map and responsive dashboard.
- Searchable player radar, coordinate focus, zoom, and reset.
- Add base, supplies, danger, friend, and custom markers.
- Markers persist in browser local storage and can be exported as JSON.
- Optional Node.js relay for positions reported by a Roblox server.

## Run the demo

Open `index.html` in a browser. For a local server with the optional API, install Node.js 18+ and run:

```sh
npm start
```

Then open http://localhost:3000. Without a configured backend and game reporter, the UI uses fictional demo player names and coordinates.

## Optional live position relay

This feature is only for a Roblox experience you own or are authorized to administer. It will not connect to the official 3008 game from an external webpage unless that game itself provides an authorized integration.

1. Deploy this Node app to a host that supports persistent Node.js processes and HTTPS. GitHub Pages alone cannot run `server.js`.
2. Configure a long random `MINIMAP_TOKEN` environment variable on the backend.
3. In your own Roblox experience, place `roblox/MinimapReporter.server.lua` in `ServerScriptService`. Set `REPORT_URL` to your HTTPS backend URL and `TOKEN` to the same secret. Keep the secret in a server-only Script, never a LocalScript.
4. In Roblox Studio, enable HTTP requests for your experience. Set the min/max X/Z bounds in the script to match your own map.
5. Open the frontend from the same Node server. The page checks `/api/players` every five seconds and switches to live positions when recent reports arrive.

The reporter's coordinate bounds are examples, not verified coordinates for the official 3008 map. You must calibrate them for your own authorized experience.

## Security and privacy

- The backend requires a bearer token for server reports and rejects malformed or oversized payloads.
- The sample `GET /api/players` endpoint is public so the browser can display reported positions. Anyone who can reach that endpoint can view those coordinates. **Do not use this default for private servers or sensitive player locations.** Put it behind authentication/access controls or adapt it before deploying publicly.
- Use HTTPS, rotate the token if it leaks, and only display player locations when you have permission to do so.
- Never put backend secrets or Roblox Open Cloud keys in browser JavaScript. Do not use exploit executors or ask anyone for Roblox passwords/cookies.

## Files

- `index.html` — UI, canvas map, markers, demo data, and live API polling.
- `server.js` — Node.js static server and optional player-position API.
- `roblox/MinimapReporter.server.lua` — server-side reporter example for your own Roblox experience.
