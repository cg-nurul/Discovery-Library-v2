import playIcon from '../../assets/play-alt.svg';
//import linkIcon from 'src/assets/link.svg';
//import rewindIcon from 'src/assets/rewind.svg';
import calendarIcon from '../../assets/calendar.svg';
import bookIcon from '../../assets/book.svg';
//import searchIcon from 'src/assets/search.svg';
//import copyIcon from 'src/assets/copy.svg';
//import lockIcon from 'src/assets/lock.svg';
import listCheckIcon from '../../assets/list-check.svg';
import newspaperIcon from '../../assets/newspaper.svg';
//import checkIcon from 'src/assets/check.svg';
//import arrowIcon from 'src/assets/arrow.svg';
//import menuIcon from 'src/assets/menu.svg';
//import closeIcon from 'src/assets/close.svg';
//import docIcon from 'src/assets/doc.svg';
//import mailNavIcon from 'src/assets/mailNav.svg';

const ICONS = {
  play: playIcon,
  //link: linkIcon,
  //rewind: rewindIcon,
  calendar: calendarIcon,
  book: bookIcon,
  //search: searchIcon,
  //copy: copyIcon,
  //lock: lockIcon,
  listCheck: listCheckIcon,
  newspaper: newspaperIcon,
  //check: checkIcon,
  //arrow: arrowIcon,
  //menu: menuIcon,
  //close: closeIcon,
  //doc: docIcon,
  //mailNav: mailNavIcon,
};

function Icon({ name, className = '' }) {
  const icon = ICONS[name];

  if (!icon) return null;

  return (
    <img
      src={icon}
      className={`ic ${className}`}
      alt=""
      aria-hidden="true"
    />
  );
}

export default Icon;