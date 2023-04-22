// src/pages/api/uniqueShaftTypes.js
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const pageUrl = req.query.pageUrl;

  if (!pageUrl) {
    res.status(400).json({ error: 'Missing pageUrl parameter' });
    return;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pageUrl);

  const uniqueShaftTypes = await page.evaluate(() => {
    const rows = document.querySelectorAll('.variantRow');
    const shaftTypeSet = new Set();

    for (const row of rows) {
      const cellShaftType = row.querySelector('.cellShaftType');
      if (cellShaftType) {
        shaftTypeSet.add(cellShaftType.textContent.trim());
      }
    }

    return Array.from(shaftTypeSet);
  });

  await browser.close();
  res.status(200).json({ uniqueShaftTypes });
}
