/**
 * Asiatensor Executive Brief - Enhanced Interactive Experience
 * With Asynchronous Multi-Language Content Loading
 */

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

const APP_CONFIG = {
    STORAGE_KEYS: {
        THEME: 'asiatensor-theme',
        LANGUAGE: 'asiatensor-language'
    },
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'ja', 'ko', 'zh-cn', 'zh-hk'],
    THEME_TYPES: {
        LIGHT: 'light',
        DARK: 'dark'
    }
};

// ==========================================
// THEME MANAGER
// ==========================================

class ThemeManager {
    constructor() {
        this.currentTheme = this.loadThemeFromStorage();
        this.applyTheme();
        this.bindEvents();
    }

    loadThemeFromStorage() {
        return localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME) || APP_CONFIG.THEME_TYPES.DARK;
    }

    applyTheme() {
        const isDark = this.currentTheme === APP_CONFIG.THEME_TYPES.DARK;
        document.documentElement.classList.toggle('dark', isDark);
        
        // Update theme toggle icons
        const sunIcons = document.querySelectorAll('#sunIcon, #mobileSunIcon');
        const moonIcons = document.querySelectorAll('#moonIcon, #mobileMoonIcon');
        
        sunIcons.forEach(icon => icon?.classList.toggle('hidden', !isDark));
        moonIcons.forEach(icon => icon?.classList.toggle('hidden', isDark));
    }

    toggle() {
        this.currentTheme = this.currentTheme === APP_CONFIG.THEME_TYPES.DARK ? 
            APP_CONFIG.THEME_TYPES.LIGHT : APP_CONFIG.THEME_TYPES.DARK;
        
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME, this.currentTheme);
        this.applyTheme();
        
        console.log(`🎨 Theme switched to: ${this.currentTheme}`);
    }

    bindEvents() {
        document.getElementById('theme-toggle-btn-desktop')?.addEventListener('click', () => this.toggle());
        document.getElementById('theme-toggle-btn-mobile')?.addEventListener('click', () => this.toggle());
    }
}

// ==========================================
// CONTENT RENDERER - ASYNC LOADER
// ==========================================

class ContentRenderer {
    constructor() {
        this.currentLanguage = APP_CONFIG.DEFAULT_LANGUAGE;
    }

    async renderContent(lang) {
        if (!APP_CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
            console.warn(`Unsupported language: ${lang}`);
            return;
        }

        try {
            // Show loading state
            this.showLoadingState();
            
            // Fetch content from JSON file
            const response = await fetch(`./assets/locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load content for ${lang}: ${response.status}`);
            }
            
            const languageContent = await response.json();
            
            // Recursively render content from nested objects
            this.renderContentRecursive(languageContent, '');
            
            this.currentLanguage = lang;
            this.updateLanguageButtons(lang);
            
            // Store language preference
            localStorage.setItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE, lang);
            
            // Hide loading state
            this.hideLoadingState();
            
            console.log(`✅ Content rendered successfully for language: ${lang}`);
        } catch (error) {
            console.error('Error rendering content:', error);
            this.hideLoadingState();
            this.showErrorState(`Failed to load ${lang} content`);
        }
    }

    renderContentRecursive(obj, prefix) {
        Object.keys(obj).forEach(key => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];
            
            if (typeof value === 'object' && value !== null) {
                // Recursively process nested objects
                this.renderContentRecursive(value, fullKey);
            } else if (typeof value === 'string') {
                // Find and update elements with matching data-key
                const elements = document.querySelectorAll(`[data-key="${fullKey}"], [data-key="${key}"]`);
                elements.forEach(element => {
                    if (element) {
                        element.innerHTML = value;
                    }
                });
                
                // Also try without prefix for backward compatibility
                if (prefix) {
                    const simpleElements = document.querySelectorAll(`[data-key="${key}"]`);
                    simpleElements.forEach(element => {
                        if (element && !element.innerHTML.trim()) {
                            element.innerHTML = value;
                        }
                    });
                }
            }
        });
    }

    showLoadingState() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('hidden');
        }
    }

    hideLoadingState() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }

    showErrorState(message) {
        console.error(message);
        // You could show a toast or modal here
    }

    updateLanguageButtons(activeLang) {
        // Update desktop language buttons
        APP_CONFIG.SUPPORTED_LANGUAGES.forEach(lang => {
            const btn = document.querySelector(`[data-lang="${lang}"]`);
            if (btn) {
                btn.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-600', 'dark:text-blue-400');
                btn.classList.add('hover:bg-gray-100', 'dark:hover:bg-gray-800', 'transition-colors');
            }
        });
        
        // Activate current language
        const activeBtn = document.querySelector(`[data-lang="${activeLang}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('hover:bg-gray-100', 'dark:hover:bg-gray-800');
            activeBtn.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-600', 'dark:text-blue-400');
        }
        
        console.log(`🌐 Language buttons updated for: ${activeLang}`);
    }
}

// ==========================================
// MOBILE MENU MANAGER
// ==========================================

class MobileMenuManager {
    constructor() {
        this.isOpen = false;
        this.bindEvents();
    }

    bindEvents() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        const menu = document.getElementById('mobileMenu');
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        const closeIcon = document.getElementById('closeIcon');
        
        if (menu && hamburgerIcon && closeIcon) {
            this.isOpen = !this.isOpen;
            
            if (this.isOpen) {
                menu.classList.remove('hidden');
                hamburgerIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                menu.classList.add('hidden');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
            
            console.log(`📱 Mobile menu ${this.isOpen ? 'opened' : 'closed'}`);
        }
    }

    // Static method for backward compatibility
    static toggle() {
        if (window.mobileMenuManager) {
            window.mobileMenuManager.toggle();
        }
    }
}

// ==========================================
// SCROLLSPY MANAGER
// ==========================================

class ScrollspyManager {
    constructor() {
        this.sections = ['summary', 'opportunity', 'solution', 'advantages', 'proof', 'path', 'prize', 'appendix'];
        this.navLinks = {};
        this.throttleTimeout = null;
        this.init();
    }

    async init() {
        // Cache nav links
        this.sections.forEach(section => {
            this.navLinks[section] = document.querySelector(`#scrollspy-nav a[href="#${section}"]`);
        });

        this.updateActiveSection();
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            if (this.throttleTimeout) return;
            
            this.throttleTimeout = setTimeout(() => {
                this.updateActiveSection();
                this.throttleTimeout = null;
            }, 100);
        });
    }

    updateActiveSection() {
        const scrollTop = window.pageYOffset;
        let activeSection = this.sections[0];
        
        this.sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                const offsetTop = element.getBoundingClientRect().top + scrollTop - 100;
                if (scrollTop >= offsetTop) {
                    activeSection = sectionId;
                }
            }
        });

        // Update navigation highlighting
        Object.keys(this.navLinks).forEach(section => {
            const link = this.navLinks[section];
            if (link) {
                link.classList.toggle('active', section === activeSection);
            }
        });
    }
}

// ==========================================
// COLLAPSIBLE MANAGER
// ==========================================

class CollapsibleManager {
    static toggleCollapsible(trigger) {
        const content = trigger.nextElementSibling;
        const icon = trigger.querySelector('.expand-icon');
        
        if (content && content.classList.contains('expanded-content')) {
            const isHidden = content.classList.contains('hidden');
            content.classList.toggle('hidden');
            
            if (icon) {
                icon.classList.toggle('rotate-180', !isHidden);
            }
        }
    }
}

// ==========================================
// PICTURE-IN-PICTURE MODAL
// ==========================================

class PictureInPictureModal {
    constructor() {
        this.modal = document.getElementById('stock-chart-modal');
        this.bindEvents();
    }

    bindEvents() {
        // Close modal when clicking outside
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close modal with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
                this.close();
            }
        });
    }

    open(content = '') {
        if (this.modal) {
            this.modal.innerHTML = content;
            this.modal.classList.remove('hidden', 'opacity-0');
            this.modal.classList.add('opacity-100');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.add('opacity-0');
            setTimeout(() => {
                this.modal.classList.add('hidden');
                this.modal.classList.remove('opacity-100');
                document.body.style.overflow = '';
            }, 300);
        }
    }
}

// ==========================================
// TRADINGVIEW MANAGER
// ==========================================

class TradingViewManager {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Bind click events to stock ticker elements
        document.querySelectorAll('[data-symbol]').forEach(element => {
            element.addEventListener('click', (e) => {
                const symbol = e.target.dataset.symbol;
                this.showChart(symbol);
            });
        });
    }

    showChart(symbol) {
        const modalContent = `
            <div class="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-xl font-semibold">${symbol} Stock Chart</h3>
                    <button onclick="pipModal.close()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="h-96 p-6">
                    <div class="flex items-center justify-center h-full">
                        <div class="text-center">
                            <div class="text-2xl font-bold mb-4">${symbol} Chart</div>
                            <div class="text-gray-600 dark:text-gray-400">
                                [TradingView Widget Placeholder]<br>
                                In production, this would display the actual ${symbol} chart
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        if (window.pipModal) {
            window.pipModal.open(modalContent);
        }
    }
}

// ==========================================
// PRINT MANAGER
// ==========================================

class PrintManager {
    static print() {
        // Expand all collapsible content before printing
        document.querySelectorAll('.expanded-content').forEach(content => {
            content.classList.remove('hidden');
        });
        
        setTimeout(() => {
            window.print();
        }, 100);
    }
}

// ==========================================
// LOGO MANAGER
// ==========================================

class LogoManager {
    static injectLogos() {
        // Note: Logos are already correctly implemented in HTML files
        // This class is maintained for consistency but HTML implementations take precedence
        console.log('✅ LogoManager: Logos already correctly implemented in HTML');
    }
}

// ==========================================
// PAGE CONTENT GENERATOR
// ==========================================

class PageContentGenerator {
    static generateMainContent() {
        const container = document.getElementById('content-container');
        if (!container) return;
        
        container.innerHTML = `
            <!-- Executive Summary -->
            <section id="summary" class="mb-20" data-aos="fade-up">
                <div class="text-center mb-12">
                    <h1 class="text-5xl font-serif font-bold mb-6" data-key="summaryTitle">Executive Summary</h1>
                    <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" data-key="summarySlogan">
                        The Public Gateway to Asia's Decentralized AI Future
                    </p>
                </div>
                
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                        <div class="text-sm text-gray-600 dark:text-gray-400 mb-2" data-key="summaryAskLabel">Round 1 Funding Target</div>
                        <div class="text-2xl font-bold text-blue-600" data-key="summaryAskValue">$7M - $8M USD</div>
                    </div>
                    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                        <div class="text-sm text-gray-600 dark:text-gray-400 mb-2" data-key="summaryPrizeLabel">Target Market Cap</div>
                        <div class="text-2xl font-bold text-green-600" data-key="summaryPrizeValue">$279M USD</div>
                    </div>
                    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                        <div class="text-sm text-gray-600 dark:text-gray-400 mb-2" data-key="summaryEngineLabel">Annual Profit Engine</div>
                        <div class="text-2xl font-bold text-purple-600" data-key="summaryEngineValue">~$89.6M USD</div>
                    </div>
                    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                        <div class="text-sm text-gray-600 dark:text-gray-400 mb-2" data-key="summaryLiquidityLabel">Target Liquidity</div>
                        <div class="text-2xl font-bold text-orange-600" data-key="summaryLiquidityValue">$1.5M - $4.5M USD Daily</div>
                    </div>
                </div>
            </section>

            <!-- Opportunity -->
            <section id="opportunity" class="mb-20" data-aos="fade-up">
                <h2 class="text-4xl font-serif font-bold mb-8" data-key="opportunityTitle">The Great Disconnect: Asia's Historic Opportunity</h2>
                <div class="prose prose-lg dark:prose-invert max-w-none">
                    <p class="text-xl mb-6" data-key="opportunitySummary">Asia is the undisputed epicenter of Web3, yet the leader in Decentralized AI, Bittensor (TAO), is a virtual blank slate in the region. This presents a historic, time-sensitive arbitrage opportunity.</p>
                    <p data-key="opportunityPara1">Asia is the undisputed global epicenter of Web3, defined by its deep capital pools, sophisticated retail investors, and immense appetite for technological innovation. Any successful digital asset, be it SOL, ETH, or BNB, owes its success to the region's formidable capital and user base.</p>
                    <p data-key="opportunityPara2">Yet, a profound disconnect exists: Bittensor (TAO), the absolute leader in Decentralized AI, is a virtual blank slate in Asia. Despite its massive volume on Binance and Coinbase, TAO remains unlisted on the regulated exchanges of Asia's most active markets: Japan, South Korea, and Hong Kong.</p>
                    <p data-key="opportunityPara3">This is not a weakness; it is a historic, time-sensitive arbitrage opportunity. This vacuum exists at the precise moment a major catalyst approaches: the February 2nd TAO halving, a deflationary event poised to significantly increase the asset's scarcity and value. Asiatensor's mission is to be the flagship that brings Bittensor to Asia, creating a powerful value flywheel as a new wave of capital and users enters the ecosystem right as this catalyst hits.</p>
                </div>
            </section>

            <!-- Solution -->
            <section id="solution" class="mb-20" data-aos="fade-up">
                <h2 class="text-4xl font-serif font-bold mb-8" data-key="solutionTitle">Our Dual-Engine Profit Model</h2>
                <p class="text-xl mb-8" data-key="solutionSummary">Our business model is designed to create sustainable value through a dual engine: high-growth Subnet Operations and a stable, self-reinforcing Validator Node.</p>
                
                <div class="grid lg:grid-cols-2 gap-8">
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-4" data-key="solutionEngine1Title">Engine 1: Subnet Operations</h3>
                        <p data-key="solutionEngine1Body">We act as premier developers in the new AI economy. We identify high-value commercial niches (e.g., finance, biotech, decentralized science), then build and operate the specialized 'digital real estate'—the Subnets—where AI innovation in those fields occurs.</p>
                    </div>
                    
                    <div class="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-4" data-key="solutionEngine2Title">Engine 2: Validator Node</h3>
                        <p data-key="solutionEngine2Body">We are also a foundational pillar of the network's security and integrity. By running a top-tier validator node, we secure the network and earn a stable 10-20% APY on our staked TAO assets.</p>
                    </div>
                </div>
            </section>

            <!-- Advantages -->
            <section id="advantages" class="mb-20" data-aos="fade-up">
                <h2 class="text-4xl font-serif font-bold mb-8" data-key="advantagesTitle">Our Core Competitive Moats</h2>
                <p class="text-xl mb-8" data-key="advantagesSummary">Our victory is predicated on a triumvirate of moats that are nearly impossible for competitors to replicate.</p>
                
                <div class="space-y-6">
                    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                        <h3 class="text-xl font-bold mb-3" data-key="advantages1Title">Government Partnerships</h3>
                        <p data-key="advantages1Body">We are not just a commercial project; we are an enabler of national strategy. Our deep engagement with multiple municipal governments in Japan aligns our distributed AI technology with the nation's emerging initiatives.</p>
                    </div>
                    
                    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                        <h3 class="text-xl font-bold mb-3" data-key="advantages2Title">Elite Technical Prowess</h3>
                        <p data-key="advantages2Body">Bittensor's technical barrier to entry is immense, with over 95% of subnet attempts failing. We are one of the few teams globally with proven, end-to-end expertise.</p>
                    </div>
                    
                    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                        <h3 class="text-xl font-bold mb-3" data-key="advantages3Title">Applied AI Solutions</h3>
                        <p data-key="advantages3Body">Our ability to build culturally-attuned solutions serves as a powerful user-acquisition gateway and value-driver for our subnets.</p>
                    </div>
                </div>
            </section>

            <!-- Proof -->
            <section id="proof" class="mb-20" data-aos="fade-up">
                <div class="text-center">
                    <h2 class="text-4xl font-serif font-bold mb-6" data-key="proofTitle">The Proof: Data-Driven Market Validation</h2>
                    <p class="text-xl mb-8" data-key="proofSummary">Our strategy is not theoretical. It is grounded in a rigorous analysis of public market data.</p>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors" data-key="proofCta">
                        Click to Explore Cross-Market Benchmarking Data
                    </button>
                </div>
            </section>

            <!-- Path -->
            <section id="path" class="mb-20" data-aos="fade-up">
                <h2 class="text-4xl font-serif font-bold mb-6" data-key="pathTitle">The Path & The Prize</h2>
                <p class="text-xl mb-8" data-key="pathSummary">We have a clear, capital-efficient, and structured plan to achieve a public listing and generate asymmetric returns.</p>
                
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
                    <h3 class="text-2xl font-bold mb-4" data-key="pathSubtitle">Path to Public Market</h3>
                    <div class="space-y-4">
                        <p data-key="pathPara1">We will leverage Japan's regulatory openness to DeFi and AI through a reverse-merger with an existing publicly-listed entity.</p>
                        <p data-key="pathPara2">This listing will create immediate brand recognition and institutional credibility in Asia.</p>
                        <p data-key="pathPara3">Our business model benefits from the 'fly-wheel effect': as TAO becomes more valuable and well-known, our subnets generate higher revenues.</p>
                    </div>
                </div>
            </section>

            <!-- Prize -->
            <section id="prize" class="mb-20" data-aos="fade-up">
                <div class="text-center">
                    <h2 class="text-4xl font-serif font-bold mb-6" data-key="prizeTitle">The Prize: Asymmetric Returns</h2>
                    <p class="text-lg max-w-3xl mx-auto" data-key="prizeDescription">Our valuation model is not speculation but a projection based on our proven operational capacity.</p>
                </div>
            </section>

            <!-- Appendix -->
            <section id="appendix" class="mb-20" data-aos="fade-up">
                <div class="text-center">
                    <h2 class="text-4xl font-serif font-bold mb-6" data-key="appendixTitle">Appendix</h2>
                    <p class="text-lg mb-8" data-key="appendixSummary">Explore additional detailed analyses and insights.</p>
                    <button onclick="openAppendix()" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors" data-key="appendixCta">
                        View Appendix
                    </button>
                </div>
            </section>
        `;
    }

    static generateLanguageSwitcher() {
        const desktopSwitcher = document.getElementById('language-switcher-desktop');
        const mobileSwitcher = document.getElementById('language-switcher-mobile');
        
        const languageButtons = APP_CONFIG.SUPPORTED_LANGUAGES.map(lang => {
            const labels = {
                'en': 'EN',
                'ja': '日',
                'ko': '한',
                'zh-cn': '中',
                'zh-hk': '港'
            };
            
            return `<button data-lang="${lang}" class="px-3 py-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">${labels[lang]}</button>`;
        }).join('');
        
        if (desktopSwitcher) {
            desktopSwitcher.innerHTML = languageButtons;
        }
        
        if (mobileSwitcher) {
            mobileSwitcher.innerHTML = languageButtons.replace(/px-3 py-1/g, 'px-6 py-3 text-xl');
        }
    }

    static generateUIElements() {
        // Theme toggle buttons
        const themeToggleDesktop = document.getElementById('theme-toggle-btn-desktop');
        const themeToggleMobile = document.getElementById('theme-toggle-btn-mobile');
        
        const themeIconHTML = `
            <svg id="sunIcon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <svg id="moonIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
        `;
        
        if (themeToggleDesktop) themeToggleDesktop.innerHTML = themeIconHTML;
        if (themeToggleMobile) themeToggleMobile.innerHTML = themeIconHTML.replace(/Icon/g, 'IconMobile');
        
        // Print buttons
        const printDesktop = document.getElementById('print-btn-desktop');
        const printMobile = document.getElementById('print-btn-mobile');
        
        const printIconHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
        `;
        
        if (printDesktop) {
            printDesktop.innerHTML = printIconHTML;
            printDesktop.onclick = PrintManager.print;
        }
        if (printMobile) {
            printMobile.innerHTML = printIconHTML;
            printMobile.onclick = PrintManager.print;
        }
        
        // Hamburger menu is already implemented in HTML
        // MobileMenuManager will handle the toggle functionality
        
        // Scrollspy Navigation
        const scrollspyNav = document.getElementById('scrollspy-nav');
        if (scrollspyNav) {
            const navHTML = `
                <ul class="space-y-3">
                    <li><a href="#summary" class="block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors"></a></li>
                    <li><a href="#opportunity" class="block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors"></a></li>
                    <li><a href="#solution" class="block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors"></a></li>
                    <li><a href="#advantages" class="block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors"></a></li>
                    <li><a href="#proof" class="block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors"></a></li>
                    <li><a href="#path" class="block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors"></a></li>
                    <li><a href="#prize" class="block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors"></a></li>
                    <li><a href="#appendix" class="block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors"></a></li>
                </ul>
            `;
            scrollspyNav.innerHTML = navHTML;
        }
    }
}

// ==========================================
// ASIATENSOR MAIN APP
// ==========================================

class AsiatensorApp {
    constructor() {
        this.themeManager = null;
        this.contentRenderer = null;
        this.scrollspyManager = null;
        this.pipModal = null;
        this.tradingViewManager = null;
        this.mobileMenuManager = null;
    }

    async init() {
        try {
            console.log('🚀 Initializing Asiatensor Executive Brief...');
            
            // Generate page content and UI elements
            PageContentGenerator.generateMainContent();
            PageContentGenerator.generateLanguageSwitcher();
            PageContentGenerator.generateUIElements();
            
            // Inject logos
            LogoManager.injectLogos();
            
            // Initialize core systems
            this.contentRenderer = new ContentRenderer();
            this.themeManager = new ThemeManager();
            this.scrollspyManager = new ScrollspyManager();
            this.pipModal = new PictureInPictureModal();
            this.tradingViewManager = new TradingViewManager();
            this.mobileMenuManager = new MobileMenuManager();
            
            // Load initial content
            const initialLanguage = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE) || APP_CONFIG.DEFAULT_LANGUAGE;
            await this.contentRenderer.renderContent(initialLanguage);
            
            // Make functions globally available
            this.bindGlobalFunctions();
            
            // Show content with fade-in effect
            setTimeout(() => {
                const container = document.getElementById('content-container');
                if (container) {
                    container.classList.remove('opacity-0');
                }
            }, 100);
            
            // Initialize AOS (Animate On Scroll)
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 1000,
                    once: true,
                    offset: 100
                });
            }
            
            console.log('✅ Application initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
        }
    }

    bindGlobalFunctions() {
        // Make functions available globally for onclick handlers
        window.switchLanguage = async (lang) => await this.contentRenderer.renderContent(lang);
        window.toggleTheme = () => this.themeManager.toggle();
        window.toggleCollapsible = (trigger) => CollapsibleManager.toggleCollapsible(trigger);
        window.toggleMobileMenu = () => this.mobileMenuManager.toggle();
        window.printPage = () => PrintManager.print();
        window.pipModal = this.pipModal;
        window.mobileMenuManager = this.mobileMenuManager;
        
        window.openAppendix = () => {
            alert('Appendix functionality would be implemented here - opening full DATCO analysis modal');
        };
        
        // Set up language switcher buttons (both desktop and mobile)
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                await this.contentRenderer.renderContent(lang);
                
                // Close mobile menu if it's open
                if (this.mobileMenuManager && this.mobileMenuManager.isOpen) {
                    this.mobileMenuManager.toggle();
                }
            });
        });
    }
}

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    const app = new AsiatensorApp();
    window.app = app; // Make globally available
    await app.init();
});

// Debug helper
window.AsiatensorDebug = {
    getConfig: () => APP_CONFIG,
    getCurrentLanguage: () => window.app?.contentRenderer?.currentLanguage,
    getCurrentTheme: () => window.app?.themeManager?.currentTheme,
    switchLanguage: (lang) => window.switchLanguage(lang),
    toggleTheme: () => window.toggleTheme()
};