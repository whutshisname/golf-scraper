import React, { useState } from 'react';

function ProductTable({ products, items }) {
  const variantLabels = [
    'Club & Loft',
    'Shaft Type',
    'Shaft Flex',
    'Length',
    'Outlet',
    'Like New',
    'Very Good',
    'Good',
    'Average',
  ];

  const parseVariantValue = (value) => {
    if (Array.isArray(value)) {
      return <a href={value[3]} target="_blank">{value[1]}</a>;
    } else if (typeof value === 'object') {
      return Object.values(value).join(' ');
    } else {
      return value;
    }
  };

  const displayValue = (pid) => {
    const item = items.find((item) => item.pid === pid);
    return item ? item.displayValue : pid;
  };

  const [filters, setFilters] = useState({});

  function handleFilterChange(label, value) {
    setFilters({
      ...filters,
      [label]: value,
    });
  }

  const variants = products.flatMap((product) =>
    product.variants.map((variantArray) => {
      const variantObj = variantArray.reduce((acc, variant) => {
        if (variant) {
          return { ...acc, [variant.label]: variant.value };
        }
        return acc;
      }, {});
      return { ...variantObj, product: product.pid };
    })
  );

  const filteredVariants = variants.filter((variant) =>
    Object.entries(filters).every(([label, value]) => {
      if (value === '') {
        return true;
      }
      if (label === 'Club & Loft') {
        const [club, loft] = value.split(' ');
        return (
          (variant['Club'] === club || club === '') &&
          (variant['Loft'] === loft || loft === '')
        );
      }
      return variant[label] === value;
    })
  );

  const clubLoftOptions = [
    ...new Set(
      variants.flatMap((variant) => {
        const club = variant['Club'] ? `${variant['Club']} ` : '';
        const loft = variant['Loft'] ? variant['Loft'] : '';
        return club || loft ? `${club}${loft}`.trim() : null;
      })
    ),
  ].filter((value) => value !== null).sort();
  
  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          {variantLabels.map((label) => {
            if (
              label === 'Outlet' ||
              label === 'Like New' ||
              label === 'Very Good' ||
              label === 'Good' ||
              label === 'Average'
            ) {
              return <th key={label}>{label}</th>;
            }
  
            if (label === 'Club & Loft') {
              return (
                <th key={label}>
                  {label}
                  <select
                    onChange={(e) => handleFilterChange(label, e.target.value)}
                    value={filters[label] || ''}
                  >
                    <option value="">All</option>
                    {clubLoftOptions.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </th>
              );
            }
  
            return (
              <th key={label}>
                {label}
                <select
                  onChange={(e) => handleFilterChange(label, e.target.value)}
                  value={filters[label] || ''}
                >
                  <option value="">All</option>
                  {[...new Set(variants.map((variant) => variant[label]))]
                    .filter((value) => value)
                    .sort()
                    .map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                </select>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {filteredVariants.map((variant, index) => (
          <tr key={index}>
            <td>{displayValue(variant.product)}</td>
            {variantLabels.map((label, idx) => (
              <td key={idx}>
                {label === 'Club & Loft'
                  ? `${variant['Club'] || ''} ${variant['Loft'] || ''}`.trim()
                  : variant[label]
                  ? parseVariantValue(variant[label])
                  : '-'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    );
}

export default ProductTable;
