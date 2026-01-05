/* --- START OF FILE toc-desktop.js --- */

export class TocDesktop {
  /* Tocbot options Ref: https://github.com/tscanlin/tocbot#usage */
  static options = {
    tocSelector: '#toc',
    contentSelector: '.content',
    ignoreSelector: '[data-toc-skip]',
    headingSelector: 'h2, h3, h4',
    orderedList: false,
    scrollSmooth: false, // 保持关闭，由下方 onClick 接管
    headingsOffset: 16 * 2, // 2rem
    
    // --- 新增修复代码开始 ---
    onClick: (e) => {
      e.preventDefault(); // 阻止默认行为
      const target = e.target;
      const href = target.getAttribute('href');
      if (!href) return;

      // 关键：强制解码 (例如将 "%E4%B8%AD" 转为 "中")
      // 并去掉开头的 # 号
      const targetId = decodeURIComponent(href).substring(1);
      
      // 尝试获取目标元素
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        // 计算滚动位置，减去顶部导航栏的高度 (约 2rem + 额外留白)
        const offset = 16 * 2 + 10; 
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetEl.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // 可选：更新 URL hash，不触发跳转
        history.pushState(null, null, href);
      }
    }
    // --- 新增修复代码结束 ---
  };

  static refresh() {
    tocbot.refresh(this.options);
  }

  static init() {
    tocbot.init(this.options);
  }
}