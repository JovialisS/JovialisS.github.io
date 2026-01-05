/* --- START OF FILE toc-desktop.js --- */

export class TocDesktop {
  static options = {
    tocSelector: '#toc',
    contentSelector: '.content',
    ignoreSelector: '[data-toc-skip]',
    headingSelector: 'h2, h3, h4',
    orderedList: false,
    scrollSmooth: false, // 必须设为 false，禁用插件自带的滚动
    headingsOffset: 16 * 2, // 2rem
    
    // --- 修复核心代码 ---
    onClick: (e) => {
      e.preventDefault(); // 阻止浏览器默认跳转，由我们接管
      
      // 1. 确保获取到的是 A 标签（修复点击文字无效的问题）
      const link = e.target.closest('a');
      if (!link) return;

      // 2. 获取 href 属性
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      // 3. 处理 ID：解码并去掉 # 号
      // 例如 "#1-%E8..." -> "1-虚拟内存"
      const targetId = decodeURIComponent(href.substring(1));
      
      // 4. 使用 getElementById (它可以处理数字开头的 ID)
      const targetEl = document.getElementById(targetId);

      // 调试信息：请在浏览器 F12 Console 中查看
      console.log('点击目标 ID:', targetId);
      console.log('是否找到元素:', targetEl);

      if (targetEl) {
        // 5. 手动计算位置并滚动
        const offset = 16 * 2 + 10; // 顶部导航栏高度 + 留白
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetEl.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth" // 强制启用 JS 平滑滚动
        });
        
        // 更新 URL 栏的 hash，但不触发页面刷新
        history.pushState(null, null, href);
      } else {
        console.warn('无法找到 ID 为 ' + targetId + ' 的标题，请检查页面 HTML 源码中标题的 id 属性');
      }
    }
    // --- 修复结束 ---
  };

  static refresh() {
    tocbot.refresh(this.options);
  }

  static init() {
    tocbot.init(this.options);
  }
}