import Icon from '../ui/Icon';
import RippleButton from '../ui/RippleButton';

function CiteRow({ label, text, onCopy }) {
  return (
    <div className="cite-row">
      <small>{label}</small>
      <div className="cite">
        <code>{text}</code>
        <RippleButton
          as="button"
          type="button"
          className="copy"
          onClick={() => onCopy(text)}
          rippleColor="rgba(255, 200, 58, 0.4)"
        >
          <Icon name="copy" />Copy
        </RippleButton>
      </div>
    </div>
  );
}

export default CiteRow;