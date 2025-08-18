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
        // Update main titles and subtitles
        document.getElementById('main-title').textContent = data.title;
        document.getElementById('main-subtitle').textContent = data.subtitle;
        
        // Update bento box labels
        document.getElementById('funding-label').textContent = data.executive_summary.round1_funding.split(':')[0] + ':';
        document.getElementById('market-cap-label').textContent = data.executive_summary.target_market_cap.split(':')[0] + ':';
        document.getElementById('profit-label').textContent = data.executive_summary.projected_annual_profit.split(':')[0] + ':';
        document.getElementById('volume-label').textContent = data.executive_summary.projected_daily_volume.split(':')[0] + ':';
        
        // Update section titles and summaries
        if (data.chapter1?.section1_1?.title) {
            document.getElementById('opportunity-title').textContent = data.chapter1.section1_1.title;
        }
        
        console.log('→ Content rendered successfully');
    }

    updateLanguageButtons(activeLang) {
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
    }
}

// ==========================================
// SCROLLSPY NAVIGATION SYSTEM
// ==========================================

class ScrollspyManager {
    constructor() {
        this.sections = ['summary', 'opportunity', 'strategy', 'financials', 'roadmap'];
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
        const icon = document.getElementById('theme-icon')?.querySelector('path');
        
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
            // Moon icon
            if (icon) {
                icon.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
            }
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
            // Sun icon
            if (icon) {
                icon.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
            }
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