/**
 * Discovery Library — Homepage (header + footer included)
 *
 * Setup:
 *   npm i three@0.128.0      (pinned to match the reference's lighting exactly)
 *
 * Usage:
 *   import DiscoveryLibraryHome from './DiscoveryLibraryHome';
 *   <DiscoveryLibraryHome />
 *
 * Notes:
 *  - All internal links go through <Link>. It renders plain "#/route" hrefs like the
 *    reference. To use React Router, change the body of <Link> to <RouterLink to={to} />.
 *  - Styles are injected as global CSS (same as the reference, which is a full-page design).
 *    Move the CSS string into a .css file if you prefer.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/* ============================== DATA ============================== */

const SESSIONS = [
  { cat: 'live', type: 'Live session', title: 'Referencing Clinic: APA 7th Edition', d: '26', mon: 'Sep', wd: 'Sat', time: '3:00 PM – 4:00 PM AEST', iso: '2026-09-26T05:00:00Z' },
  { cat: 'workshop', type: 'Workshop', title: 'Research Skills Workshop: Finding Credible Sources', d: '03', mon: 'Oct', wd: 'Sat', time: '10:00 AM – 11:30 AM AEST', iso: '2026-10-03T00:00:00Z' },
  { cat: 'webinar', type: 'Webinar', title: 'Using AI Responsibly in Your Coursework', d: '10', mon: 'Oct', wd: 'Sat', time: '11:00 AM – 12:00 PM AEDT', iso: '2026-10-10T00:00:00Z' },
  { cat: 'workshop', type: 'Workshop', title: 'Numeracy Clinic: Assessment Math & Measurements', d: '17', mon: 'Oct', wd: 'Sat', time: '2:00 PM – 3:30 PM AEDT', iso: '2026-10-17T03:00:00Z' },
  { cat: 'live', type: 'Live session', title: 'ASQA Standards Update: Information Briefing', d: '24', mon: 'Oct', wd: 'Sat', time: '1:00 PM – 2:30 PM AEDT', iso: '2026-10-24T02:00:00Z' },
];

function nextSession() {
  const now = Date.now();
  return SESSIONS.find((s) => new Date(s.iso).getTime() > now) || SESSIONS[0];
}

const WORD_LESSONS = [
  'Opening & Quitting the Program',
  'How to Create a Document, Add & Format Text',
  'Page Formatting',
  'Paragraph Formatting',
  'Word Formatting Styles',
];

const RES_CARDS = [
  { to: '/videos', cls: 'c-em', icon: 'play', t: 'Training Videos', d: 'Curated video lessons on VET compliance, technology, and assessor standards.' },
  { to: '/links', cls: 'c-gold', icon: 'link', t: 'Useful Links & Tools', d: 'Directory of academic search engines, research databases, and style manuals.' },
  { to: '/recordings', cls: 'c-mint', icon: 'rewind', t: 'Session Recordings', d: 'Catch up on past live clinics, workshops, and compliance briefings anytime.' },
  { to: '/sessions', cls: 'c-amber', icon: 'calendar', t: 'Upcoming Sessions', d: 'Live referencing clinics, numeracy workshops, and ASQA webinars.', isNew: true },
];

const QUICK = [
  { k: 'Journal article', ref: 'Lee, A. (2023). Enhancing student engagement in vocational education. Journal of VET Research, 12(3), 45–60. https://doi.org/10.1016/j.vet.2023.01.004', it: '(Lee, 2023)', n: 'Include volume, issue in parentheses, page range, and DOI URL whenever available.' },
  { k: 'Webpage', ref: 'Nguyen, T. (2025, May 12). Managing academic momentum in blended learning. Discovery Learning Insights. https://discoverylibrary.com.au/resources/momentum', it: '(Nguyen, 2025)', n: 'Include the site name when it differs from the author. Provide full URL.' },
  { k: 'Blog post', ref: 'Patel, R. (2025, June 3). Five principles for responsible AI usage in TAFE and VET. Education Tomorrow. https://educationtomorrow.edu.au/ai-principles', it: '(Patel, 2025)', n: 'Format like a webpage, specifying the specific blog publication name.' },
  { k: 'Ebook', ref: 'Smith, J. (2024). Essential vocational training and workplace assessment (2nd ed.). Academic Press. https://doi.org/10.1007/978-3-030-12345-6', it: '(Smith, 2024)', n: 'Include book edition in parentheses if applicable, followed by publisher and DOI/URL.' },
];

const NAV_LINKS = [
  { to: '/resources', label: 'Resources', icon: 'book' },
  { to: '/videos', label: 'Videos', icon: 'play' },
  { to: '/sessions', label: 'Sessions', icon: 'calendar' },
  { to: '/referencing', label: 'Referencing', icon: 'doc' },
  { to: '/newsletter', label: 'Newsletter', icon: 'mailNav' },
];

const MOBILE_LINKS = [
  ['/', 'Home'], ['/resources', 'Library Resources'], ['/videos', 'Training Videos'], ['/links', 'Useful Links & Tools'],
  ['/recordings', 'Session Recordings'], ['/sessions', 'Upcoming Sessions'], ['/referencing', 'Referencing Guide'],
  ['/newsletter', 'Newsletters'], ['/llnd', 'My LLND Portal'], ['/contact', 'Contact Us & FAQ'],
];

const FOOT_LINKS = [
  ['/resources', 'All Resources'], ['/videos', 'Training Videos'], ['/links', 'Useful Links & Tools'], ['/recordings', 'Recordings'],
  ['/sessions', 'Sessions Calendar'], ['/referencing', 'APA 7th Guide'], ['/newsletter', 'Newsletter Archive'],
  ['/llnd', 'My LLND Support'], ['/contact', 'Contact & FAQ'],
];

// Titles + blurbs used by the quick-search modal in the header
const SEARCH_VIDEOS = [
  ['Responsible Use of AI in VET', 'Guides VET trainers and students in adopting AI ethically, verifying facts, and upholding academic integrity.'],
  ['Popular AI Tools as of June 2026', 'A review of modern generative AI platforms for educators and student research workflows.'],
  ['Staff Obligations for Inventory Check', 'Procedural obligations for trainers and assessors when conducting equipment and asset audits.'],
  ['Student Course Attendance & Academic Momentum', 'Guidelines on tracking course progress, monitoring attendance, and timely student intervention.'],
  ['Inventory and Facility Management', 'Core standards of vocational training facilities and occupational safety compliance.'],
  ['Monitoring Student Progress & Attendance Policy', 'Attendance thresholds, warnings, and learning support referral pathways.'],
  ['Monitoring Policy: Key Updates', 'Recent changes to student monitoring protocols under revised VET sector frameworks.'],
  ['Counselling & Student Support Services', 'Mental health, crisis support, and welfare counselling available across all campuses.'],
  ['Overview of the Australian VET Sector', 'Orientation to the Australian VET landscape, ASQA, training packages, and RTO governance.'],
  ['Trainer and Assessor Requirements (Standards)', 'Vocational competency, current industry skills, and TAE credential requirements.'],
  ['Training & Assessment Strategy (TAS): Updated', 'How to read, implement, and adhere to the TAS document for each qualification.'],
  ['Training and Assessment Strategy Fundamentals', 'Core principles of developing and reviewing training and assessment strategies.'],
  ['Trainer Marking Quality Checklist', 'Rubrics, evidence gathering, and constructive feedback practices.'],
  ['Generation of Verifiable USI Transcript', 'Generating and verifying authenticated Unique Student Identifier transcripts.'],
  ['Critical Incident Awareness & Response', 'Emergency response workflows, reporting channels, and trauma-informed support.'],
  ['Training Rolling Intake Model', 'How flexible rolling intakes support continuous learning momentum.'],
  ['Comprehensive Training & Wellbeing Support', 'Frameworks connecting academic mentoring, English language assistance, and wellbeing resources.'],
];