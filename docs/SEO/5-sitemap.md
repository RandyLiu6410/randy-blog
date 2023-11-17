---
sidebar_position: 5
id: seo-sitemap
title: sitemap
---

## Intro

sitemap 算是站內連結的字典，供搜尋引擎知道你的站內有哪些連結。搜尋引擎可以透過自然檢索，但可能不會這麼快，我們可以透過提交sitemap主動與搜尋引擎告知。

不過提升 SERP 排名與 sitemap 並沒有直接關係，排名是透過檢索後經過演算法去排列出來的，而 sitemap 屬於「主動」申請檢索需求，加快檢索速度。

sitemap 支援的格式有

- txt
- XML
- RSS, mRSS, Atom 1.0

## Sample

以常見的 XML 為例，一樣我們先看看別人怎麼做的，以 klook 為例，我們試著打打看

`https://www.klook.com/sitemap.xml`

會發現怎麼404，`https://www.klook.com/zh-TW/sitemap.xml`呢？也是找不到，首先我們要知道 sitemap.xml 查找方式與 robots.txt 不一樣， `robots.txt` 一定會放在主路由的 `/robotx.txt`，而 sitemap 不一定，他可以被取名 `zh-tw-sitemap.xml` 也可以被置於 `/zh-TW/zh-tw-sitemap.xml`，因此我們該怎麼找到呢？透過`robots.txt`!

我們進到 `https://www.klook.com/robots.txt` 後會看到：

<img src="https://media.cleanshot.cloud/media/37219/rUiC6H3cexAmKtn9uK3k7bpkv8KmESUYXzn4Ypm9.jpeg?Expires=1700254050&Signature=SS42-lfxQWv0tOglggA7UbVOQcwqNGsuwQx9Ux5KXg-vR1mNzWEDChjuJSQvxnW0BirFetDwPH45Spxn88KdIeu7k67Ysqaj06c2h8NjqQadCcvY97CDg03wMdL~pt~8EbPzk6CqITYRYAEPSr1piSDGdV3DH2mGAiHRXkgPD9vz6LFjliYOSYlKf5SN7LclYOhYMP7509-I7AQEE5Gi2DHZLz~YSPGKlXAC4SRdHTGJ~tqSE-RHP8tF7tYcCeQcPFlrpzPnqGaBQU2ev-9H1bmyn~wBpawi59zfYqe0RCFvkMUXSXNVcIh3VNe20ClvLViiv1-vwvgHn4C3BwgXyA__&Key-Pair-Id=K269JMAT9ZF4GZ" loading="lazy" />

他下面有顯示各 sitemap 的存放位置以告知檢索器，因此我們進到其中一個 sitemap 看看：

<img src="https://media.cleanshot.cloud/media/37219/e4mILmxjTaztlB2Jpzq2SkmDjg7TVdUbtS2XbNZy.jpeg?Expires=1700254234&Signature=oAvDnruxS4QTwgMETei0O5XTzp-SLVPlXBKpmIh5Dp18LmmxbIoZKd780PmgZugYDzkc~~It~mP8PM3v4CxrOcKFBenz8W~iDvcx350xusqjLmNoPrl5gj3Xjs4K5ub~~TMlHOnegfbXjWGAa2YaY1PUHACtfDn8yRMnL5MGEipDJaWmelAN9SJ9AFrCIm1hfYdq1ut2389-lR0J7q~QRgGbNVCc3dxQ1O-kZjEy0wTezDPzw-FQ5~5pQ29CL963o89QBwcXSz0D0Kp4BQk3Vm-xSvaqc1W5q642Ux7tmGGWo~GnutGYeawSQ5xoDH~ZzjBVpC3iBNKWDEHRc6H-Gg__&Key-Pair-Id=K269JMAT9ZF4GZ" />

會看到他在裡面的格式是

``` xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.klook.com/zh-TW/sitemap-country-plain.xml</loc>
    <lastmod>2022-09-06</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.klook.com/zh-TW/sitemap-city-plain.xml</loc>
    <lastmod>2022-09-06</lastmod>
  </sitemap>
  <!-- ...-->
</sitemapindex>
```

xmlns 屬於 xml 的命名空間 (namespace)，而他遵循的命名空間是 `http://www.sitemaps.org/schemas/sitemap/0.9`，再來看到 `sitemap` tag 裡有幾個 tags: `loc`, `lastmod`，依照 [`sitemaps.org`](https://www.sitemaps.org/zh_TW/protocol.html) 的文件：

<img src="https://media.cleanshot.cloud/media/37219/yKoMziLIHwb3UpPKdUivKmQ8C2Wu3LkevnaNtNdt.jpeg?Expires=1700254721&Signature=sU0et9egDEN5xmle2zd7Q1WHu3o6P3KrOab98eI07-XiiUmIpHBJg0WATwFgiY1MlTNmVgF5sEqcKuHmkES-jp8Kob~uikM8uJaanAUcXugRu1THvlIEPkZfTaUpy9J5HAKsZGhqfMYR2B3Rn3ioxYf-PRcWt2yITgTzGgYtM~5yD4xdRGZM8HMwfvsL8RofcKHHyXvkxQ6W2nR2hjhZmjwgmLo2eSOc0uMVeSZRMcaZ1oSJdXx7lzaXtU3VfITMPsJNmtEFqi8D9~tbRFq3tT-4w~lhteoq0-emIcidFeqbJ9N6~iqV9T2jOz6Zlf7Ev368yALIi2bCVAfgeQOnjw__&Key-Pair-Id=K269JMAT9ZF4GZ" loading="lazy" />

- loc: 通常指 sitemap 位置，也就是說 sitemap 裡可以在包還 sitemap，有些人也會在裡面放壓縮檔 e.x. `http://www.example.com/sitemap2.xml.gz`
- lastmod: 該 sitemap 的變更時間，而時間格式依照 `https://www.w3.org/TR/NOTE-datetime`

我們再往下挖看看下面的 sitemap: 

<img src="https://media.cleanshot.cloud/media/37219/DUFT66288QSaDJqMDsVtCZJlO3nDWi9fgvI7uvnq.jpeg?Expires=1700255234&Signature=OYIX4oku8j0urgeOjBQGEAmmpiMuPALUxNsef2Rq3W1N5L1UxMgnBuw9Pl-XnkiAl0HkmNtd5KQrTuMiTB4r8Xqg~EXEvtprLnZ77lN64gN1AjpMJ-vmBfDZ03t6Uq4XA2VC78tc2HJIhQJWcoKqQB~9cc31WUH-0msRZPxUoaOjR-H8Sk50B0iDQNGytSExtD2LZUReDN0i0ENR-IPnDUT30BDNfKazr7upfVxW1NkyNaAVqr1Uuq2m4g4UOX18~MvftQPk2hKPCfwH9vTT3UPhx4u7t~n00T8PU0xGRDf50lS-C7Uq-agQPBRKwx5BCYjEReVyCLx1jdpgv94Ohw__&Key-Pair-Id=K269JMAT9ZF4GZ" loading="lazy" />

發現格式不一樣了

``` xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.klook.com/zh-TW/coureg/14-taiwan-things-to-do/</loc>
    <priority>0.95</priority>
    <lastmod>2020-04-09</lastmod>
  </url>
  <url>
    <loc>https://www.klook.com/zh-TW/coureg/12-japan-things-to-do/</loc>
    <priority>0.95</priority>
    <lastmod>2020-04-09</lastmod>
  </url>
  <!-- ...-->
</urlset>
```


這邊開始定義每個網址囉，我們再回去看看文件：

<img src="https://media.cleanshot.cloud/media/37219/MLhsuVFNUyK0OoUYupA0kPXwMSpJwbstKaKDCtPk.jpeg?Expires=1700255298&Signature=mnk7w8n6on55f~azZ3hdLz1N06B9HMBVlG3dMXwRN0mMzdFMAS6XJIi57FwcWEK3wP~SFRJnH1mmAeEKgU~RTNY7kjFEERG4zgxTl46xKI1EqOjufXTrfJgqrHQwr~1zIC7ibhoPF9K1Iio7TAQvlK505QfJo6OiTlposLGnlsSI3BCXwxw6PldGKNaJVidlRMCOJ2P325ihaNSkqppJRdy6W2jOyVLxVcjAeJnHtGszFV~Yf4O49-cY2sXEaj4HWw1m9HYX-7lvMo4D8wvYy3yf7VXLrdfxBgAAdAxAbPByV530rEsa0KJzkPVocKo7GvcI5anEJPUmsu~AQB95yw__&Key-Pair-Id=K269JMAT9ZF4GZ" loading="lazy" />

- loc: 網址位置
- lastmod (optional): 最後修改時間
- changefreq (optional): 變更頻率，請注意，此標記的值會當做提示而非指令。即使搜尋引擎的搜尋器在做決定時可能會參考此資訊。
- priority  (optional): 此 URL 的優先順序是相對於您網站上的其他 URL。有效值的範圍為 0.0 到 1.0。此值不會影響您的網頁與其他網站網頁的比較，而只是讓搜尋引擎知道您認為哪些網頁對檢索器來說最為重要，預設 0.5。

我們會看到文件裡處處提醒這些屬性不代表 SEO 排名，都是看搜尋引擎的檢索器邏輯，因此有興趣再至各大搜尋引擎去研究他們注重啥。

我們再看看其他人是怎做的，以 kayak 為例：

<img src="https://media.cleanshot.cloud/media/37219/Twg208fjvRShZNsln4tT8yCW8iPEipnDeNINdCF9.jpeg?Expires=1700255836&Signature=spRJpqLQngzDwaHyY7VZaK4oIJ3DEi4hkDKMErS1acBJMDOOVpPGytVutbjjIOOzJ8AszoaatTgrP8NgktxgERsLmRJPUFX2UonLuerhs8mxwZhDGWuBfSj23yaeAtKnIjbhT2aqm~HDToSOsFniHMkNczFjImg5AWayy8gW76eHpEzd7brY~1r1EbU2O6VMdE-g2OiA~LLVq261Kj6Y5KxmPIA9GODX9PqkWBCbd3paNygrrcxcJ8RngN6eFnv~I-tm89hEeAwW~DiiA5KUoAkkruQFd5IZWoHx2RB9RlO7anqzC9JOZHNlV0Gi5sA0nrkvjT1IhHJfliAaABNt4w__&Key-Pair-Id=K269JMAT9ZF4GZ" loading="lazy" />

What? 這個時間太精準了吧，而且跟我本地時間一樣，不太對勁...，因此我們來看看如何實作 sitemap.xml

## 實作 sitemap.xml

當然可以土炮建 sitemap.xml，在路由下建立 `/sitemap.xml` 檔案，但這一定會有手動更新的疑慮，我們當然想自動呀，~我們工程師這麼懶~。

### Next.js

以 Next.js 為例，我們可以在 `pages` 或 `app` 底下建立 `sitemap.xml.ts`

``` javascript
import type { GetServerSideProps } from "next";
import { getBlogIdx } from "@/api/blog";

async function generateSiteMap() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN;
  const blogIdx = await getBlogIdx();

  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
         <loc>${origin}</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <changefreq>yearly</changefreq>
         <priority>0.5</priority>
       </url>
       ${idx[0]
         .map((id) => {
           return `
         <url>
            <loc>${`${origin}/blog/${id}`}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
         </url>
       `;
         })
         .join("")}
     </urlset>
   `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // We generate the XML sitemap with the posts data
  const sitemap = await generateSiteMap();

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;

```

這邊可以看到我們用動態產生裡面的內容，這樣也能確保每次拜訪這頁時都是最完整的狀態！同時 `lastmod` 是拜訪當下的時間～

並且我們可以透過 Google Search Console 主動提交 sitemap 並觀察檢索狀態：

<img src="https://media.cleanshot.cloud/media/37219/bd4QrZ0RKl0H5B0pMoblO4aKUsrAb92aOnpBzpTB.jpeg?Expires=1700256647&Signature=TtEgJQsOUi5kJWOn7wBStxtTdxdzcAP070KX9~F03Lcbr4Ve5LPNlsgTbAv371TESX-94YjW1CLAdWbieUMHcNI6Art3eS1AADcNO8aPa49zr2yr7fPmBp1go1YqotYiQTyvCUDvMc8DvO3xu5otpxI5XyCxnoqMRzFCMkal8B0s-cuyfh86BILooGgTCZDYQfu-ilkGDaGHLcgBcVFttCck5QDI9QcAw-3ZNUcY3jjqVMzbuO8VMXwR~9J0brVp3wRx~85QXalRsp1ZKxoz7xYpnzytY-Tsj8jHD7IPPj3dYhirlMWKw01zSHievPnsyso8MnlUQYaBI3cVc9qLXg__&Key-Pair-Id=K269JMAT9ZF4GZ" />

今晚我想來點...
<iframe src="https://open.spotify.com/embed/track/2lGQJuNsRG289zdlZmDHR2?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

---
References:
- https://www.sitemaps.org/zh_TW/protocol.html
- https://welly.tw/serp-rank-optimization/what-is-sitemap