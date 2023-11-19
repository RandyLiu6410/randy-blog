---
sidebar_position: 1
id: interview-frontend-autocomplete
title: Autocomplete
tags: [interview, frontend, data structure, React.js, trie]
---

Autocomplete 應該是許多大公司滿常見的前端面試考題，不僅考**前端設計**同時也會考到**資料結構**，Autocomplete 常見的應用是 Google 搜尋的輸入欄，搜尋引擎會給你取多建議的結果，這就是 Autocomplete 的功用。

<img src="https://i.imgur.com/W2QSd39.png" loading="lazy" height="320px" />

## 確認需求
應付面試我們一定要先與面試官確認需求：

### 1. 資料形式
我們是要撈哪種資料？文字、圖片、文檔等等，先確定這個才能設計資料結構

**我們這邊先假設`文字`**

### 2. 結果呈現方式
結果的呈現方式可以有很多方式，文字、圖片等

**我們這邊先假設`文字`**

### 3. 呈現在哪種設備上
是 laptop, tablet, mobile 等，進而確定 RWD 的程度

**我們這邊先假設 `laptop`**

### 4. 需要 fuzzy search 嗎
**我們這邊先假設`不用`**

### 5. 需要 Cache 嗎
Cache 可以將上次搜尋的結果暫存起來

**我們這邊先假設`需要`**

## 架構設計
根據需求確認的結果，我們可以開始規劃架構:

<img src="https://i.imgur.com/rGrCDxb.png" loading="lazy" />

步驟如下:

1. 使用者輸入文字
2. `Input UI` 將 `Query` 傳遞至 `Controller`
3. `Controller` 拿著 `Query` 去問 `Cache`
4. 若 `Cache` 裡**有**搜尋結果的緩存，將 `Results` 回傳給 `Controller`
5. `Controller` 將 `Results` 回傳至 `Results UI`
6. 若 `Cache` 裡**沒有**搜尋結果的緩存，`Controller` 拿著 `Query` 去問 `Server`，`Server` 將搜尋結果回傳給 `Controller`
7. `Controller` 將 `Results` 回傳至 `Results UI`

## 資料結構設計
### 前提
我們確定兩個前提:
- 資料格式為文字
- 沒有 fuzzy search

### 預期結果
我們預期的結果應該會像:

``` json
{
    "query": "高雄",
    "results": [
        "高雄天氣",
        "高雄捷運",
        "高雄景點",
        ...
    ]
}
```

每個字跟下一個字是有連結關係的，並且這連結關係是有多可能性的，e.x. `高` 後面可能接 `雄`、`鐵`等...，因此腦海裡自然浮現一種資料結構，**Trie**。

### Trie
> trie的發明者Edward Fredkin把它讀作/ˈtriː/ "tree"。但是，其他作者把它讀作/ˈtraɪ/ "try"。
>
>在電腦科學中，trie，又稱字首樹或字典樹，是一種有序樹，用於儲存關聯陣列，其中的鍵通常是字串。與二元搜尋樹不同，鍵不是直接儲存在節點中，而是由節點在樹中的位置決定。一個節點的所有子孫都有相同的字首，也就是這個節點對應的字串，而根節點對應空字串。一般情況下，不是所有的節點都有對應的值，只有葉子節點和部分內部節點所對應的鍵才有相關的值。

<img src="https://i.imgur.com/LYegGZx.png" loading="lazy" />

## 實作
### 資料結構
#### TrieNode

Trie 裡的每個 Node
``` typescript
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}
```

- children: 這個 node 後接的 nodes，並且是個 Dictionary
- isEndOfWord: 是否是最後一個 node 了

#### Trie

一定會有個主 node
``` javascript
class Trie {
  constructor() {
    this.root = new TrieNode();
  }
}
```

1. 新增文字
``` javascript
insert(word: string) {
    // 先從頭開始
    let node = this.root;

    // iterate 每個字，找到相對應的 node
    for (const char of word) {
        if (!node.children[char]) {
            // 沒有相對應的 node, 幫他新增
            node.children[char] = new TrieNode();
        }
        // assign node 供下個文字查找用
        node = node.children[char];
    }
    node.isEndOfWord = true;
}
```

2. 查找文字
``` javascript
search(prefix: string) {
    // 先從頭開始
    let node = this.root;

    // iterate 每個字，找到相對應的 node
    for (const char of prefix) {
        // 若沒有相對應的 node, 代表 trie 裡沒有, 回傳空陣列
        if (!node.children[char]) {
            return [];
        }
        // assign node 供下個文字查找用
        node = node.children[char];
    }

    // 查找最後對應的 node 的所有可能性
    return this._getAllWords(node, prefix);
}
```

3. 列出可能性
``` javascript
// 根據找到的 node, 以及目前有經過的文字 prefix
_getAllWords(node: TrieNode, prefix: string) {
    // 宣告結果
    const result = [];

    // traverse 該 node
    // result 帶進去方便直接 push 結果
    this._traverse(node, prefix, result);
    return result;
}

_traverse(node: TrieNode, currentWord: string, result: Array<string>) {
    // 若 node 為最後一個節點, 將 currentWord 回傳
    if (node.isEndOfWord) {
        result.push(currentWord);
    }

    // DFS
    for (const [char, childNode] of Object.entries(node.children)) {
        // 將 currentWord + char 待到下一個 currentWord
        // 因為已看過
        this._traverse(childNode, currentWord + char, result);
    }
}
```

4. 測試
``` javascript
const trie = new Trie();
const words = ["高", "高讀音", "高字", "高英文", "高拼音", "高造詞", "高部首的字", "高雄美食", "高雄天氣", "高雄捷運"];
words.forEach(word => trie.insert(word));

const queries = ["高", "高讀", "高雄"];
const results = []
for(const query of queries) {
    results.push({
        query,
        results: trie.search(query)
    })
}

console.log(results);
```

<img src="https://i.imgur.com/pFWBW6a.png" loading="lazy" />

### Server
簡單用 Node.js + Express.js，設計一個簡單的 API，單純從 Trie 拉資料也暫時不考量 pagination:
``` javascript
import trie from "./trie.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/search", (req, res) => {
  const { query } = req.query;
  if (!query) {
    res.status(400).json({
      statusCode: 400,
      msg: `Query "query" is missing`,
      data: null,
    });
    return;
  }

  res.status(200).send({
    statusCode: 200,
    msg: "Success",
    data: {
      query,
      results: trie.search(query),
    },
  });
});

app.listen(8080, () => {
  console.log(`Server listen on 8080`);
});
```

### Cache
我們簡單設計一個 Cache，用 `Map` 去設計，key 為 index name, value 為該 index 的 `Map` Cache。

``` ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, Map<any, any>>();

cache.set("search", new Map());

export const getItem = (indexName: string, key: string) => {
  const indexCache = cache.get(indexName);
  if (!indexCache) return null;

  return indexCache.get(key);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setItem = (indexName: string, key: any, value: any) => {
  const indexCache = cache.get(indexName);
  if (!indexCache) return;

  indexCache.set(key, value);
};
```

### Controller
Controller 為前端與 server 溝通的管道，因此我們在裡面設計一個簡單的 fetch request，並且將 Cache 加進來在與 server 溝通前去確認 cache 裡是否有值，並且先不考量 revalidate。
``` ts
import { getItem, setItem } from "../modules/cache";

const CACHE_INDEX = "search";
const SEARCH_URL = "http:/localhost:8080/search";

export type SearchResponse = { query: string; results: Array<string> };
export const search = async (query: string): Promise<SearchResponse> => {
  const resultFromCache = getItem(CACHE_INDEX, query);
  if (resultFromCache) return resultFromCache;

  const url = new URL(SEARCH_URL);
  url.searchParams.set("query", query);

  const res = await fetch(url);
  if (res.status === 200) {
    const resJson = await res.json();
    setItem(CACHE_INDEX, query, resJson.data);
    return resJson.data as SearchResponse;
  }

  return {
    query,
    results: [],
  };
};
```

### Input UI
以 React 開發一個 input component，並且用 debounce 把 controller api 包起來，並設定 1 秒。
``` tsx
import styles from "./autocomplete.module.css";
import { search } from "../../api/search";
import type { SearchResponse } from "../../api/search";
import { useCallback, useState } from "react";
import { debounce } from "lodash";
import { AutocompleteList } from "./autocomplete-list";

function Autocomplete() {
  const [results, setResults] = useState<SearchResponse["results"]>([]);

  const handleSubmit = async (query?: string) => {
    if (!query) {
      setResults([]);
      return;
    }

    const response = await search(query);
    setResults(response.results);
  };
  const debounceSubmit = useCallback(debounce(handleSubmit, 1000), []);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    debounceSubmit(e.target.value);
  };

  return (
    <div className={styles.autocomplete__container}>
      <input
        className={styles.autocomplete__input}
        type="text"
        placeholder="Type something..."
        onChange={handleChange}
      />
      {results.length > 0 && <AutocompleteList results={results} />}
    </div>
  );
}

export default Autocomplete;
```

### Results UI
``` tsx
import { memo } from "react";
import styles from "./autocomplete-list.module.css";

interface AutocompleteListProps {
  results: Array<string>;
}
export const AutocompleteList = memo<AutocompleteListProps>(
  function AutocompleteList({ results }) {
    return (
      <ul className={styles.autocomplete__list}>
        {results.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    );
  }
);
```

## 成果
<img src="https://i.imgur.com/JbxkLFB.gif" loading="lazy" />

## 結論
Autocomplete 不僅是考你對前端框架的熟悉程度、與後端溝通的能力，更多是系統設計以及資料結構的掌握程度。

Autocomplete 考點其實還有很多，包含:
```
TODO:
- Virtualized List
- UX design
- Pagination
```

[原始碼](https://github.com/RandyLiu6410/react-autocomplete)

---
<iframe src="https://open.spotify.com/embed/track/0Dylgc29zZwO3YRC1VrMdo?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
---
References:
- https://www.greatfrontend.com/questions/system-design/autocomplete
- https://zh.wikipedia.org/zh-tw/Trie