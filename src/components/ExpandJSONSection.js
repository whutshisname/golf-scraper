import { useState } from 'react';

function ExpandJSONSection({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  if (data.length === 0) {
    return null;
  }

  const json = JSON.stringify(data, null, 2);

  return (
    <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
      <button onClick={toggleExpanded}>
        {isExpanded ? 'Hide' : 'View'}
      </button>
      <button onClick={copyToClipboard}>
        Copy to Clipboard
      </button>
      {isExpanded && <pre>{json}</pre>}
    </div>
  );
}

export default ExpandJSONSection;
