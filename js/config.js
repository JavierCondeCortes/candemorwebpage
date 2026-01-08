class ConfigManager {
    constructor() {
        this.config = null;
    }

    async loadConfig() {
        try {
            const response = await fetch('data/site-config.json');
            this.config = await response.json();
            this.applyColors();
        } catch (error) {
            console.error('Error cargando configuración:', error);
        }
    }

    applyColors() {
        const root = document.documentElement;
        Object.keys(this.config.colors).forEach(key => {
            root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, this.config.colors[key]);
        });
    }

    getConfig() {
        return this.config;
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem('siteConfig', JSON.stringify(this.config));
        this.applyColors();
    }
}

const configManager = new ConfigManager();
configManager.loadConfig();
