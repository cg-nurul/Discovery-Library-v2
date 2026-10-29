import { useState, useMemo } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import { WORD_LESSONS, SEARCH_VIDEOS } from '../data';

const VIDEO_CATEGORIES = [
  { id: 'all', label: 'All Lessons & Videos' },
  { id: 'word', label: 'Microsoft Word (11 Lessons)' },
  { id: 'ai', label: 'AI & Academic Integrity' },
  { id: 'vet', label: 'VET & ASQA Standards' },
  { id: 'student', label: 'Student Support & Welfare' },
];

const EXTENDED_VIDEOS = [
  ...SEARCH_VIDEOS.map(([title, desc], index) => {
    let cat = 'vet';
    if (title.toLowerCase().includes('ai')) cat = 'ai';
    else if (title.toLowerCase().includes('student') || title.toLowerCase().includes('counselling') || title.toLowerCase().includes('wellbeing')) cat = 'student';
    return {
      id: `vid-${index}`,
      title,
      desc,
      cat,
      duration: `${10 + (index % 15)} mins`,
      views: `${140 + index * 27}`,
      level: index % 3 === 0 ? 'Foundation' : index % 3 === 1 ? 'Intermediate' : 'Advanced',
    };
  }),
  ...WORD_LESSONS.map((title, i) => ({
    id: `word-${i}`,
    title: `MS Word Lesson ${i + 1}: ${title}`,
    desc: `Comprehensive hands-on tutorial on ${title.toLowerCase()} for vocational reports and assessment portfolios.`,
    cat: 'word',
    duration: `${6 + i * 2} mins`,
    views: `${320 + i * 45}`,
    level: i < 3 ? 'Foundation' : 'Intermediate',
  })),
];

export default function VideosPage({ onNotify }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const filteredVideos = useMemo(() => {
    return EXTENDED_VIDEOS.filter((v) => {
      const matchCat = selectedCat === 'all' || v.cat === selectedCat;
      const matchSearch =
        !search ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCat, search]);

  const handlePlay = (video) => {
    setActiveVideo(video);
    if (onNotify) onNotify(`Opening "${video.title}"`);
  };

  return (
    <div className="page page-videos" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div className="wrap">
        <Reveal className="sh">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Link to="/" className="btn btn-ghost btn-sm">
              <Icon name="arrow" style={{ transform: 'rotate(180deg)', width: 16, height: 16 }} /> Back to Home
            </Link>
            <span className="chip" style={{ opacity: 1, animation: 'none' }}>
              <Icon name="play" style={{ width: 14, height: 14, color: 'var(--gold)' }} />
              {EXTENDED_VIDEOS.length} Educational Tutorials
            </span>
          </div>
          <h2>Training Videos & Masterclasses</h2>
          <p>
            Curated on-demand lessons covering Microsoft Office formatting, VET regulatory compliance, ethical generative AI usage, and student success skills.
          </p>
        </Reveal>

        {/* Filter Bar & Search */}
        <Reveal className="glass panel" style={{ marginBottom: 36, padding: '18px 22px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="tabs" role="tablist" style={{ margin: 0 }}>
              {VIDEO_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedCat === cat.id}
                  className={`tab${selectedCat === cat.id ? ' on' : ''}`}
                  onClick={() => setSelectedCat(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="sbox" style={{ minWidth: 260 }}>
              <Icon name="search" />
              <input
                type="text"
                placeholder="Search training video topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Filter videos"
              />
            </div>
          </div>
        </Reveal>

        {/* Video Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filteredVideos.map((vid, idx) => (
            <Reveal key={vid.id} delay={Math.min(0.3, idx * 0.05)}>
              <div
                className="rcard glass c-em"
                style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
                onClick={() => handlePlay(vid)}
              >
                <div
                  className="player"
                  style={{
                    height: 160,
                    marginBottom: 16,
                    borderRadius: 14,
                    background: 'radial-gradient(circle at 40% 30%, rgba(25,214,138,0.25), rgba(6,35,26,0.9))',
                  }}
                >
                  <span className="pl" style={{ width: 48, height: 48, fontSize: 20 }}>
                    <Icon name="play" />
                  </span>
                  <span className="cap">{vid.duration}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span className="typetag" style={{ fontSize: 11 }}>{vid.level}</span>
                  <span style={{ fontSize: 12, color: 'var(--sub)' }}>{vid.views} students viewed</span>
                </div>
                <h3 style={{ fontSize: 18, margin: '4px 0 8px' }}>{vid.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--sub)', flex: 1 }}>{vid.desc}</p>
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="video" style={{ width: 16, height: 16 }} /> Watch Lesson
                  </span>
                  <span className="go"><Icon name="arrow" /></span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="glass panel" style={{ textAlign: 'center', padding: '60px 20px', marginTop: 20 }}>
            <Icon name="search" style={{ width: 44, height: 44, color: 'var(--sub)', margin: '0 auto 16px' }} />
            <h3>No video lessons matched "{search}"</h3>
            <p style={{ color: 'var(--sub)', marginTop: 8 }}>Try adjusting your keywords or clearing the category filter.</p>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 20 }}
              onClick={() => { setSelectedCat('all'); setSearch(''); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Video Playback Modal */}
      {activeVideo && (
        <div className="backdrop show" role="dialog" aria-modal="true" onClick={() => setActiveVideo(null)}>
          <div
            className="modal"
            style={{ width: 780, maxWidth: '95vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <span className="typetag" style={{ marginBottom: 6, display: 'inline-block' }}>{activeVideo.level} · {activeVideo.duration}</span>
                <h3 style={{ fontSize: 22, marginTop: 4 }}>{activeVideo.title}</h3>
              </div>
              <button
                type="button"
                className="copy"
                onClick={() => setActiveVideo(null)}
                style={{ fontSize: 14, padding: '6px 12px' }}
              >
                Close
              </button>
            </div>

            {/* Simulated Interactive Video Screen */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '16/9',
                borderRadius: 16,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #06231a 0%, #03140d 100%)',
                border: '1px solid var(--line-gold)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 24,
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="chip" style={{ background: 'rgba(3,20,13,0.85)', opacity: 1, animation: 'none' }}>
                  <span className="live" /> HD 1080p · Discovery Library VET Channel
                </span>
                <span style={{ fontSize: 13, color: 'var(--sub)' }}>Lesson Module #04</span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFD860, #FFB020)',
                    color: 'var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 0 30px rgba(255,200,58,0.5)',
                  }}
                >
                  <Icon name="play" style={{ width: 32, height: 32 }} />
                </div>
                <h4 style={{ fontSize: 18, color: '#fff' }}>Streaming Video Ready</h4>
                <p style={{ fontSize: 13, color: 'var(--sub)', marginTop: 4 }}>
                  Comprehensive instructional walkthrough with accredited trainer commentary.
                </p>
              </div>

              {/* Fake progress bar */}
              <div>
                <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: 2, marginBottom: 8 }}>
                  <div style={{ height: '100%', width: '35%', background: 'var(--gold)', borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--sub)' }}>
                  <span>04:12 / {activeVideo.duration}</span>
                  <span>Audio & Subtitles (EN) Enabled</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <h4 style={{ fontSize: 15, marginBottom: 6 }}>Lesson Overview</h4>
              <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.6 }}>{activeVideo.desc}</p>
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => {
                  if (onNotify) onNotify('Handout & assessment guide downloaded');
                }}
              >
                <Icon name="book" style={{ width: 16, height: 16 }} /> Download Companion Notes
              </button>
              <Link to="/referencing" className="btn btn-ghost" onClick={() => setActiveVideo(null)}>
                Cite This Source in APA 7th
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
