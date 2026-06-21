// YouTube embeddability / thumbnail / duration verifier.
// Usage:
//   node scripts/verify-yt.mjs <id1> <id2> ...
//   node scripts/verify-yt.mjs --file candidates.json   # JSON array of ids OR {id,...} objects
// Prints a JSON array of results to stdout; progress to stderr.
//
// A video PASSES only if: not in KNOWN_FAILED, oembed/thumbnail 200, and the
// IFrame player reaches a non-error state (no onError 100/101/150 = removed /
// embedding-disabled). durationSec comes from the real player.

import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CONCURRENCY = 4;
const PER_VIDEO_TIMEOUT = 9000;
// The IFrame API requires a real http(s) origin (not about:blank), so we host the
// probe page on the running dev server. Override with FC_ORIGIN if needed.
const ORIGIN = process.env.FC_ORIGIN || 'http://localhost:3000';

// Parse KNOWN_FAILED_VIDEO_IDS straight out of the service so the gate stays in sync.
function loadKnownFailed() {
  try {
    const src = readFileSync(resolve(__dirname, '../services/videoValidationService.ts'), 'utf8');
    const block = src.split('KNOWN_FAILED_VIDEO_IDS')[1].split(']')[0];
    return new Set([...block.matchAll(/'([A-Za-z0-9_-]{6,})'/g)].map(m => m[1]));
  } catch { return new Set(); }
}

function parseArgs() {
  const a = process.argv.slice(2);
  if (a[0] === '--file') {
    const raw = JSON.parse(readFileSync(a[1], 'utf8'));
    return raw.map(x => (typeof x === 'string' ? x : x.id || x.youtubeId)).filter(Boolean);
  }
  return a;
}

async function thumbOk(id) {
  try {
    const r = await fetch(`https://img.youtube.com/vi/${id}/hqdefault.jpg`, { method: 'HEAD' });
    // YouTube returns a 120x90 gray placeholder (still 200) for dead ids on some paths;
    // hqdefault 404s for truly dead ids, which is the signal we want.
    return r.status === 200;
  } catch { return false; }
}

async function checkOne(browser, id) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 640, height: 480 });
    await page.goto(ORIGIN, { waitUntil: 'domcontentloaded' });
    const result = await page.evaluate(
      (vid, timeout) =>
        new Promise(res => {
          const done = r => res(r);
          const t = setTimeout(() => done({ state: 'timeout', errorCode: null, duration: 0 }), timeout);
          window.onYouTubeIframeAPIReady = () => {
            const div = document.createElement('div');
            div.id = 'p';
            document.body.appendChild(div);
            // eslint-disable-next-line no-undef
            new YT.Player('p', {
              videoId: vid,
              playerVars: { enablejsapi: 1, origin: location.origin },
              events: {
                onReady: e => {
                  const d = e.target.getDuration();
                  // give a tick for an embedding error to fire instead of ready
                  setTimeout(() => { clearTimeout(t); done({ state: 'ready', errorCode: null, duration: d }); }, 400);
                },
                onError: e => { clearTimeout(t); done({ state: 'error', errorCode: e.data, duration: 0 }); },
              },
            });
          };
          const s = document.createElement('script');
          s.src = 'https://www.youtube.com/iframe_api';
          document.head.appendChild(s);
        }),
      id,
      PER_VIDEO_TIMEOUT
    );
    const thumb = await thumbOk(id);
    const embeddable = result.state === 'ready' && !result.errorCode;
    return {
      id,
      embeddable,
      pass: embeddable && thumb,
      thumbOk: thumb,
      durationSec: Math.round(result.duration || 0),
      state: result.state,
      errorCode: result.errorCode,
    };
  } catch (e) {
    return { id, embeddable: false, pass: false, thumbOk: false, durationSec: 0, state: 'exception', errorCode: String(e).slice(0, 60) };
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  const ids = [...new Set(parseArgs())];
  if (!ids.length) { console.error('No ids provided.'); process.exit(2); }
  const known = loadKnownFailed();
  const results = [];
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--mute-audio'] });

  let i = 0;
  async function worker() {
    while (i < ids.length) {
      const id = ids[i++];
      if (known.has(id)) { results.push({ id, embeddable: false, pass: false, thumbOk: false, durationSec: 0, state: 'known-failed', errorCode: null }); continue; }
      const r = await checkOne(browser, id);
      results.push(r);
      console.error(`${r.pass ? 'PASS' : 'FAIL'} ${id}  ${r.state}${r.errorCode != null ? '/' + r.errorCode : ''}  ${r.durationSec}s`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, ids.length) }, worker));
  await browser.close();

  results.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  const passed = results.filter(r => r.pass).length;
  console.error(`\n${passed}/${results.length} passed`);
  process.stdout.write(JSON.stringify(results, null, 2) + '\n');
}

main();
