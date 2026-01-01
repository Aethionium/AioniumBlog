/**
 * content-effects.js
 * Content页面背景装饰效果
 */

// ==========================================
// 粒子类
// ==========================================

class ContentParticle {
    constructor(container) {
        this.container = container;
        this.element = document.createElement('div');
        this.element.className = 'content-particle';
        this.init();
    }
    
    init() {
        // 随机位置
        this.element.style.left = `${Math.random() * 100}%`;
        this.element.style.bottom = '-10px';
        
        // 随机大小
        const size = 2 + Math.random() * 4;
        this.element.style.width = `${size}px`;
        this.element.style.height = `${size}px`;
        
        // 随机颜色
        const hue = 200 + Math.random() * 40;
        const alpha = 0.4 + Math.random() * 0.4;
        this.element.style.background = `hsla(${hue}, 70%, 60%, ${alpha})`;
        
        // 随机动画持续时间
        const duration = 12 + Math.random() * 8;
        this.element.style.animationDuration = `${duration}s`;
        this.element.style.animationDelay = `${Math.random() * 5}s`;
        
        this.container.appendChild(this.element);
        
        // 动画结束后移除
        this.timeout = setTimeout(() => {
            this.destroy();
        }, (duration + 5) * 1000);
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
// 粒子系统类
// ==========================================

class ContentParticleSystem {
    constructor(container, maxParticles = 12) {
        this.container = container;
        this.maxParticles = maxParticles;
        this.particles = [];
        this.isRunning = false;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // 初始化一些粒子
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 1000);
        }
        
        this.start();
    }
    
    createParticle() {
        if (this.particles.length >= this.maxParticles) return;
        
        const particle = new ContentParticle(this.container);
        this.particles.push(particle);
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
        
        // 清理已销毁的粒子
        this.particles = this.particles.filter(p => p.element?.parentElement);
        
        // 随机创建新粒子
        if (Math.random() < 0.02 && this.particles.length < this.maxParticles) {
            this.createParticle();
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
// 全局实例
// ==========================================

let particleSystemInstance = null;

// ==========================================
// 公共接口
// ==========================================

function initContentEffects() {
    const decorationContainer = document.getElementById('content-decoration');
    
    if (decorationContainer && !particleSystemInstance) {
        particleSystemInstance = new ContentParticleSystem(decorationContainer, 15);
    }
}

function stopContentEffects() {
    if (particleSystemInstance) {
        particleSystemInstance.destroy();
        particleSystemInstance = null;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ContentParticleSystem,
        initContentEffects,
        stopContentEffects
    };
}
