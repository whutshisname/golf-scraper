import { useState } from 'react';
import ExpandJSONSection from '../components/ExpandJSONSection';
import GroupedCheckboxList from '../components/ClubSelectionCheckList';
import ProductTable from '../components/TableDisplay';

const items = [
  {
    "cgid": "drivers",
    "displayValue": "Epic Flash",
    "pid": "drivers-2019-epic-flash"
  },
  {
    "cgid": "drivers",
    "displayValue": "Epic Max",
    "pid": "drivers-2021-epic-max"
  },
  {
    "cgid": "drivers",
    "displayValue": "Epic Max LS",
    "pid": "drivers-2021-epic-max-ls"
  },
  {
    "cgid": "drivers",
    "displayValue": "Epic Speed",
    "pid": "drivers-2021-epic-speed"
  },
  {
    "cgid": "drivers",
    "displayValue": "Mavrik",
    "pid": "drivers-2020-mavrik"
  },
  {
    "cgid": "drivers",
    "displayValue": "Mavrik Max",
    "pid": "drivers-2020-mavrik-max"
  },
  {
    "cgid": "drivers",
    "displayValue": "Mavrik SZ",
    "pid": "drivers-2020-mavrik-sz"
  },
  {
    "cgid": "drivers",
    "displayValue": "Rogue ST Max",
    "pid": "drivers-2022-rogue-st-max"
  },
  {
    "cgid": "drivers",
    "displayValue": "Rogue ST Max LS",
    "pid": "drivers-2022-rogue-st-max-ls"
  },
  {
    "cgid": "drivers",
    "displayValue": "Rogue ST Triple Diamond LS",
    "pid": "drivers-2022-rogue-st-triple-diamond-ls"
  },
  {
    "cgid": "fairway-woods",
    "displayValue": "Apex Utility Wood",
    "pid": "fwoods-2022-apex-utility-wood"
  },
  {
    "cgid": "fairway-woods",
    "displayValue": "Epic Flash",
    "pid": "fwoods-2019-epic-flash"
  },
  {
    "cgid": "fairway-woods",
    "displayValue": "Epic Max",
    "pid": "fwoods-2021-epic-max"
  },
  {
    "cgid": "fairway-woods",
    "displayValue": "Epic Speed",
    "pid": "fwoods-2021-epic-speed"
  },
  {
    "cgid": "fairway-woods",
    "displayValue": "Rogue ST LS",
    "pid": "fwoods-2022-rogue-st-ls"
  },
  {
    "cgid": "fairway-woods",
    "displayValue": "Rogue ST Max",
    "pid": "fwoods-2022-rogue-st-max"
  },
  {
    "cgid": "hybrids",
    "displayValue": "Apex 21",
    "pid": "hybrids-2021-apex"
  },
  {
    "cgid": "hybrids",
    "displayValue": "Apex Pro 21",
    "pid": "hybrids-2021-apex-pro"
  },
  {
    "cgid": "hybrids",
    "displayValue": "Epic Flash",
    "pid": "hybrids-2019-epic-flash"
  },
  {
    "cgid": "hybrids",
    "displayValue": "Epic Flash - JV",
    "pid": "hybrids-2019-epic-flash-jv"
  },
  {
    "cgid": "hybrids",
    "displayValue": "Epic Super Hybrid",
    "pid": "hybrids-2022-epic-super"
  },
  {
    "cgid": "hybrids",
    "displayValue": "Rogue ST Max",
    "pid": "hybrids-2022-rogue-st-max"
  },
  {
    "cgid": "hybrids",
    "displayValue": "Super Hybrid",
    "pid": "hybrids-2020-super"
  },
  {
      "cgid": "wedges",
      "displayValue": "JAWS MD5 Tour Grey Wedges",
      "pid": "wedges-2019-md5-jaws-tour-grey"
  },
  {
      "cgid": "wedges",
      "displayValue": "JAWS MD5 Platinum Chrome Wedges",
      "pid": "wedges-2019-md5-jaws-chrome"
  },
  {
      "cgid": "iron-sets",
      "displayValue": "Apex 21 Irons",
      "pid": "irons-2021-apex"
  },
  {
      "cgid": "iron-sets",
      "displayValue": "Rogue ST Pro Irons",
      "pid": "irons-2022-rogue-st-pro"
  },
  {
      "cgid": "iron-sets",
      "displayValue": "Apex Pro 21 Irons",
      "pid": "irons-2021-apex-pro"
  }
];


export default function CheckboxPage() {
  const uniqueCgids = Array.from(new Set(items.map((item) => item.cgid)));
  const [selectedItems, setSelectedItems] = useState([]);
  const [productData, setProductData] = useState([]);

  const handleItemChange = async (selectedItemIds) => {
    setSelectedItems(selectedItemIds);

    let pairs = selectedItemIds.map((pid) => {
      const foundItem = items.find((i) => i.pid === pid);
      return foundItem ? { pid: foundItem.pid, cgid: foundItem.cgid } : null;
    }).filter((pair) => pair !== null);

    // Use Promise.all to fetch data for all pairs in parallel
    const fetchData = async (pair) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairs: [pair] }),
      };
      const response = await fetch('/api/product-variants', requestOptions);
      return await response.json();
    };

    const allDataPromises = pairs.map((pair) => fetchData(pair));
    const allData = await Promise.all(allDataPromises);
    const combinedData = allData.flat();
    setProductData(combinedData);
  };

  return (
    <div className="group-container">
      {uniqueCgids.map((cgid) => (
        <GroupedCheckboxList
          key={cgid}
          items={items}
          cgid={cgid}
          handleItemChange={handleItemChange}
          selectedItems={selectedItems}
        />
      ))}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ProductTable products={productData} items={items} />
        <ExpandJSONSection data={productData} />
      </div>
    </div>
  );
}