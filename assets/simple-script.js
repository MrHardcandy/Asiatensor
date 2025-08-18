/**
 * Simplified Asiatensor Script - Direct Event Binding
 */

console.log('🚀 Simple script loading...');

// Wait for DOM and content to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing simple handlers...');
    
    // Simple theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        console.log('✅ Theme button found');
        themeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎨 Theme button clicked');
            
            const html = document.documentElement;
            const isDark = html.classList.contains('dark');
            
            if (isDark) {
                html.classList.remove('dark');
                html.classList.add('light');
                console.log('→ Switched to LIGHT mode');
            } else {
                html.classList.remove('light');
                html.classList.add('dark');
                console.log('→ Switched to DARK mode');
            }
            
            // Update icon
            const svg = themeBtn.querySelector('svg path');
            if (svg) {
                if (isDark) {
                    // Light mode, show sun icon
                    svg.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
                } else {
                    // Dark mode, show moon icon
                    svg.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
                }
            }
        });
    } else {
        console.warn('❌ Theme button not found');
    }
    
    // Simple language switching
    const langButtons = document.querySelectorAll('.lang-btn');
    console.log(`🌍 Found ${langButtons.length} language buttons`);
    
    langButtons.forEach(function(btn, index) {
        const lang = btn.getAttribute('data-lang');
        console.log(`Setting up language button ${index + 1}: ${lang}`);
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`🌍 Language clicked: ${lang}`);
            
            // Update button states
            langButtons.forEach(function(b) {
                b.classList.remove('text-white', 'bg-gray-700');
                b.classList.add('text-gray-600', 'dark:text-gray-400');
            });
            
            btn.classList.remove('text-gray-600', 'dark:text-gray-400');
            btn.classList.add('text-white', 'bg-gray-700');
            
            // Update content if available
            if (window.ASIATENSOR_CONTENT) {
                console.log('📝 Updating content for language:', lang);
                updateContentLanguage(lang);
            } else {
                console.warn('❌ ASIATENSOR_CONTENT not found');
            }
        });
    });
    
    // Simple collapsible cards
    const triggers = document.querySelectorAll('.collapsible-trigger');
    console.log(`📦 Found ${triggers.length} collapsible triggers`);
    
    triggers.forEach(function(trigger, index) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`📦 Collapsible ${index + 1} clicked`);
            
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('.collapsible-icon');
            
            if (content && content.classList.contains('collapsible-content')) {
                const isHidden = content.classList.contains('hidden');
                content.classList.toggle('hidden');
                
                if (icon) {
                    icon.classList.toggle('rotate-180');
                }
                
                console.log(`→ Content ${isHidden ? 'shown' : 'hidden'}`);
            }
        });
    });
    
    console.log('✅ Simple handlers initialized');
});

// Helper function for content updates
function updateContentLanguage(language) {
    const elements = document.querySelectorAll('[data-i18n]');
    console.log(`📝 Updating ${elements.length} elements for language: ${language}`);
    
    elements.forEach(function(element) {
        const key = element.getAttribute('data-i18n');
        const content = getNestedContent(window.ASIATENSOR_CONTENT, key, language);
        if (content) {
            element.textContent = content;
        }
    });
}

function getNestedContent(obj, path, language) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (current && current[key]) {
            current = current[key];
        } else {
            console.warn(`Content path not found: ${path} at ${key}`);
            return null;
        }
    }
    
    return current && current[language] ? current[language] : null;
}