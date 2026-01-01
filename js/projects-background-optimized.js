/**
 * projects-background-optimized.js
 * Modern ES6+ Projects page background effects
 * Function curves and pixel effects with optimized performance
 */

// ==========================================
// Function Curve Class
// ==========================================

class FunctionCurve {
    constructor(canvas, color = 'rgba(100, 200, 255, 0.8)') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: true });
        this.color = color;
        this.width = 0;
        this.height = 0;
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }

    init() {
        this.resize();
        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);
        this.start();
    }

    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.color;
        this.ctx.globalAlpha = 0.6;

        // Draw multiple curves spanning entire interface
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            const offset = i * 0.8;
            const time = Date.now() * 0.001 + offset;
            const verticalOffset = (i - 2) * this.height * 0.15;

            for (let x = 0; x < this.width; x += 2) {
                const normalizedX = x / this.width;
                const y = this.height * 0.5 + verticalOffset +
                          Math.sin(normalizedX * 8 + time) * this.height * 0.15 +
                          Math.cos(normalizedX * 4 + time * 1.2) * this.height * 0.1 +
                          Math.sin(normalizedX * 2 + time * 0.6) * this.height * 0.08;
                
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }

            this.ctx.stroke();
        }

        this.ctx.globalAlpha = 1;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.stop();
        window.removeEventListener('resize', this.resizeHandler);
    }
}

// ==========================================
// Pixel Class
// ==========================================

class Pixel {
    constructor(container) {
        this.container = container;
        this.element = document.createElement('div');
        this.element.className = 'pixel';
        this.init();
    }

    init() {
        // Random position
        Object.assign(this.element.style, {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
        });
        
        // Random size
        const size = 1 + Math.random() * 3;
        this.element.style.width = `${size}px`;
        this.element.style.height = `${size}px`;
        
        // Random color
        const hue = 200 + Math.random() * 40;
        const alpha = 0.5 + Math.random() * 0.5;
        this.element.style.background = `hsla(${hue}, 70%, 60%, ${alpha})`;
        
        // Random animation duration
        this.duration = 1.5 + Math.random() * 2.5;
        this.element.style.animationDuration = `${this.duration}s`;
        
        this.container.appendChild(this.element);

        // Auto-remove after animation
        this.timeout = setTimeout(() => this.destroy(), this.duration * 1000);
    }

    destroy() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (this.element?.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
    }
}

// ==========================================
// Pixel System Class
// ==========================================

class PixelSystem {
    constructor(container, maxPixels = 15) {
        this.container = container;
        this.maxPixels = maxPixels;
        this.pixels = [];
        this.isRunning = false;
        this.animationId = null;
        
        this.init();
    }

    init() {
        // Initialize some pixels
        for (let i = 0; i < 5; i++) {
            this.createPixel();
        }
        
        this.start();
    }

    createPixel() {
        if (this.pixels.length >= this.maxPixels) return;

        const pixel = new Pixel(this.container);
        this.pixels.push(pixel);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        // Clean up destroyed pixels
        this.pixels = this.pixels.filter(p => p.element?.parentElement);
        
        // Randomly create new pixels
        if (Math.random() < 0.05) {
            this.createPixel();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.stop();
        this.pixels.forEach(pixel => pixel.destroy());
        this.pixels = [];
    }
}

// ==========================================
// Global Instances
// ==========================================

let pixelSystemInstance = null;
let curveInstances = [];

// ==========================================
// Public Interface Functions
// ==========================================

function initProjectsBackground() {
    // Initialize function curves - two canvases with different colors
    const curveTopLeft = document.getElementById('curve-top-left');
    const curveBottomRight = document.getElementById('curve-bottom-right');

    if (curveTopLeft && !curveInstances[0]) {
        curveInstances[0] = new FunctionCurve(curveTopLeft, 'rgba(100, 200, 255, 0.6)');
    }

    if (curveBottomRight && !curveInstances[1]) {
        curveInstances[1] = new FunctionCurve(curveBottomRight, 'rgba(150, 100, 255, 0.5)');
    }

    // Initialize pixel system
    const pixelsContainer = document.getElementById('pixels-container');
    if (pixelsContainer && !pixelSystemInstance) {
        pixelSystemInstance = new PixelSystem(pixelsContainer, 20);
    }
}

function startProjectsBackground() {
    initProjectsBackground();
}

function stopProjectsBackground() {
    // Stop and cleanup pixel system
    if (pixelSystemInstance) {
        pixelSystemInstance.destroy();
        pixelSystemInstance = null;
    }

    // Stop and cleanup curve instances
    curveInstances.forEach(instance => {
        if (instance) {
            instance.destroy();
        }
    });
    curveInstances = [];
}

// ==========================================
// Page Visibility Listener
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize when Projects page is shown
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active') && 
                mutation.target.id === 'projects-page') {
                setTimeout(initProjectsBackground, 100);
            }
        });
    });

    const projectsPage = document.getElementById('projects-page');
    if (projectsPage) {
        observer.observe(projectsPage, { attributes: true, attributeFilter: ['class'] });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FunctionCurve,
        PixelSystem,
        initProjectsBackground,
        startProjectsBackground,
        stopProjectsBackground
    };
}
