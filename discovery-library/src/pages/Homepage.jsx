/* Notes:
 *  - All internal links go through <Link> (renders plain "#/route" hrefs; change to RouterLink for SPA).
 *  - Global styles live in styles/homepage.css, imported in main.jsx after index.css.
 */
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

function DiscoveryLibraryHome() {
  const progressRef = useRef(null);
  const mainRef = useRef(null);
  const footRef = useRef(null);
  const toastTimer = useRef(0);

  const [scrolled, setScrolled] = useState(false);
  const [cueHidden, setCueHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const notify = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2600);
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

  useEffect(() => { document.title = 'Discovery Library — Comprehensive Digital Library & Learning Support'; }, []);

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
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen((o) => !o); }
      if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

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

  return (
    <div className="dl-app">
      <div id="scrollProgress" ref={progressRef} />
      <Backdrop />
      <AmbientScene />

      <Header scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onSearch={() => setSearchOpen(true)} />

      <main id="view" ref={mainRef} tabIndex={-1} className="page page-home">
        <Hero cueHidden={cueHidden} />
        <StartHere />
        <WordSeries />
        <ComingUp />
        <ApaQuick onCopy={copyText} />
        <CtaBand />
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