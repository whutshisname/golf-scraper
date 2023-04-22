// src/pages/api/uniqueCellClubValues.js
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    const pageUrl = req.query.pageUrl;
    const selectedValuesString = req.query.selectedValues;

    if (!pageUrl) {
        res.status(400).json({ error: 'Missing pageUrl parameter' });
        return;
    }

    if (!selectedValuesString || selectedValuesString.length === 0) {
        res.status(400).json({ error: 'Missing or empty selectedValues parameter' });
        return;
    }

    const selectedValues = selectedValuesString.split(',');

    const browser = await puppeteer.launch({ headless: true }); 
    const page = await browser.newPage();
    await page.goto(pageUrl);

    const pageTitle = await page.evaluate(() => {
        const pageTitleElement = document.querySelector('h1#page-title');
        return pageTitleElement ? pageTitleElement.textContent.trim() : '';
    });

    const uniqueCellClubValues = await page.evaluate(({ selectedValues, pageTitle }) => {
        const rows = document.querySelectorAll('.variantRow');
        const cellClubSet = new Set();
        
        const priceRegex = /^\$\d+(,\d{3})*(\.\d{2})?$/;
        
        for (const row of rows) {
          const cellShaftType = row.querySelector('.cellShaftType');
          const cellClub = row.querySelector('.cellClub');
          const cellVeryGood = row.querySelector('.cellVeryGood');
          const cellLikeNew = row.querySelector('.cellLikeNew');
          const cellAverage = row.querySelector('.cellAverage');
          const cellGood = row.querySelector('.cellGood');
        
          const cellClubObj = {};
        
          const cellVeryGoodPrice = row.querySelector('.cellVeryGood .price');
          if (cellVeryGoodPrice) {
            const priceText = cellVeryGoodPrice.textContent.trim();
            if (priceRegex.test(priceText)) {
              cellClubObj.cellVeryGood = priceText;
            }
          } else if (cellVeryGood) {
            const priceText = cellVeryGood.textContent.trim();
            if (priceRegex.test(priceText)) {
              cellClubObj.cellVeryGood = priceText;
            }
          }
        
          const cellLikeNewPrice = row.querySelector('.cellLikeNew .price');
          if (cellLikeNewPrice) {
            const priceText = cellLikeNewPrice.textContent.trim();
            if (priceRegex.test(priceText)) {
              cellClubObj.cellLikeNew = priceText;
            }
          } else if (cellLikeNew) {
            const priceText = cellLikeNew.textContent.trim();
            if (priceRegex.test(priceText)) {
              cellClubObj.cellLikeNew = priceText;
            }
          }
        
          const cellAveragePrice = row.querySelector('.cellAverage .price');
          if (cellAveragePrice) {
            const priceText = cellAveragePrice.textContent.trim();
            if (priceRegex.test(priceText)) {
              cellClubObj.cellAverage = priceText;
            }
          } else if (cellAverage) {
            const priceText = cellAverage.textContent.trim();
            if (priceRegex.test(priceText)) {
              cellClubObj.cellAverage = priceText;
            }
          }
        
          const cellGoodPrice = row.querySelector('.cellGood .price');
          if (cellGoodPrice) {
            const priceText = cellGoodPrice.textContent.trim();
            if (priceRegex.test(priceText)) {
              cellClubObj.cellGood = priceText;
            }
          } else if (cellGood) {
            const priceText = cellGood.textContent.trim();
            if (priceRegex.test(priceText)) {
              cellClubObj.cellGood = priceText;
            }
          }
        
          if (cellShaftType && selectedValues.includes(cellShaftType.textContent.trim())) {
            if (cellClub) {
              cellClubObj.cellClub = cellClub.textContent.trim();
              cellClubObj.cellShaftType = cellShaftType.textContent.trim();
              cellClubObj.pageTitle = pageTitle;
        
              cellClubSet.add(cellClubObj);
            }
          }
        }
        
        return Array.from(cellClubSet);
    }, { selectedValues, pageTitle });

    await browser.close();

    console.log(uniqueCellClubValues);

    res.status(200).json({ uniqueCellClubValues });
}
