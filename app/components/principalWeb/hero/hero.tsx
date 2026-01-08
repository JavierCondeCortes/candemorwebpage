'use client';

import { useState, useEffect } from 'react';
import styles from './hero.module.css';
import { Hero, Colors } from '@/app/lib/configManager';
import { twitchService, StreamStatus } from '@/app/lib/twitchService';

interface VideoHeroProps {
  hero: Hero;
  colors?: Colors;
  fonts?: any;
}

export function VideoHero({ hero, colors, fonts }: VideoHeroProps) {
  const [streamStatus, setStreamStatus] = useState<StreamStatus>({ isLive: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStream = async () => {
      setLoading(true);
      const status = await twitchService.getStreamStatus('candemorracingteam');
      setStreamStatus(status);
      setLoading(false);
    };

    checkStream();
    
    // Verificar cada 60 segundos
    const interval = setInterval(checkStream, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className={styles.hero}>
      {hero.video_url && (
        <video className={styles.heroVideo} autoPlay muted loop>
          <source src={hero.video_url} type="video/mp4" />
          Tu navegador no soporta video HTML5
        </video>
      )}

      <div className={styles.heroContent}>
        <h1 
          className={styles.heroTitle}
          style={{
            fontFamily: 'var(--cande_font)',
            fontSize: (hero as any).title_size || '4rem',
          }}
        >
          {hero.title}
        </h1>

        {hero.show_discord_btn && (
          <a 
            href={hero.discord_url} 
            className={styles.discordBtn} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <svg className={styles.discordIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M20.317 4.37a19.8 19.8 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 00-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 00-.079-.037A19.766 19.766 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.042-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.294.075.075 0 01.078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 01.079.009c.12.098.246.198.373.295a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.076.076 0 00-.041.107c.36.699.77 1.364 1.225 1.994a.078.078 0 00.084.028 19.963 19.963 0 006.002-3.03.077.077 0 00.032-.057c.5-4.761-.838-8.878-3.549-12.548a.061.061 0 00-.031-.03z" />
            </svg>
            Únete a Discord
          </a>
        )}

        <div className={styles.arrowDown}>
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>

      {/* Twitch Widget */}
      <div className={styles.twitchWidget} style={{ borderColor: colors?.accent || '#9D4EDD' }}>
        <div className={styles.twitchContent}>
          {loading ? (
            <div className={styles.loadingStatus}>
              <div className={styles.spinner}>⏳</div>
              <div>Cargando...</div>
            </div>
          ) : streamStatus.isLive ? (
            <div className={styles.streamContainer}>
              <div className={styles.streamBadge}>🔴 EN VIVO</div>
              <iframe
                src={`https://player.twitch.tv/?channel=candemorracingteam&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                allowFullScreen={true}
              />
            </div>
          ) : (
            <div className={styles.offlineStatus}>
              <div className={styles.offlineDot}>●</div>
              <div className={styles.offlineText}>OFFLINE</div>
              <div className={styles.offlineSubtext}>Vuelve pronto</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
