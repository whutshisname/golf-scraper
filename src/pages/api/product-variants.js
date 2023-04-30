// pages/api/product-variant.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  console.log (req.bod);
  const { pairs } = req.body;
  console.log (pairs);
  
  if (!pairs || !Array.isArray(pairs)) {
    res.status(400).json({ message: 'Invalid request body' });
    return;
  }

  const fetchProductVariants = async (pid, cgid) => {
    const url = `https://www.callawaygolfpreowned.com/on/demandware.store/Sites-CGPO5-Site/default/Product-VariantData?pid=${pid}&cgid=${cgid}&format=json`;
    console.log(url);

    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const results = [];

  for (const pair of pairs) {
    const data = await fetchProductVariants(pair.pid, pair.cgid);
    console.log(data);
    if (data) {
      console.log(JSON.stringify(data, null, 2));

      results.push(data);
    }
  }

  if (results.length > 0) {
    res.status(200).json(results);
  } else {
    res.status(500).json({ message: 'Unable to fetch product variants.' });
  }
}
