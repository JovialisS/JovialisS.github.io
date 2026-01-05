(function() {
  console.log("ToC Fix Script Loaded (Lock Mechanism Version)");

  var toc = document.querySelector('#toc');
  var content = document.querySelector('.content');
  
  // --- 关键变量：点击锁 ---
  // 当用户点击时设为 true，此时忽略滚动监听
  var isClicking = false; 

  if (!toc || !content) return;

  // --- 核心工具：更新高亮 ---
  function updateActiveToc(id) {
    // 1. 清除旧的高亮
    var activeLinks = toc.querySelectorAll('.is-active-link');
    activeLinks.forEach(function(el) { el.classList.remove('is-active-link'); });
    var activeLis = toc.querySelectorAll('.is-active-li');
    activeLis.forEach(function(el) { el.classList.remove('is-active-li'); });

    // 2. 寻找匹配的链接 (解码对比)
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

    // 3. 设置新的高亮
    if (targetLink) {
      targetLink.classList.add('is-active-link');
      var parentLi = targetLink.closest('li');
      if (parentLi) {
        parentLi.classList.add('is-active-li');
        // 展开所有父级折叠
        var grandParent = parentLi.parentElement.closest('.toc-list-item');
        while (grandParent) {
            grandParent.classList.add('is-active-li');
            grandParent = grandParent.parentElement.closest('.toc-list-item');
        }
      }
    }
  }

  // --- 功能 1: 点击修复 (带锁) ---
  function fixTocClick(e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault();
    e.stopPropagation();

    // 1. 上锁！禁止滚动监听干扰我们
    isClicking = true;

    var targetId = decodeURIComponent(href.substring(1));
    var targetEl = document.getElementById(targetId);
    if (!targetEl) targetEl = document.getElementsByName(targetId)[0];

    if (targetEl) {
      // 2. 立即手动设置正确的高亮
      updateActiveToc(targetId);

      // 3. 开始滚动
      var offset = 65; // 顶部导航栏高度
      var elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      var offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // 更新 URL
      history.pushState(null, null, href);

      // 4. 解锁倒计时
      // 等待滚动大概完成后 (1秒够用了)，重新允许滚动监听工作
      setTimeout(function() {
        isClicking = false;
        // 再次校准一次，防止微小误差
        // onScroll(); 
      }, 1000);
    }
  }

  // --- 功能 2: 滚动监听 (带锁检查) ---
  function onScroll() {
    // 如果正在点击跳转中，直接退出，不要干扰高亮
    if (isClicking) return;

    var headings = content.querySelectorAll('h2, h3, h4');
    var scrollPos = window.scrollY || document.documentElement.scrollTop;
    // 这里的 offset 稍微大一点，保证标题滚到视口上方一点点才算“读过”
    var offset = 100; 

    var currentId = "";

    // 寻找当前视口最上方的标题
    for (var i = 0; i < headings.length; i++) {
      var h = headings[i];
      // 如果标题的位置小于 (滚动条 + 偏移)，说明它已经滚上去了或者正在视口上方
      if (h.offsetTop - offset <= scrollPos) {
        currentId = h.id;
      } else {
        break; 
      }
    }

    if (currentId) {
      updateActiveToc(currentId);
    }
  }

  // --- 初始化 ---
  toc.addEventListener('click', fixTocClick, true);

  var scrollTimer = null;
  window.addEventListener('scroll', function() {