class TwitchWidget {
    constructor() {
        this.config = null;
        this.channel = null;
    }

    init() {
        setTimeout(() => {
            this.config = configManager.getConfig();
            this.channel = this.config.twitch.channel;
            this.checkStreamStatus();
            // Actualizar cada 30 segundos
            setInterval(() => this.checkStreamStatus(), 30000);
        }, 100);
    }

    async checkStreamStatus() {
        try {
            const response = await fetch(`https://api.twitch.tv/kraken/streams/${this.channel}`, {
                headers: {
                    'Client-ID': 'YOUR_TWITCH_CLIENT_ID' // Reemplazar con Client ID real
                }
            });

            const data = await response.json();
            this.renderWidget(data.stream !== null);
        } catch (error) {
            console.warn('No se pudo conectar con Twitch API, mostrando offline');
            this.renderWidget(false);
        }
    }

    renderWidget(isOnline) {
        const twitchContent = document.getElementById('twitchContent');
        twitchContent.innerHTML = '';

        if (isOnline) {
            twitchContent.innerHTML = `
                <div style="width: 100%; height: 100%; background: #000;">
                    <iframe src="https://player.twitch.tv/?channel=${this.channel}&parent=localhost" 
                            width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen>
                    </iframe>
                </div>
            `;
        } else {
            twitchContent.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚫</div>
                    <div style="font-size: 1.2rem; font-weight: bold;">OFFLINE</div>
                    <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8;">
                        ${this.channel} no está en directo
                    </div>
                </div>
            `;
        }
    }
}

const twitchWidget = new TwitchWidget();
twitchWidget.init();
