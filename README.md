# 3008 Minimap

A dark, IKEA-inspired interactive minimap prototype for Roblox 3008. No generated images or external image assets are used.

## Features

- Responsive dark dashboard and canvas-drawn facility map.
- Demo player radar with username search and coordinate focus.
- Add markers by coordinates or by clicking the map.
- Marker types: base, supplies, danger, friend, custom.
- Markers persist in browser local storage.
- Export markers as JSON, plus zoom and reset controls.

## Run it

Open `index.html` in a browser, or publish the repository with GitHub Pages: **Settings → Pages → Deploy from a branch → main → /(root)**.

## Real Roblox players

Names and positions in the current UI are fictional demo data. A webpage cannot read live Roblox server positions on its own. Live tracking needs a Roblox server script and a trusted backend endpoint. This repository's current frontend is a prototype and is not yet connected to a live game server.

Never put backend secrets or Roblox Open Cloud keys in browser JavaScript. Do not use exploit executors or ask players for Roblox passwords/cookies. Before exposing real player coordinates, decide who is allowed to see them and secure the endpoint accordingly.

## Next step

Build a secured backend endpoint that accepts position updates from a Roblox server, then connect the frontend to it. Add authentication, rate limiting, and access controls before publishing live coordinates.
