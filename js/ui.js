class UIManager {
    constructor() {
        this.config = null;
    }

    init() {
        setTimeout(() => {
            this.config = configManager.getConfig();
            this.renderNavigation();
            this.renderHero();
            this.renderSponsors();
            this.renderContent();
            this.renderFooter();
            this.setupEventListeners();
        }, 100);
    }

    renderNavigation() {
        const navMenu = document.getElementById('navMenu');
        navMenu.innerHTML = '';

        this.config.navigation.forEach(item => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            
            if (item.subitems.length === 0) {
                li.innerHTML = `<a href="${item.url}">${item.label}</a>`;
            } else {
                li.innerHTML = `<span>${item.label}</span>`;
                li.addEventListener('click', () => this.toggleDropdown(item));
            }
            
            navMenu.appendChild(li);
        });
    }

    toggleDropdown(item) {
        const dropdown = document.getElementById('navDropdown');
        dropdown.innerHTML = '';
        
        const dropdownItem = document.createElement('div');
        dropdownItem.className = 'dropdown-item';
        
        const title = document.createElement('div');
        title.className = 'dropdown-title';
        title.textContent = item.label;
        dropdownItem.appendChild(title);

        if (item.subitems.length > 0) {
            const subitems = document.createElement('div');
            subitems.className = 'dropdown-subitems';
            
            item.subitems.forEach(sub => {
                const subitem = document.createElement('a');
                subitem.className = 'dropdown-subitem';
                subitem.href = sub.url;
                subitem.textContent = sub.label;
                subitems.appendChild(subitem);
            });
            
            dropdownItem.appendChild(subitems);
        }

        dropdown.appendChild(dropdownItem);
        dropdown.classList.add('active');
    }

    renderHero() {
        const heroTitle = document.getElementById('heroTitle');
        const discordBtn = document.getElementById('discordBtn');
        const heroVideo = document.querySelector('.hero-video');

        heroTitle.textContent = this.config.hero.title;
        discordBtn.href = this.config.hero.discord_url;
        
        if (!this.config.hero.show_discord_btn) {
            discordBtn.style.display = 'none';
        }

        const videoSource = heroVideo.querySelector('source');
        videoSource.src = this.config.hero.video_url;
        heroVideo.load();
    }

    renderSponsors() {
        const container = document.getElementById('sponsorsContainer');
        container.innerHTML = '';

        this.config.sponsors.forEach(sponsor => {
            const sponsorDiv = document.createElement('div');
            sponsorDiv.className = 'sponsor-item';
            sponsorDiv.innerHTML = `<img src="${sponsor.logo}" alt="${sponsor.name}" title="${sponsor.name}">`;
            
            if (sponsor.url) {
                sponsorDiv.addEventListener('click', () => window.open(sponsor.url, '_blank'));
            }

            container.appendChild(sponsorDiv);
        });

        // Activar scroll automático si hay muchos patrocinadores
        const isMobile = window.innerWidth < 768;
        const threshold = isMobile ? 4 : 6;

        if (this.config.sponsors.length >= threshold) {
            container.classList.add('auto-scroll');
        }
    }

    renderContent() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = '';

        this.config.content_blocks.forEach(block => {
            const blockDiv = document.createElement('div');
            blockDiv.className = `content-block ${block.layout || 'text_centered'}`;

            if (block.type === 'text_image') {
                if (block.layout.includes('image')) {
                    blockDiv.innerHTML = `
                        <img src="${block.image}" alt="${block.title}" style="flex: 1; max-width: 500px;">
                        <div class="content-block-text" style="flex: 1;">
                            <h2 class="content-block-title">${block.title}</h2>
                            <p>${block.text}</p>
                        </div>
                    `;
                } else if (block.layout === 'image_centered') {
                    blockDiv.innerHTML = `
                        <img src="${block.image}" alt="${block.title}" style="max-width: 100%; max-height: 500px;">
                    `;
                }
            } else if (block.type === 'text_only') {
                blockDiv.innerHTML = `
                    <div class="content-block-text">
                        <h2 class="content-block-title">${block.title}</h2>
                        <p>${block.text}</p>
                    </div>
                `;
            }

            mainContent.appendChild(blockDiv);
        });
    }

    renderFooter() {
        const footerContent = document.getElementById('footerContent');
        const footerCopyright = document.getElementById('footerCopyright');

        footerContent.innerHTML = '';
        this.config.footer.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.className = 'footer-link';
            a.textContent = link.label;
            footerContent.appendChild(a);
        });

        footerCopyright.textContent = this.config.footer.copyright;
    }

    setupEventListeners() {
        const hamburger = document.getElementById('hamburger');
        const dropdown = document.getElementById('navDropdown');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                hamburger.classList.remove('active');
                dropdown.classList.remove('active');
            }
        });
    }
}

const uiManager = new UIManager();
uiManager.init();
