(function() {
  console.log("ToC Fix Script Loaded (Click + ScrollSpy)");

  var toc = document.querySelector('#toc');
  var content = document.querySelector('.content'); // Chirpy 文章容器通常是 .content
  if (!toc || !content) return;

  // --- 功能 1: 修复点击跳转 (你已经测试通过的部分) ---
  function fixTocClick(e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    // 阻止 tocbot 的默认行为，防止它因为找不到ID而报错或乱跳
    e.preventDefault();
    e.stopPropagation();

    // 解码 ID
    var targetId = decodeURIComponent(href.substring(1));
    var targetEl = document.getElementById(targetId);
    
    // 备用方案：通过 name 寻找
    if (!targetEl) targetEl = document.getElementsByName(targetId)[0];

    if (targetEl) {
      // 计算偏移量 (顶部导航栏高度 ~60px + 留白)
      var offset = 65; 
      var elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      var offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // 手动触发一次高亮更新
      updateActiveToc(targetId);
      
      // 更新 URL
      history.pushState(null, null, href);
    }
  }

  // --- 功能 2: 滚动监听修复 (新增部分) ---
  // 手动计算当前应该高亮哪个目录，解决中文 ID 匹配失败的问题
  function onScroll() {
    var headings = content.querySelectorAll('h2, h3, h4');
    var scrollPos = window.scrollY || document.documentElement.scrollTop;
    // 偏移量：当标题滚动到距离顶部 80px 的位置时，认为进入了该章节
    var offset = 80; 

    var currentId = "";

    // 遍历所有标题，找到当前视口中最靠上的那个
    for (var i = 0; i < headings.length; i++) {
      var h = headings[i];
      if (h.offsetTop - offset <= scrollPos) {
        currentId = h.id;
      } else {
        break; // 因为标题是顺序排列的，一旦超过，后面的都不用看了
      }
    }

    if (currentId) {
      updateActiveToc(currentId);
    }
  }

  // 更新目录高亮样式的核心函数
  function updateActiveToc(id) {
    // 1. 移除所有激活状态
    var activeLinks = toc.querySelectorAll('.is-active-link');
    activeLinks.forEach(function(el) {
      el.classList.remove('is-active-link');
    });
    var activeLis = toc.querySelectorAll('.is-active-li');
    activeLis.forEach(function(el) {
      el.classList.remove('is-active-li');
    });

    // 2. 找到当前 ID 对应的链接
    // 注意：href 可能是编码过的 (#%E4...)，我们需要解码后对比，或者编码 ID 后对比
    // 这里采用：获取所有链接，逐个解码 href 来匹配 ID
    var links = toc.querySelectorAll('a.toc-link');
    var targetLink = null;

    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href && href.startsWith('#')) {
        var decodedHref = decodeURIComponent(href.substring(1));
        if (decodedHref === id) {
          targetLink = links[i];
          break;
        }
      }
    }

    // 3. 添加激活状态
    if (targetLink) {
      targetLink.classList.add('is-active-link');
      // 激活父级 li，用于展开折叠菜单
      var parentLi = targetLink.closest('li');
      if (parentLi) {
        parentLi.classList.add('is-active-li');
        
        // 递归激活所有父级折叠菜单 (处理多级目录)
        var grandParent = parentLi.parentElement.closest('.toc-list-item');
        while (grandParent) {
            grandParent.classList.add('is-active-li');
            grandParent = grandParent.parentElement.closest('.toc-list-item');
        }
      }
    }
  }

  // --- 初始化与事件绑定 ---
  toc.addEventListener('click', fixTocClick, true);
  
  // 使用防抖或节流优化滚动性能 (简单版：每 100ms 执行一次)
  var scrollTimer = null;
  window.addEventListener('scroll', function() {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function() {
      onScroll();
      scrollTimer = null;
    }, 100);
  });

  // 初次加载时执行一次
  setTimeout(onScroll, 500);

})();