'use client';

import { useState } from 'react';
import SizeSelector, { Size } from './size-selector';

const SizeSelectorWrapper = () => {
  const [selectedSize, setSelectedSize] = useState<Size>('M');

  const handleSizeChange = (size: Size) => {
    setSelectedSize(size);
    console.log('Selected size:', size);
  };

  return (
    <div className="my-4">
      <h3 className="mb-2 font-semibold">Select a size:</h3>
      <SizeSelector onChange={handleSizeChange} defaultSize={selectedSize} />
    </div>
  );
};

export default SizeSelectorWrapper;
