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
