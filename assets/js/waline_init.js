import { init } from 'https://unpkg.com/@waline/client@v2/dist/waline.mjs';



init({
    el: '#waline',
    serverURL: 'https://jovially.netlify.app/.netlify/functions/comment',
    comment: true,
    reaction: true,
    search: false,
    pageview: true, 
    lang: 'zh-CN',
    updateVisitor: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    emoji: [
      '//unpkg.com/@waline/emojis@1.4.0/tieba',
      '//unpkg.com/@waline/emojis@1.4.0/weibo',
      '//unpkg.com/@waline/emojis@1.4.0/qq',
      '//unpkg.com/@waline/emojis@1.4.0/bilibili',
    //   '//unpkg.com/@waline/emojis@1.4.0/tw-emoji',
    ],
    texRenderer: (blockMode, tex) =>
    window.MathJax.startup.adaptor.outerHTML(
        window.MathJax.tex2svg(tex, {
            display: blockMode,
        }),
    ),
});

