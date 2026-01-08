export interface NavItem {
  id: number;
  label: string;
  url: string;
  subitems: SubItem[];
}

export interface SubItem {
  label: string;
  url: string;
}

export interface Colors {
  navbar_bg: string;
  navbar_text: string;
  content_bg: string;
  footer_bg: string;
  accent: string;
  divider_color1: string;
  divider_color2: string;
  divider_color3: string;
}

export interface Hero {
  video_url: string;
  title: string;
  discord_url: string;
  show_discord_btn: boolean;
}

export interface Sponsor {
  id: number;
  name: string;
  logo: string;
  url: string;
}

export interface ContentBlock {
  id: number;
  type: string;
  layout: string;
  title: string;
  text: string;
  image?: string;
  image_shadow?: boolean;
}

export interface Fonts {
  title_font: string;
  body_font: string;
  title_family: string;
  body_family: string;
}

export interface SiteConfig {
  navigation: NavItem[];
  colors: Colors;
  fonts?: Fonts;
  hero: Hero;
  sponsors: Sponsor[];
  content_blocks: ContentBlock[];
  footer: {
    links: FooterLink[];
    copyright: string;
  };
  twitch: {
    channel: string;
    show_offline: boolean;
  };
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: SiteConfig | null = null;

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async loadConfig(): Promise<SiteConfig> {
    try {
      const response = await fetch('/data/site-config.json');
      this.config = await response.json();
      return this.config;
    } catch (error) {
      console.error('Error cargando configuración:', error);
      throw error;
    }
  }

  getConfig(): SiteConfig | null {
    return this.config;
  }

  async saveConfig(config: SiteConfig): Promise<void> {
    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (response.ok) {
        this.config = config;
      }
    } catch (error) {
      console.error('Error guardando configuración:', error);
      throw error;
    }
  }
}

export const configManager = ConfigManager.getInstance();
