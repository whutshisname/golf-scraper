import React, { useState } from 'react';

function GroupedCheckboxList({ items, cgid, handleItemChange, selectedItems }) {
  const formatCgid = (cgid) => {
    return cgid
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formattedCgid = (item) => formatCgid(item.cgid);

  const filteredItems = items
  .filter((item) => item.cgid === cgid)
  .sort((a, b) => a.displayValue.localeCompare(b.displayValue)); 

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAllChange = () => {
    setSelectAllChecked(!selectAllChecked);
    const allItemIds = filteredItems.map((item) => `${item.pid}|${item.cgid}`);
    if (!selectAllChecked) {
      handleItemChange(allItemIds);
    } else {
      handleItemChange([]);
    }
  };

  const handleItemChangeInGroup = (checked, itemId, itemCgid) => {
    const uniqueId = `${itemId}|${itemCgid}`;
    const selectedItemIds = [...selectedItems];
    if (checked) {
      selectedItemIds.push(uniqueId);
    } else {
      const index = selectedItemIds.indexOf(uniqueId);
      if (index !== -1) {
        selectedItemIds.splice(index, 1);
      }
    }
    handleItemChange(selectedItemIds);
    setSelectAllChecked(selectedItemIds.length === filteredItems.length);
  };

  return (
    <div className="group">
      <h2>{formatCgid(cgid)}</h2>
      <label>
        <input
          type="checkbox"
          checked={selectAllChecked}
          onChange={handleSelectAllChange}
        />
        Select All
      </label>
      <ul style={{ listStyleType: 'none' }}>
        {filteredItems.map((item) => (
          <li key={item.pid}>
            <label>
              <input
                type="checkbox"
                value={item.pid}
                checked={selectedItems.includes(`${item.pid}|${item.cgid}`)}
                onChange={(e) => handleItemChangeInGroup(e.target.checked, item.pid, item.cgid)}
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
