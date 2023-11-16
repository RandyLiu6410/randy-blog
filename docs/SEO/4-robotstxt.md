---
sidebar_position: 4
id: seo-robots-txt
title: robots.txt
---

`robots.txt` 就像是跟搜尋引擎說**哪些網頁你可以爬**以及**哪些你不能爬**。

> - 如要防止自己的網頁顯示在搜尋結果中，請使用其他方法，例如密碼保護或是 [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=zh-tw) 標記。
> - 防止惡意搜尋或是真不想透露頁面可以用一些 preference 去避免，但最終解法可以是用密碼
> **注意**：提醒您，如果想禁止存取私人內容，請不要使用 robots.txt，而是要改用適當的驗證機制。即使是 robots.txt 
檔案禁止的網址，仍有可能在未經檢索的情況下編入索引；此外，由於任何人都能查看 robots.txt 檔案，所以私人內容的位置也可能因此曝光。
> - Google 允許至少五個重新導向躍點，之後便會停止並判定 robots.txt 發生 `404` 錯誤

#### 有趣的地方是你也可以透過看競爭伙伴的 `robots.txt` 去看他們為何禁止哪些網頁給哪些檢索器，進而看出一些端倪🤔

以 [klook](https://www.klook.com/robots.txt) 來說你會發現他針對 Yeti (Naver 的檢索器) 封鎖了大部分的路由，除了 `/ko/`，以及針對中國封鎖了大多的 `Baiduspider`、`Sogou`、`360Spider` 對 `/zh-CN/` 的檢索權限，為何呢？以及 `PetalBot` 是哪家的檢索器，原來是華為的，而他為何也針對 PetalBot 去封鎖了全部路由，從很多地方都可以發現一些意外的點！

> 從少數的案例上來看，PetalBot可能會大量的爬取網站，導致資源使用量較大。

https://www.iamhippo.com/2022-04/1707.html 這篇表示他某天發現 PV/UV 接近 1:1，原來是 PetalBot 瘋狂爬～

Google 規則：
https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt?hl=zh-tw#testing

## 快取

Google 通常會快取 robots.txt 檔案的內容，最多保留 24 小時，但如果在無法重新整理快取版本的情況下 (例如逾時或5xx錯誤)，則會延長快取的保留時間。快取回應可由不同的檢索器共用。Google 可能會依 [max-age Cache-Control](https://www.rfc-editor.org/rfc/rfc9110.html) HTTP 標頭增加或減少快取的效期。

記錄您平台上註冊狀態和使用者互動情形，並嘗試找出常見的垃圾內容模式，例如：

- 表單完成時間
- 同一個 IP 位址範圍傳送的要求數量
- 註冊過程中所用的使用者代理程式
- 在註冊時所選擇的使用者名稱或其他表單提交值

這些信號可協助您建立使用者信譽系統，不僅有助於與使用者互動，也能找出垃圾內容發布者。許多垃圾評論發布者的目的是讓他們的內容出現在搜尋引擎中，因此，如果社群中有尚未累積任何信譽記錄的新使用者，您可以先在他們的文章中加入 [noindex robots `meta` 標記](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=zh-tw)，當這些使用者獲得信譽後，再允許搜尋引擎將他們的內容編入索引。這麼做能有效遏止垃圾內容發布者與平台互動。

可以透過這個工具去測試 `robots.txt`: https://github.com/google/robotstxt

---
References:
- https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt?hl=zh-tw
- https://life.aceidlo.net/disallow-huawei-petalbot/
- https://www.iamhippo.com/2022-04/1707.html