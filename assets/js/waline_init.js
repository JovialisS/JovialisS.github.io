import { init } from 'https://unpkg.com/@waline/client@v2/dist/waline.mjs';

init({
    el: '#waline',
    serverURL: 'https://jovially.netlify.app/.netlify/functions/comment',
    comment: true,
    reaction: true,
    search: false,
    lang: 'zh-CN',
    texRenderer: (blockMode, tex) =>
    window.MathJax.startup.adaptor.outerHTML(
        window.MathJax.tex2svg(tex, {
            display: blockMode,
        }),
    ),
});