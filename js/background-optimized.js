/**
 * background-optimized.js
 * Modern ES6+ background animation system for Aionium Blog
 * Optimized with better performance and cleaner code
 */

// ==========================================
// Base Animation Element Class
// ==========================================

class AnimationElement {
    constructor(container, className) {
        this.container = container;
        this.element = document.createElement('div');
        this.element.className = className;
        this.cleanupTimeout = null;
    }
    
    destroy() {
        if (this.cleanupTimeout) {
            clearTimeout(this.cleanupTimeout);
            this.cleanupTimeout = null;
        }
        if (this.element?.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
    }
}

// ==========================================
// Circle Class (Main Page)
// ==========================================

class Circle extends AnimationElement {
    constructor(container) {
        super(container, 'circle');
        this.init();
    }
    
    init() {
        const size = 50 + Math.random() * 100;
        const duration = 15 + Math.random() * 10;
        
        Object.assign(this.element.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${Math.random() * 2}s`
        });
        
        this.container.appendChild(this.element);
        
        this.cleanupTimeout = setTimeout(() => this.destroy(), (duration + 5) * 1000);
    }
}

// ==========================================
// Symbol Class (Main Page)
// ==========================================

class Symbol extends AnimationElement {
    static characters = '<>{}[];:+-*/=&|!?';
    
    constructor(container) {
        super(container, 'symbol');
        this.init();
    }
    
    init() {
        const size = 14 + Math.random() * 10;
        const duration = 10 + Math.random() * 10;
        
        Object.assign(this.element.style, {
            fontSize: `${size}px`,
            color: `rgba(100, 200, 255, ${0.3 + Math.random() * 0.3})`,
            left: '-100px',
            top: `${Math.random() * 100}%`,
            animationDuration: `${duration}s`
        });
        
        this.element.textContent = Symbol.characters[Math.floor(Math.random() * Symbol.characters.length)];
        this.container.appendChild(this.element);
        
        this.cleanupTimeout = setTimeout(() => this.destroy(), (duration + 2) * 1000);
    }
}

// ==========================================
// About Circle Class
// ==========================================

class AboutCircle extends AnimationElement {
    constructor(container) {
        super(container, 'about-circle');
        this.init();
    }
    
    init() {
        const size = 60 + Math.random() * 120;
        const duration = 20 + Math.random() * 15;
        
        Object.assign(this.element.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${Math.random() * 3}s`
        });
        
        this.container.appendChild(this.element);
        
        this.cleanupTimeout = setTimeout(() => this.destroy(), (duration + 5) * 1000);
    }
}

// ==========================================
// Base Animation System Class
// ==========================================

class AnimationSystem {
    constructor(container, ElementClass, maxElements, createInterval) {
        this.container = container;
        this.ElementClass = ElementClass;
        this.maxElements = maxElements;
        this.createInterval = createInterval;
        this.elements = [];
        this.isRunning = false;
        this.animationId = null;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.init();
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
        this.cleanup();
    }
    
    init() {
        for (let i = 0; i < this.maxElements; i++) {
            setTimeout(() => {
                if (this.isRunning) {
                    this.createElement();
                }
            }, i * this.createInterval);
        }
    }
    
    createElement() {
        if (this.elements.length >= this.maxElements || !this.isRunning) return;
        
        const element = new this.ElementClass(this.container);
        this.elements.push(element);
    }
    
    cleanup() {
        this.elements.forEach(element => element.destroy());
        this.elements = [];
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.elements = this.elements.filter(e => e.element?.parentElement);
        
        if (this.elements.length < this.maxElements && Math.random() < 0.01) {
            this.createElement();
        }
        
        this.animationId = setTimeout(() => this.animate(), 2000);
    }
}

// ==========================================
// Specific Animation Systems
// ==========================================

class CircleSystem extends AnimationSystem {
    constructor(container, maxCircles = 5) {
        super(container, Circle, maxCircles, 2500);
    }
}

class SymbolSystem extends AnimationSystem {
    constructor(container, maxSymbols = 8) {
        super(container, Symbol, maxSymbols, 1200);
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.elements = this.elements.filter(e => e.element?.parentElement);
        
        if (this.elements.length < this.maxElements && Math.random() < 0.015) {
            this.createElement();
        }
        
        this.animationId = setTimeout(() => this.animate(), 1000);
    }
}

class AboutCircleSystem extends AnimationSystem {
    constructor(container, maxCircles = 4) {
        super(container, AboutCircle, maxCircles, 3000);
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.container.classList.add('show');
        this.init();
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        this.container.classList.remove('show');
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
        this.cleanup();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.elements = this.elements.filter(e => e.element?.parentElement);
        
        if (this.elements.length < this.maxElements && Math.random() < 0.006) {
            this.createElement();
        }
        
        this.animationId = setTimeout(() => this.animate(), 2500);
    }
}

// ==========================================
// Global Instances
// ==========================================

let circleSystemInstance = null;
let symbolSystemInstance = null;
let aboutCircleSystemInstance = null;

// ==========================================
// Public Interface Functions
// ==========================================

function initMainPageAnimations() {
    const circlesContainer = document.getElementById('circles');
    const symbolsContainer = document.getElementById('symbols');
    
    if (circlesContainer && !circleSystemInstance) {
        circleSystemInstance = new CircleSystem(circlesContainer, 5);
        circleSystemInstance.start();
    }
    
    if (symbolsContainer && !symbolSystemInstance) {
        symbolSystemInstance = new SymbolSystem(symbolsContainer, 8);
        symbolSystemInstance.start();
    }
}

function stopMainPageAnimations() {
    circleSystemInstance?.stop();
    symbolSystemInstance?.stop();
}

function restartMainPageAnimations() {
    circleSystemInstance?.start();
    symbolSystemInstance?.start();
}

function initAboutPageAnimations() {
    const aboutCirclesContainer = document.getElementById('about-circles');
    
    if (aboutCirclesContainer && !aboutCircleSystemInstance) {
        aboutCircleSystemInstance = new AboutCircleSystem(aboutCirclesContainer, 4);
    }
}

function startAboutPageAnimations() {
    if (!aboutCircleSystemInstance) {
        initAboutPageAnimations();
    }
    aboutCircleSystemInstance?.start();
}

function stopAboutPageAnimations() {
    aboutCircleSystemInstance?.stop();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CircleSystem,
        SymbolSystem,
        AboutCircleSystem,
        initMainPageAnimations,
        stopMainPageAnimations,
        restartMainPageAnimations,
        initAboutPageAnimations,
        startAboutPageAnimations,
        stopAboutPageAnimations
    };
}
