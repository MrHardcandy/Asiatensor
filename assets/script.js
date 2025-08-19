/**
 * Asiatensor Executive Brief - Enhanced Interactive Experience
 * With Async Language Loading, Scrollspy Navigation, Print Functionality
 * and Advanced UI/UX Micro-refinements
 */

// ==========================================
// CONFIGURATION & CONSTANTS
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
// ENHANCED LANGUAGE LOADER WITH LOADING STATES
// ==========================================

class LanguageLoader {
    constructor() {
        this.cache = new Map();
        this.currentLanguage = APP_CONFIG.DEFAULT_LANGUAGE;
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.mainContent = document.getElementById('main-content');
    }

    showLoading() {
        this.mainContent.classList.add('content-loading');
        this.loadingSpinner.classList.remove('hidden');
    }

    hideLoading() {
        this.mainContent.classList.remove('content-loading');
        this.loadingSpinner.classList.add('hidden');
    }

    async loadLanguage(lang) {
        if (this.cache.has(lang)) {
            return this.cache.get(lang);
        }
        
        this.showLoading();
        
        try {
            const response = await fetch(`${APP_CONFIG.LOCALES_PATH}${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language: ${lang}`);
            }
            
            const data = await response.json();
            this.cache.set(lang, data);
            return data;
        } catch (error) {
            console.error(`Error loading language ${lang}:`, error);
            // Fallback to English if available
            if (lang !== 'en' && this.cache.has('en')) {
                return this.cache.get('en');
            }
            throw error;
        } finally {
            this.hideLoading();
        }
    }

    async switchLanguage(lang) {
        if (!APP_CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
            console.warn(`Unsupported language: ${lang}`);
            return;
        }

        try {
            const languageData = await this.loadLanguage(lang);
            this.renderContent(languageData);
            this.updateLanguageButtons(lang);
            this.currentLanguage = lang;
            
            // Store language preference
            localStorage.setItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE, lang);
            
            console.log(`→ Successfully switched to ${lang}`);
        } catch (error) {
            console.error(`Failed to switch to language ${lang}:`, error);
        }
    }

    renderContent(data) {
        try {
            // Update main titles and subtitles
            const mainTitle = document.getElementById('main-title');
            const mainSubtitle = document.getElementById('main-subtitle');
            if (mainTitle) mainTitle.textContent = data.title || 'Asiatensor Executive Brief';
            if (mainSubtitle) mainSubtitle.textContent = data.subtitle || 'Capitalizing on Asia\'s Historic AI Investment Opportunity';
            
            // Update bento box labels with proper fallbacks
            const fundingLabel = document.getElementById('funding-label');
            const marketCapLabel = document.getElementById('market-cap-label');
            const profitLabel = document.getElementById('profit-label');
            const volumeLabel = document.getElementById('volume-label');
            
            if (fundingLabel && data.executive_summary?.round1_funding) {
                fundingLabel.textContent = data.executive_summary.round1_funding.split(':')[0] + ':';
            }
            if (marketCapLabel && data.executive_summary?.target_market_cap) {
                marketCapLabel.textContent = data.executive_summary.target_market_cap.split(':')[0] + ':';
            }
            if (profitLabel && data.executive_summary?.projected_annual_profit) {
                profitLabel.textContent = data.executive_summary.projected_annual_profit.split(':')[0] + ':';
            }
            if (volumeLabel && data.executive_summary?.projected_daily_volume) {
                volumeLabel.textContent = data.executive_summary.projected_daily_volume.split(':')[0] + ':';
            }
            
            // Update all section titles and summaries
            const sectionMappings = [
                { elementId: 'opportunity-title', dataPath: 'chapter1.title', fallback: 'Chapter 1: The Great Disconnect - Asia\'s Web3 Dominance vs TAO\'s Value Vacuum' },
                { elementId: 'opportunity-summary', dataPath: 'chapter1.summary', fallback: 'Asia is the undisputed epicenter of Web3, yet TAO remains largely unknown. This presents a historic arbitrage opportunity.' },
                { elementId: 'strategy-title', dataPath: 'chapter2.title', fallback: 'Chapter 2: Dual-Engine Profit Model' },
                { elementId: 'strategy-summary', dataPath: 'chapter2.summary', fallback: 'Combining subnet operations and validator nodes to maximize TAO generation and market positioning in Asia.' },
                { elementId: 'financials-title', dataPath: 'chapter3.title', fallback: 'Chapter 3: TAO Production & Revenue Model' },
                { elementId: 'financials-summary', dataPath: 'chapter3.summary', fallback: 'Annual production of ~112,000 TAO, generating approximately $89.6M in annual profit under base case scenario.' },
                { elementId: 'roadmap-title', dataPath: 'chapter4.title', fallback: 'Chapter 4: Market Entry Strategy' },
                { elementId: 'roadmap-summary', dataPath: 'chapter4.summary', fallback: 'Three-phase development plan with systematic approach to infrastructure, market expansion, and ecosystem dominance.' },
                { elementId: 'risks-title', dataPath: 'chapter6.title', fallback: 'Chapter 6: Risk Analysis and Mitigation Strategies' },
                { elementId: 'risks-summary', dataPath: 'chapter6.summary', fallback: 'Comprehensive risk management approach addressing technical, market, and operational risks through diversified strategies.' },
                { elementId: 'forecasts-title', dataPath: 'chapter7.title', fallback: 'Chapter 7: Financial Forecasts and Investment Returns' },
                { elementId: 'forecasts-summary', dataPath: 'chapter7.summary', fallback: 'Five-year financial projections with exceptional returns and sensitivity analysis.' },
                { elementId: 'appendix-a-title', dataPath: 'appendix_a.title', fallback: 'Appendix A: Technical Specifications' },
                { elementId: 'appendix-a-summary', dataPath: 'appendix_a.summary', fallback: 'Detailed hardware requirements and software architecture specifications.' },
                { elementId: 'appendix-b-title', dataPath: 'appendix_b.title', fallback: 'Appendix B: Team and Advisors' },
                { elementId: 'appendix-b-summary', dataPath: 'appendix_b.summary', fallback: 'Core team and advisory board with extensive industry expertise.' },
                { elementId: 'appendix-c-title', dataPath: 'appendix_c.title', fallback: 'Appendix C: Legal and Compliance Framework' },
                { elementId: 'appendix-c-summary', dataPath: 'appendix_c.summary', fallback: 'Comprehensive legal structure and regulatory compliance across jurisdictions.' }
            ];
            
            sectionMappings.forEach(mapping => {
                const element = document.getElementById(mapping.elementId);
                if (element) {
                    const value = this.getNestedValue(data, mapping.dataPath);
                    element.textContent = value || mapping.fallback;
                }
            });
            
            // Update detailed content paragraphs and subsections
            const contentMappings = [
                { elementId: 'opportunity-para1', dataPath: 'chapter1.section1_1.content.paragraph1', fallback: 'Asia represents 60% of global crypto adoption and houses the world\'s most sophisticated DeFi protocols, yet TAO remains largely unknown outside technical circles. While Western markets debate AI regulation, Asian entrepreneurs are building the future.' },
                { elementId: 'opportunity-para2', dataPath: 'chapter1.section1_1.content.paragraph2', fallback: 'Our market intelligence reveals a critical window: institutional capital is seeking exposure to decentralized AI, but lacks the infrastructure and expertise to access this emerging asset class safely and efficiently.' }
            ];
            
            contentMappings.forEach(mapping => {
                const element = document.getElementById(mapping.elementId);
                if (element) {
                    const value = this.getNestedValue(data, mapping.dataPath);
                    element.textContent = value || mapping.fallback;
                }
            });

            // Update subsection headings if they exist
            const subsectionMappings = [
                { selector: 'h3:contains("1.1")', dataPath: 'chapter1.section1_1.title', fallback: '1.1 Asia: The Epicenter of Global Web3 Ecosystem' },
                { selector: 'h3:contains("1.2")', dataPath: 'chapter1.section1_2.title', fallback: '1.2 TAO\'s Technical Advantages and Market Positioning' },
                { selector: 'h3:contains("1.3")', dataPath: 'chapter1.section1_3.title', fallback: '1.3 Regulatory Environment Analysis' },
                { selector: 'h3:contains("2.1")', dataPath: 'chapter2.section2_1.title', fallback: '2.1 Engine 1: Subnet Operations' },
                { selector: 'h3:contains("2.2")', dataPath: 'chapter2.section2_2.title', fallback: '2.2 Engine 2: Validator Network' }
            ];

            // Update subsection headings by searching through h3 elements
            const h3Elements = document.querySelectorAll('h3');
            h3Elements.forEach(h3 => {
                const text = h3.textContent;
                subsectionMappings.forEach(mapping => {
                    const sectionNumber = mapping.selector.match(/(\d+\.\d+)/);
                    if (sectionNumber && text.includes(sectionNumber[1])) {
                        const value = this.getNestedValue(data, mapping.dataPath);
                        if (value) {
                            h3.textContent = value;
                        }
                    }
                });
            });
            
            console.log('→ Content rendered successfully for language:', this.currentLanguage);
        } catch (error) {
            console.error('Error rendering content:', error);
        }
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    updateLanguageButtons(activeLang) {
        // Update desktop language buttons
        APP_CONFIG.SUPPORTED_LANGUAGES.forEach(lang => {
            const btn = document.getElementById(`lang-${lang}`);
            if (btn) {
                btn.classList.remove('text-white', 'bg-gray-700');
                btn.classList.add('text-gray-600', 'dark:text-gray-400');
            }
        });
        
        const activeBtn = document.getElementById(`lang-${activeLang}`);
        if (activeBtn) {
            activeBtn.classList.remove('text-gray-600', 'dark:text-gray-400');
            activeBtn.classList.add('text-white', 'bg-gray-700');
        }
        
        // Update mobile language buttons  
        APP_CONFIG.SUPPORTED_LANGUAGES.forEach(lang => {
            const mobileBtnElement = document.getElementById(`lang-${lang}-mobile`);
            if (mobileBtnElement) {
                mobileBtnElement.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-600', 'dark:text-blue-400');
                mobileBtnElement.classList.add('border-gray-200', 'dark:border-gray-700', 'text-gray-600', 'dark:text-gray-400');
            }
        });
        
        const activeMobileBtn = document.getElementById(`lang-${activeLang}-mobile`);
        if (activeMobileBtn) {
            activeMobileBtn.classList.remove('border-gray-200', 'dark:border-gray-700', 'text-gray-600', 'dark:text-gray-400');
            activeMobileBtn.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-600', 'dark:text-blue-400');
        }
    }
}

// ==========================================
// SCROLLSPY NAVIGATION SYSTEM
// ==========================================

class ScrollspyManager {
    constructor() {
        this.sections = ['summary', 'opportunity', 'strategy', 'financials', 'roadmap', 'risks', 'forecasts', 'appendix-a', 'appendix-b', 'appendix-c'];
        this.navLinks = {};
        this.throttleTimeout = null;
        this.init();
    }

    init() {
        // Cache nav links
        this.sections.forEach(section => {
            this.navLinks[section] = document.querySelector(`#scrollspy-nav a[href="#${section}"]`);
        });

        // Add scroll listener
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 50));
        
        // Add click listeners
        this.sections.forEach(section => {
            const link = this.navLinks[section];
            if (link) {
                link.addEventListener('click', this.handleNavClick.bind(this, section));
            }
        });

        // Set initial active state after a brief delay to ensure DOM is ready
        setTimeout(() => {
            this.handleScroll();
            console.log('🎯 Scrollspy navigation initialized and active state set');
        }, 100);
    }

    throttle(func, limit) {
        return () => {
            if (!this.throttleTimeout) {
                this.throttleTimeout = setTimeout(() => {
                    func.apply(this, arguments);
                    this.throttleTimeout = null;
                }, limit);
            }
        };
    }

    handleScroll() {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        const triggerPoint = scrollTop + viewportHeight * 0.3; // 30% from top of viewport
        
        let activeSection = null;
        let maxVisibility = 0;

        // Find the section with maximum visibility
        this.sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                const elementTop = scrollTop + rect.top;
                const elementBottom = elementTop + rect.height;
                
                // Calculate how much of the section is visible
                const visibleTop = Math.max(scrollTop, elementTop);
                const visibleBottom = Math.min(scrollTop + viewportHeight, elementBottom);
                const visibility = Math.max(0, visibleBottom - visibleTop) / rect.height;
                
                // Also check if the section crosses the trigger point
                const crossesTrigger = elementTop <= triggerPoint && elementBottom >= triggerPoint;
                
                if (crossesTrigger && visibility > maxVisibility) {
                    maxVisibility = visibility;
                    activeSection = section;
                }
            }
        });

        // Fallback: if no section crosses trigger point, find the closest one
        if (!activeSection) {
            let minDistance = Infinity;
            
            this.sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = scrollTop + rect.top;
                    const distance = Math.abs(triggerPoint - elementTop);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        activeSection = section;
                    }
                }
            });
        }

        // Update active states
        this.updateActiveState(activeSection);
        
    }

    updateActiveState(activeSection) {
        // Remove active class from all links
        Object.values(this.navLinks).forEach(link => {
            if (link) link.classList.remove('active');
        });

        // Add active class to current section
        if (activeSection && this.navLinks[activeSection]) {
            this.navLinks[activeSection].classList.add('active');
        }
    }

    handleNavClick(section, event) {
        event.preventDefault();
        
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}

// ==========================================
// TRADINGVIEW CHART INTEGRATION
// ==========================================

class TradingViewManager {
    constructor() {
        this.initializeClickableStocks();
    }

    initializeClickableStocks() {
        // Find all elements with stock ticker classes and make them clickable
        const stockElements = document.querySelectorAll('.stock-ticker, [data-ticker]');
        
        stockElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.style.textDecoration = 'underline';
            element.style.color = '#3B82F6'; // blue-600
            
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const ticker = element.dataset.ticker || element.textContent.match(/[A-Z]{2,5}/)?.[0];
                if (ticker) {
                    this.openTradingViewChart(ticker);
                }
            });
        });
    }

    openTradingViewChart(ticker) {
        const chartContent = `
            <div style="height: 500px; width: 100%;">
                <div class="tradingview-widget-container" style="height: 100%; width: 100%;">
                    <div class="tradingview-widget-container__widget" style="height: calc(100% - 32px); width: 100%;"></div>
                    <div class="tradingview-widget-copyright">
                        <a href="https://www.tradingview.com/symbols/${ticker}/" rel="noopener" target="_blank">
                            <span class="blue-text">${ticker} Chart</span>
                        </a> by TradingView
                    </div>
                    <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
                    {
                        "autosize": true,
                        "symbol": "${ticker}",
                        "interval": "D",
                        "timezone": "Etc/UTC",
                        "theme": "light",
                        "style": "1",
                        "locale": "en",
                        "enable_publishing": false,
                        "allow_symbol_change": true,
                        "calendar": false,
                        "support_host": "https://www.tradingview.com"
                    }
                    </script>
                </div>
            </div>
        `;
        
        // Use PIP modal to show the chart
        if (window.app && window.app.pipModal) {
            window.app.pipModal.open(`${ticker} Stock Chart`, chartContent);
        }
    }

    // Static method to manually open a chart
    static openChart(ticker) {
        const manager = new TradingViewManager();
        manager.openTradingViewChart(ticker);
    }
}

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
}

// ==========================================
// THEME MANAGEMENT SYSTEM
// ==========================================

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || APP_CONFIG.DEFAULT_THEME;
        this.applyTheme(this.currentTheme);
    }

    getStoredTheme() {
        return localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME);
    }

    applyTheme(theme) {
        const html = document.documentElement;
        const desktopIcon = document.getElementById('theme-icon')?.querySelector('path');
        const mobileIcon = document.getElementById('theme-icon-mobile')?.querySelector('path');
        
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
            // Moon icon
            const moonPath = 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z';
            if (desktopIcon) desktopIcon.setAttribute('d', moonPath);
            if (mobileIcon) mobileIcon.setAttribute('d', moonPath);
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
            // Sun icon
            const sunPath = 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z';
            if (desktopIcon) desktopIcon.setAttribute('d', sunPath);
            if (mobileIcon) mobileIcon.setAttribute('d', sunPath);
        }
        
        this.currentTheme = theme;
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME, theme);
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        console.log(`→ Switched to ${newTheme.toUpperCase()} mode`);
    }
}

// ==========================================
// COLLAPSIBLE CONTENT MANAGER
// ==========================================

class CollapsibleManager {
    static toggleCollapsible(trigger) {
        const content = trigger.nextElementSibling;
        const icon = trigger.querySelector('svg');
        
        if (content) {
            content.classList.toggle('hidden');
            if (icon) {
                icon.classList.toggle('rotate-180');
            }
        }
    }
}

// ==========================================
// MOBILE MENU MANAGER
// ==========================================

class MobileMenuManager {
    static toggle() {
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburgerIcon = document.getElementById('hamburger-icon');
        const closeIcon = document.getElementById('close-icon');
        const body = document.body;
        
        if (mobileMenu && hamburgerIcon && closeIcon) {
            const isOpen = !mobileMenu.classList.contains('translate-x-full');
            
            if (isOpen) {
                // Close menu
                mobileMenu.classList.add('translate-x-full');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                body.style.overflow = '';
            } else {
                // Open menu
                mobileMenu.classList.remove('translate-x-full');
                hamburgerIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
                body.style.overflow = 'hidden';
            }
        }
    }
    
    static close() {
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburgerIcon = document.getElementById('hamburger-icon');
        const closeIcon = document.getElementById('close-icon');
        const body = document.body;
        
        if (mobileMenu && hamburgerIcon && closeIcon) {
            mobileMenu.classList.add('translate-x-full');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            body.style.overflow = '';
        }
    }
}

// ==========================================
// DOCUMENTS MANAGER
// ==========================================

class DocumentsManager {
    static toggleDropdown() {
        const dropdown = document.getElementById('docs-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
        }
    }
    
    static closeDropdown() {
        const dropdown = document.getElementById('docs-dropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    }
    
    static openMemorandum() {
        // Get current language to determine which memorandum to show
        const currentLang = localStorage.getItem('asiatensor-language') || 'en';
        const langMap = {
            'en': 'en',
            'zh-cn': 'zh-cn', 
            'zh-hk': 'zh-hk',
            'ja': 'ja',
            'ko': 'ko'
        };
        
        const filename = `memorandum_${langMap[currentLang] || 'en'}.md`;
        
        // Open in a new window/tab to display the markdown content
        window.open(`./content/${filename}`, '_blank');
        
        this.closeDropdown();
    }
    
    static openDATCO() {
        // Always show Chinese version of DATCO report as it's the primary version
        window.open('./content/datco_report_zh-cn.md', '_blank');
        this.closeDropdown();
    }
}

// ==========================================
// PRINT FUNCTIONALITY
// ==========================================

class PrintManager {
    constructor() {
        this.printBtn = document.getElementById('print-btn');
        if (this.printBtn) {
            this.printBtn.addEventListener('click', this.handlePrint.bind(this));
        }
    }

    handlePrint() {
        // Expand all collapsible content before printing
        const collapsibleContents = document.querySelectorAll('.collapsible-content');
        const collapsibleIcons = document.querySelectorAll('.collapsible-icon');
        
        // Temporarily expand all content
        collapsibleContents.forEach(content => {
            content.classList.remove('hidden');
        });
        
        collapsibleIcons.forEach(icon => {
            icon.classList.add('rotate-180');
        });

        // Trigger print
        window.print();

        // Note: We don't collapse content back because users might want to see it expanded
        // If needed, we could add a timeout to collapse it back after printing
    }
}

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

class AsiatensorApp {
    constructor() {
        this.languageLoader = null;
        this.scrollspyManager = null;
        this.pipModal = null;
        this.themeManager = null;
        this.printManager = null;
        this.tradingViewManager = null;
    }

    async init() {
        try {
            console.log('🚀 Initializing Asiatensor Executive Brief...');
            
            // Initialize core systems
            this.languageLoader = new LanguageLoader();
            this.themeManager = new ThemeManager();
            this.printManager = new PrintManager();
            
            // Initialize UI components
            this.scrollspyManager = new ScrollspyManager();
            this.pipModal = new PictureInPictureModal();
            this.tradingViewManager = new TradingViewManager();
            
            // Load initial language
            const initialLanguage = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE) || APP_CONFIG.DEFAULT_LANGUAGE;
            await this.languageLoader.switchLanguage(initialLanguage);
            
            // Make functions globally available
            this.bindGlobalFunctions();
            
            console.log('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
        }
    }

    bindGlobalFunctions() {
        // Make functions available globally for onclick handlers
        window.switchLanguage = (lang) => this.languageLoader.switchLanguage(lang);
        window.toggleTheme = () => this.themeManager.toggle();
        window.toggleCollapsible = (trigger) => CollapsibleManager.toggleCollapsible(trigger);
        window.toggleMobileMenu = () => MobileMenuManager.toggle();
        window.toggleDocsDropdown = () => DocumentsManager.toggleDropdown();
        window.openMemorandum = () => DocumentsManager.openMemorandum();
        window.openDATCO = () => DocumentsManager.openDATCO();
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#docs-btn') && !e.target.closest('#docs-dropdown')) {
                DocumentsManager.closeDropdown();
            }
        });
    }
}

// ==========================================
// APPLICATION STARTUP
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    const app = new AsiatensorApp();
    await app.init();
});

// Debug helper
window.AsiatensorDebug = {
    getConfig: () => APP_CONFIG,
    getCurrentLanguage: () => window.app?.languageLoader?.currentLanguage,
    getTheme: () => window.app?.themeManager?.currentTheme,
    clearCache: () => {
        localStorage.clear();
        location.reload();
    }
};