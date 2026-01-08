class AdminManager {
    constructor() {
        this.config = null;
        this.isLoggedIn = false;
    }

    init() {
        this.setupLoginForm();
        this.setupTabs();
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const result = await this.validateLogin(username, password);
            if (result) {
                this.isLoggedIn = true;
                document.getElementById('loginPanel').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'flex';
                this.loadAdminPanel();
            } else {
                document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos';
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.isLoggedIn = false;
            document.getElementById('loginPanel').style.display = 'flex';
            document.getElementById('adminPanel').style.display = 'none';
            document.getElementById('loginForm').reset();
        });
    }

    async validateLogin(username, password) {
        try {
            const response = await fetch('config/credentials.json');
            const creds = await response.json();
            return username === creds.admin_user && password === creds.admin_password;
        } catch (error) {
            console.error('Error validando credenciales:', error);
            return false;
        }
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(tabName).classList.add('active');
            });
        });
    }

    loadAdminPanel() {
        setTimeout(() => {
            this.config = configManager.getConfig();
            this.loadColors();
            this.loadNavigation();
            this.loadHero();
            this.loadSponsors();
            this.loadContent();
            this.loadFooter();
        }, 100);
    }

    // ============ COLORES ============
    loadColors() {
        document.getElementById('navbarBg').value = this.rgbToHex(this.config.colors.navbar_bg);
        document.getElementById('navbarText').value = this.config.colors.navbar_text;
        document.getElementById('contentBg').value = this.config.colors.content_bg;
        document.getElementById('footerBg').value = this.rgbToHex(this.config.colors.footer_bg);
        document.getElementById('accent').value = this.config.colors.accent;
    }

    saveColors() {
        this.config.colors = {
            navbar_bg: this.hexToRgba(document.getElementById('navbarBg').value, 0.7),
            navbar_text: document.getElementById('navbarText').value,
            content_bg: document.getElementById('contentBg').value,
            footer_bg: this.hexToRgba(document.getElementById('footerBg').value, 0.5),
            accent: document.getElementById('accent').value
        };
        this.saveToFile();
        alert('Colores guardados correctamente');
    }

    rgbToHex(rgb) {
        const match = rgb.match(/\d+/g);
        if (!match) return '#000000';
        return "#" + ((1 << 24) + (parseInt(match[0]) << 16) + (parseInt(match[1]) << 8) + parseInt(match[2])).toString(16).slice(1);
    }

    hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // ============ NAVEGACIÓN ============
    loadNavigation() {
        const list = document.getElementById('navigationList');
        list.innerHTML = '';

        this.config.navigation.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            
            let subitemsHtml = '';
            if (item.subitems.length > 0) {
                subitemsHtml = `<strong>Subapartados:</strong><ul>${item.subitems.map(s => `<li>${s.label}</li>`).join('')}</ul>`;
            }

            card.innerHTML = `
                <div class="item-content">
                    <strong>${item.label}</strong>
                    <p>${item.url}</p>
                    ${subitemsHtml}
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="adminManager.editNavigation(${idx})">Editar</button>
                    <button class="delete-btn" onclick="adminManager.deleteNavigation(${idx})">Eliminar</button>
                </div>
            `;
            
            list.appendChild(card);
        });
    }

    addNavigationItem() {
        const label = prompt('Nombre del apartado:');
        if (!label) return;

        this.config.navigation.push({
            id: Date.now(),
            label,
            url: '#',
            subitems: []
        });

        this.saveToFile();
        this.loadNavigation();
    }

    deleteNavigation(idx) {
        if (confirm('¿Eliminar este apartado?')) {
            this.config.navigation.splice(idx, 1);
            this.saveToFile();
            this.loadNavigation();
        }
    }

    editNavigation(idx) {
        const item = this.config.navigation[idx];
        const newLabel = prompt('Nuevo nombre:', item.label);
        if (newLabel) {
            item.label = newLabel;
            this.saveToFile();
            this.loadNavigation();
        }
    }

    // ============ HERO ============
    loadHero() {
        document.getElementById('heroTitle').value = this.config.hero.title;
        document.getElementById('heroVideo').value = this.config.hero.video_url;
        document.getElementById('heroDiscord').value = this.config.hero.discord_url;
        document.getElementById('showDiscordBtn').checked = this.config.hero.show_discord_btn;
    }

    saveHero() {
        this.config.hero = {
            title: document.getElementById('heroTitle').value,
            video_url: document.getElementById('heroVideo').value,
            discord_url: document.getElementById('heroDiscord').value,
            show_discord_btn: document.getElementById('showDiscordBtn').checked
        };
        this.saveToFile();
        alert('Hero guardado correctamente');
    }

    // ============ PATROCINADORES ============
    loadSponsors() {
        const list = document.getElementById('sponsorsList');
        list.innerHTML = '';

        this.config.sponsors.forEach((sponsor, idx) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-content">
                    <strong>${sponsor.name}</strong>
                    <p><img src="${sponsor.logo}" alt="${sponsor.name}" style="max-width: 100px; margin-top: 0.5rem;"></p>
                    <p>${sponsor.url}</p>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="adminManager.editSponsor(${idx})">Editar</button>
                    <button class="delete-btn" onclick="adminManager.deleteSponsor(${idx})">Eliminar</button>
                </div>
            `;
            list.appendChild(card);
        });
    }

    addSponsor() {
        const name = prompt('Nombre del patrocinador:');
        if (!name) return;

        this.config.sponsors.push({
            id: Date.now(),
            name,
            logo: 'path/to/logo.png',
            url: 'https://...'
        });

        this.saveToFile();
        this.loadSponsors();
    }

    deleteSponsor(idx) {
        if (confirm('¿Eliminar este patrocinador?')) {
            this.config.sponsors.splice(idx, 1);
            this.saveToFile();
            this.loadSponsors();
        }
    }

    editSponsor(idx) {
        const sponsor = this.config.sponsors[idx];
        const name = prompt('Nombre:', sponsor.name);
        if (name) {
            sponsor.name = name;
            this.saveToFile();
            this.loadSponsors();
        }
    }

    // ============ CONTENIDO ============
    loadContent() {
        const list = document.getElementById('contentList');
        list.innerHTML = '';

        this.config.content_blocks.forEach((block, idx) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-content">
                    <strong>${block.title}</strong>
                    <p>Tipo: ${block.type} | Layout: ${block.layout}</p>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="adminManager.editContent(${idx})">Editar</button>
                    <button class="delete-btn" onclick="adminManager.deleteContent(${idx})">Eliminar</button>
                </div>
            `;
            list.appendChild(card);
        });
    }

    addContentBlock() {
        alert('Funcionalidad de agregar bloque - implementar formulario dinámico');
    }

    deleteContent(idx) {
        if (confirm('¿Eliminar este bloque?')) {
            this.config.content_blocks.splice(idx, 1);
            this.saveToFile();
            this.loadContent();
        }
    }

    editContent(idx) {
        alert('Funcionalidad de editar bloque - implementar formulario dinámico');
    }

    // ============ FOOTER ============
    loadFooter() {
        const list = document.getElementById('footerLinksList');
        list.innerHTML = '';

        this.config.footer.links.forEach((link, idx) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-content">
                    <strong>${link.label}</strong>
                    <p>${link.url}</p>
                </div>
                <div class="item-actions">
                    <button class="delete-btn" onclick="adminManager.deleteFooterLink(${idx})">Eliminar</button>
                </div>
            `;
            list.appendChild(card);
        });

        document.getElementById('copyright').value = this.config.footer.copyright;
    }

    addFooterLink() {
        const label = prompt('Texto del enlace:');
        if (!label) return;
        const url = prompt('URL:');
        if (!url) return;

        this.config.footer.links.push({ label, url });
        this.saveToFile();
        this.loadFooter();
    }

    deleteFooterLink(idx) {
        if (confirm('¿Eliminar este enlace?')) {
            this.config.footer.links.splice(idx, 1);
            this.saveToFile();
            this.loadFooter();
        }
    }

    saveFooter() {
        this.config.footer.copyright = document.getElementById('copyright').value;
        this.saveToFile();
        alert('Footer guardado correctamente');
    }

    // ============ GUARDAR A ARCHIVO ============
    saveToFile() {
        // En una aplicación real, esto haría un POST al servidor
        localStorage.setItem('siteConfig', JSON.stringify(this.config));
        console.log('Configuración guardada en localStorage');
    }
}

const adminManager = new AdminManager();
adminManager.init();
