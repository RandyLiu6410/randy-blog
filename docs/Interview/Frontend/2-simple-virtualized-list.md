---
sidebar_position: 2
id: interview-simple-virtualized-list
title: Simple Virtualized List
tags: [interview, frontend, virtualized-list]
enableComments: true
---

# Virtualized List 簡單實作

當今天有大量資料要render出來時，舉例如果有一千筆資料要被呈現出來，正常viewport不會長到可以顯示一千筆資料，我們會在container加上 `overflow: 'scroll'` 讓 container 可以符合使用者體驗地去顯示資料，因此我們真正會顯示給使用者的只有在 container 可視範圍內的資料，也代表其他不在可視範圍的 DOM 是使用者不需要不過吃了許多資源，同時在渲染過程也花了許多不必要的時間。進而導致以下幾種問題：

- 載入時時間加長( Critical Rendering Path 花許多時間在計算)
- 不必要的 dom 佔據記憶體
- 每個 DOM 太吃資源的情況下會導致 FPS 降低
- 若每個元素裡都有掛載圖片，會花一堆時間去下載全部資源(可以用lazy load)，但載進來後無疑多更多不必要的資源

在這情況下可優化的方式很多種，其中就是今天的主角: **Virtualized List**

## 原理

當滾動時，透過計算可視範圍內會有哪些元素去渲染元素，也稱作 Windowing。

<img src="https://strapi-randy-resume.s3.amazonaws.com/d_Ku_K_Vj_P02x_Wx_O9_L_Po_Ouc_9fdd77e5ea.avif" loading="lazy" />

以上圖為例，若List中有超過一千筆資料，而現在可視範圍內只需要 ID 1000 ~ 1005，那我們只需要這幾個元素，其他移除。

## 實作

在不考慮Dynamic height元素下，簡單實作一個Virtualized List會需要以下幾個條件去做計算：

- 元素數量 (constant): itemCount
- 元素高度 (constant): itemHeight
- 可視範圍高度: listHeight
- 可視範圍的 scrollTop

### Container

我們需要兩層Container，最外層掌管scroll行為，內層為渲染list，內層的高度為 `itemCount * itemHeight`。

``` tsx
      <div
        className="virtualizedList__wrapper"
        style={{ overflow: "scroll", height: listHeight }}
      >
        <div
          className="virtualizedList__inner"
          style={{ position: "relative", height: innerHeight }}
        >
        </div>
      </div>
```

### 現在元素範圍

在內層 Container 上一個的元素index:

``` typescript
const pastIndex = Math.max(
    Math.floor(scrollTop / itemHeight) - 1,
    -1
);
```

若元素 index 為 `<= pastIndex`，我們不渲染。

在內層 Container 下一個的元素index:

``` typescript
const futureIndex = Math.min(
    Math.ceil((scrollTop + listHeight) / itemHeight),
    itemCount
);
```

若元素index為 `>= futureIndex`，我們不渲染。

### 渲染元素

我們需要一個 prop 並且 type 為 function `renderComponent` 讓我們知道怎麼渲染元素。
``` tsx
renderComponent: (index: number, style: CSSProperties) => ReactElement
```

在 scroll event 發生時，根據 `pastIndex < index < futureIndex` 的範圍去呼叫 `renderComponent` 在渲染進內層 container，同時改變元素的位移。
因為內層container被scroll，而我們只渲染可視範圍內的元素，若直接把元素放進容器而不位移，元素會從頂層渲染，這時當scrollTop不等於0時，元素會跑出可視範圍。

``` typescript
const temp = [];
for (let i = pastIndex + 1; i < futureIndex; i++) {
temp.push(
    renderComponent(i, {
        position: "absolute",
        transform: `translateY(${i * itemHeight}px)`,
        width: "100%"
    })
);
}
setItems([...temp]); // items為state，是可視範圍內的元素
```

這裡使用 `transform: translateY` 去位移，使用 GPU 計算資源。

這下清楚了，直接上code。
<img src="https://strapi-randy-resume.s3.amazonaws.com/code_7d8c344360.png" loading="lazy" />

會發現我加了一些小細節：
- buffer: 在前後提前渲染一些元素，除了提升UX，也可以預載資源
- throttle: scroll 好夥伴，避免密集運算。


<img src="https://strapi-randy-resume.s3.amazonaws.com/Clean_Shot_2023_06_13_at_23_33_53_e3b772dab7.gif" loading="lazy" />

<img src="https://strapi-randy-resume.s3.amazonaws.com/Clean_Shot_2023_06_13_at_23_46_55_c3af55f353.gif" loading="lazy" />

[CodeSandbox](https://codesandbox.io/s/virtualizedlist-9d5ltn?file=/src/components/demoList.tsx)

### TODO
- dynamic height元素的virtualized list

---
<iframe src="https://open.spotify.com/embed/track/7BgyWwbbybJr2IbQoI1gzH?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>