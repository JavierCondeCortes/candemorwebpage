'use client';

import { useState, useEffect } from 'react';
import { SiteConfig, Colors, Sponsor, ContentBlock, FooterLink } from '@/app/lib/configManager';
import { ColorUtils } from '@/app/lib/colorUtils';
import { ColorPicker } from './ColorPicker';
import { FileUploadField } from './FileUploadField';

interface AdminDashboardProps {
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
  onLogout: () => void;
}

export function AdminDashboard({ config, setConfig, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('colors');
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setLocalConfig(config);
    // Cargar favoritos y historial del localStorage
    loadColorPreferences();
  }, [config]);

  const loadColorPreferences = () => {
    try {
      const saved = localStorage.getItem('colorPreferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        setLocalConfig(prev => ({
          ...prev,
          colorFavorites: prefs.favorites || [],
          colorHistory: prefs.history || [],
        }));
      }
    } catch (error) {
      console.error('Error cargando preferencias:', error);
    }
  };

  const saveColorPreferences = () => {
    try {
      localStorage.setItem('colorPreferences', JSON.stringify({
        favorites: localConfig.colorFavorites || [],
        history: localConfig.colorHistory || [],
      }));
    } catch (error) {
      console.error('Error guardando preferencias:', error);
    }
  };

  const saveConfig = async () => {
    try {
      saveColorPreferences();
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localConfig),
      });

      if (response.ok) {
        setConfig(localConfig);
        setSavedMessage('✓ Configuración guardada');
        setTimeout(() => setSavedMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error guardando:', error);
      setSavedMessage('✗ Error guardando');
    }
  };

  const addToColorHistory = (color: string) => {
    if (!ColorUtils.isValidColor(color)) return;

    setLocalConfig(prev => {
      const history = [...(prev.colorHistory || [])];
      
      // Eliminar si ya existe
      const index = history.findIndex(c => ColorUtils.compare(c, color));
      if (index > -1) {
        history.splice(index, 1);
      }
      
      // Agregar al inicio
      history.unshift(color);
      
      // Limitar a 30 colores
      if (history.length > 30) {
        history.pop();
      }

      return { ...prev, colorHistory: history };
    });
  };

  const addToColorFavorites = (color: string) => {
    if (!ColorUtils.isValidColor(color)) return;

    setLocalConfig(prev => {
      const favorites = [...(prev.colorFavorites || [])];
      const index = favorites.findIndex(c => ColorUtils.compare(c, color));

      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.unshift(color);
        // Limitar a 15 favoritos
        if (favorites.length > 15) {
          favorites.pop();
        }
      }

      return { ...prev, colorFavorites: favorites };
    });
  };

  if (!localConfig) {
    return (
      <div className="admin-panel">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#9D4EDD', fontSize: '1.2rem' }}>⏳ Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <nav className="admin-navbar">
        <h2>🎮 Candemor Admin</h2>
        <button onClick={onLogout} className="logout-btn">Cerrar sesión</button>
      </nav>

      <div className="admin-container" style={{ padding: '2rem' }}>
        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'colors' ? 'active' : ''}`} onClick={() => setActiveTab('colors')}>🎨 Colores</button>
          <button className={`tab-btn ${activeTab === 'fonts' ? 'active' : ''}`} onClick={() => setActiveTab('fonts')}>🔤 Fuentes</button>
          <button className={`tab-btn ${activeTab === 'navigation' ? 'active' : ''}`} onClick={() => setActiveTab('navigation')}>📍 Navegación</button>
          <button className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>🎬 Hero</button>
          <button className={`tab-btn ${activeTab === 'sponsors' ? 'active' : ''}`} onClick={() => setActiveTab('sponsors')}>⭐ Patrocinadores</button>
          <button className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>📝 Contenido</button>
          <button className={`tab-btn ${activeTab === 'footer' ? 'active' : ''}`} onClick={() => setActiveTab('footer')}>🔗 Footer</button>
        </div>

        {savedMessage && (
          <div style={{
            color: savedMessage.includes('✓') ? '#FFD60A' : '#ff6b6b',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 'bold',
            padding: '0.8rem',
            background: savedMessage.includes('✓') 
              ? 'rgba(255, 214, 10, 0.1)'
              : 'rgba(255, 107, 107, 0.1)',
            borderRadius: '6px',
          }}>
            {savedMessage}
          </div>
        )}

        {activeTab === 'colors' && (
          <ColorsTab
            config={localConfig}
            setConfig={setLocalConfig}
            onAddToHistory={addToColorHistory}
            onAddToFavorites={addToColorFavorites}
          />
        )}
        {activeTab === 'fonts' && <FontsTab config={localConfig} setConfig={setLocalConfig} />}
        {activeTab === 'navigation' && <NavigationTab config={localConfig} setConfig={setLocalConfig} />}
        {activeTab === 'hero' && <HeroTab config={localConfig} setConfig={setLocalConfig} />}
        {activeTab === 'sponsors' && <SponsorsTab config={localConfig} setConfig={setLocalConfig} />}
        {activeTab === 'content' && <ContentTab config={localConfig} setConfig={setLocalConfig} />}
        {activeTab === 'footer' && <FooterTab config={localConfig} setConfig={setLocalConfig} />}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem' }}>
        <button onClick={saveConfig} className="save-btn" style={{ paddingLeft: '3rem', paddingRight: '3rem' }}>
          💾 Guardar Cambios
        </button>
      </div>
    </div>
  );
}

interface ColorTabProps {
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
  onAddToHistory: (color: string) => void;
  onAddToFavorites: (color: string) => void;
}

function ColorsTab({ config, setConfig, onAddToHistory, onAddToFavorites }: ColorTabProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('navbar');
  const [previewSize, setPreviewSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Validar que colors existe
  if (!config?.colors) {
    return (
      <div className="tab-content active">
        <h3>🎨 Configuración de Colores</h3>
        <p style={{ color: '#ff6b6b' }}>Error: Configuración de colores no disponible</p>
      </div>
    );
  }

  const updateColor = (section: string, key: string, value: string) => {
    if (!ColorUtils.isValidColor(value)) return;

    const sectionKey = section as keyof Colors;
    
    setConfig({
      ...config,
      colors: {
        ...config.colors,
        [sectionKey]: {
          ...(config.colors?.[sectionKey] as any),
          [key]: value,
        },
      },
    });
  };

  const getPreviewStyle = () => {
    switch (previewSize) {
      case 'small':
        return { width: '60px', height: '60px', fontSize: '0.7rem' };
      case 'large':
        return { width: '150px', height: '150px', fontSize: '0.9rem' };
      default:
        return { width: '100px', height: '100px', fontSize: '0.8rem' };
    }
  };

  const ColorSection = ({ 
    title, 
    icon, 
    sectionKey 
  }: { 
    title: string
    icon: string
    sectionKey: keyof typeof config.colors 
  }) => {
    const sectionColors = config.colors?.[sectionKey];
    
    if (!sectionColors || typeof sectionColors !== 'object') return null;

    const colorEntries = Object.entries(sectionColors) as Array<[string, string]>;

    return (
      <div style={{
        background: 'var(--primary-black)',
        border: '2px solid #2a2a3e',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        overflow: 'hidden',
      }}>
        <button
          onClick={() => setExpandedSection(expandedSection === sectionKey ? null : sectionKey)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            background: 'linear-gradient(90deg, rgba(157, 78, 221, 0.2), rgba(255, 214, 10, 0.1))',
            border: 'none',
            color: '#FFD60A',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: '600',
            fontSize: '1.1rem',
          }}
        >
          <span>{icon} {title}</span>
          <span style={{
            transform: expandedSection === sectionKey ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}>▼</span>
        </button>

        {expandedSection === sectionKey && (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Preview Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(${previewSize === 'small' ? '80px' : previewSize === 'large' ? '180px' : '130px'}, 1fr))`,
              gap: '2rem',
              padding: '1rem',
              background: 'rgba(157, 78, 221, 0.08)',
              borderRadius: '8px',
            }}>
              {colorEntries.map(([key, value]) => (
                <button
                  key={`${sectionKey}-${key}`}
                  onClick={() => {
                    const input = document.querySelector(
                      `[data-color="${sectionKey}-${key}"]`
                    ) as HTMLInputElement;
                    input?.focus();
                  }}
                  style={{
                    ...getPreviewStyle(),
                    background: ColorUtils.isValidColor(value) ? value : 'linear-gradient(45deg, #ccc 25%, transparent 25%)',
                    backgroundSize: '10px 10px',
                    border: `2px solid ${ColorUtils.isValidColor(value) ? value : '#9D4EDD'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                  }}
                  title={`${key}\n${value}\nClick para editar`}
                >
                  <div style={{
                    position: 'absolute',
                    bottom: '-28px',
                    left: 0,
                    right: 0,
                    fontSize: '0.65rem',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                    textAlign: 'center',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {key}
                  </div>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              padding: '0.8rem',
              background: 'rgba(157, 78, 221, 0.1)',
              borderRadius: '8px',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setPreviewSize(size)}
                    style={{
                      padding: '0.5rem 0.8rem',
                      background: previewSize === size ? '#9D4EDD' : 'rgba(157, 78, 221, 0.2)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      transition: 'all 0.3s',
                    }}
                    title={size === 'small' ? 'Pequeño' : size === 'large' ? 'Grande' : 'Mediano'}
                  >
                    {size === 'small' ? '□' : size === 'large' ? '■' : '◨'}
                  </button>
                ))}
              </div>
              <p style={{ margin: 0, color: '#9D4EDD', fontSize: '0.85rem' }}>
                📌 Click en colores para editar
              </p>
            </div>

            {/* Color Inputs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}>
              {colorEntries.map(([key, value]) => (
                <div key={`${sectionKey}-${key}`} data-color={`${sectionKey}-${key}`}>
                  <ColorPicker
                    value={value}
                    onChange={(color) => updateColor(sectionKey, key, color)}
                    label={key.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    onAddToHistory={onAddToHistory}
                    onAddToFavorites={onAddToFavorites}
                    favorites={config.colorFavorites}
                    history={config.colorHistory}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tab-content active">
      <h3>🎨 Configuración de Colores</h3>
      <p style={{ color: '#b0b0b0', marginBottom: '2rem' }}>
        Personaliza todos los colores de tu sitio. Usa ⭐ para favoritos y reutiliza del historial.
      </p>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <ColorSection title="Barra de Navegación" icon="📍" sectionKey="navbar" />
        <ColorSection title="Sección Hero" icon="🎬" sectionKey="hero" />
        <ColorSection title="Pie de Página" icon="🔗" sectionKey="footer" />
        <ColorSection title="Líneas Divisoras" icon="➖" sectionKey="dividers" />
        <ColorSection title="Patrocinadores" icon="⭐" sectionKey="sponsors" />
        <ColorSection title="Contenido Principal" icon="📝" sectionKey="content" />
      </div>
    </div>
  );
}

function NavigationTab({ config, setConfig }: { config: SiteConfig; setConfig: (config: SiteConfig) => void }) {
  const addNavItem = () => {
    const newItem = {
      id: Date.now(),
      label: 'Nuevo Apartado',
      url: '#',
      subitems: [],
    };
    setConfig({
      ...config,
      navigation: [...config.navigation, newItem],
    });
  };

  const updateNavItem = (id: number, field: string, value: any) => {
    setConfig({
      ...config,
      navigation: config.navigation.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const deleteNavItem = (id: number) => {
    setConfig({
      ...config,
      navigation: config.navigation.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="tab-content active">
      <h3>📍 Gestionar Navegación</h3>
      <button onClick={addNavItem} className="add-btn" style={{ marginBottom: '2rem' }}>+ Agregar Apartado</button>

      <div className="items-list">
        {config.navigation.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-content" style={{ flex: 1 }}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateNavItem(item.id, 'label', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>URL</label>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => updateNavItem(item.id, 'url', e.target.value)}
                />
              </div>
            </div>
            <button onClick={() => deleteNavItem(item.id)} className="delete-btn">🗑️ Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SponsorsTab({ config, setConfig }: { config: SiteConfig; setConfig: (config: SiteConfig) => void }) {
  const addSponsor = () => {
    const newSponsor: Sponsor = {
      id: Date.now(),
      name: 'Nuevo Patrocinador',
      logo: '/path/to/logo.png',
      url: 'https://example.com',
    };
    setConfig({
      ...config,
      sponsors: [...config.sponsors, newSponsor],
    });
  };

  const updateSponsor = (id: number, field: string, value: any) => {
    setConfig({
      ...config,
      sponsors: config.sponsors.map((s: Sponsor) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  const deleteSponsor = (id: number) => {
    setConfig({
      ...config,
      sponsors: config.sponsors.filter((s: Sponsor) => s.id !== id),
    });
  };

  return (
    <div className="tab-content active">
      <h3>⭐ Gestionar Patrocinadores</h3>
      <button onClick={addSponsor} className="add-btn" style={{ marginBottom: '2rem' }}>+ Agregar Patrocinador</button>

      <div className="items-list">
        {config.sponsors.map((sponsor: Sponsor) => (
          <div key={sponsor.id} className="item-card">
            <div className="item-content" style={{ flex: 1 }}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={sponsor.name}
                  onChange={(e) => updateSponsor(sponsor.id, 'name', e.target.value)}
                />
              </div>
              <FileUploadField
                value={sponsor.logo}
                onChange={(url) => updateSponsor(sponsor.id, 'logo', url)}
                accept="image/*"
                label="Logo del Patrocinador"
              />
              <div className="form-group">
                <label>URL del Sitio</label>
                <input
                  type="text"
                  value={sponsor.url}
                  onChange={(e) => updateSponsor(sponsor.id, 'url', e.target.value)}
                />
              </div>
            </div>
            <button onClick={() => deleteSponsor(sponsor.id)} className="delete-btn">🗑️ Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroTab({ config, setConfig }: { config: SiteConfig; setConfig: (config: SiteConfig) => void }) {
  const updateHero = (field: string, value: any) => {
    setConfig({
      ...config,
      hero: { ...config.hero, [field]: value },
    });
  };

  return (
    <div className="tab-content active">
      <h3>🎬 Configurar Hero</h3>
      <div style={{ maxWidth: '600px' }}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            value={config.hero.title}
            onChange={(e) => updateHero('title', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Tamaño del Título (ej: 4rem, 3.5rem, 60px)</label>
          <input
            type="text"
            value={(config.hero as any).title_size || '4rem'}
            onChange={(e) => updateHero('title_size', e.target.value)}
            placeholder="4rem"
          />
        </div>
        <FileUploadField
          value={config.hero.video_url}
          onChange={(url) => updateHero('video_url', url)}
          accept="video/*"
          label="Video del Hero"
        />
        <div className="form-group">
          <label>URL Discord</label>
          <input
            type="text"
            value={config.hero.discord_url}
            onChange={(e) => updateHero('discord_url', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={config.hero.show_discord_btn}
              onChange={(e) => updateHero('show_discord_btn', e.target.checked)}
            />
            Mostrar botón Discord
          </label>
        </div>
      </div>
    </div>
  );
}

function FontsTab({ config, setConfig }: { config: SiteConfig; setConfig: (config: SiteConfig) => void }) {
  const updateFonts = (field: string, value: any) => {
    setConfig({
      ...config,
      fonts: { ...(config.fonts || {}), [field]: value },
    });
  };

  return (
    <div className="tab-content active">
      <h3>🔤 Configurar Fuentes</h3>
      <div style={{ maxWidth: '600px' }}>
        <div className="form-group">
          <label>Fuente para Títulos (Google Fonts URL)</label>
          <input
            type="text"
            value={config.fonts?.title_font || ''}
            onChange={(e) => updateFonts('title_font', e.target.value)}
            placeholder="https://fonts.googleapis.com/css2?family=..."
          />
        </div>
        <div className="form-group">
          <label>Familia de Fuente para Títulos</label>
          <input
            type="text"
            value={config.fonts?.title_family || ''}
            onChange={(e) => updateFonts('title_family', e.target.value)}
            placeholder="'Poppins', sans-serif"
          />
        </div>

        <div className="form-group">
          <label>Fuente para Texto (Google Fonts URL)</label>
          <input
            type="text"
            value={config.fonts?.body_font || ''}
            onChange={(e) => updateFonts('body_font', e.target.value)}
            placeholder="https://fonts.googleapis.com/css2?family=..."
          />
        </div>
        <div className="form-group">
          <label>Familia de Fuente para Texto</label>
          <input
            type="text"
            value={config.fonts?.body_family || ''}
            onChange={(e) => updateFonts('body_family', e.target.value)}
            placeholder="'Inter', sans-serif"
          />
        </div>

        <div style={{ padding: '1rem', background: 'rgba(157, 78, 221, 0.1)', borderRadius: '8px', marginTop: '1.5rem' }}>
          <p style={{ color: '#FFD60A', fontSize: '0.9rem', margin: 0 }}>
            💡 Puedes usar fuentes de Google Fonts. Ejemplo: https://fonts.googleapis.com/css2?family=Poppins:wght@700;900&display=swap
          </p>
        </div>
      </div>
    </div>
  );
}

function ContentTab({ config, setConfig }: { config: SiteConfig; setConfig: (config: SiteConfig) => void }) {
  const addBlock = () => {
    const newBlock: ContentBlock = {
      id: Date.now(),
      type: 'text_image',
      layout: 'image_left',
      title: 'Nuevo Bloque',
      text: 'Descripción...',
      image: '/path/to/image.png',
      image_shadow: true,
    };
    setConfig({
      ...config,
      content_blocks: [...config.content_blocks, newBlock],
    });
  };

  const updateBlock = (id: number, field: string, value: any) => {
    setConfig({
      ...config,
      content_blocks: config.content_blocks.map((b: ContentBlock) =>
        b.id === id ? { ...b, [field]: value } : b
      ),
    });
  };

  const deleteBlock = (id: number) => {
    setConfig({
      ...config,
      content_blocks: config.content_blocks.filter((b: ContentBlock) => b.id !== id),
    });
  };

  return (
    <div className="tab-content active">
      <h3>📝 Gestionar Contenido</h3>
      <button onClick={addBlock} className="add-btn" style={{ marginBottom: '2rem' }}>+ Agregar Bloque</button>

      <div className="items-list">
        {config.content_blocks.map((block: ContentBlock) => (
          <div key={block.id} className="item-card">
            <div className="item-content" style={{ flex: 1 }}>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Tipo de Contenido</label>
                <select
                  value={block.type}
                  onChange={(e) => updateBlock(block.id, 'type', e.target.value)}
                  style={{
                    color: '#000',
                    backgroundColor: '#fff',
                  }}
                >
                  <option value="text_image">Texto + Imagen</option>
                  <option value="text_only">Solo Texto</option>
                  <option value="image_only">Solo Imagen</option>
                </select>
              </div>

              {(block.type === 'text_image' || block.type === 'text_only') && (
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={block.text}
                    onChange={(e) => updateBlock(block.id, 'text', e.target.value)}
                  />
                </div>
              )}

              {block.type === 'text_image' && (
                <div className="form-group">
                  <label>Posición de la Imagen</label>
                  <select
                    value={block.layout}
                    onChange={(e) => updateBlock(block.id, 'layout', e.target.value)}
                    style={{
                      color: '#000',
                      backgroundColor: '#fff',
                    }}
                  >
                    <option value="image_left">Imagen Izquierda</option>
                    <option value="image_right">Imagen Derecha</option>
                  </select>
                </div>
              )}

              {(block.type === 'text_image' || block.type === 'image_only') && (
                <>
                  <FileUploadField
                    value={block.image || ''}
                    onChange={(url) => updateBlock(block.id, 'image', url)}
                    accept="image/*"
                    label="Imagen"
                  />
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={block.image_shadow || false}
                        onChange={(e) => updateBlock(block.id, 'image_shadow', e.target.checked)}
                      />
                      Agregar sombra a los bordes
                    </label>
                  </div>
                </>
              )}
            </div>
            <button onClick={() => deleteBlock(block.id)} className="delete-btn">🗑️ Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterTab({ config, setConfig }: { config: SiteConfig; setConfig: (config: SiteConfig) => void }) {
  const addLink = () => {
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        links: [...config.footer.links, { label: 'Nuevo Enlace', url: '#' }],
      },
    });
  };

  const updateLink = (idx: number, field: string, value: string) => {
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        links: config.footer.links.map((link: FooterLink, i: number) =>
          i === idx ? { ...link, [field]: value } : link
        ),
      },
    });
  };

  const deleteLink = (idx: number) => {
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        links: config.footer.links.filter((_: FooterLink, i: number) => i !== idx),
      },
    });
  };

  const updateCopyright = (value: string) => {
    setConfig({
      ...config,
      footer: { ...config.footer, copyright: value },
    });
  };

  return (
    <div className="tab-content active">
      <h3>🔗 Configurar Footer</h3>
      <button onClick={addLink} className="add-btn" style={{ marginBottom: '2rem' }}>+ Agregar Enlace</button>

      <div className="items-list">
        {config.footer.links.map((link: FooterLink, idx: number) => (
          <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
            <input
              type="text"
              placeholder="Nombre"
              value={link.label}
              onChange={(e) => updateLink(idx, 'label', e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              type="text"
              placeholder="URL"
              value={link.url}
              onChange={(e) => updateLink(idx, 'url', e.target.value)}
              style={{ flex: 1 }}
            />
            <button onClick={() => deleteLink(idx)} className="delete-btn">🗑️</button>
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Copyright</label>
        <textarea
          value={config.footer.copyright}
          onChange={(e) => updateCopyright(e.target.value)}
        />
      </div>
    </div>
  );
}
