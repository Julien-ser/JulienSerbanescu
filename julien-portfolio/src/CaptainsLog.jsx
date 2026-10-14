import React, { useRef, useState } from 'react';
import { Play, Pause, ArrowLeft } from 'lucide-react';

// One Markdown file per entry in ./logs, named YYYY-MM-DD-slug.md, with a
// small frontmatter block: title, stardate, date, and optionally summary and
// audio. Images go in ./logs/img, recordings in ./logs/audio. A recording
// named intro.* in ./logs/audio is the "what is this log" clip.
const entryFiles = import.meta.glob('./logs/*.md', { query: '?raw', import: 'default', eager: true });
const entryImages = import.meta.glob('./logs/img/*', { import: 'default', eager: true });
const entryAudio = import.meta.glob('./logs/audio/*', { import: 'default', eager: true });

const INTRO_AUDIO = Object.entries(entryAudio).find(([path]) => /\/intro\.[a-z0-9]+$/i.test(path))?.[1];

function parseEntry(path, raw) {
  const text = raw.replace(/\r\n/g, '\n');
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = {};
  if (match) {
    for (const line of match[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return {
    slug: path.split('/').pop().replace(/\.md$/, ''),
    ...meta,
    body: (match ? match[2] : text).trim(),
  };
}

// Newest first: file names start with the date.
const LOG_ENTRIES = Object.entries(entryFiles)
  .map(([path, raw]) => parseEntry(path, raw))
  .sort((a, b) => b.slug.localeCompare(a.slug));

function formatDate(iso) {
  const d = new Date(`${iso}T00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ponytail: hand-rolled Markdown subset (paragraphs, ## headings, - lists,
// images, **bold**, `code`, links). Swap for `marked` if entries need tables
// or nested lists.
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="subtle-link">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

function renderBody(body) {
  return body.split(/\n{2,}/).map((block, i) => {
    const lines = block.split('\n');
    const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const src = entryImages[`./logs/img/${image[2]}`];
      return src ? <img key={i} src={src} alt={image[1]} className="log-image" loading="lazy" /> : null;
    }
    if (block.startsWith('## ')) return <h3 key={i} className="log-heading">{block.slice(3)}</h3>;
    if (lines.every((l) => l.startsWith('- '))) {
      return (
        <ul key={i} className="log-list">
          {lines.map((l, j) => <li key={j}>{renderInline(l.slice(2))}</li>)}
        </ul>
      );
    }
    return <p key={i} className="par">{renderInline(lines.join(' '))}</p>;
  });
}

function EntryMeta({ entry }) {
  return (
    <>
      <span className="log-stardate">Stardate {entry.stardate}</span>
      <span className="log-title">{entry.title}</span>
      <span className="log-date">{formatDate(entry.date)}</span>
    </>
  );
}

// Play/pause for the intro clip, shown under the profile photo. Renders
// nothing until an intro recording exists.
export function LogIntroButton() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  if (!INTRO_AUDIO) return null;

  const Icon = playing ? Pause : Play;
  return (
    <>
      <audio
        ref={audioRef}
        src={INTRO_AUDIO}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        className="log-intro-btn"
        aria-pressed={playing}
        onClick={() => (playing ? audioRef.current.pause() : audioRef.current.play())}
      >
        <Icon size={13} strokeWidth={2} aria-hidden="true" />
        {playing ? 'Pause' : 'What is the log?'}
      </button>
    </>
  );
}

export default function CaptainsLogApp() {
  const [openSlug, setOpenSlug] = useState(null);
  const entry = LOG_ENTRIES.find((e) => e.slug === openSlug);

  if (entry) {
    const audio = entry.audio && entryAudio[`./logs/audio/${entry.audio}`];
    return (
      <div className="log-app">
        <button type="button" className="log-back" onClick={() => setOpenSlug(null)}>
          <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
          All entries
        </button>
        <article className="log-entry is-open">
          <header className="log-entry-head">
            <EntryMeta entry={entry} />
          </header>
          {audio && <audio className="log-audio" controls preload="none" src={audio} />}
          <div className="log-body">{renderBody(entry.body)}</div>
        </article>
      </div>
    );
  }

  return (
    <div className="log-app">
      <h2 className="section-title">Captain's Log</h2>
      <div className="section-divider"></div>
      <p className="par log-intro">What I'm learning, recorded a few times a week. Newest first.</p>
      {INTRO_AUDIO && <audio className="log-audio log-audio-intro" controls preload="none" src={INTRO_AUDIO} />}

      {LOG_ENTRIES.length === 0 && <p className="par">No entries yet.</p>}

      {LOG_ENTRIES.map((e) => (
        <article key={e.slug} className="log-entry">
          <button type="button" className="log-entry-head" onClick={() => setOpenSlug(e.slug)}>
            <EntryMeta entry={e} />
            {e.summary && <span className="log-summary">{e.summary}</span>}
          </button>
        </article>
      ))}
    </div>
  );
}
