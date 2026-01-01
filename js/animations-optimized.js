/**
 * animations-optimized.js
 * Modern ES6+ animation classes for Aionium Blog
 * Optimized with better performance and cleaner code
 */

// ==========================================
// Wave Animation Class
// ==========================================

class Wave {
    constructor(canvas, color = 'rgba(100, 200, 255, 0.6)') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: true });
        this.color = color;
        this.waves = [];
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);
        
        // Initialize wave parameters
        for (let i = 0; i < 2; i++) {
            this.waves.push({
                amplitude: 15 + Math.random() * 15,
                frequency: 0.01 + Math.random() * 0.015,
                phase: Math.random() * Math.PI * 2,
                speed: 0.015 + Math.random() * 0.025,
                opacity: 0.4 + Math.random() * 0.3
            });
        }
        
        this.start();
    }
    
    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.waves.forEach((wave) => {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.height);
            
            for (let x = 0; x < this.width; x++) {
                const baseWave = Math.sin(x * wave.frequency + wave.phase) * wave.amplitude;
                const noiseWave = Math.sin(x * (wave.frequency * 2) + wave.phase * 1.5) * (wave.amplitude * 0.2);
                const y = baseWave + noiseWave + this.height * 0.8;
                this.ctx.lineTo(x, y);
            }
            
            this.ctx.lineTo(this.width, this.height);
            this.ctx.closePath();
            
            const gradient = this.ctx.createLinearGradient(0, this.height, 0, 0);
            gradient.addColorStop(0, this.color.replace('0.6', wave.opacity.toString()));
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            wave.phase += wave.speed;
        });
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
// Floating Text Effect Class
// ==========================================

class FloatingText {
    constructor(element) {
        this.element = element;
        this.init();
    }
    
    init() {
        const text = this.element.textContent;
        this.element.innerHTML = '';
        
        Object.assign(this.element.style, {
            fontSize: '4rem',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            position: 'relative',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: 'normal'
        });
        
        this.addAnimationStyles();
        
        text.split('').forEach((char, i) => {
            const charSpan = this.createCharSpan(char, i);
            this.element.appendChild(charSpan);
        });
    }
    
    createCharSpan(char, index) {
        const span = document.createElement('span');
        span.textContent = char;
        
        Object.assign(span.style, {
            display: 'inline-block',
            position: 'relative'
        });
        
        const delay = Math.random() * 0.3;
        const duration = 1.5 + Math.random() * 1.5;
        const motionType = Math.floor(Math.random() * 3);
        
        const leftAmount = 15 + Math.random() * 20;
        const topAmount = 10 + Math.random() * 15;
        const scaleAmount = 0.9 + Math.random() * 0.2;
        
        span.style.setProperty('--left-amount', `${leftAmount}px`);
        span.style.setProperty('--top-amount', `-${topAmount}px`);
        span.style.setProperty('--scale-amount', scaleAmount.toString());
        span.style.animation = `motionType${motionType} ${duration}s ease-in-out ${delay}s infinite, scaleChar ${duration}s ease-in-out ${delay}s infinite`;
        
        return span;
    }
    
    addAnimationStyles() {
        if (document.getElementById('floating-text-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'floating-text-styles';
        style.textContent = `
            @keyframes motionType0 {
                0% { transform: translate(0px, 0px); }
                25% { transform: translate(var(--left-amount), 0px); }
                50% { transform: translate(var(--left-amount), var(--top-amount)); }
                75% { transform: translate(0px, var(--top-amount)); }
                100% { transform: translate(0px, 0px); }
            }
            @keyframes motionType1 {
                0% { transform: translate(0px, 0px); }
                25% { transform: translate(var(--left-amount), calc(var(--top-amount) / 2)); }
                50% { transform: translate(0px, var(--top-amount)); }
                75% { transform: translate(calc(var(--left-amount) * -1), calc(var(--top-amount) / 2)); }
                100% { transform: translate(0px, 0px); }
            }
            @keyframes motionType2 {
                0% { transform: translate(0px, 0px); }
                25% { transform: translate(var(--left-amount), var(--top-amount)); }
                50% { transform: translate(calc(var(--left-amount) * -1), calc(var(--top-amount) * -1)); }
                75% { transform: translate(calc(var(--left-amount) / 2), calc(var(--top-amount) / 2)); }
                100% { transform: translate(0px, 0px); }
            }
            @keyframes scaleChar {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(var(--scale-amount)); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================
// Particle Class
// ==========================================

class Particle {
    static characters = '+-.*&%';
    
    constructor(container) {
        this.container = container;
        this.element = document.createElement('div');
        this.init();
    }
    
    init() {
        Object.assign(this.element.style, {
            position: 'absolute',
            color: `rgba(100, 200, 255, ${0.3 + Math.random() * 0.5})`,
            fontSize: `${10 + Math.random() * 14}px`,
            fontWeight: 'bold',
            pointerEvents: 'none',
            userSelect: 'none'
        });
        
        this.x = Math.random() * this.container.offsetWidth;
        this.y = Math.random() * this.container.offsetHeight;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        
        this.updateCharacter();
        this.updateTime = Math.random() * 1500 + 800;
        this.lastUpdate = Date.now();
        this.life = Math.random() * 4000 + 3000;
        this.birth = Date.now();
        
        this.container.appendChild(this.element);
        this.animate();
    }
    
    updateCharacter() {
        this.element.textContent = Particle.characters[Math.floor(Math.random() * Particle.characters.length)];
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off walls
        if (this.x < 0 || this.x > this.container.offsetWidth) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(this.x, this.container.offsetWidth));
        }
        if (this.y < 0 || this.y > this.container.offsetHeight) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(this.y, this.container.offsetHeight));
        }
        
        // Update character periodically
        if (Date.now() - this.lastUpdate > this.updateTime) {
            this.updateCharacter();
            this.lastUpdate = Date.now();
            this.updateTime = Math.random() * 1500 + 800;
        }
        
        // Fade out based on age
        const age = Date.now() - this.birth;
        const opacity = 1 - (age / this.life);
        this.element.style.opacity = opacity.toString();
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        
        return opacity > 0;
    }
    
    animate() {
        if (this.update()) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.destroy();
        }
    }
    
    destroy() {
        if (this.element.parentElement) {
            this.container.removeChild(this.element);
        }
    }
}

// ==========================================
// Particle System Class
// ==========================================

class ParticleSystem {
    constructor(container, count = 15) {
        this.container = container;
        this.count = count;
        this.particles = [];
        this.isRunning = false;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.count; i++) {
            setTimeout(() => {
                if (this.isRunning) {
                    this.particles.push(new Particle(this.container));
                }
            }, i * 150);
        }
        
        this.start();
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
        
        this.particles = this.particles.filter(p => p.element.parentElement);
        
        if (this.particles.length < this.count && Math.random() < 0.3) {
            this.particles.push(new Particle(this.container));
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        this.stop();
        this.particles.forEach(p => p.destroy());
        this.particles = [];
    }
}

// ==========================================
// Ball Class
// ==========================================

class Ball {
    constructor(container, size, x, y) {
        this.container = container;
        this.element = document.createElement('div');
        this.size = size;
        this.x = x;
        this.y = y;
        this.riseSpeed = 0.3 + Math.random() * 0.3;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        Object.assign(this.element.style, {
            position: 'absolute',
            width: `${this.size}px`,
            height: `${this.size}px`,
            borderRadius: '50%',
            background: 'rgba(100, 200, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            opacity: '0',
            left: `${this.x}px`,
            top: `${this.y}px`
        });
        
        this.container.appendChild(this.element);
        
        // Delayed fade-in
        setTimeout(() => {
            this.element.style.transition = 'opacity 0.5s ease';
            this.element.style.opacity = '0.3';
        }, 50);
        
        this.animate();
    }
    
    animate() {
        this.y -= this.riseSpeed;
        this.element.style.top = `${this.y}px`;
        
        // Fade out at top
        const containerHeight = this.container.offsetHeight;
        if (this.y < containerHeight * 0.2) {
            const fadeProgress = this.y / (containerHeight * 0.2);
            this.element.style.opacity = Math.max(0, fadeProgress * 0.3).toString();
        }
        
        if (this.y < -this.size) {
            this.destroy();
            return;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.element.parentElement) {
            this.container.removeChild(this.element);
        }
    }
}

// ==========================================
// Ball System Class
// ==========================================

class BallSystem {
    constructor(container, maxBalls = 3) {
        this.container = container;
        this.maxBalls = maxBalls;
        this.balls = [];
        this.isActive = true;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        const initialCount = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => this.createBall(), i * 1000);
        }
        
        this.animate();
    }
    
    isOverlapping(newBallX, newBallY, newBallSize) {
        return this.balls.some(ball => {
            const dx = newBallX - ball.x;
            const dy = newBallY - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (newBallSize + ball.size) / 2 + 50;
            return distance < minDistance;
        });
    }
    
    createBall() {
        if (this.balls.length >= this.maxBalls || !this.isActive) return;
        
        const size = 80 + Math.random() * 150;
        let attempts = 0;
        let x, y, overlapping;
        
        do {
            x = Math.random() * this.container.offsetWidth;
            y = this.container.offsetHeight + size + 50;
            overlapping = this.isOverlapping(x, y, size);
            attempts++;
        } while (overlapping && attempts < 20);
        
        if (!overlapping) {
            const ball = new Ball(this.container, size, x, y);
            this.balls.push(ball);
        }
    }
    
    stop() {
        this.isActive = false;
    }
    
    start() {
        this.isActive = true;
    }
    
    animate() {
        if (this.isActive) {
            this.balls = this.balls.filter(b => b.element.parentElement);
            
            if (this.balls.length < this.maxBalls && Math.random() < 0.003) {
                this.createBall();
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        this.stop();
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.balls.forEach(b => b.destroy());
        this.balls = [];
    }
}

// Export classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Wave, FloatingText, Particle, ParticleSystem, Ball, BallSystem };
}
