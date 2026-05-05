import React from 'react';
import { motion } from 'framer-motion';

interface FractionCircleProps {
  numerator: number;
  denominator: number;
  color?: string;
  size?: number;
  label?: string;
}

export const FractionCircle: React.FC<FractionCircleProps> = ({
  numerator, denominator, color = '#8b5cf6', size = 80, label
}) => {
  const paths: string[] = [];
  const cx = size / 2, cy = size / 2, r = size / 2 - 2;

  for (let i = 0; i < denominator; i++) {
    const startAngle = (i / denominator) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / denominator) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = denominator === 1 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    paths.push(path);
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths.map((path, i) => (
          <motion.path
            key={i}
            d={path}
            fill={i < numerator ? color : '#e5e7eb'}
            stroke="white"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </svg>
      {label && (
        <div className="text-center">
          <div className="font-black text-lg leading-none">{numerator}</div>
          <div className="w-full h-0.5 bg-gray-800" />
          <div className="font-black text-lg leading-none">{denominator}</div>
        </div>
      )}
    </div>
  );
};

interface FractionBarProps {
  numerator: number;
  denominator: number;
  color?: string;
  width?: number;
  showLabel?: boolean;
}

export const FractionBar: React.FC<FractionBarProps> = ({
  numerator, denominator, color = '#8b5cf6', width = 200, showLabel = true
}) => {
  const cellWidth = Math.floor(width / denominator);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex border-2 border-gray-300 rounded-lg overflow-hidden" style={{ width: cellWidth * denominator }}>
        {Array.from({ length: denominator }).map((_, i) => (
          <motion.div
            key={i}
            style={{ width: cellWidth, height: 36 }}
            className={`border-r border-gray-300 last:border-r-0 flex items-center justify-center text-xs font-bold`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backgroundColor: i < numerator ? color : '#f3f4f6' }}
            transition={{ delay: i * 0.05 }}
          >
            {i < numerator ? <span style={{ color: 'white' }}>✓</span> : ''}
          </motion.div>
        ))}
      </div>
      {showLabel && (
        <div className="text-center font-black">
          <span style={{ color }}>{numerator}/{denominator}</span>
          <span className="text-gray-500 text-sm ml-2">= {(numerator/denominator).toFixed(denominator <= 10 ? 1 : 2)}</span>
        </div>
      )}
    </div>
  );
};

interface FractionDisplayProps {
  numerator: number;
  denominator: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({ numerator, denominator, color = 'text-purple-700', size = 'md' }) => {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
  return (
    <span className={`inline-flex flex-col items-center leading-none ${sizes[size]} font-black ${color} mx-1`}>
      <span>{numerator}</span>
      <span className="border-t-2 border-current w-full" />
      <span>{denominator}</span>
    </span>
  );
};
