/**
 * Asiatensor Executive Brief - Main Application
 * Optimized with asynchronous language loading and enhanced UX
 */

// ==========================================
// CONFIGURATION
// ==========================================

const APP_CONFIG = {
    STORAGE_KEYS: {
        AUTH: 'isAuthenticated',
        THEME: 'asiatensor-theme',
        LANGUAGE: 'asiatensor-language'
    },
    DEFAULT_THEME: 'dark',
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'ja', 'ko', 'zh-cn', 'zh-hk'],
    LANGUAGE_NAMES: {
        'en': 'EN',
        'zh-cn': '简体',
        'zh-hk': '繁體', 
        'ja': '日本語',
        'ko': '한국어'
    },
    LOCALES_PATH: './assets/locales/'
};

// ==========================================
// PICTURE-IN-PICTURE MODAL SYSTEM
// ==========================================

class PictureInPictureModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.id = 'pip-modal';
        this.modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden';
        this.modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden relative">
                <!-- Close button positioned absolutely in top-right corner -->
                <button id="pip-close" class="absolute top-3 right-3 z-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-all duration-200 shadow-lg" title="关闭 / Close">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                
                <div class="flex justify-between items-center p-4 pr-12 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white" id="pip-title">Loading...</h3>
                </div>
                <div class="p-6 overflow-auto max-h-[80vh]" id="pip-content">
                    <div class="flex items-center justify-center h-64">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
    }

    bindEvents() {
        const closeBtn = this.modal.querySelector('#pip-close');
        closeBtn.addEventListener('click', () => this.close());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open(title, content) {
        const titleEl = this.modal.querySelector('#pip-title');
        const contentEl = this.modal.querySelector('#pip-content');
        
        titleEl.textContent = title;
        contentEl.innerHTML = content;
        
        this.modal.classList.remove('hidden');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.add('hidden');
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    showCompanyInfo(symbol, name) {
        const content = `
            <div class="space-y-6">
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2">公司信息 / Company Information</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">股票代码 / Symbol: <span class="font-mono font-bold">${symbol}</span></p>
                    <p class="text-sm text-gray-600 dark:text-gray-300">公司名称 / Name: ${name}</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">K线图 / Stock Chart</h4>
                        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <iframe 
                                src="https://widget.finnhub.io/widgets/stocks/chart?symbol=${symbol}&watermarkColor=%23ffffff&backgroundColor=%23222222&textColor=%23ffffff"
                                width="100%" 
                                height="400"
                                frameborder="0"
                                allowtransparency="true"
                                scrolling="no"
                                class="w-full">
                            </iframe>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">实时报价 / Live Quote</h4>
                        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                            <iframe 
                                src="https://widget.finnhub.io/widgets/stocks/quote?symbol=${symbol}&watermarkColor=%23ffffff&backgroundColor=%23222222&textColor=%23ffffff"
                                width="100%" 
                                height="300"
                                frameborder="0"
                                allowtransparency="true"
                                scrolling="no"
                                class="w-full">
                            </iframe>
                        </div>
                    </div>
                </div>
                
                <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
                    数据由 Finnhub 提供 / Data provided by Finnhub
                </div>
            </div>
        `;
        
        this.open(`${name} (${symbol})`, content);
    }

    showTaoPrice() {
        const content = `
            <div class="space-y-6">
                <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                    <h4 class="font-semibold mb-2">Bittensor (TAO) 实时价格</h4>
                    <p class="text-sm opacity-90">去中心化AI网络的原生代币 / Native token of decentralized AI network</p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">价格图表 / Price Chart</h4>
                        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <iframe 
                                src="https://widget.coinmarketcap.com/widget/chart?id=22974&range=7D&theme=auto"
                                width="100%" 
                                height="400"
                                frameborder="0"
                                allowtransparency="true"
                                scrolling="no"
                                class="w-full">
                            </iframe>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">市场数据 / Market Data</h4>
                        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <iframe 
                                src="https://widget.coinmarketcap.com/widget/coin?id=22974&theme=auto"
                                width="100%" 
                                height="300"
                                frameborder="0"
                                allowtransparency="true"
                                scrolling="no"
                                class="w-full">
                            </iframe>
                        </div>
                    </div>
                </div>
                
                <div class="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <h5 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">重要提醒 / Important Notice</h5>
                    <p class="text-sm text-yellow-700 dark:text-yellow-300">
                        TAO供应量将于2025年2月2日减半，这是一个重要的通缩事件，可能对价格产生重大影响。<br>
                        <em>TAO supply will halve on February 2, 2025, which is a significant deflationary event that may have major price implications.</em>
                    </p>
                </div>
                
                <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
                    数据由 CoinMarketCap 提供 / Data provided by CoinMarketCap
                </div>
            </div>
        `;
        
        this.open('Bittensor (TAO) 实时价格', content);
    }
}

// ==========================================
// CONTENT INTERACTION ENHANCEMENT
// ==========================================

class InteractiveContentManager {
    constructor(pipModal) {
        this.pipModal = pipModal;
        this.companyData = {
            'MicroStrategy': { symbol: 'MSTR', name: 'MicroStrategy Inc.' },
            'MSTR': { symbol: 'MSTR', name: 'MicroStrategy Inc.' },
            'Tesla': { symbol: 'TSLA', name: 'Tesla Inc.' },
            'TSLA': { symbol: 'TSLA', name: 'Tesla Inc.' },
            'Block': { symbol: 'SQ', name: 'Block Inc.' },
            'Coinbase': { symbol: 'COIN', name: 'Coinbase Global Inc.' },
            'COIN': { symbol: 'COIN', name: 'Coinbase Global Inc.' },
            'Marathon Digital': { symbol: 'MARA', name: 'Marathon Digital Holdings' },
            'MARA': { symbol: 'MARA', name: 'Marathon Digital Holdings' },
            'TAO Synergies': { symbol: 'TAOX', name: 'TAO Synergies Inc.' },
            'TAOX': { symbol: 'TAOX', name: 'TAO Synergies Inc.' },
            'Metaplanet': { symbol: '3350.T', name: 'Metaplanet Inc.' },
            '3350.T': { symbol: '3350.T', name: 'Metaplanet Inc.' },
            'Wemade': { symbol: '112040.KS', name: 'Wemade Co Ltd' },
            'Oblong': { symbol: 'OBLG', name: 'Oblong Inc.' },
            'OBLG': { symbol: 'OBLG', name: 'Oblong Inc.' },
            'Safello': { symbol: 'SFL.ST', name: 'Safello AB' }
        };
    }

    enhanceContent() {
        this.addCompanyLinks();
        this.addTaoLinks();
    }

    addCompanyLinks() {
        // Find company mentions in content
        const contentSelectors = [
            '.collapsible-content',
            '[id^="content-"]',
            'p', 'div', 'span'
        ];

        contentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.dataset.enhanced) return;
                
                let html = element.innerHTML;
                let hasChanges = false;

                // Replace company names with clickable links
                Object.keys(this.companyData).forEach(companyName => {
                    const company = this.companyData[companyName];
                    const regex = new RegExp(`\\b${companyName}\\b`, 'gi');
                    
                    if (regex.test(html) && !html.includes(`data-company="${company.symbol}"`)) {
                        html = html.replace(regex, `<button class="company-link text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors cursor-pointer" data-company="${company.symbol}" data-name="${company.name}">$&</button>`);
                        hasChanges = true;
                    }
                });

                if (hasChanges) {
                    element.innerHTML = html;
                    element.dataset.enhanced = 'true';
                }
            });
        });

        // Bind click events to company links
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('company-link')) {
                const symbol = e.target.dataset.company;
                const name = e.target.dataset.name;
                this.pipModal.showCompanyInfo(symbol, name);
            }
        });
    }

    addTaoLinks() {
        const contentSelectors = [
            '.collapsible-content',
            '[id^="content-"]',
            'p', 'div', 'span'
        ];

        contentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.dataset.taoEnhanced) return;
                
                let html = element.innerHTML;
                let hasChanges = false;

                // Replace TAO price mentions with clickable links
                const taoRegex = /\b(TAO|\$TAO|Bittensor|TAO价格|TAO\s*价格|TAO\s*\$\d+|\$\d+\s*TAO)\b/gi;
                
                if (taoRegex.test(html) && !html.includes('class="tao-link"')) {
                    html = html.replace(taoRegex, '<button class="tao-link text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 underline transition-colors cursor-pointer font-semibold">$&</button>');
                    hasChanges = true;
                }

                if (hasChanges) {
                    element.innerHTML = html;
                    element.dataset.taoEnhanced = 'true';
                }
            });
        });

        // Bind click events to TAO links
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tao-link')) {
                this.pipModal.showTaoPrice();
            }
        });
    }
}

// ==========================================
// LANGUAGE LOADING SYSTEM
// ==========================================

class LanguageLoader {
    constructor() {
        this.cache = new Map();
        this.currentLanguage = this.getSavedLanguage();
        this.isLoading = false;
    }

    getSavedLanguage() {
        const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE);
        if (saved && APP_CONFIG.SUPPORTED_LANGUAGES.includes(saved)) {
            return saved;
        }
        
        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            const langCode = this.mapBrowserLanguage(browserLang.toLowerCase());
            if (APP_CONFIG.SUPPORTED_LANGUAGES.includes(langCode)) {
                return langCode;
            }
        }
        
        return APP_CONFIG.DEFAULT_LANGUAGE;
    }

    mapBrowserLanguage(browserLang) {
        const langMap = {
            'en': 'en', 'en-us': 'en', 'en-gb': 'en',
            'ja': 'ja', 'ja-jp': 'ja',
            'ko': 'ko', 'ko-kr': 'ko',
            'zh': 'zh-cn', 'zh-cn': 'zh-cn',
            'zh-tw': 'zh-hk', 'zh-hk': 'zh-hk'
        };
        
        return langMap[browserLang] || langMap[browserLang.split('-')[0]] || 'en';
    }

    async loadLanguage(lang) {
        if (this.cache.has(lang)) {
            return this.cache.get(lang);
        }

        try {
            console.log(`🌍 Loading language: ${lang}`);
            const response = await fetch(`${APP_CONFIG.LOCALES_PATH}${lang}.json`);
            
            if (!response.ok) {
                throw new Error(`Failed to load language ${lang}: ${response.status}`);
            }
            
            const content = await response.json();
            this.cache.set(lang, content);
            console.log(`✅ Language loaded: ${lang}`);
            return content;
            
        } catch (error) {
            console.error(`❌ Failed to load language ${lang}:`, error);
            // Fallback to English if available
            if (lang !== 'en' && this.cache.has('en')) {
                return this.cache.get('en');
            }
            throw error;
        }
    }

    async switchLanguage(lang) {
        if (!APP_CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
            console.warn(`Unsupported language: ${lang}`);
            return false;
        }

        if (this.isLoading) {
            console.log('Language switch already in progress...');
            return false;
        }

        try {
            this.isLoading = true;
            this.showLoadingState();

            const content = await this.loadLanguage(lang);
            
            // Smooth transition
            await this.animateContentChange(() => {
                this.renderContent(content);
                this.currentLanguage = lang;
                localStorage.setItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE, lang);
            });

            this.updateActiveLanguageButton(lang);
            console.log(`🌍 Language switched to: ${lang}`);
            return true;
            
        } catch (error) {
            console.error('Language switch failed:', error);
            return false;
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    async animateContentChange(updateCallback) {
        const contentElements = document.querySelectorAll('[data-translatable]');
        
        // Fade out
        contentElements.forEach(el => {
            el.style.transition = 'opacity 0.2s ease-out';
            el.style.opacity = '0.6';
        });

        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Update content
        updateCallback();
        
        // Fade in
        contentElements.forEach(el => {
            el.style.opacity = '1';
        });
    }

    showLoadingState() {
        const indicators = document.querySelectorAll('.lang-btn');
        indicators.forEach(btn => {
            btn.style.opacity = '0.6';
            btn.disabled = true;
        });
    }

    hideLoadingState() {
        const indicators = document.querySelectorAll('.lang-btn');
        indicators.forEach(btn => {
            btn.style.opacity = '1';
            btn.disabled = false;
        });
    }

    renderContent(content) {
        // Update main titles
        const titleEl = document.getElementById('main-title');
        const subtitleEl = document.getElementById('main-subtitle');
        if (titleEl) titleEl.textContent = content.title;
        if (subtitleEl) subtitleEl.textContent = content.subtitle;
        
        // Update bento box labels
        const updateElement = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        
        updateElement('funding-label', content.funding_label);
        updateElement('market-cap-label', content.market_cap_label);
        updateElement('profit-label', content.profit_label);
        updateElement('volume-label', content.volume_label);
        
        // Update section titles and summaries
        updateElement('opportunity-title', content.opportunity_title);
        updateElement('opportunity-summary', content.opportunity_summary);
        updateElement('opportunity-para1', content.opportunity_para1);
        updateElement('opportunity-para2', content.opportunity_para2);
        updateElement('strategy-title', content.strategy_title);
        updateElement('strategy-summary', content.strategy_summary);
        updateElement('financials-title', content.financials_title);
        updateElement('financials-summary', content.financials_summary);
        updateElement('roadmap-title', content.roadmap_title);
        updateElement('roadmap-summary', content.roadmap_summary);
    }

    updateActiveLanguageButton(activeLanguage) {
        const buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            btn.classList.remove('text-white', 'bg-gray-700');
            btn.classList.add('text-gray-600', 'dark:text-gray-400');
            
            if (lang === activeLanguage) {
                btn.classList.remove('text-gray-600', 'dark:text-gray-400');
                btn.classList.add('text-white', 'bg-gray-700');
            }
        });
    }
}

// ==========================================
// THEME MANAGEMENT
// ==========================================

class ThemeManager {
    constructor() {
        this.currentTheme = this.getSavedTheme();
        this.init();
    }

    getSavedTheme() {
        const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME);
        if (saved && ['light', 'dark'].includes(saved)) {
            return saved;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return APP_CONFIG.DEFAULT_THEME;
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.initThemeToggle();
        this.watchSystemTheme();
    }

    applyTheme(theme) {
        const html = document.documentElement;
        const body = document.body;
        
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
            body.classList.add('dark');
            body.classList.remove('light');
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
            body.classList.remove('dark');
            body.classList.add('light');
        }
        
        this.currentTheme = theme;
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME, theme);
        this.updateThemeIcon();
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.animateThemeToggle();
    }

    initThemeToggle() {
        const toggleButton = document.getElementById('theme-toggle-btn');
        if (!toggleButton) return;

        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });
    }

    updateThemeIcon() {
        const toggleButton = document.getElementById('theme-toggle-btn');
        if (!toggleButton) return;
        
        const svg = toggleButton.querySelector('svg path');
        if (!svg) return;
        
        if (this.currentTheme === 'dark') {
            // Sun icon for light mode
            svg.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
        } else {
            // Moon icon for dark mode
            svg.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
        }
    }

    animateThemeToggle() {
        const toggleButton = document.getElementById('theme-toggle-btn');
        if (toggleButton) {
            toggleButton.style.animation = 'spin 0.4s ease-in-out';
            setTimeout(() => {
                toggleButton.style.animation = '';
            }, 400);
        }
    }

    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME)) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
}

// ==========================================
// INTERACTIVE ELEMENTS
// ==========================================

class InteractionManager {
    constructor() {
        this.init();
    }

    init() {
        this.initCollapsibleCards();
        this.initSmoothScrolling();
    }

    initCollapsibleCards() {
        const triggers = document.querySelectorAll('.collapsible-trigger');
        
        triggers.forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCollapsible(trigger);
            });
        });
    }

    toggleCollapsible(trigger) {
        const content = trigger.nextElementSibling;
        const icon = trigger.querySelector('svg');
        const section = trigger.closest('section');
        
        if (!content || !content.classList.contains('collapsible-content')) {
            content = trigger.parentElement.nextElementSibling;
        }
        
        if (content) {
            const isHidden = content.classList.contains('hidden');
            
            if (isHidden) {
                // Expand
                content.classList.remove('hidden');
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                content.style.transform = 'translateY(-10px)';
                
                // Trigger reflow
                content.offsetHeight;
                
                content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
                
                // Clean up
                setTimeout(() => {
                    content.style.maxHeight = '';
                    content.style.transition = '';
                }, 400);
                
            } else {
                // Collapse
                content.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                
                // Trigger reflow
                content.offsetHeight;
                
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                content.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    content.classList.add('hidden');
                    content.style.transition = '';
                    content.style.transform = '';
                }, 300);
            }
            
            // Animate icon
            if (icon) {
                icon.style.transition = 'transform 0.3s ease';
                icon.classList.toggle('rotate-180');
            }
            
            // Add subtle section highlight
            if (section) {
                section.style.transition = 'all 0.3s ease';
                if (isHidden) {
                    section.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                    section.style.backgroundColor = 'rgba(59, 130, 246, 0.02)';
                } else {
                    section.style.borderColor = '';
                    section.style.backgroundColor = '';
                }
            }
        }
    }

    initSmoothScrolling() {
        // Add smooth scrolling for any anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ==========================================
// AUTHENTICATION CHECK
// ==========================================

class AuthChecker {
    constructor() {
        this.checkAccess();
    }

    checkAccess() {
        if (sessionStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH) !== 'true') {
            console.log('🔒 Authentication required, redirecting to login...');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// ==========================================
// MAIN APPLICATION
// ==========================================

class AsiatensorApp {
    constructor() {
        this.auth = new AuthChecker();
        this.theme = new ThemeManager();
        this.languageLoader = new LanguageLoader();
        this.interactions = new InteractionManager();
        
        // Initialize Picture-in-Picture functionality
        this.pipModal = new PictureInPictureModal();
        this.interactiveContent = new InteractiveContentManager(this.pipModal);
        
        this.init();
    }

    async init() {
        this.logSystemInfo();
        this.initLanguageSwitcher();
        await this.loadInitialLanguage();
        
        // Enhance content with interactive elements after initial load
        this.enhanceContentAfterLoad();
        
        this.addCustomStyles();
    }
    
    enhanceContentAfterLoad() {
        // Delay content enhancement to ensure DOM is fully loaded
        setTimeout(() => {
            this.interactiveContent.enhanceContent();
        }, 1000);
        
        // Re-enhance content when language changes
        const originalSwitchLanguage = this.languageLoader.switchLanguage.bind(this.languageLoader);
        this.languageLoader.switchLanguage = async (langCode) => {
            await originalSwitchLanguage(langCode);
            setTimeout(() => {
                this.interactiveContent.enhanceContent();
            }, 500);
        };
    }

    async loadInitialLanguage() {
        try {
            await this.languageLoader.switchLanguage(this.languageLoader.currentLanguage);
        } catch (error) {
            console.error('Failed to load initial language:', error);
        }
    }

    initLanguageSwitcher() {
        const languageButtons = document.querySelectorAll('.lang-btn');
        
        languageButtons.forEach((btn) => {
            const lang = btn.getAttribute('data-lang');
            
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                if (lang && !this.languageLoader.isLoading) {
                    await this.languageLoader.switchLanguage(lang);
                }
            });
        });
    }

    addCustomStyles() {
        const style = document.createElement('style');
        style.id = 'asiatensor-enhancements';
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes modalSlideIn {
                from { 
                    opacity: 0; 
                    transform: translateY(20px) scale(0.95); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
            }
            
            @keyframes modalSlideOut {
                from { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
                to { 
                    opacity: 0; 
                    transform: translateY(-20px) scale(0.95); 
                }
            }
            
            @keyframes backdropFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes floatIn {
                from { 
                    opacity: 0; 
                    transform: translateY(10px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            /* Modal animations */
            .modal-overlay {
                animation: backdropFadeIn 0.3s ease-out;
            }
            
            .modal-content {
                animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .modal-content.closing {
                animation: modalSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Enhanced collapsible animations */
            .collapsible-trigger {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }
            
            .collapsible-trigger::before {
                content: '';
                position: absolute;
                top: 0;
                left: -4px;
                width: 2px;
                height: 0;
                background: linear-gradient(135deg, #3b82f6, #06b6d4);
                transition: height 0.3s ease;
                border-radius: 1px;
            }
            
            .collapsible-trigger:hover {
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(6, 182, 212, 0.03));
                transform: translateX(2px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
            }
            
            .collapsible-trigger:hover::before {
                height: 100%;
            }
            
            .collapsible-content {
                overflow: hidden;
            }
            
            /* Custom scrollbar */
            ::-webkit-scrollbar {
                width: 8px;
            }
            
            ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(6, 182, 212, 0.6));
                border-radius: 4px;
                transition: background 0.3s ease;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(6, 182, 212, 0.8));
            }
            
            /* Firefox scrollbar */
            * {
                scrollbar-width: thin;
                scrollbar-color: rgba(59, 130, 246, 0.6) rgba(255, 255, 255, 0.1);
            }
            
            /* Smooth focus transitions */
            .lang-btn {
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            .lang-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s ease;
            }
            
            .lang-btn:hover::before {
                left: 100%;
            }
            
            .lang-btn:disabled {
                cursor: not-allowed;
            }
            
            /* Enhanced section animations */
            .bento-box {
                animation: floatIn 0.6s ease-out;
                animation-fill-mode: both;
            }
            
            .bento-box:nth-child(1) { animation-delay: 0.1s; }
            .bento-box:nth-child(2) { animation-delay: 0.2s; }
            .bento-box:nth-child(3) { animation-delay: 0.3s; }
            .bento-box:nth-child(4) { animation-delay: 0.4s; }
            
            /* Smooth content transitions */
            [data-translatable] {
                transition: opacity 0.2s ease-out;
            }
            
            /* Loading pulse effect */
            .loading-pulse {
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }

    logSystemInfo() {
        console.group('🚀 Asiatensor Executive Brief');
        console.info('📊 Dashboard Ready');
        console.info(`🎨 Theme: ${this.theme.currentTheme}`);
        console.info(`🌍 Language: ${this.languageLoader.currentLanguage}`);
        console.info('🔐 Authenticated');
        console.groupEnd();
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        window.asiatensorApp = new AsiatensorApp();
        console.info('✅ Executive Brief System Initialized');
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.asiatensorApp) {
        console.info('💤 Session ending...');
    }
});

// Export for potential external use
export { AsiatensorApp, LanguageLoader, ThemeManager };