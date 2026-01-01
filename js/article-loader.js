/**
 * article-loader.js
 * 文章加载和显示系统
 */

// 文章数据库
const articles = {
    'empowering-innovation': {
        title: {
            en: 'Empowering Innovation',
            zh: '赋能创新'
        },
        date: '2026-01-02',
        category: {
            en: 'Innovation',
            zh: '创新'
        },
        status: 'wip',
        content: {
            en: `
                <div class="wip-notice">
                    <div class="wip-icon">🚧</div>
                    <h2>
                        <span class="wip-title-en active">Work in Progress</span>
                        <span class="wip-title-zh">正在制作</span>
                    </h2>
                    <p>
                        <span class="wip-text-en active">This article is currently being written. Please check back later for the full content.</span>
                        <span class="wip-text-zh">本文章正在撰写中，请稍后查看完整内容。</span>
                    </p>
                </div>
            `,
            zh: `
                <div class="wip-notice">
                    <div class="wip-icon">🚧</div>
                    <h2>
                        <span class="wip-title-en">Work in Progress</span>
                        <span class="wip-title-zh active">正在制作</span>
                    </h2>
                    <p>
                        <span class="wip-text-en">This article is currently being written. Please check back later for the full content.</span>
                        <span class="wip-text-zh active">本文章正在撰写中，请稍后查看完整内容。</span>
                    </p>
                </div>
            `
        }
    }
};

// 获取URL参数
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 加载文章
function loadArticle() {
    const articleId = getUrlParameter('id');
    const articleContainer = document.getElementById('article-content');
    
    if (!articleId || !articles[articleId]) {
        // 文章不存在
        articleContainer.innerHTML = `
            <div class="article-header">
                <h1 class="article-title">
                    <span class="title-en active">Article Not Found</span>
                    <span class="title-zh">文章未找到</span>
                </h1>
            </div>
            <div class="article-body">
                <p>
                    <span class="text-en active">Sorry, the article you're looking for doesn't exist.</span>
                    <span class="text-zh">抱歉，您查找的文章不存在。</span>
                </p>
            </div>
        `;
        return;
    }
    
    const article = articles[articleId];
    const isEnglish = localStorage.getItem('isEnglish') !== 'false';
    const lang = isEnglish ? 'en' : 'zh';
    
    // 构建文章HTML
    const articleHTML = `
        <div class="article-header">
            <h1 class="article-title">${isEnglish ? article.title.en : article.title.zh}</h1>
            <div class="article-meta">
                <span>📅 ${article.date}</span>
                <span>📁 ${isEnglish ? article.category.en : article.category.zh}</span>
                ${article.status === 'wip' ? `
                    <span class="status-badge status-wip">
                        <span class="badge-en ${isEnglish ? 'active' : ''}">WIP</span>
                        <span class="badge-zh ${!isEnglish ? 'active' : ''}">制作中</span>
                    </span>
                ` : ''}
            </div>
        </div>
        <div class="article-body">
            ${article.content[lang]}
        </div>
    `;
    
    articleContainer.innerHTML = articleHTML;
    
    // 更新页面标题
    document.title = `${isEnglish ? article.title.en : article.title.zh} - Aionium Blog`;
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', () => {
    loadArticle();
    
    // 监听语言切换
    window.addEventListener('storage', (e) => {
        if (e.key === 'isEnglish') {
            loadArticle();
        }
    });
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { articles, loadArticle };
}
