import PlayIcon from '../../assets/play-alt.svg?react';
// import LinkIcon from '../../assets/link.svg?react';
// import RewindIcon from '../../assets/rewind.svg?react';
import CalendarIcon from '../../assets/calendar.svg?react';
import BookIcon from '../../assets/book.svg?react';
import LockIcon from '../../assets/lock.svg?react';
import ListCheckIcon from '../../assets/list-check.svg?react';
import NewspaperIcon from '../../assets/newspaper.svg?react';

const ICONS = {
play: PlayIcon,
// link: LinkIcon,
// rewind: RewindIcon,
calendar: CalendarIcon,
book: BookIcon,
lock: LockIcon,
listCheck: ListCheckIcon,
newspaper: NewspaperIcon,
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
