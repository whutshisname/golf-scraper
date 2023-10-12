import { useState } from 'react';
import ExpandJSONSection from '../components/ExpandJSONSection';
import GroupedCheckboxList from '../components/ClubSelectionCheckList';
import ProductTable from '../components/TableDisplay';
import items from '../data/clubTypes.json';
import LimitedAutocomplete  from '../components/autocomplete'

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
            <LimitedAutocomplete maxItems={1} />
          </div>

        )
      }
    </div>
  );
}
