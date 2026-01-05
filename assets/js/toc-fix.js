(function() {
  console.log("ToC Fix Script Loaded"); // 调试用，确认脚本已加载

  function fixTocClick() {
    var toc = document.querySelector('#toc');
    if (!toc) return;

    // 使用捕获阶段监听，优先级高于 tocbot 插件
    toc.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      // 只拦截以 # 开头的内部链接
      if (!href || !href.startsWith('#')) return;

      // 1. 阻止默认行为（防止 tocbot 插件做错误处理）
      e.preventDefault();
      e.stopPropagation();

      // 2. 解码 URL (例如 "%E4%B8%AD" -> "中") 并去掉 #
      var targetId = decodeURIComponent(href.substring(1));
      
      // 3. 寻找目标元素
      // 优先尝试 getElementById (处理数字开头ID)
      var targetEl = document.getElementById(targetId);
      
      // 如果找不到，尝试通过 name 属性找（有些 Markdown 渲染器用 name）
      if (!targetEl) {
          targetEl = document.getElementsByName(targetId)[0];
      }

      if (targetEl) {
        // 4. 计算滚动位置 (减去顶部导航栏高度)
        var offset = 16 * 2 + 10; 
        var elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
        var offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // 更新浏览器地址栏，但不刷新
        history.pushState(null, null, href);
      } else {
        console.warn('无法找到 ID 为 [' + targetId + '] 的标题');
      }
    }, true); 
  }

  // 等待页面加载完成执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixTocClick);
  } else {
    fixTocClick();
  }
})();