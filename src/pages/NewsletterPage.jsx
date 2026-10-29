import { useState } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';

const NEWSLETTERS = [
  {
    issue: 'Issue 42 — October 2026',
    title: 'Navigating New ASQA Evidence Standards & AI in Capstone Projects',
    date: 'October 15, 2026',
    summary: 'A look into the revised TAE and vocational assessment guidelines, how trainers can verify evidence authenticity, and new generative AI referencing requirements under APA 7th.',
    readTime: '6 min read',
    tags: ['ASQA Standards', 'AI Policies', 'Library Update'],
  },
  {
    issue: 'Issue 41 — September 2026',
    title: 'Digital Literacies in 2026: Beyond Basic Word Processing',
    date: 'September 12, 2026',
    summary: 'Introducing the 11-lesson Microsoft Word Masterclass on Discovery Library. Plus: Top academic databases accessible to every vocational learner without paid paywalls.',
    readTime: '5 min read',
    tags: ['MS Word Series', 'Student Tools', 'VOCEDplus'],
  },
  {
    issue: 'Issue 40 — August 2026',
    title: 'Academic Momentum: Staying on Track During Rolling Intakes',
    date: 'August 18, 2026',
    summary: 'Proven strategies for students balancing work commitments with vocational certificates. Discover how one-on-one LLND support sessions boost course completion rates.',
    readTime: '4 min read',
    tags: ['LLND Support', 'Study Strategies', 'Campus Life'],
  },
];

export default function NewsletterPage({ onNotify }) {
  const [subEmail, setSubEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    if (onNotify) onNotify(`Thank you! ${subEmail} has been subscribed to Discovery Herald.`);
    setSubEmail('');
  };

  return (
    <div className="page page-newsletter" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div className="wrap">
        <Reveal className="sh">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Link to="/" className="btn btn-ghost btn-sm">
              <Icon name="arrow" style={{ transform: 'rotate(180deg)', width: 16, height: 16 }} /> Back to Home
            </Link>
            <span className="chip" style={{ opacity: 1, animation: 'none' }}>
              <Icon name="newspaper" style={{ width: 14, height: 14, color: 'var(--gold)' }} />
              The Discovery Herald Archive
            </span>
          </div>
          <h2>Discovery Library Newsletters</h2>
          <p>
            Monthly updates, academic writing tips, VET sector updates, and announcements from the Discovery Library team.
          </p>
        </Reveal>

        {/* Subscribe banner */}
        <Reveal className="glass panel" style={{ marginBottom: 40, padding: '30px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Subscribe to Monthly Editions</h3>
              <p style={{ fontSize: 14, color: 'var(--sub)' }}>
                Receive research highlights, clinic invitations, and APA updates right to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10 }}>
              <input
                type="email"
                required
                placeholder="Enter your student or staff email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                style={{
                  background: 'rgba(2,14,9,0.7)',
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                  padding: '10px 16px',
                  color: 'var(--cream)',
                  minWidth: 260,
                }}
              />
              <button type="submit" className="btn btn-gold">
                Subscribe
              </button>
            </form>
          </div>
        </Reveal>

        {/* Issues */}
        <div style={{ display: 'grid', gap: 24 }}>
          {NEWSLETTERS.map((item, idx) => (
            <Reveal key={item.issue} delay={idx * 0.08}>
              <div className="glass panel" style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span className="badge-new" style={{ margin: 0 }}>{item.issue}</span>
                  <span style={{ fontSize: 13, color: 'var(--sub)' }}>{item.date} · {item.readTime}</span>
                </div>
                <h3 style={{ fontSize: 22, margin: '8px 0 10px' }}>{item.title}</h3>
                <p style={{ fontSize: 14.5, color: 'var(--sub)', lineHeight: 1.6, marginBottom: 16 }}>
                  {item.summary}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {item.tags.map((t) => (
                      <span key={t} className="typetag" style={{ fontSize: 11 }}>{t}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      if (onNotify) onNotify(`Opening "${item.title}" digital reader.`);
                    }}
                  >
                    Read Full Edition ↗
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
