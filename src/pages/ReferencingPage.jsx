import { useState } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import CiteRow from '../components/sections/CiteRow';
import { QUICK } from '../data';

const CITATION_CATEGORIES = [
  ...QUICK,
  {
    k: 'AI-Generated Text',
    ref: 'OpenAI. (2026). ChatGPT (Mar 14 version) [Large language model]. https://chat.openai.com',
    it: '(OpenAI, 2026)',
    n: 'Under APA 7th, credit the developer as author, date the interaction or model version, provide the descriptor in square brackets, and detail the prompt in your assignment text or appendix.',
  },
  {
    k: 'ASQA / Government Report',
    ref: 'Australian Skills Quality Authority. (2025). Standards for RTOs compliance overview (Report No. ASQA-2025-11). Australian Government Publishing Service. https://asqa.gov.au/standards',
    it: '(Australian Skills Quality Authority, 2025) or (ASQA, 2025)',
    n: 'Use organizational author for official bodies. If abbreviating, spell out the full name in the first in-text mention with the acronym in square brackets.',
  },
  {
    k: 'YouTube / Training Video',
    ref: 'Discovery Library. (2026, February 10). Responsible use of AI in vocational education [Video]. YouTube. https://www.youtube.com/watch?v=dl-ai-vet-2026',
    it: '(Discovery Library, 2026)',
    n: 'Include [Video] after the title in brackets, followed by the hosting platform (e.g. YouTube, Vimeo) and full URL.',
  },
];

export default function ReferencingPage({ onCopy, onNotify }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Custom Citation Generator State
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('2026');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [url, setUrl] = useState('');
  const [genType, setGenType] = useState('website');

  const curr = CITATION_CATEGORIES[selectedIdx];

  // Generated Citation
  const formattedRef = () => {
    const a = author.trim() || 'Author, A. A.';
    const y = year.trim() || 'n.d.';
    const t = title.trim() || 'Title of document or webpage';
    const s = source.trim() || 'Publisher / Site Name';
    const u = url.trim() ? ` ${url.trim()}` : '';

    if (genType === 'book') {
      return `${a} (${y}). ${t}. ${s}.${u}`;
    }
    if (genType === 'journal') {
      return `${a} (${y}). ${t}. ${s}, 15(2), 101–118.${u}`;
    }
    return `${a} (${y}). ${t}. ${s}.${u}`;
  };

  const formattedInText = () => {
    const a = author.trim() ? author.trim().split(',')[0].trim() : 'Author';
    const y = year.trim() || 'n.d.';
    return `(${a}, ${y})`;
  };

  const handleCopy = (text) => {
    if (onCopy) onCopy(text);
    else if (onNotify) onNotify('Copied to clipboard');
  };

  return (
    <div className="page page-referencing" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div className="wrap">
        <Reveal className="sh">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Link to="/" className="btn btn-ghost btn-sm">
              <Icon name="arrow" style={{ transform: 'rotate(180deg)', width: 16, height: 16 }} /> Back to Home
            </Link>
            <span className="chip" style={{ opacity: 1, animation: 'none' }}>
              <Icon name="listCheck" style={{ width: 14, height: 14, color: 'var(--gold)' }} />
              APA 7th Edition Reference Standards
            </span>
          </div>
          <h2>APA 7th Referencing Guide & Builder</h2>
          <p>
            Master academic integrity and referencing conventions across all qualifications. Browse common examples below or build your own validated citation in real time.
          </p>
        </Reveal>

        {/* Quick Style Examples */}
        <div className="split" style={{ marginBottom: 60, alignItems: 'start' }}>
          <Reveal>
            <h3 style={{ fontSize: 26, marginBottom: 16 }}>Common Reference Formats</h3>
            <p className="lead" style={{ marginTop: 0, marginBottom: 24 }}>
              Select a medium to see the approved Reference List format and In-Text citation pattern according to the American Psychological Association (7th edition).
            </p>

            <div className="tabs" role="tablist" style={{ marginBottom: 24 }}>
              {CITATION_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.k}
                  type="button"
                  role="tab"
                  aria-selected={selectedIdx === idx}
                  className={`tab${selectedIdx === idx ? ' on' : ''}`}
                  onClick={() => setSelectedIdx(idx)}
                >
                  {cat.k}
                </button>
              ))}
            </div>

            <div className="glass panel" style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span className="typetag">{curr.k}</span>
                <span style={{ fontSize: 13, color: 'var(--sub)' }}>APA 7th Standard</span>
              </div>
              <CiteRow label="Reference List Entry" text={curr.ref} onCopy={handleCopy} />
              <div style={{ marginTop: 14 }}>
                <CiteRow label="In-Text Citation" text={curr.it} onCopy={handleCopy} />
              </div>
              <div style={{ marginTop: 18, background: 'rgba(255,200,58,0.06)', borderLeft: '3px solid var(--gold)', padding: '12px 16px', borderRadius: 8 }}>
                <small style={{ color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Style Guidance & Advice</small>
                <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.55 }}>{curr.n}</p>
              </div>
            </div>
          </Reveal>

          {/* Reference List Rules Checklist */}
          <Reveal className="glass panel" delay={0.15}>
            <h3 style={{ fontSize: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="listCheck" className="gold" /> Key APA 7th Rules for VET
            </h3>
            <ul style={{ display: 'grid', gap: 14, fontSize: 13.5, color: '#cfe3d8' }}>
              <li style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--em)', fontWeight: 700 }}>✓</span>
                <span><strong>Alphabetical Order:</strong> Arrange your Reference List alphabetically by the first author's surname.</span>
              </li>
              <li style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--em)', fontWeight: 700 }}>✓</span>
                <span><strong>Hanging Indent:</strong> Every entry after the first line should be indented 1.27 cm (0.5 inches).</span>
              </li>
              <li style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--em)', fontWeight: 700 }}>✓</span>
                <span><strong>DOIs and URLs:</strong> Present DOIs and web links as live, clickable URLs beginning with https://.</span>
              </li>
              <li style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--em)', fontWeight: 700 }}>✓</span>
                <span><strong>Up to 20 Authors:</strong> In the reference list, write out all authors up to 20 before using an ellipsis.</span>
              </li>
              <li style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--em)', fontWeight: 700 }}>✓</span>
                <span><strong>AI Disclosure:</strong> Always provide in-text commentary describing the exact prompts used when referencing LLMs.</span>
              </li>
            </ul>

            <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
              <Link to="/consultation" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                Book Referencing Check with Librarian
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Interactive Citation Builder */}
        <Reveal className="glass panel" style={{ padding: '36px 32px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span className="typetag" style={{ marginBottom: 8, display: 'inline-block' }}>Interactive Tool</span>
              <h3 style={{ fontSize: 28 }}>Generate Your Custom Citation</h3>
              <p style={{ color: 'var(--sub)', fontSize: 14.5, marginTop: 6 }}>
                Fill in the known source details below to generate ready-to-paste APA 7th entries.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
              {[
                { id: 'website', label: 'Webpage / Online Article' },
                { id: 'journal', label: 'Scholarly Journal' },
                { id: 'book', label: 'Book / Textbook' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`tab${genType === t.id ? ' on' : ''}`}
                  onClick={() => setGenType(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                  Author (Surname, Initial.)
                </label>
                <div className="sbox">
                  <input
                    type="text"
                    placeholder="e.g. Mitchell, J. A."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{ paddingLeft: 14 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                  Year of Publication
                </label>
                <div className="sbox">
                  <input
                    type="text"
                    placeholder="e.g. 2026 or n.d."
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{ paddingLeft: 14 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                  Title of Work
                </label>
                <div className="sbox">
                  <input
                    type="text"
                    placeholder="e.g. Best practices in vocational nursing"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ paddingLeft: 14 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                  Publisher / Publication Name
                </label>
                <div className="sbox">
                  <input
                    type="text"
                    placeholder="e.g. Department of Education / Oxford Press"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    style={{ paddingLeft: 14 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                URL or DOI Link (Optional)
              </label>
              <div className="sbox">
                <input
                  type="text"
                  placeholder="e.g. https://doi.org/10.1016/j.edu.2026.01.002"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ paddingLeft: 14 }}
                />
              </div>
            </div>

            {/* Generated output */}
            <div style={{ background: 'rgba(2,14,9,0.7)', borderRadius: 14, padding: 20, border: '1px solid var(--line-gold)' }}>
              <small style={{ color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                Generated Output:
              </small>
              <CiteRow label="Reference List Entry" text={formattedRef()} onCopy={handleCopy} />
              <div style={{ marginTop: 12 }}>
                <CiteRow label="In-Text Citation" text={formattedInText()} onCopy={handleCopy} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
