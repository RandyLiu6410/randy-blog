---
sidebar_position: 2
id: seo-crawler
title: 檢索器
tags: [seo]
enableComments: true
---

搜尋引擎是如何定義哪些網頁該怎麼呈現在 SERP 上是透過他們的爬蟲系統去盡可能爬各種網頁抓重要的資訊後呈現在搜尋頁面上，並透過裡面的內容不管是內部連結還是外部連結去建立索引，而各家搜尋引擎的爬蟲機制及建立索引演算法不盡相同，根據想打的國家市場會做不同的優化方式，

目前全球主流搜尋引擎有
- Google
- Yahoo
- Bing: 微軟
- Naver: 韓國
- Yandex: 俄羅斯
- Baidu: 中國

<img src="https://www.statista.com/graphic/1/1365281/taiwan-market-share-of-mobile-search-engines.jpg" alt="Statistic: Market share of leading mobile search engines in Taiwan as of September 2023 | Statista"/>
Find more statistics at  <a href="https://www.statista.com" rel="nofollow">Statista</a>

從這張圖我們可以發現 2023 的台灣以 Google 為主，因此就可以特別針對 Google 做討論。

## Google 檢索器

首先我們需要知道是哪個瀏覽器正在爬你的網站以及用哪種設備模擬器 (User-Agent)，通常在 Web server 或是中間的攔截器可以得知 UA，而 Google 會透過不同的 UA 去爬找：

| 檢索器 | UA |
| --- | --- |
| Googlebot Smartphone | Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) |
| Googlebot Desktop | Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36 |
| Googlebot Image | Googlebot-Image/1.0 |
| Googlebot News | Googlebot-News 使用者代理程式會使用[各種 Googlebot 使用者代理程式字串](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers?hl=zh-tw#googlebot-desktop)。 |
等等...

Google 會透過大量的伺服器進行檢索作業，並且有可能是並且有可能會造成網頁伺服器的負載，可以透過 Google Search Console 去降低檢索頻率，或是讓 Google 自動降低檢索頻率，像是回傳 `500`、`503` 或 `429`等回應狀態碼，比較建議前者。

當然也可以透過明定的方式去禁止檢索特定網頁，例如未開放網頁或是後台等等，像是

**robots.txt**

```
User-agent: *
Allow: /ja/open-to-world
Disallow: /ja

Disallow: /admin
```

**meta**
``` html
<meta name="robots" content="noindex">
<!-- 特定檢索器 -->
<meta name="googlebot" content="noindex">
```

**rel**
``` html
<a rel="noindex" href="/admin" >管理員後台</a>
```

今天獻上:
<iframe src="https://open.spotify.com/embed/track/0gmgtr39ooM5utYIz5C07Q?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

---
Reference:
- [Google Crawlers](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers?hl=zh-tw)
- [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot?hl=zh-tw)