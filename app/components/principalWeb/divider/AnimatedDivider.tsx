'use client';

import styles from './divider.module.css';

interface AnimatedDividerProps {
  colors?: any;
}

export function AnimatedDivider({ colors }: AnimatedDividerProps) {
  const color1 = colors?.dividers?.color1 || '#9D4EDD';
  const color2 = colors?.dividers?.color2 || '#000000';
  const color3 = colors?.dividers?.color3 || '#FFD60A';

  return (
    <div 
      className={styles.divider}
      style={{
        background: `linear-gradient(90deg, ${color1}, ${color2}, ${color3})`,
        backgroundSize: '200% 100%',
      }}
    />
  );
}
