import { useState } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';
import { SESSIONS } from '../data';

const ADDITIONAL_SESSIONS = [
  ...SESSIONS,
  {
    cat: 'workshop',
    type: 'Workshop',
    title: 'Academic Writing Fundamentals: Structuring VET Reports',
    d: '31',
    mon: 'Oct',
    wd: 'Sat',
    time: '11:00 AM – 12:30 PM AEDT',
    iso: '2026-10-31T00:00:00Z',
    facilitator: 'Dr. Evelyn Ward, Senior Academic Mentor',
    location: 'Virtual Classroom via Zoom & Sydney Campus Library Hub',
    seats: 18,
  },
  {
    cat: 'live',
    type: 'Live session',
    title: 'Digital Literacy Clinic: Managing Moodle, Portfolios & USI Transcripts',
    d: '07',
    mon: 'Nov',
    wd: 'Sat',
    time: '2:00 PM – 3:30 PM AEDT',
    iso: '2026-11-07T03:00:00Z',
    facilitator: 'Marcus Tan, Learning Technologies Coordinator',
    location: 'Virtual Classroom & Melbourne Campus Library Hub',
    seats: 25,
  },
  {
    cat: 'webinar',
    type: 'Webinar',
    title: 'Copyright & Plagiarism in Australian Vocational Education',
    d: '14',
    mon: 'Nov',
    wd: 'Sat',
    time: '3:00 PM – 4:00 PM AEDT',
    iso: '2026-11-14T04:00:00Z',
    facilitator: 'Rachel Green, Chief Librarian & Compliance Lead',
    location: 'All Campuses Live Broadcast',
    seats: 40,
  },
];

export default function SessionsPage({ onNotify }) {
  const [filter, setFilter] = useState('all');
  const [rsvpSession, setRsvpSession] = useState(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [confirmedSessions, setConfirmedSessions] = useState(new Set());

  const filtered = ADDITIONAL_SESSIONS.filter((s) => {
    if (filter === 'all') return true;
    return s.cat === filter;
  });

  const handleBook = (s) => {
    setRsvpSession(s);
  };

  const submitRsvp = (e) => {
    e.preventDefault();
    if (!studentEmail.trim()) return;
    setConfirmedSessions((prev) => new Set([...prev, rsvpSession.title]));
    if (onNotify) onNotify(`RSVP confirmed for "${rsvpSession.title}". Calendar invite sent to ${studentEmail}!`);
    setRsvpSession(null);
    setStudentEmail('');
  };

  return (
    <div className="page page-sessions" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div className="wrap">
        <Reveal className="sh">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Link to="/" className="btn btn-ghost btn-sm">
              <Icon name="arrow" style={{ transform: 'rotate(180deg)', width: 16, height: 16 }} /> Back to Home
            </Link>
            <span className="chip" style={{ opacity: 1, animation: 'none' }}>
              <span className="live" />
              Upcoming Academic Calendar · 2026
            </span>
          </div>
          <h2>Live Sessions, Clinics & Webinars</h2>
          <p>
            Interactive workshops and referencing clinics led by academic advisors and VET trainers. Join online or attend in person at your campus library.
          </p>
        </Reveal>

        {/* Filters */}
        <Reveal className="glass panel" style={{ marginBottom: 32, padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--sub)', marginRight: 6 }}>Filter Session Type:</span>
            {[
              { id: 'all', label: 'All Sessions' },
              { id: 'live', label: 'Live Clinics' },
              { id: 'workshop', label: 'Workshops' },
              { id: 'webinar', label: 'Webinars' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                className={`tab${filter === f.id ? ' on' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Sessions List */}
        <div style={{ display: 'grid', gap: 16 }}>
          {filtered.map((s, idx) => {
            const isConfirmed = confirmedSessions.has(s.title);
            return (
              <Reveal key={s.title} delay={idx * 0.06}>
                <div
                  className={`glass panel c-${s.cat}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(60px, 80px) 1fr auto',
                    gap: 24,
                    alignItems: 'center',
                    padding: '24px 28px',
                    borderColor: isConfirmed ? 'var(--em)' : undefined,
                  }}
                >
                  <div className="datebadge" style={{ width: 72, height: 76 }}>
                    <b style={{ fontSize: 26 }}>{s.d}</b>
                    <span style={{ fontSize: 13 }}>{s.mon}</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span className="typetag">{s.type}</span>
                      <span style={{ fontSize: 13, color: 'var(--sub)' }}>{s.wd} · {s.time}</span>
                      {isConfirmed && (
                        <span className="badge-new" style={{ margin: 0, background: 'var(--em)', color: '#01160e' }}>
                          ✓ Registered
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 20, marginBottom: 6 }}>{s.title}</h3>
                    <p style={{ fontSize: 13.5, color: 'var(--sub)' }}>
                      Facilitator: {s.facilitator || 'Discovery Library Academic Team'} · Location: {s.location || 'Online via Zoom (Link sent on RSVP)'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                    <button
                      type="button"
                      className={isConfirmed ? 'btn btn-ghost' : 'btn btn-gold'}
                      onClick={() => handleBook(s)}
                    >
                      <Icon name="calendar" style={{ width: 16, height: 16 }} />
                      {isConfirmed ? 'Edit Registration' : 'Reserve Spot (Free)'}
                    </button>
                    <span style={{ fontSize: 12, color: 'var(--sub)' }}>
                      {s.seats || 20} spots remaining
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Booking Consultation Callout */}
        <Reveal style={{ marginTop: 48 }}>
          <div className="cta-band" style={{ padding: '40px 32px' }}>
            <h2>Need 1-on-1 assistance with your timetable or assignments?</h2>
            <p>Our academic skills advisors are available for private consultations at all campuses and online.</p>
            <div className="row">
              <Link to="/consultation" className="btn btn-gold btn-lg">Book a Private Consultation</Link>
              <Link to="/referencing" className="btn btn-ghost btn-lg">Explore Referencing Guides</Link>
            </div>
          </div>
        </Reveal>
      </div>

      {/* RSVP Modal */}
      {rsvpSession && (
        <div className="backdrop show" role="dialog" aria-modal="true" onClick={() => setRsvpSession(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="typetag">{rsvpSession.type}</span>
              <button type="button" className="copy" onClick={() => setRsvpSession(null)}>Cancel</button>
            </div>
            <h3 style={{ fontSize: 22, marginBottom: 8 }}>{rsvpSession.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--sub)', marginBottom: 20 }}>
              📅 {rsvpSession.wd}, {rsvpSession.d} {rsvpSession.mon} · {rsvpSession.time}
            </p>

            <form onSubmit={submitRsvp} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Student Email / ID
                </label>
                <div className="sbox">
                  <input
                    type="email"
                    required
                    placeholder="e.g. s123456@aibtglobal.edu.au"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    style={{ paddingLeft: 14 }}
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(2,14,9,0.5)', padding: 14, borderRadius: 10, border: '1px solid var(--line)' }}>
                <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.5 }}>
                  ✓ Zoom meeting details & calendar invitation will be dispatched immediately.<br />
                  ✓ Slides and recording access provided after the session.
                </p>
              </div>

              <button type="submit" className="btn btn-gold btn-lg" style={{ justifyContent: 'center' }}>
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
