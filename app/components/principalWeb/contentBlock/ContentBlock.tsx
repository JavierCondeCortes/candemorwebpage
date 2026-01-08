'use client';

import styles from './content.module.css';
import { ContentBlock as ContentBlockType } from '@/app/lib/configManager';

interface ContentBlockProps {
  block: ContentBlockType;
}

export function ContentBlock({ block }: ContentBlockProps) {
  const getLayoutClass = () => {
    switch (block.layout) {
      case 'image_left':
        return styles.imageLeft;
      case 'image_right':
        return styles.imageRight;
      case 'image_centered':
        return styles.imageCentered;
      default:
        return styles.textCentered;
    }
  };

  // Texto + Imagen
  if (block.type === 'text_image') {
    return (
      <div className={`${styles.contentBlock} ${getLayoutClass()}`}>
        {block.image && (
          <img 
            src={block.image} 
            alt={block.title}
            className={`${styles.blockImage} ${block.image_shadow ? styles.withShadow : ''}`}
          />
        )}
        <div className={styles.blockText}>
          <h2 className={styles.blockTitle}>{block.title}</h2>
          <p className={styles.blockParagraph}>{block.text}</p>
        </div>
      </div>
    );
  }

  // Solo Texto
  if (block.type === 'text_only') {
    return (
      <div className={`${styles.contentBlock} ${styles.textCentered}`}>
        <div className={styles.blockText}>
          <h2 className={styles.blockTitle}>{block.title}</h2>
          <p className={styles.blockParagraph}>{block.text}</p>
        </div>
      </div>
    );
  }

  // Solo Imagen
  if (block.type === 'image_only') {
    return (
      <div className={`${styles.contentBlock} ${styles.imageCentered}`}>
        {block.image && (
          <img 
            src={block.image} 
            alt={block.title}
            className={`${styles.blockImage} ${block.image_shadow ? styles.withShadow : ''}`}
          />
        )}
      </div>
    );
  }

  return null;
}
