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

  let browser = null;
  let page = null;

  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle0' });

    const pageTitle = await page.$eval('h1#page-title', (el) => el.textContent.trim());

    const uniqueCellClubValues = await page.$$eval('.variantRow', (rows, { selectedValues, pageTitle }) => {
      const cellClubSet = new Set();

      const priceRegex = /^\$\d+(,\d{3})*(\.\d{2})?$/;

      for (const row of rows) {
        const cellShaftType = row.querySelector('.cellShaftType, .variantCell.cellShaftType');
        const cellShaftFlex = row.querySelector('.cellShaftFlex, .variantCell.cellShaftFlex'); // Add this line
        const cellClub = row.querySelector('.cellClub, .cellLoft');

        const cellClubObj = {
          cellVeryGood: getCellPrice(row, '.cellVeryGood .price', priceRegex),
          cellLikeNew: getCellPrice(row, '.cellLikeNew .price', priceRegex),
          cellAverage: getCellPrice(row, '.cellAverage .price', priceRegex),
          cellGood: getCellPrice(row, '.cellGood .price', priceRegex),
        };

        if (cellShaftType && selectedValues.includes(cellShaftType.textContent.trim())) {
          if (cellClub) {
            cellClubObj.cellClub = cellClub.textContent.trim();
            cellClubObj.cellShaftType = cellShaftType.textContent.trim();
            cellClubObj.cellShaftFlex = cellShaftFlex ? cellShaftFlex.textContent.trim() : null; // Add this line
            cellClubObj.pageTitle = pageTitle;

            cellClubSet.add(cellClubObj);
          }
        }
      }

      return Array.from(cellClubSet);

      function getCellPrice(row, selector, priceRegex) {
        const cellPrice = row.querySelector(selector);
        if (cellPrice) {
          const priceText = cellPrice.textContent.trim();
          if (priceRegex.test(priceText)) {
            return priceText;
          }
        }
        return null;
      }
    }, { selectedValues, pageTitle });


    console.log(uniqueCellClubValues);

    res.status(200).json({ uniqueCellClubValues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}
