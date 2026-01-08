'use client';

import { useEffect, useState } from 'react';
import styles from './sponsor.module.css';
import { Sponsor } from '@/app/lib/configManager';

interface SponsorBarProps {
  sponsors: Sponsor[];
  colors?: any;
}

export function SponsorBar({ sponsors, colors }: SponsorBarProps) {
  const [shouldScroll, setShouldScroll] = useState(false);
  const [displaySponsors, setDisplaySponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const threshold = isMobile ? 4 : 6;

    // Si hay suficientes patrocinadores, duplicar para crear el efecto infinito
    if (sponsors.length >= threshold) {
      setShouldScroll(true);
      // Duplicar 2 veces para asegurar que siempre haya contenido visible
      setDisplaySponsors([...sponsors, ...sponsors, ...sponsors]);
    } else {
      setShouldScroll(false);
      setDisplaySponsors(sponsors);
    }
  }, [sponsors]);

  return (
    <div className={styles.sponsorsSection}>
      <h2 className={styles.sponsorsTitle}>Nuestros Patrocinadores</h2>
      <div
        className={`${styles.sponsorsContainer} ${shouldScroll ? styles.autoScroll : ''}`}
        style={{
          '--sponsor-bg': colors?.sponsors?.item_bg || '#f0f0f0',
          '--sponsor-border': colors?.sponsors?.item_border || '#ddd',
        } as any}
      >
        {displaySponsors.map((sponsor, idx) => (
          <div key={`sponsor-${sponsor.id}-${idx}`} className={styles.sponsorItem}>
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              title={sponsor.name}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                loading="lazy"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}