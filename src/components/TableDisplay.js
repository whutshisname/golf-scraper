import React, { useState, useRef, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Select, Button, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function ProductTable({ products, items }) {
  const variantLabels = [
    'Club/Set',
    'Club',
    'Loft',
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
      return <a href={value[3]} target="_blank" rel="noopener noreferrer">{value[1]}</a>;
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

  function clearFilters() {
    setFilters({});
  }

  const variants = products.flatMap((product) =>
    product.variants.map((variantArray, variantIndex) => {
      const variantObj = variantArray.reduce((acc, variant) => {
        if (variant) {
          return { ...acc, [variant.label]: variant.value };
        }
        return acc;
      }, {});
      return { id: product.pid + "-" + variantIndex, ...variantObj, product: product.pid };
    })
  );

  const filteredVariants = variants.filter((variant) =>
    Object.entries(filters).every(([label, value]) => {
      if (value === '') {
        return true;
      }
      return variant[label] === value;
    })
  );

  function customSortComparator(v1, v2, cellParams1, cellParams2) {
    const getPrice = value => {
      if (Array.isArray(value) && value[1] && value[1] !== '-') {
        return parseFloat(value[1].replace('$', ''));
      }
      return null;  // using null to represent empty values (i.e., '-')
    }

    const price1 = getPrice(v1);
    const price2 = getPrice(v2);

    // Safely check if sortModel exists and has items
    const sortModelExists = cellParams1.sortModel && cellParams1.sortModel.length;
    const orderDirection = sortModelExists && cellParams1.sortModel[0].sort === 'asc' ? 1 : -1;

    if (price1 === null && price2 === null) return 0;
    if (price1 === null) return 1;  // Always place null at the bottom
    if (price2 === null) return -1; // Always place null at the bottom

    return (price1 - price2) * orderDirection;
  }

  const toolbarRef = useRef(null);  // This ref is used to capture the toolbar's width
  const [toolbarWidth, setToolbarWidth] = useState('100%');  // Start with 100% as default

  useEffect(() => {
    if (toolbarRef.current) {
      setToolbarWidth(toolbarRef.current.offsetWidth + 'px');  // Capture the width once the component mounts
    }
  }, []);

  function FiltersToolbar() {
    // Determine unique values for each label
    const uniqueValues = {};
    variantLabels.forEach(label => {
      uniqueValues[label] = [...new Set(variants.map(variant => variant[label]))].filter(value => value);
    });
  
    return (
      <div
        ref={toolbarRef}
        style={{ display: 'flex', justifyContent: 'flex-start', padding: '8px', background: '#f5f5f5' }} // justifyContent is changed to 'flex-start'
      >
        {variantLabels.map((label) => {
          if (
            label === 'Outlet' ||
            label === 'Like New' ||
            label === 'Very Good' ||
            label === 'Good' ||
            label === 'Average' ||
            label === 'Length' ||
            uniqueValues[label].length === 0
          ) {
            return null;
          }
          return (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px' }}> {/* added marginRight for spacing between filters */}
              <span>{label}</span>
              <Select
                onBlur={(e) => e.stopPropagation()}
                value={filters[label] || ''}
                onChange={(e) => {
                  handleFilterChange(label, e.target.value);
                  e.stopPropagation();
                }}
                fullWidth
                style={{
                  marginTop: '8px',
                  minWidth: '200px',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  backgroundColor: 'white',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                IconComponent={ArrowDropDownIcon}
              >
                <MenuItem value="">All</MenuItem>
                {uniqueValues[label].sort().map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </div>
          );
        })}
      </div>
    );
  }  
  
  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      flex: 3,
      renderCell: (params) => displayValue(params.value),
      renderHeader: () => null,
    },
    ...variantLabels.map((label) => {
      let columnConfig = {
        field: label,
        headerName: label,
        flex: label === 'Shaft Type' ? 5 : 1,
        renderCell: (params) => params.value ? parseVariantValue(params.value) : '-',
        disableClickEventBubbling: true,
        renderHeader: () => label,
      };
    
      if (
        label === 'Outlet' ||
        label === 'Like New' ||
        label === 'Very Good' ||
        label === 'Good' ||
        label === 'Average'
      ) {
        columnConfig.sortComparator = customSortComparator;
      }
    
      return columnConfig;
    })
    
  ];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Button onClick={clearFilters} variant="contained">
        Clear filters
      </Button>

      <DataGrid
        rows={filteredVariants}
        columns={columns}
        pageSize={5}
        autoHeight
        getRowHeight={() => 'auto'}
        disableColumnMenu
        getRowId={(row) => row.id}
        components={{
          Toolbar: FiltersToolbar,
        }}
      />
    </div>
  );
}


export default ProductTable;