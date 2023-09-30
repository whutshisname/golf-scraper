import { useState } from 'react';
import ExpandJSONSection from '../components/ExpandJSONSection';
import GroupedCheckboxList from '../components/ClubSelectionCheckList';
import ProductTable from '../components/TableDisplay';

const items = [
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
    "displayValue": "Rogue ST Max",
    "pid": "drivers-2022-rogue-st-max"
  },
  {
    "cgid": "drivers",
    "displayValue": "Paradym",
    "pid": "drivers-2023-paradym"
  },
  {
    "cgid": "drivers",
    "displayValue": "Paradym X",
    "pid": "drivers-2023-paradym-x"
  },
  {
    "cgid": "drivers",
    "displayValue": "Paradym Triple Diamond",
    "pid": "drivers-2023-paradym-td"
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
    "displayValue": "Paradym X",
    "pid": "fwoods-2023-paradym-x"
  },
  {
    "cgid": "fairway-woods",
    "displayValue": "Paradym",
    "pid": "fwoods-2023-paradym"
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
    "displayValue": "JAWS MD5 Tour Grey",
    "pid": "wedges-2019-md5-jaws-tour-grey"
  },
  {
    "cgid": "wedges",
    "displayValue": "JAWS MD5 Platinum Chrome",
    "pid": "wedges-2019-md5-jaws-chrome"
  },
  {
    "cgid": "iron-sets",
    "displayValue": "Rogue ST Pro",
    "pid": "irons-2022-rogue-st-pro"
  },
  {
    "cgid": "single-irons",
    "displayValue": "Paradym",
    "pid": "irons-2023-paradym"
  },
  {
    "cgid": "single-irons",
    "displayValue": "Paradym X",
    "pid": "irons-2023-paradym-x"
  },
  {
    "cgid": "iron-sets",
    "displayValue": "Paradym X",
    "pid": "irons-2023-paradym-x"
  },
  {
    "cgid": "iron-sets",
    "displayValue": "Paradym",
    "pid": "irons-2023-paradym"
  },
  {
    "cgid": "iron-sets",
    "displayValue": "Rogue ST MAX",
    "pid": "irons-2022-rogue-st-max"
  },
  {
    "cgid": "iron-sets",
    "displayValue": "Rogue ST MAX OS",
    "pid": "irons-2022-rogue-st-max-os"
  },
  {
    "cgid": "iron-sets",
    "displayValue": "Great Big Bertha",
    "pid": "irons-2023-gbb"
  },
  {
    "cgid": "iron-sets",
    "displayValue": "Big Bertha",
    "pid": "irons-2023-big-bertha"
  }
];


export default function CheckboxPage() {
  const uniqueCgids = Array.from(new Set(items.map((item) => item.cgid)));
  const [selectedItems, setSelectedItems] = useState([]);
  const [productData, setProductData] = useState([]);

  const handleItemChange = async (selectedItemIds) => {
    console.log("Selected Items:", selectedItemIds);
    setSelectedItems(selectedItemIds);

    const pairs = selectedItemIds.map((id) => {
      const [pid, cgid] = id.split('|');
      return { pid, cgid };
    });
    console.log("Pairs:", pairs);

    // Use Promise.all to fetch data for all pairs in parallel
    const fetchData = async (pair) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairs: [pair] }),
      };
      console.log("Sending request with body:", requestOptions.body);
      const response = await fetch('/api/product-variants', requestOptions);
      const data = await response.json();
      console.log("Received data:", data);
      return data;
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

      {
        productData.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <ProductTable products={productData} items={items} />
            <ExpandJSONSection data={productData} />
          </div>

        )
      }
    </div>
  );
}
