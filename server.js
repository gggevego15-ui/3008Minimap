const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const TOKEN = process.env.MINIMAP_TOKEN;
const ROOT = __dirname;
let players = [];
let lastUpdate = 0;

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.ico': 'image/x-icon' };
function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 100_000) { reject(new Error('Payload too large')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && ['/api/health', '/api/players'].includes(url.pathname)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return send(res, 200, { ok: true, connected: Boolean(lastUpdate && Date.now() - lastUpdate < 20_000), players: players.length });
  }
  if (req.method === 'GET' && url.pathname === '/api/players') {
    const fresh = Date.now() - lastUpdate < 20_000;
    return send(res, 200, { connected: Boolean(lastUpdate && fresh), updatedAt: lastUpdate || null, players: fresh ? players : [] });
  }
  if (req.method === 'POST' && url.pathname === '/api/report') {
    if (!TOKEN) return send(res, 503, { error: 'Set MINIMAP_TOKEN on the server before accepting reports.' });
    if (req.headers.authorization !== 'Bearer ' + TOKEN) return send(res, 401, { error: 'Unauthorized' });
    try {
      const body = await readBody(req);
      if (!Array.isArray(body.players) || body.players.length > 100) return send(res, 400, { error: 'players must be an array of at most 100 entries' });
      const clean = [];
      for (const p of body.players) {
        if (!p || typeof p.name !== 'string' || !Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
        clean.push({
          id: String(p.id || p.name).slice(0, 64),
          name: p.name.replace(/[<>]/g, '').slice(0, 32),
          x: Math.max(0, Math.min(100, Math.round(p.x))),
          y: Math.max(0, Math.min(100, Math.round(p.y))),
          color: '#8bc8ff',
          self: false
        });
      }
      players = clean;
      lastUpdate = Date.now();
      return send(res, 200, { ok: true, count: players.length });
    } catch (err) {
      return send(res, 400, { error: err.message === 'Payload too large' ? err.message : 'Invalid JSON payload' });
    }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed' });
  const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const file = path.resolve(ROOT, '.' + requested);
  if (!file.startsWith(ROOT + path.sep) && file !== path.join(ROOT, 'index.html')) return send(res, 403, { error: 'Forbidden' });
  fs.readFile(file, (err, content) => {
    if (err) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : content);
  });
});
server.listen(PORT, HOST, () => console.log('3008 Minimap listening on http://' + HOST + ':' + PORT));
module.exports = server;
