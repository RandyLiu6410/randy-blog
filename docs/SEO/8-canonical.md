---
sidebar_position: 8
id: seo-canonical
title: canonical
tags: [seo]
enableComments: true
---

## 標準化網址

>有某一個網頁可透過多個網址存取，或者不同網頁上存在相似的內容 (例如同時提供行動版和電腦版網頁)，Google 會將這些網頁視為相同網頁的重複版本，從中選出一個網址做為「標準」版本進行檢索，然後將其他網址判定為「重複」網址並降低檢索頻率。

當今天站內有許多頁面是雷同的，會讓搜尋引擎不知道要把哪個網頁推到 SERP，例如某個洋裝的頁面

```
https://example.com/dress //主進入點
https://example.com/dress?size=m // 尺寸為 M
https://example.com/dress?size=m&color=green // 尺寸為 M、顏色為綠色
```

那搜尋引擎會認為這三頁明顯是差不多的，不知道是要在 SERP 呈現哪一頁，並且會導致站內瓜分權重。

因此我們需要告知搜尋引擎我們希望哪個是訪客的進入點。這時就需要定義標準化網頁，**並且必須用絕對路徑**：

``` html
<!-- https://example.com/dress -->
<link rel="canonical" href="https://example.com/dress" />
```
``` html
<!-- https://example.com/dress?size=m -->
<link rel="canonical" href="https://example.com/dress" />
```
``` html
<!-- https://example.com/dress?size=m&color=greens -->
<link rel="canonical" href="https://example.com/dress" />
```

設定標準化網址的目的有：
- 為了指定要顯示在搜尋結果中的網址
- 為了整合相似或重複網頁的連結信號
- 為了簡化單一產品或主題的追蹤指標
- 為了管理聯合發布內容
- 為了避免耗時檢索重複網頁

## 範例
什麼樣的情況會需要標準化網頁：
- 商品頁

`https://example.com/dress`
``` html
<!-- https://example.com/dress -->
<link rel="canonical" href="https://example.com/dress" />
```
`https://example.com/dress?size=m`
``` html
<!-- https://example.com/dress?size=m -->
<link rel="canonical" href="https://example.com/dress" />
```
- 分類或集合頁

`https://example.com/category/short`
``` html
<!-- https://example.com/category/short -->
<link rel="canonical" href="https://example.com/category/short" />
```
`https://example.com/category/short?size=m`
``` html
<!-- https://example.com/category/short?size=m -->
<link rel="canonical" href="https://example.com/category/short" />
```
- 多語言/多地區版本網站的重複頁面，會透過 alternate link 去定義其他語系的網頁

`https://example.com`
``` html
<!-- https://example.com -->
<link rel="canonical" href="https://example.com" />
<!-- 語系 en -->
<link rel="alternate" hreflang="en" href="https://example.com" />
<!-- 語系 zh-TW -->
<link rel="alternate" hreflang="zh-TW" href="https://example.com" />
<!-- 語系 ja -->
<link rel="alternate" hreflang="ja" href="https://ja.example.co" />
```
- 行動版網頁為獨立網址時

`https://example.com`
``` html
<!-- https://example.com -->
<link rel="canonical" href="https://example.com" />
<!-- 手機版 -->
<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.example.com" />
```
- 採用AMP規範頁面
> [AMP（Accelerated Mobile Pages）](https://zh.wikipedia.org/zh-tw/Accelerated_Mobile_Pages)為Google 從 2015 年開始推廣 的網頁格式，主要標榜讓網頁能以更快速度載入

`https://example.com`
``` html
<!-- https://example.com -->
<link rel="canonical" href="https://example.com" />
<!-- AMP -->
<link rel="amphtml" href="https://example.com/amp" />
```


## 評估流程
<img src="https://lh6.googleusercontent.com/c1gIcTk2xTk5WF4pMHwOSF83ME0YrJ7TlCTx5pgZRQ_cckfMwCyWY2s5IBumpJf8XYvRxWF-JZLLyLKoHf9zO8ozIHuyZ-84vtcYk6dbGyvulbZymACNI2dco4zupZMgjmDc8C34=s0" loading="lazy" />
*Reference: https://www.awoo.ai/zh-hant/blog/canonical-seo/*

## 駭客注意
有些攻擊方式是在網站植入傳回 HTTP 301 重新導向的程式碼，或是在 HTML `<head>` 或 HTTP 標頭中插入跨網域的 `rel="canonical"` link 標記。此類程式碼和標記通常會指向代管惡意內容或垃圾資訊的網址，在這些情況下，我們的演算法可能會選擇惡意網址或垃圾資訊網址，而非遭入侵網站上的網址。

---
Day Wave 超讚！
<iframe src="https://open.spotify.com/embed/track/5gEni4dmBqme8fyPcyWYiK?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

---
References:
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=zh-tw
- https://www.awoo.ai/zh-hant/blog/canonical-seo/