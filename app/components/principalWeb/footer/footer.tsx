'use client';

import styles from './footer.module.css';
import { Colors } from '@/app/lib/configManager';

interface FooterProps {
  footer: {
    links: Array<{ label: string; url: string }>;
    copyright: string;
  };
  colors: Colors;
}

export function Footer({ footer, colors }: FooterProps) {
  return (
    <footer 
      className={styles.footer}
      style={{
        backgroundColor: colors.footer_bg,
        color: colors.navbar_text,
      }}
    >
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          {footer.links.map((link, idx) => (
            <a 
              key={idx}
              href={link.url} 
              className={styles.footerLink}
              target={link.url.startsWith('http') ? '_blank' : '_self'}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className={styles.footerCopyright}>
          {footer.copyright}
        </div>
      </div>
    </footer>
  );
}