/**
 * avatar-effects-optimized.js
 * Modern ES6+ avatar border effects with audio visualization
 * Optimized with better performance and cleaner code
 */

// ==========================================
// Avatar Border Effect Class
// ==========================================

class AvatarBorderEffect {
    constructor(container) {
        this.container = container;
        this.radius = 90;
        this.segmentCount = 80;
        this.segmentWidth = 4;
        this.segmentHeight = 4;
        this.waveSegments = [];
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.isAudioActive = false;
        this.rotationSpeed = 0.35;
        this.baseWaveAmplitude = 12;
        this.audioWaveAmplitude = 20;
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    async init() {
        this.addWaveStyles();
        this.createWaveSegments();
        await this.initAudio();
        this.start();
    }
    
    createWaveSegments() {
        for (let i = 0; i < this.segmentCount; i++) {
            const segment = this.createSegment(i);
            this.container.appendChild(segment.element);
            this.waveSegments.push(segment);
        }
    }
    
    createSegment(index) {
        const element = document.createElement('div');
        element.className = 'wave-segment';
        
        const angle = (index / this.segmentCount) * Math.PI * 2;
        const x = Math.cos(angle) * this.radius;
        const y = Math.sin(angle) * this.radius;
        
        const hue = (index / this.segmentCount) * 360;
        const saturation = 75;
        const lightness = 60;
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        Object.assign(element.style, {
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}aa, 0 0 15px ${color}66`,
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            transform: `translate(-50%, -50%) rotate(${angle}rad)`
        });
        
        return {
            element,
            angle,
            baseRadius: this.radius,
            currentRadius: this.radius,
            targetRadius: this.radius,
            velocity: 0,
            x,
            y,
            hue,
            saturation,
            lightness,
            originalIndex: index
        };
    }
    
    addWaveStyles() {
        if (document.getElementById('wave-segment-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'wave-segment-styles';
        style.textContent = `
            .wave-segment {
                position: absolute;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                transform-origin: center;
                transition: background-color 0.15s ease, box-shadow 0.15s ease;
                pointer-events: none;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
    }
    
    async initAudio() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ 
                video: false,
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length === 0) {
                throw new Error('No desktop audio track available');
            }
            
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 128;
            this.analyser.smoothingTimeConstant = 0.85;
            
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.isAudioActive = true;
            
            console.log('Desktop audio capture initialized');
        } catch (error) {
            console.log('Audio access not available, using default animation');
            this.isAudioActive = false;
        }
    }
    
    updateSegmentWithAudio(segment, index, time, rotationOffset) {
        const rotatedAngle = segment.angle + rotationOffset;
        
        // Audio data mapping
        const dataIndex = Math.floor((index / this.segmentCount) * this.dataArray.length);
        const audioValue = this.dataArray[dataIndex] || 0;
        const radiusChange = (audioValue / 255) * this.audioWaveAmplitude;
        
        // Multi-layer base waves
        const baseWave1 = Math.sin(time * 2.2 + index * 0.15) * 8;
        const baseWave2 = Math.cos(time * 1.6 + index * 0.12) * 6;
        const baseWave3 = Math.sin(time * 3.0 + index * 0.08) * 4;
        
        segment.targetRadius = segment.baseRadius + radiusChange + baseWave1 + baseWave2 + baseWave3;
        
        // Spring physics
        const spring = 0.18;
        const damping = 0.72;
        segment.velocity += (segment.targetRadius - segment.currentRadius) * spring;
        segment.velocity *= damping;
        segment.currentRadius += segment.velocity;
        
        // Clamp radius
        segment.currentRadius = Math.max(
            segment.baseRadius - 10, 
            Math.min(segment.baseRadius + 35, segment.currentRadius)
        );
        
        // Update position
        const x = Math.cos(rotatedAngle) * segment.currentRadius;
        const y = Math.sin(rotatedAngle) * segment.currentRadius;
        
        segment.element.style.left = `calc(50% + ${x}px)`;
        segment.element.style.top = `calc(50% + ${y}px)`;
        
        // Audio-responsive color
        const intensity = audioValue / 255;
        const lightness = Math.min(95, segment.lightness + intensity * 30);
        const saturation = Math.min(100, segment.saturation + intensity * 20);
        const color = `hsl(${segment.hue}, ${saturation}%, ${lightness}%)`;
        
        segment.element.style.backgroundColor = color;
        segment.element.style.boxShadow = `0 0 ${10 + intensity * 15}px ${color}dd, 0 0 ${20 + intensity * 25}px ${color}77`;
    }
    
    updateSegmentDefault(segment, index, time, rotatedAngle) {
        // Multi-layer waves
        const wave1 = Math.sin(time * 1.8 + index * 0.15) * 11;
        const wave2 = Math.cos(time * 2.3 + index * 0.12) * 8;
        const wave3 = Math.sin(time * 1.4 + index * 0.18) * 6;
        const wave4 = Math.cos(time * 2.8 + index * 0.10) * 4;
        
        segment.targetRadius = segment.baseRadius + wave1 + wave2 + wave3 + wave4;
        
        // Spring physics
        const spring = 0.14;
        const damping = 0.78;
        segment.velocity += (segment.targetRadius - segment.currentRadius) * spring;
        segment.velocity *= damping;
        segment.currentRadius += segment.velocity;
        
        // Clamp radius
        segment.currentRadius = Math.max(
            segment.baseRadius - 8, 
            Math.min(segment.baseRadius + 25, segment.currentRadius)
        );
        
        // Update position
        const x = Math.cos(rotatedAngle) * segment.currentRadius;
        const y = Math.sin(rotatedAngle) * segment.currentRadius;
        
        segment.element.style.left = `calc(50% + ${x}px)`;
        segment.element.style.top = `calc(50% + ${y}px)`;
        
        // Keep original color
        const color = `hsl(${segment.hue}, ${segment.saturation}%, ${segment.lightness}%)`;
        segment.element.style.backgroundColor = color;
        segment.element.style.boxShadow = `0 0 8px ${color}aa, 0 0 15px ${color}66`;
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
        
        const time = Date.now() * 0.001;
        const rotationOffset = time * this.rotationSpeed;
        
        if (this.isAudioActive && this.analyser && this.dataArray) {
            this.analyser.getByteFrequencyData(this.dataArray);
            
            this.waveSegments.forEach((segment, index) => {
                this.updateSegmentWithAudio(segment, index, time, rotationOffset);
            });
        } else {
            this.waveSegments.forEach((segment, index) => {
                const rotatedAngle = segment.angle + rotationOffset;
                this.updateSegmentDefault(segment, index, time, rotatedAngle);
            });
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        this.stop();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.waveSegments.forEach(segment => {
            if (segment.element.parentElement) {
                segment.element.parentElement.removeChild(segment.element);
            }
        });
        
        this.waveSegments = [];
    }
}

// ==========================================
// Public Interface
// ==========================================

let avatarEffectInstance = null;

function initAvatarEffects() {
    const avatarBorder = document.getElementById('avatar-border');
    if (avatarBorder && !avatarBorder.dataset.initialized) {
        avatarBorder.dataset.initialized = 'true';
        avatarEffectInstance = new AvatarBorderEffect(avatarBorder);
    }
}

function destroyAvatarEffects() {
    if (avatarEffectInstance) {
        avatarEffectInstance.destroy();
        avatarEffectInstance = null;
    }
}

// Auto-initialize on About page
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active') && 
                mutation.target.id === 'about-page') {
                setTimeout(initAvatarEffects, 100);
            }
        });
    });
    
    const aboutPage = document.getElementById('about-page');
    if (aboutPage) {
        observer.observe(aboutPage, { attributes: true, attributeFilter: ['class'] });
        
        if (aboutPage.classList.contains('active')) {
            setTimeout(initAvatarEffects, 100);
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AvatarBorderEffect, initAvatarEffects, destroyAvatarEffects };
}
