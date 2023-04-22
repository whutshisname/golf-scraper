import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

function groupByPageTitle(cellClubValues) {
  const grouped = {};

  cellClubValues.forEach((cellClubObj) => {
    const { cellClub, pageTitle, cellShaftType, cellVeryGood, cellLikeNew, cellAverage, cellGood } = cellClubObj;

    if (!grouped[pageTitle]) {
      grouped[pageTitle] = {};
    }

    if (!grouped[pageTitle][cellShaftType]) {
      grouped[pageTitle][cellShaftType] = {
        cellClubs: new Set(),
        values: {},
      };
    }

    grouped[pageTitle][cellShaftType].cellClubs.add(cellClub);
    grouped[pageTitle][cellShaftType].values[cellClub] = { cellVeryGood, cellLikeNew, cellAverage, cellGood };
  });

  return grouped;
}

function renderPageTitleTable(pageTitle, cellShaftTypes) {
  const rows = [];

  Object.entries(cellShaftTypes).forEach(([cellShaftType, shaftTypeData], shaftTypeIndex) => {
    const subRows = Array.from(shaftTypeData.cellClubs).map((cellClub, index) => {
      const { cellVeryGood, cellLikeNew, cellAverage, cellGood } = shaftTypeData.values[cellClub];
      return (
        <tr key={`${cellShaftType}-${cellClub}`}>
          {index === 0 && (
            <td rowSpan={shaftTypeData.cellClubs.size} style={{ verticalAlign: 'middle' }}>
              {cellShaftType}
            </td>
          )}
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

  return (
    <div key={pageTitle}>
      <h2>{pageTitle}</h2>
      <table>
        <thead>
          <tr>
            <th>Cell Shaft Type</th>
            <th>Cell Club</th>
            <th>Like New</th>
            <th>Very Good</th>
            <th>Good</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

function HomePage() {
  const [uniqueShaftTypes, setUniqueShaftTypes] = useState([]);
  const [selectedShaftTypes, setSelectedShaftTypes] = useState([]);
  const [uniqueCellClubValues, setUniqueCellClubValues] = useState([]);

  const [availableUrls, setAvailableUrls] = useState([
    'https://www.callawaygolfpreowned.com/fairway-woods/fwoods-2022-rogue-st-max.html',
    'https://www.callawaygolfpreowned.com/fairway-woods/fwoods-2022-rogue-st-ls.html',
    'https://www.callawaygolfpreowned.com/fairway-woods/fwoods-2021-epic-speed.html',
    'https://www.callawaygolfpreowned.com/fairway-woods/fwoods-2021-epic-max.html',
  ]);
  
  const [selectedUrls, setSelectedUrls] = useState([...availableUrls]);
  
  useEffect(() => {
    async function fetchData() {
      const urls = selectedUrls;

      const shaftTypes = [];

      for (const url of urls) {
        const res = await fetch(`/api/uniqueShaftTypes?pageUrl=${encodeURIComponent(url)}`);
        const data = await res.json();
        console.log(data);
        data.uniqueShaftTypes.forEach((shaftType) => {
          if (!shaftTypes.includes(shaftType)) {
            shaftTypes.push(shaftType);
          }
        });
      }

      const sortedShaftTypes = shaftTypes.sort();

      setUniqueShaftTypes(sortedShaftTypes);
    }

    fetchData();
  }, [selectedShaftTypes, selectedUrls]);

  useEffect(() => {
    async function fetchData() {
      if (selectedShaftTypes.length === 0 || selectedUrls.length === 0) {
        return;
      }

      // Update this line to use selectedUrls instead of the constant urls
      const urls = selectedUrls;

      const cellClubValues = [];

      for (const url of urls) {
        const res = await fetch(`/api/uniqueCellClubValues?pageUrl=${encodeURIComponent(url)}&selectedValues=${encodeURIComponent(selectedShaftTypes.join(','))}`);
        const data = await res.json();
        console.log(data);
        data.uniqueCellClubValues.forEach((cellClubObj) => {
          cellClubValues.push(cellClubObj);
        });

      }

      const groupedByPageTitle = groupByPageTitle(cellClubValues);
      const pageTitleTables = Object.entries(groupedByPageTitle).map(([pageTitle, cellClubs]) => renderPageTitleTable(pageTitle, cellClubs));
      setUniqueCellClubValues(pageTitleTables);
    }

    fetchData();
  }, [selectedShaftTypes, selectedUrls]); // Add selectedUrls to the dependency array

  function handleShaftTypeChange(event) {
    const target = event.target;
    const value = target.value;
    const isChecked = target.checked;

    setSelectedShaftTypes((prevSelectedShaftTypes) =>
      isChecked ? [...prevSelectedShaftTypes, value] : prevSelectedShaftTypes.filter((shaftType) => shaftType !== value),
    );
  }

  function handleUrlChange(event) {
    const target = event.target;
    const value = target.value;
    const isChecked = target.checked;

    setSelectedUrls((prevSelectedUrls) =>
      isChecked ? [...prevSelectedUrls, value] : prevSelectedUrls.filter((url) => url !== value),
    );
  }

  return (
    <div className={styles.container}>
      <h1>Shaft Types</h1>
      <form>
        <label htmlFor="urls">Select URLs:</label>
        <div id="urls">
          {availableUrls.map((url, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={`url-${index}`}
                value={url}
                checked={selectedUrls.includes(url)} 
                onChange={handleUrlChange}
              />
              <label htmlFor={`url-${index}`}>{url}</label>
            </div>
          ))}
        </div>

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
      <h1>Cell Club Values</h1>
      {uniqueCellClubValues}
    </div>
  );
}

export default HomePage;