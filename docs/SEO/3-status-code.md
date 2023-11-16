---
sidebar_position: 3
id: seo-status-code
title: Status Code 回應狀態碼
---

## Soft 404

`soft 404` 錯誤是指您的網址所傳回的頁面告知使用者該網頁不存在，但同時又傳回 **[200 (success)](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success) (成功) 狀態碼**。在某些情況下，傳回的頁面可能沒有主要內容或空白網頁。

網站的網路伺服器、內容管理系統或使用者的瀏覽器會因為許多原因產生這類網頁。例如：

- 缺少伺服器端 (Server-Side Include) 檔案。
- 與資料庫的連線中斷。
- 內部搜尋結果網頁空白。
- JavaScript 檔案未載入或遺失。

Solution: 正確使用404 status code

Customized 404 page

- 明確告訴訪客，系統找不到他們所需的網頁。請使用友善且具吸引力的語句。
- 確認 `404` 網頁與您網站的其餘部分使用相同的風格和外觀 (包括導覽方式)。
- 考慮加入連結，指向網站上最熱門的幾篇文章以及首頁。
- 考慮為使用者提供回報無效連結的方法。

## 3xx

Googlebot 最多採用 10 個重新導向躍點。如果檢索器未在 10 個躍點內收到內容，Search Console 就會在網站的網頁索引報表中顯示[重新導向錯誤](https://support.google.com/webmasters/answer/7440203?hl=zh-tw#zippy=,errors)。Googlebot 採用的躍點數量視使用者代理程式而定，例如 Googlebot Smartphone 和 Googlebot Image 的值可能有所差異。

## 5xx

`5xx` 和 `429` 伺服器錯誤會促使 Google 檢索器暫時降低檢索頻率。系統會將已建立索引的網址保留在索引中，但最終會予以移除。

## DNS

網路錯誤和 DNS 錯誤會對網址在 Google 搜尋中的排名產生負面影響，而且非常快速。Googlebot 處理 `5xx` 伺服器錯誤的方式，與網路逾時、連線重設和 DNS 錯誤的處理方式相似。

## Redirect

如果網頁已移到他處，或者有明確的替代網頁，請傳回 [301 (permanent redirect) (永久重新導向)](https://developers.google.com/search/docs/crawling-indexing/301-redirects?hl=zh-tw) 狀態碼，將使用者重新導向。

---
References:
- https://developers.google.com/search/docs/crawling-indexing/http-network-errors?hl=zh-tw