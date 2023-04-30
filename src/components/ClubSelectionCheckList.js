import React from 'react';

function GroupedCheckboxList({ items, cgid, handleItemChange, selectedItems }) {
  const filteredItems = items
    .filter((item) => item.cgid === cgid)
    .sort((a, b) => a.displayValue.localeCompare(b.displayValue)); // sort the items by displayValue

  return (
    <div>
      <h2>{cgid}</h2>
      <ul style={{ listStyleType: 'none' }}>
        {filteredItems.map((item) => (
          <li key={item.pid}>
            <label>
              <input
                type="checkbox"
                value={item.pid}
                checked={selectedItems.includes(item.pid)}
                onChange={() => handleItemChange(item.pid)}
              />
              {item.displayValue}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupedCheckboxList;
