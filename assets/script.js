/**
 * Asiatensor Executive Brief - Minimalist Professional Interface
 * Clean, collapsible card-based interaction system
 */

// Remove import for now - will load THREE.js via CDN instead
// import * as THREE from 'three';

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
    ACCESS_CODE: 'TAO2025',
    STORAGE_KEYS: {
        AUTH: 'isAuthenticated',
        THEME: 'asiatensor-theme',
        LANGUAGE: 'asiatensor-language'
    },
    DEFAULT_THEME: 'dark',
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'ja', 'ko', 'zh-cn', 'zh-hk']
};

// ==========================================
// 3D NETWORK ANIMATION (LOGIN PAGE ONLY)
// ==========================================

// Check if we are on the login page before running the animation
if (document.getElementById('bg-canvas')) {
    // Only initialize if THREE.js is available
    if (typeof THREE !== 'undefined') {
        try {
            initializeNetworkAnimation();
        } catch (error) {
            console.warn('3D animation not supported, falling back to CSS animation');
            setupFallbackAnimation();
        }
    } else {
        console.warn('THREE.js not loaded, skipping 3D animation');
    }
}

function initializeNetworkAnimation() {
    // 1. Scene Setup with error handling
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    // Check WebGL support
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        throw new Error('WebGL not supported');
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Optimize renderer settings based on device capabilities
    const pixelRatio = Math.min(window.devicePixelRatio, 2); // Cap at 2 for performance
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: pixelRatio < 2, // Only use antialiasing on low-DPI displays
        alpha: true,
        powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(pixelRatio);
    
    // Performance optimizations
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = false; // Disable for better performance

    // 2. Create the Network Geometry (Adaptive point count)
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency < 4;
    const pointCount = isMobile ? 400 : (isLowEnd ? 600 : 800);
    
    const points = [];
    const radius = 8;

    // Generate points in a sphere distribution
    for (let i = 0; i < pointCount; i++) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius * (0.5 + 0.5 * Math.random()); // Variable radius for depth
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        points.push(new THREE.Vector3(x, y, z));
    }

    // Create points mesh with enhanced visibility
    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointsMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff, // Start with white for visibility
        size: 0.15, // Increased size for better visibility
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
    });
    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointsMesh);

    // Create lines connecting nearby points (Optimized algorithm)
    const linesGeometry = new THREE.BufferGeometry();
    const positions = [];
    const maxDistance = isMobile ? 2.0 : 2.5;
    const maxConnections = isMobile ? 3 : 5; // Limit connections per point

    for (let i = 0; i < pointCount; i++) {
        let connections = 0;
        for (let j = i + 1; j < pointCount && connections < maxConnections; j++) {
            const distance = points[i].distanceTo(points[j]);
            if (distance < maxDistance) {
                positions.push(points[i].x, points[i].y, points[i].z);
                positions.push(points[j].x, points[j].y, points[j].z);
                connections++;
            }
        }
    }

    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const linesMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff, // Start with white for visibility
        transparent: true, 
        opacity: 0.4 // Increased opacity for better visibility
    });
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // Function to update colors based on theme
    function updateThemeColors() {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            // Dark mode: white network on black background
            renderer.setClearColor(0x000000, 1);
            pointsMaterial.color.setHex(0xffffff);
            linesMaterial.color.setHex(0xffffff);
            linesMaterial.opacity = 0.15;
        } else {
            // Light mode: dark network on light background
            renderer.setClearColor(0xf8fafc, 1);
            pointsMaterial.color.setHex(0x1e293b);
            linesMaterial.color.setHex(0x475569);
            linesMaterial.opacity = 0.25;
        }
    }

    // 3. Position Camera
    camera.position.z = 15;

    // Initialize theme colors now that materials are created
    updateThemeColors();

    // 4. Animation Loop
    let time = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        time += 0.01;

        // Slow rotation on multiple axes
        pointsMesh.rotation.x += 0.0005;
        pointsMesh.rotation.y += 0.0008;
        linesMesh.rotation.x += 0.0005;
        linesMesh.rotation.y += 0.0008;

        // Subtle pulsing effect
        const scale = 1 + 0.1 * Math.sin(time);
        pointsMesh.scale.setScalar(scale);
        linesMesh.scale.setScalar(scale);

        // Gentle camera movement
        camera.position.x = Math.sin(time * 0.3) * 2;
        camera.position.y = Math.cos(time * 0.2) * 1;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    };
    animate();

    // 5. Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 6. Watch for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                updateThemeColors();
            }
        });
    });
    
    observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['class'] 
    });

    // Animation successfully initialized
    console.info('✅ 3D network visualization loaded');
}

// WebGL fallback animation using CSS
function setupFallbackAnimation() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    // Create CSS-based particle animation
    canvas.style.background = `
        radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)
    `;
    
    // Add subtle animation via CSS transforms
    canvas.style.animation = 'fallbackPulse 8s ease-in-out infinite';
    
    // Add CSS animation keyframes if not already present
    if (!document.querySelector('#fallback-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'fallback-animation-styles';
        style.textContent = `
            @keyframes fallbackPulse {
                0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
                50% { transform: scale(1.02) rotate(0.5deg); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================

class AuthenticationManager {
    constructor() {
        this.init();
    }

    init() {
        if (this.isOnLoginPage()) {
            this.initLoginForm();
        } else {
            this.checkAuthentication();
        }
    }

    isOnLoginPage() {
        return document.getElementById('loginForm') !== null;
    }

    initLoginForm() {
        const form = document.getElementById('loginForm');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('errorMessage');

        if (!form || !passwordInput || !errorMessage) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(passwordInput.value, errorMessage);
        });

        // Clear error on input
        passwordInput.addEventListener('input', () => {
            this.hideError(errorMessage);
        });

        // Focus on password input
        passwordInput.focus();
    }

    handleLogin(password, errorElement) {
        this.hideError(errorElement);

        if (password === CONFIG.ACCESS_CODE) {
            // Successful login
            sessionStorage.setItem(CONFIG.STORAGE_KEYS.AUTH, 'true');
            this.showSuccess();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            // Failed login
            this.showError(errorElement);
            this.shakeForm();
        }
    }

    showError(errorElement) {
        errorElement.classList.remove('hidden');
        errorElement.classList.add('animate-fade-in');
    }

    hideError(errorElement) {
        errorElement.classList.add('hidden');
        errorElement.classList.remove('animate-fade-in');
    }

    showSuccess() {
        const form = document.getElementById('loginForm');
        const successDiv = document.createElement('div');
        successDiv.className = 'text-center animate-fade-in mt-4';
        successDiv.innerHTML = `
            <div class="rounded-xl bg-green-900/30 border border-green-700/50 backdrop-blur p-4">
                <div class="flex items-center justify-center">
                    <svg class="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <p class="text-sm text-green-300 font-mono">Access granted. Redirecting...</p>
                </div>
            </div>
        `;
        form.parentNode.insertBefore(successDiv, form.nextSibling);
    }

    shakeForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.classList.add('animate-pulse');
            setTimeout(() => {
                form.classList.remove('animate-pulse');
            }, 500);
        }
    }

    checkAuthentication() {
        if (sessionStorage.getItem(CONFIG.STORAGE_KEYS.AUTH) !== 'true') {
            window.location.href = 'login.html';
        }
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

    init() {
        this.applyTheme(this.currentTheme);
        this.initThemeToggle();
        this.watchSystemTheme();
    }

    getSavedTheme() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
        if (saved && ['light', 'dark'].includes(saved)) {
            return saved;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return CONFIG.DEFAULT_THEME;
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
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
        
        // Update theme icon
        this.updateThemeIcon();
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
        
        console.log(`Theme applied: ${theme}`);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    initThemeToggle() {
        const toggleButton = document.getElementById('theme-toggle-btn');
        console.log('Theme toggle button:', toggleButton);
        
        if (!toggleButton) {
            console.warn('Theme toggle button not found');
            return;
        }

        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Theme toggle clicked');
            this.toggleTheme();
            this.animateThemeToggle(toggleButton);
        });

        // Add keyboard support
        toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('Theme toggle via keyboard');
                this.toggleTheme();
                this.animateThemeToggle(toggleButton);
            }
        });
        
        console.log('Theme toggle initialized');
    }

    updateThemeIcon() {
        const toggleButton = document.getElementById('theme-toggle-btn');
        if (!toggleButton) return;
        
        const svg = toggleButton.querySelector('svg');
        if (!svg) return;
        
        if (this.currentTheme === 'dark') {
            // Sun icon for light mode
            svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
        } else {
            // Moon icon for dark mode
            svg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
        }
    }

    animateThemeToggle(button) {
        button.classList.add('animate-spin');
        setTimeout(() => {
            button.classList.remove('animate-spin');
        }, 300);
    }

    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem(CONFIG.STORAGE_KEYS.THEME)) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
}

// ==========================================
// LANGUAGE MANAGEMENT
// ==========================================

class LanguageManager {
    constructor() {
        this.currentLanguage = this.getSavedLanguage();
        this.init();
    }

    init() {
        this.initLanguageSwitcher();
        this.updateActiveLanguageButton();
        this.updateContentLanguage(this.currentLanguage);
    }

    getSavedLanguage() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE);
        if (saved && CONFIG.SUPPORTED_LANGUAGES.includes(saved)) {
            return saved;
        }
        
        // Try to detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            const langCode = this.mapBrowserLanguage(browserLang.toLowerCase());
            if (CONFIG.SUPPORTED_LANGUAGES.includes(langCode)) {
                return langCode;
            }
        }
        
        return CONFIG.DEFAULT_LANGUAGE;
    }

    mapBrowserLanguage(browserLang) {
        const langMap = {
            'en': 'en',
            'en-us': 'en',
            'en-gb': 'en',
            'ja': 'ja',
            'ja-jp': 'ja',
            'ko': 'ko',
            'ko-kr': 'ko',
            'zh': 'zh-cn',
            'zh-cn': 'zh-cn',
            'zh-tw': 'zh-hk',
            'zh-hk': 'zh-hk'
        };
        
        return langMap[browserLang] || langMap[browserLang.split('-')[0]] || 'en';
    }

    initLanguageSwitcher() {
        const languageButtons = document.querySelectorAll('.lang-btn');
        console.log('Found language buttons:', languageButtons.length);
        
        if (!languageButtons.length) {
            console.warn('No language buttons found');
            return;
        }

        languageButtons.forEach((button, index) => {
            const lang = button.getAttribute('data-lang');
            console.log(`Setting up language button ${index + 1} for language: ${lang}`);
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Language button clicked:', lang);
                
                if (lang && CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
                    this.switchLanguage(lang);
                } else {
                    console.warn('Unsupported language:', lang);
                }
            });
        });
        
        console.log('Language switcher initialized');
    }

    switchLanguage(language) {
        if (!CONFIG.SUPPORTED_LANGUAGES.includes(language)) {
            console.warn(`Unsupported language: ${language}`);
            return;
        }

        this.currentLanguage = language;
        localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, language);
        this.updateActiveLanguageButton();
        this.updateContentLanguage(language);
        
        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language } 
        }));

        console.info(`🌐 Language switched to: ${language}`);
    }

    updateContentLanguage(language) {
        // Update all elements with data-i18n attributes
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const content = this.getNestedContent(window.ASIATENSOR_CONTENT, key, language);
            if (content) {
                element.textContent = content;
            }
        });
    }

    getNestedContent(obj, path, language) {
        // Navigate through nested object using dot notation
        const keys = path.split('.');
        let current = obj;
        
        for (const key of keys) {
            if (current && current[key]) {
                current = current[key];
            } else {
                return null;
            }
        }
        
        // Return the content for the specified language
        return current && current[language] ? current[language] : null;
    }

    updateActiveLanguageButton() {
        const buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(button => {
            const lang = button.getAttribute('data-lang');
            button.classList.remove('text-white', 'bg-gray-700');
            button.classList.add('text-gray-400', 'hover:text-white', 'hover:bg-gray-800');
            
            if (lang === this.currentLanguage) {
                button.classList.remove('text-gray-400', 'hover:text-white', 'hover:bg-gray-800');
                button.classList.add('text-white', 'bg-gray-700');
            }
        });
    }
}

// ==========================================
// COLLAPSIBLE CARDS SYSTEM
// ==========================================

class CollapsibleCardsManager {
    constructor() {
        this.init();
    }

    init() {
        this.initCollapsibleCards();
    }

    initCollapsibleCards() {
        console.log('Initializing collapsible cards...');
        const triggers = document.querySelectorAll('.collapsible-trigger');
        console.log(`Found ${triggers.length} collapsible triggers`);
        
        triggers.forEach((trigger, index) => {
            console.log(`Setting up trigger ${index + 1}`);
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Collapsible trigger clicked');
                
                const content = trigger.nextElementSibling;
                const icon = trigger.querySelector('.collapsible-icon');
                
                if (content && content.classList.contains('collapsible-content')) {
                    // Toggle content visibility
                    const isHidden = content.classList.contains('hidden');
                    content.classList.toggle('hidden');
                    
                    // Animate icon rotation
                    if (icon) {
                        icon.classList.toggle('rotate-180');
                    }
                    
                    console.log(`Content ${isHidden ? 'expanded' : 'collapsed'}`);
                } else {
                    console.log('No collapsible content found or incorrect structure');
                }
            });
        });
    }
}

// ==========================================
// MODAL SYSTEM
// ==========================================

class ModalManager {
    constructor() {
        this.init();
    }

    init() {
        this.initStockChartModal();
    }

    initStockChartModal() {
        const modal = document.getElementById('stock-chart-modal');
        const closeButton = document.getElementById('close-modal');
        const chartContainer = document.getElementById('chart-container');

        if (!modal || !closeButton || !chartContainer) return;

        // Close modal event
        closeButton.addEventListener('click', () => {
            this.closeModal(modal);
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeModal(modal);
            }
        });
    }

    openStockChartModal() {
        const modal = document.getElementById('stock-chart-modal');
        const chartContainer = document.getElementById('chart-container');
        
        if (!modal || !chartContainer) return;

        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Load TradingView widget
        chartContainer.innerHTML = `
            <div class="tradingview-widget-container" style="height:400px;width:100%">
                <div class="tradingview-widget-container__widget"></div>
                <div class="tradingview-widget-copyright">
                    <a href="https://www.tradingview.com/symbols/TAOUSDT/" rel="noopener" target="_blank">
                        <span class="blue-text">TAO/USDT Chart</span>
                    </a> by TradingView
                </div>
                <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
                {
                    "autosize": true,
                    "symbol": "BYBIT:TAOUSDT",
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": "tradingview_widget"
                }
                </script>
            </div>
        `;
    }

    closeModal(modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

// ==========================================
// MAIN APPLICATION CLASS
// ==========================================

class AsiatensorApp {
    constructor() {
        this.auth = new AuthenticationManager();
        this.theme = new ThemeManager();
        
        // Only initialize on main page (not login)
        if (!this.auth.isOnLoginPage()) {
            this.language = new LanguageManager();
            this.collapsible = new CollapsibleCardsManager();
            this.modal = new ModalManager();
        }
        
        this.init();
    }

    init() {
        this.logSystemInfo();
        this.initInteractiveElements();
    }

    logSystemInfo() {
        console.group('🚀 Asiatensor Executive Brief');
        const pageType = this.auth.isOnLoginPage() ? 'Login Portal' : 'Executive Dashboard';
        console.info(`📊 ${pageType} Ready`);
        
        if (!this.auth.isOnLoginPage()) {
            console.info(`🎨 Theme: ${this.theme?.currentTheme || 'auto'}`);
            console.info(`🌐 Language: ${this.language?.currentLanguage || 'en'}`);
        }
        
        const authStatus = sessionStorage.getItem(CONFIG.STORAGE_KEYS.AUTH) === 'true' ? '🔐 Authenticated' : '🚪 Guest Access';
        console.info(authStatus);
        console.groupEnd();
    }

    initInteractiveElements() {
        // Additional interactive elements can be initialized here
        // This method is called after all core systems are initialized
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.asiatensorApp = new AsiatensorApp();
    console.info('✅ Executive Brief System Initialized');
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.asiatensorApp) {
        console.info('💤 Session ending...');
    }
});