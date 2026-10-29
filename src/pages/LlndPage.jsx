import { useState } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';

const LLND_PILLARS = [
  {
    title: 'Language & Grammar',
    icon: 'book',
    desc: 'Structuring academic sentences, using vocational terminology accurately, active vs passive voice, and avoiding colloquialisms.',
    resources: ['Essay & Report Sentence Starters', 'Glossary of VET Assessment Action Verbs', 'Common Australian Spelling vs US Spelling'],
  },
  {
    title: 'Literacy & Reading',
    icon: 'newspaper',
    desc: 'Techniques for skimming and scanning complex industry guidelines, extracting key regulations, and synthesizing source texts.',
    resources: ['SQ3R Active Reading Method', 'How to Deconstruct Assessment Rubrics', 'Annotated Bibliography Template'],
  },
  {
    title: 'Numeracy & Math',
    icon: 'listCheck',
    desc: 'Formulas, unit conversions, medication dosages, commercial kitchen ratios, construction tolerances, and assessment math.',
    resources: ['Metric & Imperial Conversion Tables', 'Percentages, Ratios and Fractions Guide', 'Graph & Chart Interpretation Checklist'],
  },
  {
    title: 'Digital Skills',
    icon: 'play',
    desc: 'Navigating LMS portals (Moodle), uploading assignments, managing Google Docs/Word styles, digital security, and cloud storage.',
    resources: ['11-Lesson Microsoft Word Masterclass', 'PDF Merging & Digital Signature Tutorial', 'Verifying USI Transcripts Online'],
  },
];

export default function LlndPage({ onNotify }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="page page-llnd" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div className="wrap">
        <Reveal className="sh">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Link to="/" className="btn btn-ghost btn-sm">
              <Icon name="arrow" style={{ transform: 'rotate(180deg)', width: 16, height: 16 }} /> Back to Home
            </Link>
            <span className="chip" style={{ opacity: 1, animation: 'none' }}>
              <Icon name="lock" style={{ width: 14, height: 14, color: 'var(--em)' }} />
              My LLND Support Portal
            </span>
          </div>
          <h2>Language, Literacy, Numeracy & Digital Skills</h2>
          <p>
            Tailored learning support to build your academic confidence. Strengthen the foundational skills required across every vocational qualification.
          </p>
        </Reveal>

        {/* 4 Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 40 }}>
          {LLND_PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="rcard glass c-em" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <span className="ico"><Icon name={p.icon} /></span>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--sub)', marginBottom: 16, flex: 1 }}>{p.desc}</p>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                  <small style={{ color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: 8 }}>Included Tools:</small>
                  <ul style={{ fontSize: 12.5, color: '#cfe3d8', display: 'grid', gap: 6 }}>
                    {p.resources.map((r) => (
                      <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--em)' }}>•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Self-Assessment Quick Tool */}
        <Reveal className="glass panel" style={{ padding: '36px 32px', marginBottom: 40 }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span className="typetag" style={{ marginBottom: 8, display: 'inline-block' }}>Confidential Assessment</span>
              <h3 style={{ fontSize: 26 }}>Request a Diagnostic LLND Assessment</h3>
              <p style={{ color: 'var(--sub)', fontSize: 14, marginTop: 6 }}>
                Every vocational course has ACSF (Australian Core Skills Framework) requirements. If you feel unsure about assessment math or report writing, our specialized LLND coaches can help.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div className="glass" style={{ padding: 18, borderRadius: 14, textAlign: 'center' }}>
                <b style={{ fontSize: 24, color: 'var(--gold)', display: 'block', marginBottom: 4 }}>Level 1-2</b>
                <span style={{ fontSize: 13, color: 'var(--sub)' }}>Guided Step-by-Step Tutoring</span>
              </div>
              <div className="glass" style={{ padding: 18, borderRadius: 14, textAlign: 'center' }}>
                <b style={{ fontSize: 24, color: 'var(--em)', display: 'block', marginBottom: 4 }}>Level 3-4</b>
                <span style={{ fontSize: 13, color: 'var(--sub)' }}>Independent Research Mentoring</span>
              </div>
              <div className="glass" style={{ padding: 18, borderRadius: 14, textAlign: 'center' }}>
                <b style={{ fontSize: 24, color: 'var(--mint)', display: 'block', marginBottom: 4 }}>Level 5</b>
                <span style={{ fontSize: 13, color: 'var(--sub)' }}>Advanced Diploma & TAE Standards</span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to="/consultation" className="btn btn-gold btn-lg">
                Schedule an LLND Confidence Session
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
