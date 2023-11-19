---
sidebar_position: 12
id: seo-structured-data
title: Structured Data
tags: [seo]
---

## 結構化資訊
Structured data，結構化資訊，是搜尋引擎優化介面後提供的多元呈現模式。在 SEO 的世界就是要以多元的方式吸引使用者點擊，不管是優化呈現方式還是多元的連結其他資訊，都能增加能見度。

常見的結構化資訊有:

- FAQPage 問與答
<img src="https://developers.google.com/static/search/docs/images/faqpage-searchresult.png" loading="lazy" />
- Local business 本地商家
<img src="https://developers.google.com/static/search/docs/images/local-business02.png" loading="lazy" />
等...

而結構化資訊根據不同的資訊類型各有適用的屬性，並且遵循 [Schema.org](https://schema.org/) 的規範。

舉例來說，FAQ 的的範例:

<img src="https://i.imgur.com/Q53eqfO.png" loading="lazy" />

而你可以在相關頁面內塞入相關的結構化資訊:

<img src="https://i.imgur.com/mLHOILW.png" loading="lazy" />

## 如何塞入結構化資訊？
結構化資訊支援的格式有

- [JSON-LD (Recommended)](https://json-ld.org/)
- [Microdata](https://html.spec.whatwg.org/multipage/microdata.html#microdata)
- [RDFa](https://rdfa.info/)

根據不同的類型，可以至 [Schema.org](https://schema.org/) 查詢，e.x. https://schema.org/FAQPage

### JSON-LD (JavaScript Object Notation for Linked Data)
適用於頁面類型的資訊

結構化資訊:
``` json
[
    {
        "@context": "http://schema.org/",
        "@type": "Product",
        "name": "Panasonic White 60L Refrigerator",
        "image": "panasonic-fridge-60l-white.jpg",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": 3.5,
            "bestRating": 5,
            "worstRating": 0,
            "reviewCount": 11
        }
    }
]
```

以這樣的方式塞在 `head`:
``` html
<script type="application/ld+json">
[
    {
        "@context": "http://schema.org/",
        "@type": "Product",
        "name": "Panasonic White 60L Refrigerator",
        "image": "panasonic-fridge-60l-white.jpg",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": 3.5,
            "bestRating": 5,
            "worstRating": 0,
            "reviewCount": 11
        }
    }
]
</script>

```

### Microdata
由於單一頁面中可以有多種結構化資訊，可能有 `Product` 適用於單一產品區塊、`AggregateRating` 適用於評論區塊等等，因此可以透過 Microdata 去控制多種結構化資訊。

``` html
<div itemscope itemtype="http://schema.org/Product">
 <span itemprop="name">Panasonic White 60L Refrigerator</span>
 <img src="panasonic-fridge-60l-white.jpg" alt="">
  <div itemprop="aggregateRating"
       itemscope itemtype="http://schema.org/AggregateRating">
   <meter itemprop="ratingValue" min=0 value=3.5 max=5>Rated 3.5/5</meter>
   (based on <span itemprop="reviewCount">11</span> customer reviews)
  </div>
</div>
```

### RDFa
以 HTML5 支援的 [Linked data](https://en.wikipedia.org/wiki/Linked_data) 去描述資料間的關係，進而強化搜尋引擎對內容關係的了解。

``` html
<div xmlns="http://www.w3.org/1999/xhtml" xmlns:schema="http://schema.org" typeof="schema:Product" resource="#product">
  <span property="schema:name">Panasonic White 60L Refrigerator</span>
  <img src="panasonic-fridge-60l-white.jpg" alt="" property="schema:image">
  <div typeof="schema:AggregateRating" property="schema:aggregateRating" resource="#rating">
    <meter property="schema:ratingValue" min="0" value="3.5" max="5">Rated 3.5/5</meter>
    (based on <span property="schema:reviewCount">11</span> customer reviews)
  </div>
</div>
```

視覺化後:
<img src="https://i.imgur.com/BT9MHfS.png" loading="lazy" />

### 小結
1. 三種方法介紹：

    - RDFa 和 Microdata 類似，都嵌入在HTML標記中。
    - JSON-LD 是基於JavaScript的語法，通過script標籤嵌入或作為單獨的文件鏈接。

2. Microdata 和 RDFa 語法比較：

    - Microdata 使用 `itemtype` 和 `itemprop`，指向 `schema.org` 的URL。
    - RDFa 使用 `vocab` 和 `property`，概念相同但屬性名稱不同。

3. JSON-LD的語法：

    - JSON-LD 在 HTML 中以 `script` 標籤包裹，並使用 `type="application/ld+json"`。
    - JSON-LD 包含一個 JSON，列舉屬性和值，與 RDFa 和 Microdata 相同的資訊。

4. 選擇使用的方法：

    - Google 傾向於使用 JSON-LD，並建議開發者先使用 JSON-LD，然後使用 Microdata 補充。
    - JSON-LD 的優勢在於易於添加到現有頁面，但需要重複基本資訊。
    - RDFa 和 Microdata 優勢在於可以直接放入 HTML tag，但需要注意代碼嵌入可能對非工程人員較為複雜。

5. 建議的做法：

    - Google建議先使用JSON-LD，然後使用 Microdata 補充。

## 連結其他資訊
當你提供了結構化資訊時，搜尋引擎會在系統內根據結構化資訊不同提供者去互相連結，e.x. google, gogoout, facebook 都有提供 `偉世紀租車` 的評論，因此當你搜尋 `偉世紀租車` 時你會看到本地商家的資訊卡裡也同時提供這些資訊提供者的內容:

<img src="https://i.imgur.com/ag5Bhbz.png" loading="lazy" />

---
References:
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://schema.org/
- https://rdfa.info/