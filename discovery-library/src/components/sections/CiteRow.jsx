import Icon from '../ui/Icon';

function CiteRow({ label, text, onCopy }) {
  return (
    <div className="cite-row">
      <small>{label}</small>
      <div className="cite">
        <code>{text}</code>
        <button type="button" className="copy" onClick={() => onCopy(text)}><Icon name="copy" />Copy</button>
      </div>
    </div>
  );
}

export default CiteRow;