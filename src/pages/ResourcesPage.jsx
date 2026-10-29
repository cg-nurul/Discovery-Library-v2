import { useState } from 'react';
import Icon from '../components/ui/Icon';
import Link from '../components/ui/Link';
import Reveal from '../components/ui/Reveal';

const DIRECTORY = [
  {
    category: 'Academic Search & Research Databases',
    items: [
      {
        name: 'VOCEDplus',
        desc: 'The National Centre for Vocational Education Research (NCVER) free international research database for VET.',
        url: 'https://www.voced.edu.au',
        tag: 'VET Research',
        icon: 'book',
      },
      {
        name: 'Google Scholar',
        desc: 'Freely accessible search engine indexing full text or metadata of scholarly literature across disciplines.',
        url: 'https://scholar.google.com',
        tag: 'General Academic',
        icon: 'search',
      },
      {
        name: 'ERIC (Education Resources Info Center)',
        desc: 'Comprehensive online library of education research and information sponsored by the Institute of Education Sciences.',
        url: 'https://eric.ed.gov',
        tag: 'Education',
        icon: 'book',
      },
      {
        name: 'Trove (National Library of Australia)',
        desc: 'Discover Australian research papers, historical archives, government gazettes, and published texts.',
        url: 'https://trove.nla.gov.au',
        tag: 'Australian Archives',
        icon: 'link',
      },
    ],
  },
  {
    category: 'VET Standards & Compliance Portals',
    items: [
      {
        name: 'training.gov.au (TGA)',
        desc: 'The official national register of information on Training Packages, Qualifications, Courses, and RTOs.',
        url: 'https://training.gov.au',
        tag: 'Official Register',
        icon: 'listCheck',
      },
      {
        name: 'ASQA (Australian Skills Quality Authority)',
        desc: 'National regulator for Australia’s vocational education and training sector, providing standards and student guides.',
        url: 'https://www.asqa.gov.au',
        tag: 'Regulatory',
        icon: 'lock',
      },
      {
        name: 'Unique Student Identifier (USI)',
        desc: 'Access your authenticated USI transcript and verify vocational training records across providers.',
        url: 'https://www.usi.gov.au',
        tag: 'Student Transcript',
        icon: 'lock',
      },
    ],
  },
  {
    category: 'Academic Writing & Study Tools',
    items: [
      {
        name: 'APA Style Central (7th Edition)',
        desc: 'Official APA referencing style blog and answers to complex electronic referencing dilemmas.',
        url: 'https://apastyle.apa.org',
        tag: 'Citation Standard',
        icon: 'listCheck',
      },
      {
        name: 'Purdue OWL (Online Writing Lab)',
        desc: 'World-renowned writing resources, formatting guidelines, and sample academic papers.',
        url: 'https://owl.purdue.edu',
        tag: 'Writing Guide',
        icon: 'newspaper',
      },
      {
        name: 'Zotero Reference Manager',
        desc: 'Free, easy-to-use tool to help you collect, organize, annotate, cite, and share research.',
        url: 'https://www.zotero.org',
        tag: 'Software',
        icon: 'link',
      },
    ],
  },
];

export default function ResourcesPage({ onNotify }) {
  const [filterQuery, setFilterQuery] = useState('');

  return (
    <div className="page page-resources" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div className="wrap">
        <Reveal className="sh">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Link to="/" className="btn btn-ghost btn-sm">
              <Icon name="arrow" style={{ transform: 'rotate(180deg)', width: 16, height: 16 }} /> Back to Home
            </Link>
            <span className="chip" style={{ opacity: 1, animation: 'none' }}>
              <Icon name="book" style={{ width: 14, height: 14, color: 'var(--gold)' }} />
              Research & Digital Catalogs
            </span>
          </div>
          <h2>Library Resources & Useful Links</h2>
          <p>
            Curated repository of academic search engines, research databases, VET national frameworks, and writing assistance tools.
          </p>
        </Reveal>

        {/* Search */}
        <Reveal className="glass panel" style={{ marginBottom: 36, padding: '16px 20px' }}>
          <div className="sbox">
            <Icon name="search" />
            <input
              type="text"
              placeholder="Filter databases, journals, official registers, or writing aids..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              aria-label="Filter library links"
            />
          </div>
        </Reveal>

        {/* Directory Categorized */}
        <div style={{ display: 'grid', gap: 40 }}>
          {DIRECTORY.map((cat, cIdx) => {
            const items = cat.items.filter(
              (it) =>
                !filterQuery ||
                it.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
                it.desc.toLowerCase().includes(filterQuery.toLowerCase()) ||
                it.tag.toLowerCase().includes(filterQuery.toLowerCase())
            );

            if (items.length === 0) return null;

            return (
              <div key={cat.category}>
                <Reveal delay={cIdx * 0.1}>
                  <h3 style={{ fontSize: 22, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
                    {cat.category}
                  </h3>
                </Reveal>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                  {items.map((it, iIdx) => (
                    <Reveal key={it.name} delay={iIdx * 0.05}>
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rcard glass c-gold"
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        onClick={() => {
                          if (onNotify) onNotify(`Opening external catalog: ${it.name}`);
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                          <span className="ico"><Icon name={it.icon} /></span>
                          <span className="typetag" style={{ fontSize: 11 }}>{it.tag}</span>
                        </div>
                        <h4 style={{ fontSize: 18, margin: '0 0 6px' }}>{it.name}</h4>
                        <p style={{ fontSize: 13.5, color: 'var(--sub)', flex: 1 }}>{it.desc}</p>
                        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 10 }}>
                          <span style={{ fontSize: 12.5, color: 'var(--gold)', fontWeight: 600 }}>
                            Access Catalog ↗
                          </span>
                          <span className="go"><Icon name="arrow" /></span>
                        </div>
                      </a>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Reveal style={{ marginTop: 50 }}>
          <div className="cta-band" style={{ padding: '40px 32px' }}>
            <h2>Need help locating a specific journal or article?</h2>
            <p>Our library staff can request inter-library articles or guide your literature search.</p>
            <div className="row">
              <Link to="/consultation" className="btn btn-gold btn-lg">Ask a Librarian</Link>
              <Link to="/referencing" className="btn btn-ghost btn-lg">APA Referencing Guides</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
