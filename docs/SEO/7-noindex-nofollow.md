---
sidebar_position: 7
id: seo-noindex-nofollow
title: noindex, nofollow
tags: [seo]
---

## noindex

意旨告知檢索器該頁面或連結不供建立索引，代表不會在 SERP 出現。

- 頁面
``` html
<meta name="robots" content="noindex">
```
- 連結
``` html
<a rel="noindex" href="/admin" >管理員後台</a>
```


## nofollow

---前情提要---
### 權重
這邊先簡單解說權重的意思，SEO 演算法裡有個指標是 `Authority Score`，分數落在 1 - 100，代表你這個頁面的在某個特定領域的權威性，e.x. `semrush.com` 在解說 SEO 的這塊領域是非常有指標性的，裡面有很多解說 SEO 的技術文章，因此用 ubersuggest 稍微看一下該網域的 `Authority Score`：

<img src="https://i.imgur.com/mPzX1PR.png" loading="lazy" />

他的 `Authority Score` 為 **89**，算是非常高。

### backlinks
backlinks (反向連結) 指的是當今天在網域A裡的某個頁面裡有連結至網域B的某個連結，這樣就是網域B成功透過網域A建立反向連結，因此網域A會傳遞他的 `Authority Score` 過去網域 B，增加網域B的 SEO。

---前情提要結束---

1.
若是你不想要你的網頁從其他網頁傳遞權重過來，通常會防止別人在差勁的網站貼你的網頁進而傳遞差勁的權重到你的網頁，可以在 `meta` 裡放置：
``` html
<meta name="robots" content="nofollow">
```

2.
若是你某個頁面裡參照的另一格網域 (`https://example.com`) 的某頁面，但不想要傳遞你的 `Authority Score` 過去，你可以在連結裡放置 `nofollow`：
``` html
<a rel="nofollow" href="https://example.com" >到example瞭解更多</a>
```
使用時機：
1. 付費連結: 付費解鎖我網頁內合作夥伴的連結🥴
2. 不願為其保證、背書的目標網站
3. 用戶自製內容（UGC）: 
> 除了像開放評論、留言的網站之外，Ptt、Dcard這類論壇大多數內容來自於使用者自製，網站管理員難以控管其內容品質。
>
> 這時候為了防止太多的垃圾連結，就可以透過nofollow統一管理，將網站上所有連向外部的連結，都標示rel=”nofollow”或rel=”ugc”，以保護自己網站的權益。

<img src="https://images.ctfassets.net/vx2fw5lk485m/3hovIcdRr9qleXlGqr7eKs/535aa3d7b3079feedd0d35c35842fd6e/________-_16.nofollow-1__2___1_.jpg" loading="lazy" />

## Summary
- noindex: 禁止建立索引
- nofollow: 禁止傳遞權重，防止洗連結

<img src="https://images.ctfassets.net/vx2fw5lk485m/2HRiVnT4OWPpgNWYXWPuUB/a2ceb5d55f8be242320bc5787530a514/________-_16.nofollow-3.png" loading="lazy" />

而 noindex 與 nofollow 可以同時存在：
``` html
<meta name="robots" content="noindex, nofollow">
```
``` html
<a rel="noindex, nofollow" href="https://example.com" >到example瞭解更多</a>
```

<iframe src="https://open.spotify.com/embed/track/4zHC1zzSAV2xR7OlUqo2Oz?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
---
References:
- https://welly.tw/serp-rank-optimization/what-is-nofollow