/**
 * Asiatensor Login Page - 3D Animation & Authentication
 * Separate module for login functionality and Three.js animation
 */

// ==========================================
// CONFIGURATION
// ==========================================

const LOGIN_CONFIG = {
    ACCESS_CODE: 'TAO2025',
    STORAGE_KEY: 'isAuthenticated',
    REDIRECT_URL: 'index.html'
};

// ==========================================
// 3D NETWORK ANIMATION
// ==========================================

class NetworkAnimation {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.pointsMesh = null;
        this.linesMesh = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || typeof THREE === 'undefined') {
            console.warn('Canvas or THREE.js not available, skipping 3D animation');
            return;
        }

        try {
            this.setupScene(canvas);
            this.createNetworkGeometry();
            this.setupThemeWatcher();
            this.startAnimation();
            this.setupResizeHandler();
            console.info('✅ 3D network visualization loaded');
        } catch (error) {
            console.warn('3D animation failed to initialize:', error);
            this.setupFallbackAnimation(canvas);
        }
    }

    setupScene(canvas) {
        // Check WebGL support
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            throw new Error('WebGL not supported');
        }
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Optimize renderer settings
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: pixelRatio < 2,
            alpha: true,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = false;
        
        this.camera.position.z = 15;
    }

    createNetworkGeometry() {
        const isMobile = window.innerWidth < 768;
        const isLowEnd = navigator.hardwareConcurrency < 4;
        const pointCount = isMobile ? 800 : (isLowEnd ? 1200 : 1500); // Enhanced Spherical Nebula
        
        const points = [];
        const radius = 10; // Larger sphere

        // Generate points in uniform sphere distribution (Spherical Nebula)
        for (let i = 0; i < pointCount; i++) {
            // Use more uniform distribution for better nebula effect
            const u = Math.random();
            const v = Math.random();
            const w = Math.random();
            
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = radius * Math.cbrt(w) * (0.7 + 0.3 * Math.random()); // Cube root for uniform volume
            
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            points.push(new THREE.Vector3(x, y, z));
        }

        // Create points mesh with enhanced nebula properties
        const pointsGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const pointsMaterial = new THREE.PointsMaterial({ 
            color: 0xffffff,
            size: 0.12, // Slightly smaller for denser nebula effect
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.9, // Higher opacity for more visible points
            blending: THREE.AdditiveBlending // Additive blending for glow effect
        });
        this.pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
        this.scene.add(this.pointsMesh);

        // Create connecting lines with enhanced nebula network
        const linesGeometry = new THREE.BufferGeometry();
        const positions = [];
        const maxDistance = isMobile ? 2.8 : 3.2; // Increased for more connections
        const maxConnections = isMobile ? 4 : 6; // More connections for dense nebula

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
            color: 0xffffff,
            transparent: true, 
            opacity: 0.3, // Slightly lower opacity for subtle network effect
            blending: THREE.AdditiveBlending // Additive blending for ethereal glow
        });
        this.linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
        this.scene.add(this.linesMesh);

        // Initialize theme colors
        this.updateThemeColors();
    }

    updateThemeColors() {
        if (!this.pointsMesh || !this.linesMesh) return;
        
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            this.renderer.setClearColor(0x000000, 1);
            this.pointsMesh.material.color.setHex(0xffffff);
            this.linesMesh.material.color.setHex(0xffffff);
            this.linesMesh.material.opacity = 0.15;
        } else {
            this.renderer.setClearColor(0xf8fafc, 1);
            this.pointsMesh.material.color.setHex(0x1e293b);
            this.linesMesh.material.color.setHex(0x475569);
            this.linesMesh.material.opacity = 0.25;
        }
    }

    setupThemeWatcher() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.updateThemeColors();
                }
            });
        });
        
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    }

    startAnimation() {
        let time = 0;
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            time += 0.01;

            if (this.pointsMesh && this.linesMesh) {
                // Enhanced multi-axis rotation for living, complex network
                this.pointsMesh.rotation.x += 0.0008;
                this.pointsMesh.rotation.y += 0.0012;
                this.pointsMesh.rotation.z += 0.0003; // Added Z-axis rotation
                this.linesMesh.rotation.x += 0.0008;
                this.linesMesh.rotation.y += 0.0012;
                this.linesMesh.rotation.z += 0.0003;

                // More complex pulsing with slight variation between points and lines
                const pointScale = 1 + 0.08 * Math.sin(time * 1.2);
                const lineScale = 1 + 0.05 * Math.sin(time * 1.5 + Math.PI / 4);
                this.pointsMesh.scale.setScalar(pointScale);
                this.linesMesh.scale.setScalar(lineScale);

                // Enhanced camera movement for more dynamic viewing
                this.camera.position.x = Math.sin(time * 0.25) * 3;
                this.camera.position.y = Math.cos(time * 0.18) * 2;
                this.camera.position.z = 15 + Math.sin(time * 0.1) * 2; // Subtle zoom
                this.camera.lookAt(0, 0, 0);

                // Add slight opacity animation for ethereal effect
                if (this.pointsMesh.material && this.linesMesh.material) {
                    this.pointsMesh.material.opacity = 0.9 + 0.1 * Math.sin(time * 2);
                    this.linesMesh.material.opacity = 0.3 + 0.15 * Math.sin(time * 1.8 + Math.PI / 3);
                }
            }

            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    }

    setupFallbackAnimation(canvas) {
        canvas.style.background = `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)
        `;
        canvas.style.animation = 'fallbackPulse 8s ease-in-out infinite';
        
        // Add CSS keyframes
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

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer && this.renderer.domElement) {
            this.renderer.dispose();
        }
    }
}

// ==========================================
// AUTHENTICATION MANAGER
// ==========================================

class LoginAuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.initLoginForm();
        this.focusPasswordInput();
    }

    initLoginForm() {
        const form = document.getElementById('loginForm');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('errorMessage');

        if (!form || !passwordInput || !errorMessage) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(passwordInput.value, errorMessage, passwordInput);
        });

        // Clear error on input
        passwordInput.addEventListener('input', () => {
            this.hideError(errorMessage);
        });

        // Handle Enter key
        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });
    }

    async handleLogin(password, errorElement, passwordInput) {
        this.hideError(errorElement);

        // Add loading state
        this.setLoadingState(passwordInput, true);

        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        if (password === LOGIN_CONFIG.ACCESS_CODE) {
            // Successful login
            sessionStorage.setItem(LOGIN_CONFIG.STORAGE_KEY, 'true');
            this.showSuccess();
            
            // Redirect after success animation
            setTimeout(() => {
                window.location.href = LOGIN_CONFIG.REDIRECT_URL;
            }, 1500);
        } else {
            // Failed login
            this.setLoadingState(passwordInput, false);
            this.showError(errorElement);
            this.shakeForm();
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    setLoadingState(input, isLoading) {
        if (isLoading) {
            input.classList.add('opacity-50');
            input.disabled = true;
        } else {
            input.classList.remove('opacity-50');
            input.disabled = false;
        }
    }

    showError(errorElement) {
        errorElement.classList.remove('hidden');
        errorElement.style.animation = 'fadeInShake 0.5s ease-out';
    }

    hideError(errorElement) {
        errorElement.classList.add('hidden');
        errorElement.style.animation = '';
    }

    showSuccess() {
        const form = document.getElementById('loginForm');
        const successDiv = document.createElement('div');
        successDiv.className = 'text-center mt-6';
        successDiv.style.animation = 'fadeInUp 0.6s ease-out';
        successDiv.innerHTML = `
            <div class="rounded-xl bg-green-900/30 border border-green-700/50 backdrop-blur p-6">
                <div class="flex items-center justify-center mb-3">
                    <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="text-green-300 font-semibold">Access Granted</p>
                        <p class="text-green-400 text-sm">Redirecting to executive brief...</p>
                    </div>
                </div>
                <div class="w-full bg-green-800/30 rounded-full h-1">
                    <div class="bg-green-500 h-1 rounded-full animate-pulse" style="width: 100%; animation: progressBar 1.2s ease-out;"></div>
                </div>
            </div>
        `;
        form.parentNode.insertBefore(successDiv, form.nextSibling);
    }

    shakeForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.style.animation = 'shakeForm 0.5s ease-in-out';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        }
    }

    focusPasswordInput() {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            // Delay focus to ensure page is fully loaded
            setTimeout(() => passwordInput.focus(), 100);
        }
    }
}

// ==========================================
// ENHANCED CSS ANIMATIONS
// ==========================================

function injectLoginAnimations() {
    const style = document.createElement('style');
    style.id = 'login-animations';
    style.textContent = `
        @keyframes fadeInShake {
            0% { opacity: 0; transform: translateY(-10px); }
            50% { opacity: 1; transform: translateY(0) rotate(1deg); }
            75% { transform: rotate(-1deg); }
            100% { opacity: 1; transform: translateY(0) rotate(0); }
        }
        
        @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes shakeForm {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes progressBar {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        
        /* Enhanced input focus styles */
        #password:focus {
            transform: scale(1.02);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 10px 25px rgba(59, 130, 246, 0.15);
        }
        
        /* Smooth transitions */
        #password, #loginForm > button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        #loginForm > button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.25);
        }
        
        #loginForm > button:active {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Asiatensor Login Portal initializing...');
    
    // Inject enhanced animations
    injectLoginAnimations();
    
    // Initialize 3D animation
    const networkAnimation = new NetworkAnimation();
    
    // Initialize authentication
    const authManager = new LoginAuthManager();
    
    console.log('✅ Login Portal ready');
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    console.log('🔐 Login session ending...');
});

export { NetworkAnimation, LoginAuthManager };