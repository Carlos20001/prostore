'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL';

interface SizeSelectorProps {
  defaultSize?: Size;
  onChange?: (size: Size) => void;
}

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL'];

const SizeSelector: React.FC<SizeSelectorProps> = ({ defaultSize = 'M', onChange }) => {
  const [selectedSize, setSelectedSize] = useState<Size>(defaultSize);

  const handleSelect = (size: Size) => {
    setSelectedSize(size);
    onChange?.(size);
  };

  return (
    <div className="flex gap-2">
      {SIZES.map((size) => (
        <Button
          key={size}
          variant={selectedSize === size ? 'default' : 'outline'}
          onClick={() => handleSelect(size)}
        >
          {size}
        </Button>
      ))}
    </div>
  );
};

export default SizeSelector;
