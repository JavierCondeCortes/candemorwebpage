'use client';

import { useEffect, useState } from 'react';
import { CandeNavbar } from './components/principalWeb/navbar/candeNavbar';
import { VideoHero } from './components/principalWeb/hero/hero';
import { SponsorBar } from './components/principalWeb/sponsorBar/sponsor';
import { Footer } from './components/principalWeb/footer/footer';
import { ContentBlock } from './components/principalWeb/contentBlock/ContentBlock';
import { AnimatedDivider } from './components/principalWeb/divider/AnimatedDivider';
import { configManager, SiteConfig } from './lib/configManager';

export default function Home() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initConfig = async () => {
      try {
        const loadedConfig = await configManager.loadConfig();
        setConfig(loadedConfig);
        applyConfigColors(loadedConfig);
        applyFonts(loadedConfig);
      } catch (error) {
        console.error('Error inicializando configuración:', error);
      } finally {
        setLoading(false);
      }
    };

    initConfig();
  }, []);

  const applyConfigColors = (cfg: SiteConfig) => {
    const root = document.documentElement;
    
    // Navbar
    if (cfg.colors?.navbar) {
      root.style.setProperty('--navbar_bg', cfg.colors.navbar.background || 'rgba(0, 0, 0, 0.7)');
      root.style.setProperty('--navbar_text', cfg.colors.navbar.text || '#FFFFFF');
      root.style.setProperty('--navbar_hover', cfg.colors.navbar.hover || 'rgba(255, 255, 255, 0.1)');
    }

    // Hero
    if (cfg.colors?.hero) {
      root.style.setProperty('--hero_title', cfg.colors.hero.title || '#FFFFFF');
      root.style.setProperty('--hero_button_bg', cfg.colors.hero.button_bg || '#FFFFFF');
      root.style.setProperty('--hero_button_text', cfg.colors.hero.button_text || '#5865F2');
      root.style.setProperty('--hero_button_hover', cfg.colors.hero.button_hover || '#F0F0F0');
    }

    // Footer
    if (cfg.colors?.footer) {
      root.style.setProperty('--footer_bg', cfg.colors.footer.background || 'rgba(0, 0, 0, 0.8)');
      root.style.setProperty('--footer_text', cfg.colors.footer.text || '#FFFFFF');
      root.style.setProperty('--footer_link_hover', cfg.colors.footer.link_hover || '#9D4EDD');
    }

    // Dividers
    if (cfg.colors?.dividers) {
      root.style.setProperty('--divider_color1', cfg.colors.dividers.color1 || '#9D4EDD');
      root.style.setProperty('--divider_color2', cfg.colors.dividers.color2 || '#000000');
      root.style.setProperty('--divider_color3', cfg.colors.dividers.color3 || '#FFD60A');
    }

    // Sponsors
    if (cfg.colors?.sponsors) {
      root.style.setProperty('--sponsors_item_bg', cfg.colors.sponsors.item_bg || '#f0f0f0');
      root.style.setProperty('--sponsors_item_border', cfg.colors.sponsors.item_border || '#ddd');
      root.style.setProperty('--sponsors_item_hover', cfg.colors.sponsors.item_hover || '#e0e0e0');
    }

    // Content
    if (cfg.colors?.content) {
      root.style.setProperty('--content_bg', cfg.colors.content.background || '#FFFFFF');
      root.style.setProperty('--content_title', cfg.colors.content.title || '#333');
      root.style.setProperty('--content_text', cfg.colors.content.text || '#555');
      root.style.setProperty('--content_link', cfg.colors.content.link || '#9D4EDD');
    }
  };

  const applyFonts = (cfg: SiteConfig) => {
    const root = document.documentElement;
    
    if (cfg.fonts?.title_font) {
      const link = document.createElement('link');
      link.href = cfg.fonts.title_font;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    if (cfg.fonts?.body_font) {
      const link = document.createElement('link');
      link.href = cfg.fonts.body_font;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    if (cfg.fonts?.title_family) {
      root.style.setProperty('--title_family', cfg.fonts.title_family);
    }
    if (cfg.fonts?.body_family) {
      root.style.setProperty('--body_family', cfg.fonts.body_family);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[var(--content_bg)]"><p style={{ color: 'var(--navbar_text)' }}>Cargando...</p></div>;
  }

  if (!config) {
    return <div className="flex items-center justify-center min-h-screen bg-[var(--content_bg)]"><p style={{ color: 'var(--navbar_text)' }}>Error cargando configuración</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <nav className="sticky top-0 z-50">
          <CandeNavbar navigation={config.navigation} colors={config.colors} />
        </nav>
        <div className="hero-section">
          <VideoHero hero={config.hero} colors={config.colors} fonts={config.fonts} />
        </div>
      </header>

      <AnimatedDivider colors={config.colors} />

      <section className="sponsors-wrapper py-8" style={{ backgroundColor: 'var(--content_bg)' }}>
        <SponsorBar sponsors={config.sponsors} colors={config.colors} />
      </section>

      <AnimatedDivider colors={config.colors} />

      <main className="flex-1 w-full" style={{ backgroundColor: 'var(--content_bg)' }}>
        <div className="max-w-6xl mx-auto px-4 py-12 md:px-8 md:py-16">
          {config.content_blocks.map((block) => (
            <ContentBlock key={block.id} block={block} />
          ))}
        </div>
      </main>

      <AnimatedDivider colors={config.colors} />

      <footer>
        <Footer footer={config.footer} colors={config.colors} />
      </footer>
    </div>
  );
}
