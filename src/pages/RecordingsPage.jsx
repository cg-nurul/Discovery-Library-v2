import { useState } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';

const PAST_RECORDINGS = [
  {
    id: 'rec-1',
    title: 'Referencing Clinic: Mastering In-Text Citations & Quotations',
    date: '19 Sep 2026',
    duration: '52 mins',
    facilitator: 'Dr. Evelyn Ward',
    category: 'Referencing',
    desc: 'Deep dive into direct quotations versus paraphrasing, block quotes, and multi-author citation rules under APA 7th.',
  },
  {
    id: 'rec-2',
    title: 'ASQA Compliance Briefing: Evidence Gathering & Competency',
    date: '12 Sep 2026',
    duration: '74 mins',
    facilitator: 'Rachel Green',
    category: 'VET Compliance',
    desc: 'Understanding rules of evidence, authenticity, and student intervention thresholds for accredited qualifications.',
  },
  {
    id: 'rec-3',
    title: 'Research Skills Masterclass: Evaluating Peer-Reviewed Sources',
    date: '05 Sep 2026',
    duration: '48 mins',
    facilitator: 'Marcus Tan',
    category: 'Research Skills',
    desc: 'How to use Google Scholar, VOCEDplus, and Boolean operators to locate high-impact academic journal papers.',
  },
  {
    id: 'rec-4',
    title: 'Numeracy Clinic: Dosage Calculations & Workshop Math',
    date: '29 Aug 2026',
    duration: '60 mins',
    facilitator: 'Dr. Evelyn Ward',
    category: 'Numeracy Support',
    desc: 'Step-by-step breakdown of practical assessment math, conversion formulas, and percentage calculations.',
  },
  {
    id: 'rec-5',
    title: 'Generative AI Guidelines for Vocational Students',
    date: '22 Aug 2026',
    duration: '45 mins',
    facilitator: 'Marcus Tan',
    category: 'AI Ethics',
    desc: 'Clear boundaries on ethical prompt engineering, disclosure statements, and avoiding contract cheating.',
  },
];

export default function RecordingsPage({ onNotify }) {
  const [activeRec, setActiveRec] = useState(null);

  const handlePlay = (rec) => {
    setActiveRec(rec);
    if (onNotify) onNotify(`Playing recording: ${rec.title}`);
  };

  return (
    <div className="page page-recordings" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div className="wrap">
        <Reveal className="sh">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Link to="/" className="btn btn-ghost btn-sm">
              <Icon name="arrow" style={{ transform: 'rotate(180deg)', width: 16, height: 16 }} /> Back to Home
            </Link>
            <span className="chip" style={{ opacity: 1, animation: 'none' }}>
              <Icon name="record" style={{ width: 14, height: 14, color: 'var(--mint)' }} />
              On-Demand Workshop Archive
            </span>
          </div>
          <h2>Session Recordings Archive</h2>
          <p>
            Missed a live session or need to review a concept? Stream all past clinics, workshops, and briefings anytime at your own pace.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gap: 20 }}>
          {PAST_RECORDINGS.map((rec, i) => (
            <Reveal key={rec.id} delay={i * 0.08}>
              <div
                className="glass panel"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(180px, 240px) 1fr auto',
                  gap: 24,
                  alignItems: 'center',
                  padding: 22,
                }}
              >
                <div
                  className="player"
                  style={{
                    height: 120,
                    borderRadius: 12,
                    cursor: 'pointer',
                    background: 'radial-gradient(circle at 60% 40%, rgba(140,247,197,0.25), rgba(6,35,26,0.95))',
                  }}
                  onClick={() => handlePlay(rec)}
                >
                  <span className="pl" style={{ width: 44, height: 44, fontSize: 18 }}>
                    <Icon name="play" />
                  </span>
                  <span className="cap">{rec.duration}</span>
                </div>

                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                    <span className="typetag" style={{ borderColor: 'rgba(140,247,197,0.3)', color: 'var(--mint)' }}>
                      {rec.category}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--sub)' }}>Recorded on {rec.date}</span>
                  </div>
                  <h3 style={{ fontSize: 19, marginBottom: 6 }}>{rec.title}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--sub)' }}>{rec.desc}</p>
                  <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--gold)' }}>
                    Instructor: {rec.facilitator}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <button type="button" className="btn btn-em" onClick={() => handlePlay(rec)}>
                    <Icon name="play" style={{ width: 14, height: 14 }} /> Watch Recording
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      if (onNotify) onNotify(`Session slides for "${rec.title}" downloaded.`);
                    }}
                  >
                    Slides PDF
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Playback Modal */}
      {activeRec && (
        <div className="backdrop show" role="dialog" aria-modal="true" onClick={() => setActiveRec(null)}>
          <div className="modal" style={{ width: 720 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span className="typetag">{activeRec.category} · {activeRec.duration}</span>
              <button type="button" className="copy" onClick={() => setActiveRec(null)}>Close</button>
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>{activeRec.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 16 }}>
              Facilitated by {activeRec.facilitator} · Recorded {activeRec.date}
            </p>

            <div
              style={{
                aspectRatio: '16/9',
                background: '#041810',
                borderRadius: 14,
                border: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'var(--em)',
                  color: '#01160e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="play" style={{ width: 28, height: 28 }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Streaming Full Recording</span>
              <span style={{ fontSize: 12, color: 'var(--sub)' }}>Archived Cloud Stream (1080p 60fps)</span>
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Link to="/referencing" className="btn btn-ghost" onClick={() => setActiveRec(null)}>
                Cite This Lecture
              </Link>
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => {
                  if (onNotify) onNotify('Full transcript (.vtt/.txt) downloaded.');
                }}
              >
                Download Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
