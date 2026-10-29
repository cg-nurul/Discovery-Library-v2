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

export { SESSIONS, nextSession };