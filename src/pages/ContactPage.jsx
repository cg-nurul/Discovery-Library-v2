import { useState } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';

const CAMPUS_LOCATIONS = [
  { city: 'Brisbane', address: 'Level 2, 288 Edward Street, Brisbane QLD 4000', hours: 'Mon–Fri: 8:00 AM – 6:00 PM', email: 'library.bne@aibtglobal.edu.au' },
  { city: 'Sydney', address: 'Level 1, 460 Church Street, Parramatta NSW 2150', hours: 'Mon–Fri: 8:00 AM – 6:00 PM', email: 'library.syd@aibtglobal.edu.au' },
  { city: 'Melbourne', address: 'Level 3, 277 Flinders Lane, Melbourne VIC 3000', hours: 'Mon–Fri: 8:30 AM – 5:30 PM', email: 'library.mel@aibtglobal.edu.au' },
  { city: 'Adelaide', address: 'Level 1, 90 King William Street, Adelaide SA 5000', hours: 'Mon–Fri: 9:00 AM – 5:00 PM', email: 'library.adl@aibtglobal.edu.au' },
  { city: 'Hobart', address: 'Suite 4, 111 Macquarie Street, Hobart TAS 7000', hours: 'Mon–Fri: 9:00 AM – 5:00 PM', email: 'library.hba@aibtglobal.edu.au' },
];

const FAQS = [
  {
    q: 'How do I access peer-reviewed journals for free?',
    a: 'Vocational students have free access to VOCEDplus, Google Scholar, ERIC, and DOAJ via the Useful Links page. No paywalls or external subscriptions are required.',
  },
  {
    q: 'Can I use generative AI (e.g. ChatGPT) for my assessments?',
    a: 'AI may be used as an exploratory research assistant or for brainstorming, but cannot write assessment answers. Any AI ideas must be disclosed with prompts and cited under APA 7th standards.',
  },
  {
    q: 'How do I download session slides or recordings?',
    a: 'Visit the Session Recordings page or Upcoming Sessions tab. Each event provides direct links to streaming video archives and downloadable companion slides.',
  },
  {
    q: 'Are library consultations completely free?',
    a: 'Yes, 100% free of charge for all enrolled vocational students across certificate, diploma, and advanced diploma qualifications.',
  },
];

export default function ContactPage({ onNotify }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [contactMsg, setContactMsg] = useState({ name: '', email: '', message: '' });

  const handleSend = (e) => {
    e.preventDefault();
    if (!contactMsg.name || !contactMsg.email) return;
    if (onNotify) onNotify(`Thank you ${contactMsg.name}! Your enquiry has been received.`);
    setContactMsg({ name: '', email: '', message: '' });
  };

  return (
    <div className="page page-contact" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div className="wrap">
        <Reveal className="sh">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Link to="/" className="btn btn-ghost btn-sm">
              <Icon name="arrow" style={{ transform: 'rotate(180deg)', width: 16, height: 16 }} /> Back to Home
            </Link>
            <span className="chip" style={{ opacity: 1, animation: 'none' }}>
              <Icon name="link" style={{ width: 14, height: 14, color: 'var(--gold)' }} />
              Student Support Services
            </span>
          </div>
          <h2>Contact Us & Campus Library Hubs</h2>
          <p>
            Connect with our library staff in person at any campus location or submit an inquiry online.
          </p>
        </Reveal>

        {/* Campuses Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 48 }}>
          {CAMPUS_LOCATIONS.map((c, i) => (
            <Reveal key={c.city} delay={i * 0.06}>
              <div className="glass panel" style={{ height: '100%', padding: 22 }}>
                <span className="typetag" style={{ marginBottom: 10, display: 'inline-block' }}>{c.city} Campus</span>
                <h3 style={{ fontSize: 18, marginBottom: 6 }}>{c.city} Library Hub</h3>
                <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.5, marginBottom: 12 }}>{c.address}</p>
                <div style={{ fontSize: 12.5, color: '#cfe3d8', display: 'grid', gap: 4 }}>
                  <div>🕒 {c.hours}</div>
                  <div>✉️ {c.email}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Form and FAQ */}
        <div className="split" style={{ alignItems: 'start' }}>
          {/* Contact Form */}
          <Reveal className="glass panel" style={{ padding: '32px 28px' }}>
            <h3 style={{ fontSize: 22, marginBottom: 16 }}>Send a Library Inquiry</h3>
            <form onSubmit={handleSend} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Name</label>
                <div className="sbox">
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={contactMsg.name}
                    onChange={(e) => setContactMsg({ ...contactMsg, name: e.target.value })}
                    style={{ paddingLeft: 14 }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Email</label>
                <div className="sbox">
                  <input
                    type="email"
                    required
                    placeholder="Your student or staff email"
                    value={contactMsg.email}
                    onChange={(e) => setContactMsg({ ...contactMsg, email: e.target.value })}
                    style={{ paddingLeft: 14 }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Message / Request</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can our librarians help you today?"
                  value={contactMsg.message}
                  onChange={(e) => setContactMsg({ ...contactMsg, message: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(2,14,9,0.7)',
                    border: '1px solid var(--line)',
                    borderRadius: 11,
                    padding: '11px 14px',
                    color: 'var(--cream)',
                    font: '500 14px var(--f-body)',
                  }}
                />
              </div>
              <button type="submit" className="btn btn-gold btn-lg" style={{ justifyContent: 'center' }}>
                Submit Enquiry
              </button>
            </form>
          </Reveal>

          {/* FAQs */}
          <Reveal className="glass panel" delay={0.12} style={{ padding: '32px 28px' }}>
            <h3 style={{ fontSize: 22, marginBottom: 16 }}>Frequently Asked Questions</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    style={{
                      background: 'rgba(2,14,9,0.5)',
                      borderRadius: 12,
                      border: '1px solid var(--line)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '14px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: 600,
                        fontSize: 14,
                        color: isOpen ? 'var(--gold)' : 'var(--cream)',
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ fontSize: 18, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }}>
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 16px 16px', fontSize: 13.5, color: 'var(--sub)', lineHeight: 1.55 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
