document.addEventListener('DOMContentLoaded', () => {
    // --- STATE & CONFIG ---
    let currentLang = 'en';
    const languages = [
        { code: 'en', name: 'EN' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' },
        { code: 'zh-cn', name: '简体' },
        { code: 'zh-hk', name: '繁體' }
    ];

    // --- DOM ELEMENTS ---
    const contentContainer = document.getElementById('content-container');
    const loadingSpinner = document.getElementById('loading-spinner');

    // --- CORE FUNCTIONS ---

    // 1. Fetch and Render Content
    async function renderContent(lang) {
        showLoading();
        try {
            const response = await fetch(`./assets/locales/${lang}.json`);
            if (!response.ok) throw new Error(`Could not load language file: ${lang}`);
            const translations = await response.json();

            // Populate all elements with data-key
            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.dataset.key;
                if (translations[key]) {
                    element.innerHTML = translations[key];
                }
            });

            currentLang = lang;
            localStorage.setItem('asiatensor-lang', lang);
            updateLanguageSwitcherUI();

        } catch (error) {
            console.error("Failed to render content:", error);
        } finally {
            hideLoading();
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }
    }

    // 2. Theme Management
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.getElementById('sunIcon')?.classList.remove('hidden');
            document.getElementById('moonIcon')?.classList.add('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            document.getElementById('sunIcon')?.classList.add('hidden');
            document.getElementById('moonIcon')?.classList.remove('hidden');
        }
        localStorage.setItem('asiatensor-theme', theme);
    }

    function toggleTheme() {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    // 3. Language Switcher UI
    function updateLanguageSwitcherUI() {
        document.querySelectorAll('[data-lang]').forEach(button => {
            if (button.dataset.lang === currentLang) {
                button.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-600', 'dark:text-blue-400');
                button.classList.remove('hover:bg-gray-100', 'dark:hover:bg-gray-800');
            } else {
                button.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-600', 'dark:text-blue-400');
                button.classList.add('hover:bg-gray-100', 'dark:hover:bg-gray-800');
            }
        });
    }

    // 4. Mobile Menu
    function toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const hamburger = document.getElementById('hamburgerIcon');
        const close = document.getElementById('closeIcon');

        if (menu && hamburger && close) {
            const isHidden = menu.classList.contains('hidden');
            menu.classList.toggle('hidden');
            hamburger.classList.toggle('hidden');
            close.classList.toggle('hidden');
        }
    }

    // 5. Collapsible Cards
    function toggleCard(card) {
        const content = card.querySelector('.expanded-content');
        const icon = card.querySelector('.expand-icon');
        
        if (content) {
            content.classList.toggle('hidden');
        }
        if (icon) {
            icon.classList.toggle('rotated');
        }
    }

    // 6. Modal Management
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    // 7. Scrollspy
    function updateScrollspy() {
        const sections = ['summary', 'metrics', 'opportunity', 'strategy', 'financials', 'execution', 'appendix'];
        const scrollTop = window.scrollY;
        let activeSection = sections[0];
        
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.3) {
                    activeSection = sectionId;
                }
            }
        });

        document.querySelectorAll('.scrollspy-dot').forEach(dot => {
            dot.classList.remove('active');
            if (dot.dataset.target === activeSection) {
                dot.classList.add('active');
            }
        });
    }

    // --- INITIALIZATION ---
    function initialize() {
        // Authenticate
        if (sessionStorage.getItem('isAuthenticated') !== 'true') {
            window.location.href = 'login.html';
            return;
        }

        // Set initial theme
        const savedTheme = localStorage.getItem('asiatensor-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

        // Set initial language
        const savedLang = localStorage.getItem('asiatensor-lang') || 'en';
        
        // Render content for the initial language
        renderContent(savedLang).then(() => {
            initializeInteractiveElements();
            const container = document.getElementById('content-container');
            if (container) {
                container.style.opacity = 1;
            }
        });
    }
    
    function initializeInteractiveElements() {
        // AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 800, once: true });
        }

        // Theme Toggles
        document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
        document.getElementById('mobileThemeToggle')?.addEventListener('click', toggleTheme);

        // Mobile Menu
        document.getElementById('mobileMenuToggle')?.addEventListener('click', toggleMobileMenu);

        // Language Switchers
        document.querySelectorAll('[data-lang]').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const lang = button.dataset.lang;
                await renderContent(lang);
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    toggleMobileMenu();
                }
            });
        });

        // Collapsible Cards
        document.querySelectorAll('.insight-card').forEach(card => {
            card.addEventListener('click', () => toggleCard(card));
        });

        // Print functionality
        document.getElementById('printBtn')?.addEventListener('click', () => {
            document.querySelectorAll('.expanded-content').forEach(content => {
                content.classList.remove('hidden');
            });
            window.print();
        });
        document.getElementById('mobilePrintBtn')?.addEventListener('click', () => {
            document.querySelectorAll('.expanded-content').forEach(content => {
                content.classList.remove('hidden');
            });
            window.print();
        });

        // Scrollspy
        window.addEventListener('scroll', updateScrollspy);
        document.querySelectorAll('.scrollspy-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const target = e.target.dataset.target;
                const element = document.getElementById(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Appendix Modal
        document.getElementById('open-appendix-btn')?.addEventListener('click', () => {
            openAppendixModal();
        });
        document.getElementById('close-appendix')?.addEventListener('click', () => {
            closeModal('appendix-modal');
        });

        // Chart Modal
        document.querySelectorAll('.clickable-company').forEach(element => {
            element.addEventListener('click', (e) => {
                const symbol = e.target.dataset.symbol;
                openChartModal(symbol);
            });
        });
        document.getElementById('closeChart')?.addEventListener('click', () => {
            closeModal('chartModal');
        });

        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                e.target.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-backdrop:not(.hidden)').forEach(modal => {
                    modal.classList.add('hidden');
                    document.body.style.overflow = '';
                });
            }
        });

        updateScrollspy();
    }

    // Chart Modal
    function openChartModal(symbol) {
        const modal = document.getElementById('chartModal');
        const title = document.getElementById('chartTitle');
        const container = document.getElementById('chartContainer');
        
        if (title) title.textContent = `${symbol} Stock Chart`;
        if (container) {
            container.innerHTML = `
                <div class="flex items-center justify-center h-full">
                    <div class="text-center">
                        <div class="text-2xl font-bold mb-4">${symbol} Chart</div>
                        <div class="text-gray-600 dark:text-gray-400">
                            [TradingView Widget Placeholder]<br>
                            In production, this would display the actual ${symbol} chart
                        </div>
                    </div>
                </div>
            `;
        }
        
        openModal('chartModal');
    }

    // Appendix Modal
    async function openAppendixModal() {
        const modal = document.getElementById('appendix-modal');
        const content = document.getElementById('appendix-content');
        
        openModal('appendix-modal');
        
        if (content) {
            content.innerHTML = `
                <div class="flex items-center justify-center h-64">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p class="text-gray-600 dark:text-gray-400">Loading report...</p>
                    </div>
                </div>
            `;
            
            try {
                const response = await fetch(`./assets/reports/datco-report-${currentLang}.md`);
                if (response.ok) {
                    const markdown = await response.text();
                    if (typeof marked !== 'undefined') {
                        content.innerHTML = `<div class="prose prose-lg dark:prose-invert max-w-none">${marked.parse(markdown)}</div>`;
                    } else {
                        content.innerHTML = `<pre class="whitespace-pre-wrap text-sm">${markdown}</pre>`;
                    }
                } else {
                    throw new Error('Failed to load report');
                }
            } catch (error) {
                content.innerHTML = `
                    <div class="text-center py-8">
                        <div class="text-red-600 mb-4">Failed to load report</div>
                        <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry</button>
                    </div>
                `;
            }
        }
    }

    // --- UTILITIES ---
    function showLoading() {
        if (loadingSpinner) {
            loadingSpinner.classList.remove('hidden');
        }
    }

    function hideLoading() {
        if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
        }
    }

    // Make functions globally available
    window.toggleCard = toggleCard;
    window.renderContent = renderContent;
    window.toggleTheme = toggleTheme;
    window.toggleMobileMenu = toggleMobileMenu;

    // --- START THE APP ---
    initialize();
});