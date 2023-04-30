import { useState, useEffect } from 'react';

const CheckboxList = ({ data }) => {
  const [selected, setSelected] = useState([]);
  const [shaftTypes, setShaftTypes] = useState([]);
  const [shaftFlexes, setShaftFlexes] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Get all unique values of "Shaft Type" and "Shaft Flex" variants
      const variants = data[0].variants;
      const types = Array.from(new Set(variants.map(v => v.find(x => x.label === 'Shaft Type')?.value)));
      const flexes = Array.from(new Set(variants.map(v => v.find(x => x.label === 'Shaft Flex')?.value)));
      // Sort the lists alphabetically with numbers at the top
      setShaftTypes(sortAlphabetically(types));
      setShaftFlexes(sortAlphabetically(flexes));
    } else {
      // Reset the selected state and variants
      setSelected([]);
      setShaftTypes([]);
      setShaftFlexes([]);
    }
  }, [data]);

  // Update selected state when a checkbox is clicked
  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const index = selected.indexOf(value);

    if (index === -1) {
      setSelected([...selected, value]);
    } else {
      setSelected([...selected.slice(0, index), ...selected.slice(index + 1)]);
    }
  }

  // Sort an array alphabetically with numbers at the top
  const sortAlphabetically = (arr) => {
    const sortedArr = arr.slice().sort((a, b) => {
      if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b, undefined, { numeric: true });
      }
      if (typeof a === 'number' && typeof b === 'string') {
        return -1;
      }
      if (typeof a === 'string' && typeof b === 'number') {
        return 1;
      }
      return a - b;
    });
    return sortedArr;
  }

  return (
    <div>
      <h2>Shaft Type:</h2>
      <div>
        {shaftTypes.map((type) => (
          <label key={type} style={{ display: 'block' }}>
            <input type="checkbox" value={type} onChange={handleCheckboxChange} checked={selected.includes(type)} />
            {type}
          </label>
        ))}
        {shaftTypes.length === 0 && <p>No shaft types found.</p>}
      </div>
      <h2>Shaft Flex:</h2>
      <div>
        {shaftFlexes.map((flex) => (
          <label key={flex} style={{ display: 'block' }}>
            <input type="checkbox" value={flex} onChange={handleCheckboxChange} checked={selected.includes(flex)} />
            {flex}
          </label>
        ))}
        {shaftFlexes.length === 0 && <p>No shaft flexes found.</p>}
      </div>
    </div>
  );
};

export default CheckboxList;