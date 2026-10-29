import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../components/ui/Icon';
import Backdrop from '../components/layout/Backdrop';
import AmbientScene from '../components/three/AmbientScene';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SearchModal from '../components/search/SearchModal';
import Hero from '../components/sections/Hero';
import StartHere from '../components/sections/StartHere';
import WordSeries from '../components/sections/WordSeries';
import ComingUp from '../components/sections/ComingUp';
import ApaQuick from '../components/sections/ApaQuick';
import CtaBand from '../components/sections/CtaBand';

import VideosPage from './VideosPage';
import SessionsPage from './SessionsPage';
import ReferencingPage from './ReferencingPage';
import ResourcesPage from './ResourcesPage';
import RecordingsPage from './RecordingsPage';
import NewsletterPage from './NewsletterPage';
import LlndPage from './LlndPage';
import ConsultationPage from './ConsultationPage';
import ContactPage from './ContactPage';

function DiscoveryLibraryHome() {
  const progressRef = useRef(null);
  const mainRef = useRef(null);
  const footRef = useRef(null);
  const toastTimer = useRef(0);

  const [route, setRoute] = useState(() => {
    const raw = window.location.hash.replace(/^#\/?/, '');
    return raw ? `/${raw}` : '/';
  });

  const [scrolled, setScrolled] = useState(false);
  const [cueHidden, setCueHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const notify = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2800);
  }, []);

  const copyText = useCallback((txt) => {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).catch(fallback);
    else fallback();
    notify('Citation copied to clipboard');
  }, [notify]);

  // Route change listener
  useEffect(() => {
    const onHashChange = () => {
      const raw = window.location.hash.replace(/^#\/?/, '');
      const clean = raw ? `/${raw}` : '/';
      setRoute(clean);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Sync document titles
  useEffect(() => {
    if (route === '/' || route === '') {
      document.title = 'Discovery Library — Comprehensive Digital Library & Learning Support';
    } else if (route.startsWith('/videos')) {
      document.title = 'Training Videos & Masterclasses — Discovery Library';
    } else if (route.startsWith('/sessions')) {
      document.title = 'Upcoming Sessions & Workshops — Discovery Library';
    } else if (route.startsWith('/referencing')) {
      document.title = 'APA 7th Referencing Guide — Discovery Library';
    } else if (route.startsWith('/resources') || route.startsWith('/links')) {
      document.title = 'Library Resources & Useful Links — Discovery Library';
    } else if (route.startsWith('/recordings')) {
      document.title = 'Session Recordings Archive — Discovery Library';
    } else if (route.startsWith('/newsletter')) {
      document.title = 'The Discovery Herald Newsletter — Discovery Library';
    } else if (route.startsWith('/llnd')) {
      document.title = 'My LLND Support Portal — Discovery Library';
    } else if (route.startsWith('/consultation')) {
      document.title = 'Book a Consultation — Discovery Library';
    } else if (route.startsWith('/contact')) {
      document.title = 'Contact Us & Campus Hubs — Discovery Library';
    }
  }, [route]);

  // Scroll Progress
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progressRef.current) progressRef.current.style.width = `${(window.scrollY / max) * 100}%`;
      setScrolled(window.scrollY > 8);
      setCueHidden(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [route]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen((o) => !o); }
      if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Modal / drawer scroll lock
  useEffect(() => {
    const blocked = menuOpen || searchOpen;
    document.body.style.overflow = blocked ? 'hidden' : '';
    [mainRef.current, footRef.current].forEach((el) => {
      if (!el) return;
      if (blocked) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const renderCurrentView = () => {
    if (route === '/' || route === '') {
      return (
        <>
          <Hero cueHidden={cueHidden} />
          <StartHere />
          <WordSeries />
          <ComingUp />
          <ApaQuick onCopy={copyText} />
          <CtaBand />
        </>
      );
    }
    if (route.startsWith('/videos')) {
      return <VideosPage onNotify={notify} />;
    }
    if (route.startsWith('/sessions')) {
      return <SessionsPage onNotify={notify} />;
    }
    if (route.startsWith('/referencing')) {
      return <ReferencingPage onCopy={copyText} onNotify={notify} />;
    }
    if (route.startsWith('/resources') || route.startsWith('/links')) {
      return <ResourcesPage onNotify={notify} />;
    }
    if (route.startsWith('/recordings')) {
      return <RecordingsPage onNotify={notify} />;
    }
    if (route.startsWith('/newsletter')) {
      return <NewsletterPage onNotify={notify} />;
    }
    if (route.startsWith('/llnd')) {
      return <LlndPage onNotify={notify} />;
    }
    if (route.startsWith('/consultation')) {
      return <ConsultationPage onNotify={notify} />;
    }
    if (route.startsWith('/contact')) {
      return <ContactPage onNotify={notify} />;
    }

    // Default fallback to home
    return (
      <>
        <Hero cueHidden={cueHidden} />
        <StartHere />
        <WordSeries />
        <ComingUp />
        <ApaQuick onCopy={copyText} />
        <CtaBand />
      </>
    );
  };

  return (
    <div className="dl-app">
      <div id="scrollProgress" ref={progressRef} />
      <Backdrop />
      <AmbientScene />

      <Header
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onSearch={() => setSearchOpen(true)}
        currentRoute={route}
      />

      <main id="view" ref={mainRef} tabIndex={-1} className={`page page-${route === '/' ? 'home' : route.slice(1)}`}>
        {renderCurrentView()}
      </main>

      <div ref={footRef}><Footer /></div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className={`toast${toast.show ? ' show' : ''}`} role="status" aria-live="polite">
        <Icon name="check" /><span>{toast.msg}</span>
      </div>
    </div>
  );
}

export default DiscoveryLibraryHome;