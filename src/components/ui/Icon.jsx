import PlayIcon from '../../assets/play.svg?react';
import LinkIcon from '../../assets/link.svg?react';
import RecordingIcon from '../../assets/recording.svg?react';
import CalendarIcon from '../../assets/calendar.svg?react';
import BookIcon from '../../assets/book.svg?react';
import LockIcon from '../../assets/lock.svg?react';
import ListCheckIcon from '../../assets/list-check.svg?react';
import NewspaperIcon from '../../assets/newspaper.svg?react';
import SearchIcon from '../../assets/search_1.svg?react';
import MobileMenuIcon from '../../assets/menu.svg?react';
import BrowseIcon from '../../assets/browse.svg?react';
import VideoIcon from '../../assets/play-alt.svg?react';
import ArrowIcon from '../../assets/arrow.svg?react';

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CopyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

const ICONS = {
  play: PlayIcon,
  video: VideoIcon,
  link: LinkIcon,
  record: RecordingIcon,
  calendar: CalendarIcon,
  book: BookIcon,
  lock: LockIcon,
  listCheck: ListCheckIcon,
  newspaper: NewspaperIcon,
  search: SearchIcon,
  menu: MobileMenuIcon,
  browse: BrowseIcon,
  arrow: ArrowIcon,
  check: CheckIcon,
  close: CloseIcon,
  copy: CopyIcon,
};

function Icon({ name, className = '' }) {
  const SvgIcon = ICONS[name];

  if (!SvgIcon) return null;

  return (
    <SvgIcon
      className={`ic ${className}`}
      aria-hidden="true"
      focusable="false"
    />
  );
}

export default Icon;
