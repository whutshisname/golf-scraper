import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

function groupByPageTitle(cellClubValues) {
  const grouped = {};

  cellClubValues.forEach((cellClubObj) => {
    const { cellClub, pageTitle, cellShaftType, cellShaftFlex, cellVeryGood, cellLikeNew, cellAverage, cellGood } = cellClubObj;

    if (!grouped[pageTitle]) {
      grouped[pageTitle] = {};
    }

    const combinedShaftKey = `${cellShaftType} - ${cellShaftFlex}`;

    if (!grouped[pageTitle][combinedShaftKey]) {
      grouped[pageTitle][combinedShaftKey] = {
        cellClubs: new Set(),
        values: {},
      };
    }

    grouped[pageTitle][combinedShaftKey].cellClubs.add(cellClub);
    grouped[pageTitle][combinedShaftKey].values[cellClub] = { cellVeryGood, cellLikeNew, cellAverage, cellGood, cellShaftFlex };
  });

  return grouped;
}

function renderPageTitleTable(pageTitle, cellShaftTypes) {
  const rows = [];

  Object.entries(cellShaftTypes).forEach(([cellShaftType, shaftTypeData], shaftTypeIndex) => {
    const subRows = Array.from(shaftTypeData.cellClubs).map((cellClub, index) => {
      const { cellVeryGood, cellLikeNew, cellAverage, cellGood, cellShaftFlex } = shaftTypeData.values[cellClub];
      return (
        <tr key={`${cellShaftType}-${cellClub}`}>
          {index === 0 && (
            <td rowSpan={shaftTypeData.cellClubs.size} style={{ verticalAlign: 'middle' }}>
              {cellShaftType}
            </td>
          )}
          <td>{cellShaftFlex}</td>
          <td>{cellClub}</td>
          <td>{cellLikeNew}</td>
          <td>{cellVeryGood}</td>
          <td>{cellGood}</td>
          <td>{cellAverage}</td>
        </tr>
      );
    });
    rows.push(...subRows);
  });

  return {
    pageTitle,
    content: (
      <div key={pageTitle}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Shaft Type</th>
              <th>Shaft Flex</th>
              <th>Club</th>
              <th>Like New</th>
              <th>Very Good</th>
              <th>Good</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    ),
  };
}

function HomePage() {
  const [uniqueShaftTypes, setUniqueShaftTypes] = useState([]);
  const [selectedShaftTypes, setSelectedShaftTypes] = useState([]);
  const [uniqueCellClubValues, setUniqueCellClubValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [availableUrls, setAvailableUrls] = useState([
    { displayValue: 'Rogue ST Max', url: 'https://www.callawaygolfpreowned.com/fairway-woods/fwoods-2022-rogue-st-max.html', group: 'Fairway' },
    { displayValue: 'Rogue ST LS', url: 'https://www.callawaygolfpreowned.com/fairway-woods/fwoods-2022-rogue-st-ls.html', group: 'Fairway' },
    { displayValue: 'Epic Speed', url: 'https://www.callawaygolfpreowned.com/fairway-woods/fwoods-2021-epic-speed.html', group: 'Fairway' },
    { displayValue: 'Epic Max', url: 'https://www.callawaygolfpreowned.com/fairway-woods/fwoods-2021-epic-max.html', group: 'Fairway' },
    { displayValue: 'Rogue ST MAX', url: 'https://www.callawaygolfpreowned.com/drivers/drivers-2022-rogue-st-max.html', group: 'Driver' },
    { displayValue: 'Rogue ST MAX LS', url: 'https://www.callawaygolfpreowned.com/drivers/drivers-2022-rogue-st-max-ls.html', group: 'Driver' },
    { displayValue: 'Epic MAX', url: 'https://www.callawaygolfpreowned.com/drivers/drivers-2021-epic-max.html', group: 'Driver' },
    { displayValue: 'Epic MAX LS', url: 'https://www.callawaygolfpreowned.com/drivers/drivers-2021-epic-max-ls.html', group: 'Driver' },
    { displayValue: 'Epic Speed', url: 'https://www.callawaygolfpreowned.com/drivers/drivers-2021-epic-speed.html', group: 'Driver' },
    { displayValue: 'Rogue ST Pro', url: 'https://www.callawaygolfpreowned.com/hybrids/hybrids-2022-rogue-st-pro.html', group: 'Hybrid' },
    { displayValue: 'Apex Pro 21', url: 'https://www.callawaygolfpreowned.com/hybrids/hybrids-2021-apex-pro.html', group: 'Hybrid' },
    { displayValue: 'Apex 21', url: 'https://www.callawaygolfpreowned.com/hybrids/hybrids-2021-apex.html', group: 'Hybrid' },
    { displayValue: 'Epic Super', url: 'https://www.callawaygolfpreowned.com/hybrids/hybrids-2022-epic-super.html', group: 'Hybrid' },
    { displayValue: 'Rogue ST MAX', url: 'https://www.callawaygolfpreowned.com/hybrids/hybrids-2022-rogue-st-max.html', group: 'Hybrid' },
    { displayValue: 'Super Hybrid', url: 'https://www.callawaygolfpreowned.com/hybrids/hybrids-2020-super.html', group: 'Hybrid' },
    { displayValue: 'Rogue ST Triple Diamond LS', url: 'https://www.callawaygolfpreowned.com/drivers/drivers-2022-rogue-st-triple-diamond-ls.html', group: 'Driver' },
  ]);

  const [selectedUrls, setSelectedUrls] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const urls = selectedUrls;
      setLoading(true);
  
      const fetchShaftTypesPromises = urls.map(async (url) => {
        const res = await fetch(`/api/uniqueShaftTypes?pageUrl=${encodeURIComponent(url)}`);
        return res.json();
      });
  
      const responses = await Promise.all(fetchShaftTypesPromises);
      const shaftTypes = responses.flatMap(data => data.uniqueShaftTypes)
        .filter((value, index, self) => self.indexOf(value) === index) // Unique values
        .sort();
  
      setUniqueShaftTypes(shaftTypes);
      setLoading(false);
    }
  
    fetchData();
  }, [selectedUrls]);

  useEffect(() => {
    async function fetchData() {
      if (selectedShaftTypes.length === 0 || selectedUrls.length === 0) {
        setLoadingStatus(false);
        return;
      }
  
      const urls = selectedUrls;
  
      const fetchCellClubValuesPromises = urls.map(async (url) => {
        const res = await fetch(`/api/uniqueCellClubValues?pageUrl=${encodeURIComponent(url)}&selectedValues=${encodeURIComponent(selectedShaftTypes.join(','))}`);
        return res.json();
      });
  
      const responses = await Promise.all(fetchCellClubValuesPromises);
      const cellClubValues = responses.flatMap(data => data.uniqueCellClubValues);
  
      const groupedByPageTitle = groupByPageTitle(cellClubValues);
      const pageTitleTables = Object.entries(groupedByPageTitle).map(([pageTitle, cellClubs]) => renderPageTitleTable(pageTitle, cellClubs));
      setUniqueCellClubValues(pageTitleTables);
      setLoadingStatus(false);
    }
  
    fetchData();
  }, [selectedShaftTypes, selectedUrls]);

  function handleShaftTypeChange(event) {
    setLoadingStatus(true);
    const target = event.target;
    const value = target.value;
    const isChecked = target.checked;

    setSelectedShaftTypes((prevSelectedShaftTypes) =>
      isChecked ? [...prevSelectedShaftTypes, value] : prevSelectedShaftTypes.filter((shaftType) => shaftType !== value),
    );
  }

  function handleUrlChange(event) {
    setLoadingStatus(true);
    const target = event.target;
    const urlObj = availableUrls.find((urlObj) => urlObj.url === target.value);
    const isChecked = target.checked;

    setSelectedUrls((prevSelectedUrls) =>
      isChecked ? [...prevSelectedUrls, urlObj.url] : prevSelectedUrls.filter((selectedUrl) => selectedUrl !== urlObj.url),
    );
  }

  function resetAll() {
    setSelectedShaftTypes([]);
    setSelectedUrls([]);
    setUniqueCellClubValues([]);
  }

  const groupedUrls = availableUrls.reduce((acc, urlObj) => {
    const group = urlObj.group || 'Other'; // default to 'Other' if group is not defined
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(urlObj);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shaft Types</h1>
      <button onClick={resetAll}>Reset</button> {/* Add this reset button */}
      <form>
        {Object.entries(groupedUrls).map(([group, urls]) => (
          <div key={group} className={styles.group}>
            <h3 className={styles.groupHeader}>{group}</h3>
            {urls.map((urlObj, index) => (
              <div key={`${group}-${index}`}>
                <input
                  type="checkbox"
                  id={`${group}-url-${index}`}
                  value={urlObj.url}
                  checked={selectedUrls.includes(urlObj.url)}
                  onChange={handleUrlChange}
                />
                <label htmlFor={`${group}-url-${index}`}>{urlObj.displayValue}</label>
              </div>
            ))}
          </div>
        ))}

        <label htmlFor="shaftTypes">Select Shaft Types:</label>
        <div id="shaftTypes">
          {uniqueShaftTypes.map((shaftType, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={`shaftType-${index}`}
                value={shaftType}
                checked={selectedShaftTypes.includes(shaftType)}
                onChange={handleShaftTypeChange}
              />
              <label htmlFor={`shaftType-${index}`}>{shaftType}</label>
            </div>
          ))}
        </div>
      </form>
      <h1 className={styles.title}>Cell Club Values</h1>
      {loadingStatus ? (
        <div>Loading...</div> // Replace this with your desired loading indicator
      ) : (
        uniqueCellClubValues.map(({ pageTitle, content }, index) => (
          <div key={index} className={styles.tableContainer}>
            <h2>{pageTitle}</h2>
            {content}
          </div>
        ))
      )}

    </div>
  );
}

export default HomePage;