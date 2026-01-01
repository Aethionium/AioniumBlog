// ==========================================
// 工具函数模块 - 现代化优化版本
// ==========================================

/**
 * 本地存储管理器
 * 使用现代化的API封装localStorage操作
 */
const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item !== null ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    },
    
    clear() {
        localStorage.clear();
    }
};

/**
 * DOM操作辅助函数
 */
const DOM = {
    // 查询单个元素
    $(selector, context = document) {
        return context.querySelector(selector);
    },
    
    // 查询多个元素
    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },
    
    // 添加类
    addClass(element, ...classes) {
        if (element) element.classList.add(...classes);
    },
    
    // 移除类
    removeClass(element, ...classes) {
        if (element) element.classList.remove(...classes);
    },
    
    // 切换类
    toggleClass(element, className, force) {
        if (element) return element.classList.toggle(className, force);
    },
    
    // 检查是否有类
    hasClass(element, className) {
        return element?.classList.contains(className) ?? false;
    },
    
    // 设置属性
    setAttr(element, attrs) {
        if (!element) return;
        Object.entries(attrs).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    },
    
    // 设置样式
    setStyle(element, styles) {
        if (!element) return;
        Object.assign(element.style, styles);
    }
};

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 等待DOM元素出现
 * @param {string} selector - CSS选择器
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<Element>}
 */
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = DOM.$(selector);
        if (element) return resolve(element);
        
        const observer = new MutationObserver(() => {
            const element = DOM.$(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

/**
 * 动画帧请求包装
 * @param {Function} callback - 回调函数
 * @returns {number} 请求ID
 */
function nextFrame(callback) {
    return requestAnimationFrame(() => {
        requestAnimationFrame(callback);
    });
}

/**
 * 检查元素是否在视口中
 * @param {Element} element - 要检查的元素
 * @param {number} offset - 偏移量
 * @returns {boolean}
 */
function isInViewport(element, offset = 0) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.left >= -offset &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
    );
}

/**
 * 平滑滚动到元素
 * @param {Element|string} target - 目标元素或选择器
 * @param {Object} options - 滚动选项
 */
function scrollToElement(target, options = {}) {
    const element = typeof target === 'string' ? DOM.$(target) : target;
    if (!element) return;
    
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        ...options
    });
}

/**
 * 事件委托
 * @param {Element} parent - 父元素
 * @param {string} selector - 子元素选择器
 * @param {string} event - 事件类型
 * @param {Function} handler - 事件处理函数
 */
function delegate(parent, selector, event, handler) {
    parent.addEventListener(event, (e) => {
        const target = e.target.closest(selector);
        if (target) {
            handler.call(target, e);
        }
    });
}

/**
 * 加载图片
 * @param {string} src - 图片URL
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * 预加载多个图片
 * @param {string[]} urls - 图片URL数组
 * @returns {Promise<HTMLImageElement[]>}
 */
function preloadImages(urls) {
    return Promise.all(urls.map(loadImage));
}

// 导出所有工具
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Storage,
        DOM,
        debounce,
        throttle,
        waitForElement,
        nextFrame,
        isInViewport,
        scrollToElement,
        delegate,
        loadImage,
        preloadImages
    };
}
