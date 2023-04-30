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
    .sort((a, b) => formattedCgid(a).localeCompare(formattedCgid(b))); // sort the items by formatted cgid

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectAllChange = () => {
    setSelectAllChecked(!selectAllChecked);
    const allItemIds = filteredItems.map((item) => item.pid);
    if (!selectAllChecked) {
      handleItemChange(allItemIds);
    } else {
      handleItemChange([]);
    }
  };

  const handleItemChangeInGroup = (checked, itemId) => {
    const selectedItemIds = [...selectedItems];
    if (checked) {
      selectedItemIds.push(itemId);
    } else {
      const index = selectedItemIds.indexOf(itemId);
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
                checked={selectedItems.includes(item.pid)}
                onChange={(e) => handleItemChangeInGroup(e.target.checked, item.pid)}
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
