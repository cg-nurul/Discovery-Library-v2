/**
 * WordPress Live Destination URLs for Discovery Library
 * All homepage buttons and navigation links route directly to these WordPress pages.
 */
export const SITE_URLS = {
  home: 'https://discoverylibrary.com.au/',
  resources: 'https://discoverylibrary.com.au/library-services/library-resource/',
  videos: 'https://discoverylibrary.com.au/library-services/library-resource/training-videos/',
  sessions: 'https://discoverylibrary.com.au/upcoming-trainings/',
  referencing: 'https://discoverylibrary.com.au/referencing/',
  newsletter: 'https://discoverylibrary.com.au/newsletter/',
  llnd: 'http://myllnd.com/login',
  consultation: 'https://discoverylibrary.com.au/contact/',
  contact: 'https://discoverylibrary.com.au/contact/',
  links: 'https://discoverylibrary.com.au/library-services/library-resource/useful-links-videos/',
  recordings: 'https://discoverylibrary.com.au/library-services/library-resource/training-videos/',
};

/**
 * Resolves any route or path to the corresponding live WordPress URL.
 * Handles both full URLs and internal route paths safely.
 */
export function resolveUrl(to) {
  if (!to) return SITE_URLS.home;
  
  // If it's already an absolute or scheme-based URL
  if (
    to.startsWith('http://') ||
    to.startsWith('https://') ||
    to.startsWith('//') ||
    to.startsWith('mailto:') ||
    to.startsWith('tel:')
  ) {
    return to;
  }

  // Preserve page anchors if needed (e.g. #nav)
  if (to.startsWith('#') && !to.startsWith('#/')) {
    return to;
  }

  const clean = to.replace(/^[#/]+/, '').toLowerCase();

  if (!clean || clean === 'home') return SITE_URLS.home;
  if (clean.startsWith('resource')) return SITE_URLS.resources;
  if (clean.startsWith('video')) return SITE_URLS.videos;
  if (clean.startsWith('session') || clean.startsWith('upcoming') || clean.startsWith('training')) return SITE_URLS.sessions;
  if (clean.startsWith('referenc')) return SITE_URLS.referencing;
  if (clean.startsWith('newsletter')) return SITE_URLS.newsletter;
  if (clean.startsWith('llnd') || clean.startsWith('myllnd')) return SITE_URLS.llnd;
  if (clean.startsWith('consult') || clean.startsWith('contact')) return SITE_URLS.contact;
  if (clean.startsWith('link') || clean.startsWith('tool')) return SITE_URLS.links;
  if (clean.startsWith('record')) return SITE_URLS.recordings;

  return `${SITE_URLS.home}${clean}/`;
}
