// ==========================================
// 页面切换系统 - 优化版本
// ==========================================

/**
 * 页面切换管理器
 * 使用现代化的类和Promise
 */
class PageTransition {
    constructor(options = {}) {
        this.duration = options.duration || 100;
        this.transitionClass = 'transitioning';
        this.noScrollClass = 'no-scroll';
        this.contentSelectors = ['.home-content', '.about-content', '.projects-content'];
        
        this.init();
    }
    
    init() {
        this.setupHeader();
        this.setupScrollbar();
        this.setupNavigation();
    }
    
    // 设置标题栏
    setupHeader() {
        const header = DOM.$('.header');
        if (header) {
            DOM.setStyle(header, {
                animation: 'none',
                opacity: '1'
            });
        }
    }
    
    // 设置滚动条
    setupScrollbar() {
        // 移除transitioning类
        DOM.removeClass(document.body, this.transitionClass);
        
        // 延迟检查滚动条
        setTimeout(() => this.checkScrollbar(), 50);
        
        // 监听窗口大小变化
        window.addEventListener('resize', debounce(() => {
            this.checkScrollbar();
        }, 100));
    }
    
    // 检查是否需要滚动条
    checkScrollbar() {
        nextFrame(() => {
            const needsScroll = document.documentElement.scrollHeight > window.innerHeight + 5;
            DOM.toggleClass(document.body, this.noScrollClass, !needsScroll);
        });
    }
    
    // 设置导航
    setupNavigation() {
        const links = DOM.$$('.nav-link, .logo');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });
    }
    
    // 处理导航点击
    handleNavClick(e, link) {
        const href = link.getAttribute('href');
        
        // 验证链接
        if (!this.isValidLink(href)) {
            e.preventDefault();
            return;
        }
        
        // 阻止默认行为
        e.preventDefault();
        
        // 执行切换
        this.transition(href);
    }
    
    // 验证链接
    isValidLink(href) {
        if (!href || href === '#') return false;
        if (href.startsWith('http')) return false;
        if (href === window.location.pathname.split('/').pop()) return false;
        return true;
    }
    
    // 执行切换
    async transition(href) {
        // 添加transitioning类
        DOM.addClass(document.body, this.transitionClass);
        
        // 播放退出动画
        await this.playExitAnimation();
        
        // 跳转页面
        window.location.href = href;
    }
    
    // 播放退出动画
    playExitAnimation() {
        return new Promise(resolve => {
            const contentAreas = DOM.$$(this.contentSelectors.join(', '));
            
            contentAreas.forEach(area => {
                DOM.setStyle(area, {
                    animation: 'pageExit 0.1s ease-in forwards'
                });
            });
            
            setTimeout(resolve, this.duration);
        });
    }
}

/**
 * 滚动条管理器
 * 独立管理滚动条显示逻辑
 */
class ScrollbarManager {
    constructor() {
        this.threshold = 5; // 容差值
        this.init();
    }
    
    init() {
        this.check();
        window.addEventListener('resize', debounce(() => this.check(), 100));
        window.addEventListener('load', () => this.check());
    }
    
    check() {
        nextFrame(() => {
            const needsScroll = this.needsScrollbar();
            DOM.toggleClass(document.body, 'no-scroll', !needsScroll);
        });
    }
    
    needsScrollbar() {
        return document.documentElement.scrollHeight > window.innerHeight + this.threshold;
    }
    
    hide() {
        DOM.addClass(document.body, 'transitioning');
    }
    
    show() {
        DOM.removeClass(document.body, 'transitioning');
        this.check();
    }
}

// 自动初始化
if (typeof window !== 'undefined') {
    let pageTransition;
    let scrollbarManager;
    
    const initTransition = () => {
        pageTransition = new PageTransition();
        scrollbarManager = new ScrollbarManager();
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTransition);
    } else {
        initTransition();
    }
}
