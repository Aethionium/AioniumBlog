// ==========================================
// UI控制系统 - 优化版本
// ==========================================

/**
 * 主题管理器
 * 使用单例模式管理主题状态
 */
const ThemeManager = (() => {
    const STORAGE_KEY = 'isDarkMode';
    const DARK_CLASS = 'dark-mode';
    
    let isDark = false;
    
    // 初始化主题
    function init() {
        isDark = Storage.get(STORAGE_KEY, false);
        applyTheme(isDark);
        
        const btn = DOM.$('#theme-switch');
        if (btn) {
            btn.addEventListener('click', toggle);
        }
    }
    
    // 应用主题
    function applyTheme(dark) {
        const elements = [document.documentElement, document.body];
        elements.forEach(el => DOM.toggleClass(el, DARK_CLASS, dark));
    }
    
    // 切换主题
    function toggle() {
        isDark = !isDark;
        applyTheme(isDark);
        Storage.set(STORAGE_KEY, isDark);
    }
    
    // 获取当前主题
    function getCurrent() {
        return isDark ? 'dark' : 'light';
    }
    
    return { init, toggle, getCurrent };
})();

/**
 * 语言管理器
 * 使用单例模式管理语言状态
 */
const LanguageManager = (() => {
    const STORAGE_KEY = 'isEnglish';
    const ACTIVE_CLASS = 'active';
    
    let isEnglish = true;
    
    // 语言配置映射
    const selectors = {
        // About页面
        aboutIntro: { en: '.about-intro-en', zh: '.about-intro-zh' },
        aboutTitle: '.about-content .main-title',
        dialogTitle: { en: '.dialog-title-en', zh: '.dialog-title-zh' },
        dialogText: { en: '.dialog-text-en', zh: '.dialog-text-zh' },
        
        // Projects页面
        projectsTitle: '.projects-content .main-title',
        projectsIntro: { en: '.projects-intro-en', zh: '.projects-intro-zh' },
        projectTitle: { en: '.project-title-en', zh: '.project-title-zh' },
        projectDesc: { en: '.project-description-en', zh: '.project-description-zh' },
        
        // Content页面
        contentTitle: { en: '.content-page .title-en', zh: '.content-page .title-zh' },
        contentIntro: { en: '.content-intro .intro-en', zh: '.content-intro .intro-zh' },
        articleCategory: { en: '.article-category .category-en', zh: '.article-category .category-zh' },
        statusBadge: { en: '.status-badge .badge-en', zh: '.status-badge .badge-zh' },
        articleTitleSpan: { en: '.article-title .article-title-en', zh: '.article-title .article-title-zh' },
        articleExcerpt: { en: '.article-excerpt .excerpt-en', zh: '.article-excerpt .excerpt-zh' },
        readMoreBtn: { en: '.read-more-btn .btn-text-en', zh: '.read-more-btn .btn-text-zh' },
        
        // Article页面
        backBtn: { en: '.back-btn .back-text-en', zh: '.back-btn .back-text-zh' },
        wipTitle: { en: '.wip-title-en', zh: '.wip-title-zh' },
        wipText: { en: '.wip-text-en', zh: '.wip-text-zh' }
    };
    
    // 文本内容映射
    const texts = {
        aboutTitle: { en: 'About Me', zh: '关于我' },
        projectsTitle: { en: 'My Projects', zh: '我的项目' }
    };
    
    // 初始化语言
    function init() {
        isEnglish = Storage.get(STORAGE_KEY, true);
        updateDisplay();
        
        const btn = DOM.$('#lang-switch');
        if (btn) {
            btn.addEventListener('click', toggle);
        }
    }
    
    // 更新显示
    function updateDisplay() {
        // 切换双语元素
        Object.entries(selectors).forEach(([key, value]) => {
            if (typeof value === 'object' && value.en && value.zh) {
                toggleBilingual(value.en, value.zh);
            }
        });
        
        // 更新文本内容
        updateText(selectors.aboutTitle, texts.aboutTitle);
        updateText(selectors.projectsTitle, texts.projectsTitle);
    }
    
    // 切换双语元素
    function toggleBilingual(enSelector, zhSelector) {
        const enElements = DOM.$$(enSelector);
        const zhElements = DOM.$$(zhSelector);
        
        enElements.forEach(el => DOM.toggleClass(el, ACTIVE_CLASS, isEnglish));
        zhElements.forEach(el => DOM.toggleClass(el, ACTIVE_CLASS, !isEnglish));
    }
    
    // 更新文本
    function updateText(selector, textMap) {
        const element = DOM.$(selector);
        if (element && textMap) {
            element.textContent = isEnglish ? textMap.en : textMap.zh;
        }
    }
    
    // 切换语言
    function toggle() {
        isEnglish = !isEnglish;
        updateDisplay();
        Storage.set(STORAGE_KEY, isEnglish);
    }
    
    // 获取当前语言
    function getCurrent() {
        return isEnglish ? 'en' : 'zh';
    }
    
    return { init, toggle, getCurrent, updateDisplay };
})();

/**
 * 打字机效果
 * 使用现代化的Promise和async/await
 */
class Typewriter {
    constructor(element, options = {}) {
        this.element = element;
        this.texts = options.texts || [];
        this.typeSpeed = options.typeSpeed || 30;
        this.deleteSpeed = options.deleteSpeed || 15;
        this.pauseTime = options.pauseTime || 2000;
        this.currentIndex = 0;
        this.isRunning = false;
    }
    
    async type(text) {
        for (const char of text) {
            this.element.textContent += char;
            await this.wait(this.typeSpeed);
        }
    }
    
    async delete(text) {
        for (let i = text.length; i > 0; i--) {
            this.element.textContent = text.substring(0, i - 1);
            await this.wait(this.deleteSpeed);
        }
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async start() {
        if (this.isRunning || this.texts.length === 0) return;
        
        this.isRunning = true;
        
        while (this.isRunning) {
            const text = this.texts[this.currentIndex];
            
            await this.type(text);
            await this.wait(this.pauseTime);
            await this.delete(text);
            await this.wait(500);
            
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
        }
    }
    
    stop() {
        this.isRunning = false;
    }
}

/**
 * 初始化打字机效果
 */
function initTypewriter() {
    const element = DOM.$('#subtitle');
    if (!element) return;
    
    const quotes = [
        "AI is the new electricity.",
        "Code is the language of the future.",
        "Machine learning is the new revolution.",
        "AI engineers shape tomorrow's world.",
        "Data is the fuel for AI innovation.",
        "Algorithms power intelligent systems.",
        "AI enhances human potential.",
        "Coding bridges imagination and reality.",
        "AI transforms challenges into opportunities.",
        "Engineers turn ideas into intelligent solutions."
    ];
    
    const typewriter = new Typewriter(element, {
        texts: quotes,
        typeSpeed: 30,
        deleteSpeed: 15,
        pauseTime: 2000
    });
    
    // 延迟启动
    setTimeout(() => typewriter.start(), 1000);
}

/**
 * 统一初始化函数
 */
function initUIControls() {
    ThemeManager.init();
    LanguageManager.init();
}

// 自动初始化（如果在浏览器环境）
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUIControls);
    } else {
        initUIControls();
    }
}
