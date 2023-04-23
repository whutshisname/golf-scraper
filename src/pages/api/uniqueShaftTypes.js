import { chromium } from 'playwright';

export default async function handler(req, res) {
  const pageUrl = req.query.pageUrl;

  if (!pageUrl) {
    res.status(400).json({ error: 'Missing pageUrl parameter' });
    return;
  }

  const browser = await chromium.launch({
    args: [],
    headless: true,
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: null,
  });

  const page = await context.newPage();
  await page.goto(pageUrl);

  const uniqueShaftTypes = await page.$$eval('.variantRow', (rows) => {
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
